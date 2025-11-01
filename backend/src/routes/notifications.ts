import express from "express";
import pool from "../config/database";
import { authenticateToken } from "../middleware/auth";
import { NotFoundError, AppError } from "../utils/errors";
import { handleDatabaseError } from "../utils/dbErrorHandler";
import { logger } from "../utils/logger";

const router = express.Router();

// Get all notifications for current user
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const { is_read, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = "SELECT * FROM notifications WHERE user_id = ?";
    const params: any[] = [userId];

    if (is_read !== undefined) {
      query += " AND is_read = ?";
      params.push(is_read === "true" ? 1 : 0);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), offset);

    const [rows]: any = await pool.execute(query, params);

    const notifications = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      is_read: row.is_read === 1 || row.is_read === true,
      created_at: row.created_at,
    }));

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM notifications WHERE user_id = ?";
    const countParams: any[] = [userId];
    if (is_read !== undefined) {
      countQuery += " AND is_read = ?";
      countParams.push(is_read === "true" ? 1 : 0);
    }

    const [countRows]: any = await pool.execute(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      data: notifications,
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

// Get unread notifications count
router.get("/unread/count", authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0",
      [userId]
    );

    res.json({ count: rows[0].count || 0 });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Mark notification as read
router.put("/:id/read", authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const [existing]: any = await pool.execute(
      "SELECT id FROM notifications WHERE id = ? AND user_id = ?",
      [req.params.id, userId]
    );

    if (existing.length === 0) {
      throw new NotFoundError("Notification", req.params.id);
    }

    await pool.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id]);

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Mark all notifications as read
router.put("/read-all", authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await pool.execute("UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0", [userId]);

    logger.info("All notifications marked as read", { userId });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Create notification (admin only - for system notifications)
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { user_id, title, message } = req.body;

    if (!user_id || !title) {
      throw new AppError("user_id and title are required", 400);
    }

    const id = `N${Date.now()}`;

    await pool.execute(
      "INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)",
      [id, user_id, title, message || null]
    );

    const [rows]: any = await pool.execute("SELECT * FROM notifications WHERE id = ?", [id]);

    logger.info("Notification created", { notificationId: id, userId: user_id });

    res.status(201).json(rows[0]);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Delete notification
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const [existing]: any = await pool.execute(
      "SELECT id FROM notifications WHERE id = ? AND user_id = ?",
      [req.params.id, userId]
    );

    if (existing.length === 0) {
      throw new NotFoundError("Notification", req.params.id);
    }

    await pool.execute("DELETE FROM notifications WHERE id = ?", [req.params.id]);

    logger.info("Notification deleted", { notificationId: req.params.id, userId });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

export default router;

