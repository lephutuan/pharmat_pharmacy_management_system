import express from "express";
import pool from "../config/database";

const router = express.Router();

// Get all members
router.get("/", async (req, res) => {
  try {
    const { search, level, page = 1, limit = 100 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = "SELECT * FROM members WHERE 1=1";
    const params: any[] = [];

    if (search) {
      query += " AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)";
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (level) {
      query += " AND level = ?";
      params.push(level);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), offset);

    const [rows]: any = await pool.execute(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM members WHERE 1=1";
    const countParams: any[] = [];
    if (search) {
      countQuery += " AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)";
      const searchParam = `%${search}%`;
      countParams.push(searchParam, searchParam, searchParam);
    }
    if (level) {
      countQuery += " AND level = ?";
      countParams.push(level);
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
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Get member by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows]: any = await pool.execute("SELECT * FROM members WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ error: "Failed to fetch member" });
  }
});

// Create member
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, level = "bronze", points = 0 } = req.body;
    const id = `C${Date.now()}`;

    await pool.execute(
      "INSERT INTO members (id, name, email, phone, level, points) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, email || null, phone, level, points]
    );

    const [rows]: any = await pool.execute("SELECT * FROM members WHERE id = ?", [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ error: "Failed to create member" });
  }
});

// Update member
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, level, points } = req.body;

    await pool.execute(
      "UPDATE members SET name = ?, email = ?, phone = ?, level = ?, points = ? WHERE id = ?",
      [name, email || null, phone, level, points, req.params.id]
    );

    const [rows]: any = await pool.execute("SELECT * FROM members WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ error: "Failed to update member" });
  }
});

export default router;
