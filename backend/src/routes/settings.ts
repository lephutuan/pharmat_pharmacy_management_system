import express from "express";
import pool from "../config/database";

const router = express.Router();

// Get all settings
router.get("/", async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT `key`, value, description FROM settings"
    );

    // Transform to key-value object
    const settings: Record<string, string> = {};
    rows.forEach((row: any) => {
      settings[row.key] = row.value;
    });

    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Get setting by key
router.get("/:key", async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT `key`, value, description FROM settings WHERE `key` = ?",
      [req.params.key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.json({
      key: rows[0].key,
      value: rows[0].value,
      description: rows[0].description,
    });
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

// Update setting
router.put("/:key", async (req, res) => {
  try {
    const { value, description } = req.body;

    await pool.execute(
      "UPDATE settings SET value = ?, description = ? WHERE `key` = ?",
      [value, description || null, req.params.key]
    );

    const [rows]: any = await pool.execute(
      "SELECT `key`, value, description FROM settings WHERE `key` = ?",
      [req.params.key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.json({
      key: rows[0].key,
      value: rows[0].value,
      description: rows[0].description,
    });
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});

// Update multiple settings
router.put("/", async (req, res) => {
  try {
    const settings = req.body; // { key1: value1, key2: value2 }

    for (const [key, value] of Object.entries(settings)) {
      await pool.execute(
        "UPDATE settings SET value = ? WHERE `key` = ?",
        [value, key]
      );
    }

    // Return updated settings
    const [rows]: any = await pool.execute(
      "SELECT `key`, value, description FROM settings"
    );

    const result: Record<string, string> = {};
    rows.forEach((row: any) => {
      result[row.key] = row.value;
    });

    res.json(result);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;

