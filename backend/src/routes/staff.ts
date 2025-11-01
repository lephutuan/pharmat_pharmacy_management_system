import express from "express";
import pool from "../config/database";
import { authenticateToken, requireRole } from "../middleware/auth";
import bcrypt from "bcryptjs";
import { NotFoundError, AppError } from "../utils/errors";
import { handleDatabaseError } from "../utils/dbErrorHandler";
import { logger } from "../utils/logger";

const router = express.Router();

// Get all staff (protected, admin only)
router.get("/", authenticateToken, requireRole("admin"), async (req, res, next) => {
  try {
    const { search, role, active, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = "SELECT id, name, email, role, phone, avatar, active, created_at FROM users WHERE 1=1";
    const params: any[] = [];

    if (search) {
      query += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    if (active !== undefined) {
      query += " AND active = ?";
      params.push(active === "true" ? 1 : 0);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), offset);

    const [rows]: any = await pool.execute(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const countParams: any[] = [];
    if (search) {
      countQuery += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
      const searchParam = `%${search}%`;
      countParams.push(searchParam, searchParam, searchParam);
    }
    if (role) {
      countQuery += " AND role = ?";
      countParams.push(role);
    }
    if (active !== undefined) {
      countQuery += " AND active = ?";
      countParams.push(active === "true" ? 1 : 0);
    }

    const [countRows]: any = await pool.execute(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      data: rows,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Get staff by ID (protected, admin only)
router.get("/:id", authenticateToken, requireRole("admin"), async (req, res, next) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT id, name, email, role, phone, avatar, active, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      throw new NotFoundError("Staff", req.params.id);
    }
    res.json(rows[0]);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Create staff (protected, admin only)
router.post("/", authenticateToken, requireRole("admin"), async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { name, email, password, role, phone, active = true } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      throw new AppError("Name, email, password, and role are required", 400);
    }

    if (!["admin", "sales_staff", "inventory_staff"].includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    // Check if email already exists
    const [existing]: any = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      throw new AppError("Email already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = `U${Date.now()}`;
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=313fb2&color=fff`;

    await pool.execute(
      "INSERT INTO users (id, name, email, password, role, phone, avatar, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, name, email, hashedPassword, role, phone || null, avatar, active ? 1 : 0]
    );

    const [rows]: any = await pool.execute(
      "SELECT id, name, email, role, phone, avatar, active, created_at FROM users WHERE id = ?",
      [id]
    );

    const duration = Date.now() - startTime;
    logger.request("POST", "/staff", (req as any).user?.id, duration);
    logger.info("Staff created", { staffId: id, name, email, role, userId: (req as any).user?.id });

    res.status(201).json(rows[0]);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Update staff (protected, admin only)
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { name, email, password, role, phone, active } = req.body;

    // Check if staff exists
    const [existing]: any = await pool.execute("SELECT id, email FROM users WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      throw new NotFoundError("Staff", req.params.id);
    }

    // If email is being changed, check for duplicates
    if (email && email !== existing[0].email) {
      const [emailCheck]: any = await pool.execute("SELECT id FROM users WHERE email = ? AND id != ?", [
        email,
        req.params.id,
      ]);
      if (emailCheck.length > 0) {
        throw new AppError("Email already exists", 400);
      }
    }

    // Validate role if provided
    if (role && !["admin", "sales_staff", "inventory_staff"].includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (email) {
      updates.push("email = ?");
      params.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      params.push(hashedPassword);
    }
    if (role) {
      updates.push("role = ?");
      params.push(role);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      params.push(phone || null);
    }
    if (active !== undefined) {
      updates.push("active = ?");
      params.push(active ? 1 : 0);
    }

    if (updates.length === 0) {
      throw new AppError("No fields to update", 400);
    }

    params.push(req.params.id);

    await pool.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);

    const [rows]: any = await pool.execute(
      "SELECT id, name, email, role, phone, avatar, active, created_at FROM users WHERE id = ?",
      [req.params.id]
    );

    const duration = Date.now() - startTime;
    logger.request("PUT", `/staff/${req.params.id}`, (req as any).user?.id, duration);
    logger.info("Staff updated", { staffId: req.params.id, userId: (req as any).user?.id });

    res.json(rows[0]);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Delete staff (protected, admin only)
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res, next) => {
  try {
    // Check if staff exists
    const [existing]: any = await pool.execute("SELECT id FROM users WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      throw new NotFoundError("Staff", req.params.id);
    }

    // Check if staff has related records (orders, inventory_records)
    const [orderCheck]: any = await pool.execute("SELECT COUNT(*) as count FROM orders WHERE staff_id = ?", [
      req.params.id,
    ]);
    if (orderCheck[0].count > 0) {
      // Instead of deleting, deactivate
      await pool.execute("UPDATE users SET active = 0 WHERE id = ?", [req.params.id]);
      logger.info("Staff deactivated (has related records)", { staffId: req.params.id });
      return res.json({ message: "Staff deactivated (cannot delete staff with related records)" });
    }

    await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);

    logger.info("Staff deleted", { staffId: req.params.id, userId: (req as any).user?.id });

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

export default router;
