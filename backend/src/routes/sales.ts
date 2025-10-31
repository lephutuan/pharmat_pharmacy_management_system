import express from "express";
import pool from "../config/database";

const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  try {
    const { date, status, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT o.*, 
             m.name as customer_name, m.phone as customer_phone,
             u.name as staff_name
      FROM orders o
      LEFT JOIN members m ON o.customer_id = m.id
      LEFT JOIN users u ON o.staff_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (date) {
      query += " AND DATE(o.created_at) = ?";
      params.push(date);
    }

    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }

    query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), offset);

    const [rows]: any = await pool.execute(query, params);

    // Fix N+1 query problem: Get all order items in a single query
    if (rows.length > 0) {
      const orderIds = rows.map((order: any) => order.id);
      const placeholders = orderIds.map(() => '?').join(',');

      const [allItems]: any = await pool.execute(
        `SELECT oi.*, m.name as medicine_name
         FROM order_items oi
         JOIN medicines m ON oi.medicine_id = m.id
         WHERE oi.order_id IN (${placeholders})`,
        orderIds
      );

      // Group items by order_id
      const itemsByOrder = allItems.reduce((acc: any, item: any) => {
        if (!acc[item.order_id]) {
          acc[item.order_id] = [];
        }
        acc[item.order_id].push(item);
        return acc;
      }, {});

      // Assign items to each order
      rows.forEach((order: any) => {
        order.items = itemsByOrder[order.id] || [];
      });
    }

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM orders WHERE 1=1";
    const countParams: any[] = [];
    if (date) {
      countQuery += " AND DATE(created_at) = ?";
      countParams.push(date);
    }
    if (status) {
      countQuery += " AND status = ?";
      countParams.push(status);
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
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

// Get today's stats
router.get("/stats/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const [stats]: any = await pool.execute(
      `SELECT 
        COALESCE(SUM(final_amount), 0) as revenue,
        COUNT(*) as orders,
        COUNT(DISTINCT customer_id) as customers
       FROM orders 
       WHERE DATE(created_at) = ? AND status = 'completed'`,
      [today]
    );
    res.json(stats[0]);
  } catch (error) {
    console.error("Error fetching today's stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Create order
router.post("/", async (req, res) => {
  try {
    const {
      customer_id,
      staff_id,
      items,
      discount = 0,
    } = req.body;

    // Calculate totals
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.quantity * item.price;
    }
    const finalAmount = totalAmount - discount;

    const orderId = `ORD-${Date.now()}`;

    // Create order
    await pool.execute(
      `INSERT INTO orders (id, customer_id, staff_id, total_amount, discount, final_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [orderId, customer_id || null, staff_id, totalAmount, discount, finalAmount]
    );

    // Create order items
    for (const item of items) {
      const itemId = `${orderId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await pool.execute(
        `INSERT INTO order_items (id, order_id, medicine_id, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          orderId,
          item.medicine_id,
          item.quantity,
          item.price,
          item.quantity * item.price,
        ]
      );

      // Note: Stock update is handled by the tr_sale_update_stock trigger
      // No manual update or inventory_records creation needed to avoid duplicate updates
    }

    // Get created order with details
    const [orderRows]: any = await pool.execute(
      `SELECT o.*, 
              m.name as customer_name, m.phone as customer_phone,
              u.name as staff_name
       FROM orders o
       LEFT JOIN members m ON o.customer_id = m.id
       LEFT JOIN users u ON o.staff_id = u.id
       WHERE o.id = ?`,
      [orderId]
    );

    const [orderItems]: any = await pool.execute(
      `SELECT oi.*, med.name as medicine_name 
       FROM order_items oi 
       JOIN medicines med ON oi.medicine_id = med.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    orderRows[0].items = orderItems;

    res.status(201).json(orderRows[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
