import express from "express";
import pool from "../config/database";

const router = express.Router();

// Get categories
router.get("/categories", async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT * FROM medicine_categories ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Mock data as fallback
const medicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Thuốc giảm đau, hạ sốt",
    category: "Giảm đau",
    price: 15000,
    quantity: 150,
    expiryDate: "2025-12-31",
    stockAlert: 20,
    barcode: "8936017180001",
    manufacturer: "Công ty ABC",
  },
  {
    id: "2",
    name: "Amoxicillin 500mg",
    description: "Kháng sinh",
    category: "Kháng sinh",
    price: 45000,
    quantity: 5,
    expiryDate: "2024-12-15",
    stockAlert: 30,
    barcode: "8936017180002",
    manufacturer: "Công ty XYZ",
  },
  {
    id: "3",
    name: "Vitamin C 1000mg",
    description: "Bổ sung vitamin C",
    category: "Vitamin",
    price: 25000,
    quantity: 200,
    expiryDate: "2025-06-30",
    stockAlert: 50,
    barcode: "8936017180003",
    manufacturer: "Công ty DEF",
  },
];

// Get all medicines
router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT m.*, mc.name as category_name 
      FROM medicines m 
      JOIN medicine_categories mc ON m.category_id = mc.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += " AND m.name LIKE ?";
      params.push(`%${search}%`);
    }

    if (category) {
      query += " AND mc.name = ?";
      params.push(category);
    }

    query += " ORDER BY m.created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), offset);

    const [rows]: any = await pool.execute(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM medicines m 
      JOIN medicine_categories mc ON m.category_id = mc.id 
      WHERE 1=1
    `;
    const countParams: any[] = [];

    if (search) {
      countQuery += " AND m.name LIKE ?";
      countParams.push(`%${search}%`);
    }

    if (category) {
      countQuery += " AND mc.name = ?";
      countParams.push(category);
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
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

// Get medicine by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT m.*, mc.name as category_name FROM medicines m JOIN medicine_categories mc ON m.category_id = mc.id WHERE m.id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching medicine:", error);
    res.status(500).json({ error: "Failed to fetch medicine" });
  }
});

// Create medicine
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      price,
      quantity,
      expiry_date,
      stock_alert,
      barcode,
      manufacturer,
    } = req.body;
    const id = `M${Date.now()}`;

    await pool.execute(
      "INSERT INTO medicines (id, name, description, category_id, price, quantity, expiry_date, stock_alert, barcode, manufacturer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        name,
        description,
        category_id,
        price,
        quantity,
        expiry_date,
        stock_alert,
        barcode,
        manufacturer,
      ]
    );

    const [rows]: any = await pool.execute(
      "SELECT m.*, mc.name as category_name FROM medicines m JOIN medicine_categories mc ON m.category_id = mc.id WHERE m.id = ?",
      [id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({ error: "Failed to create medicine" });
  }
});

// Update medicine
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      price,
      quantity,
      expiry_date,
      stock_alert,
      barcode,
      manufacturer,
    } = req.body;

    await pool.execute(
      "UPDATE medicines SET name = ?, description = ?, category_id = ?, price = ?, quantity = ?, expiry_date = ?, stock_alert = ?, barcode = ?, manufacturer = ? WHERE id = ?",
      [
        name,
        description,
        category_id,
        price,
        quantity,
        expiry_date,
        stock_alert,
        barcode,
        manufacturer,
        req.params.id,
      ]
    );

    const [rows]: any = await pool.execute(
      "SELECT m.*, mc.name as category_name FROM medicines m JOIN medicine_categories mc ON m.category_id = mc.id WHERE m.id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ error: "Failed to update medicine" });
  }
});

// Delete medicine
router.delete("/:id", async (req, res) => {
  try {
    const [result]: any = await pool.execute(
      "DELETE FROM medicines WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json({ message: "Medicine deleted" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ error: "Failed to delete medicine" });
  }
});

export default router;
