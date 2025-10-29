import express from "express";
import pool from "../config/database";

const router = express.Router();

// Get all staff
router.get("/", async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT id, name, email, role, phone, avatar, active, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// Get staff by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT id, name, email, role, phone, avatar, active, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

export default router;
