import express from "express";
import pool from "../config/database";
import { authenticateToken } from "../middleware/auth";
import { AppError } from "../utils/errors";
import { handleDatabaseError } from "../utils/dbErrorHandler";
import { notifyOrderCompleted, notifyOrderCancelled } from "../utils/notificationHelper";
import { logger } from "../utils/logger";
import { 
  calculateMemberDiscount, 
  calculatePointsToAdd, 
  getUpgradeLevel 
} from "../utils/memberHelper";

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

// Create order (now creates as completed since payment is immediate)
router.post("/", authenticateToken, async (req, res, next) => {
  const startTime = Date.now();
  try {
    const {
      customer_id,
      staff_id,
      items,
      discount = 0,
    } = req.body;

    if (!items || items.length === 0) {
      throw new AppError("Order must have at least one item", 400);
    }

    const userId = (req as any).user?.id || staff_id;
    if (!userId) {
      throw new AppError("Staff ID is required", 400);
    }

    // Calculate totals
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.quantity * item.price;
    }

    // Calculate member discount if customer is a member
    let memberDiscount = discount;
    let memberLevel: string | null = null;
    if (customer_id) {
      const [memberRows]: any = await pool.execute(
        "SELECT level FROM members WHERE id = ?",
        [customer_id]
      );
      if (memberRows.length > 0) {
        memberLevel = memberRows[0].level;
        const autoDiscount = calculateMemberDiscount(memberLevel, totalAmount);
        // Use the higher discount (manual or auto)
        memberDiscount = Math.max(autoDiscount, discount || 0);
      }
    }

    const finalAmount = totalAmount - memberDiscount;

    const orderId = `ORD-${Date.now()}`;

    // Create order with status 'pending' (needs confirmation)
    await pool.execute(
      `INSERT INTO orders (id, customer_id, staff_id, total_amount, discount, final_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [orderId, customer_id || null, userId, totalAmount, memberDiscount, finalAmount]
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

    // Don't create notification when order is pending - will be created when completed

    const duration = Date.now() - startTime;
    logger.request("POST", "/sales", userId, duration);
    logger.info("Order created", { orderId, userId, finalAmount });

    res.status(201).json(orderRows[0]);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

// Update order status
router.put("/:id/status", authenticateToken, async (req, res, next) => {
  try {
    const { status } = req.body;
    const userId = (req as any).user?.id;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    // Get order details
    const [orderRows]: any = await pool.execute(
      `SELECT o.*, 
              m.name as customer_name
       FROM orders o
       LEFT JOIN members m ON o.customer_id = m.id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orderRows.length === 0) {
      throw new AppError("Order not found", 404);
    }

    const order = orderRows[0];

    // Update status
    await pool.execute("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);

    // If order is completed and has a member customer, add points and check for upgrade
    if (status === "completed" && order.customer_id) {
      try {
        // Get member info
        const [memberRows]: any = await pool.execute(
          "SELECT level, points FROM members WHERE id = ?",
          [order.customer_id]
        );

        if (memberRows.length > 0) {
          const member = memberRows[0];
          const pointsToAdd = calculatePointsToAdd(
            member.level,
            parseFloat(order.final_amount)
          );

          if (pointsToAdd > 0) {
            const newPoints = member.points + pointsToAdd;
            
            // Check if should upgrade
            const newLevel = getUpgradeLevel(newPoints);
            
            // Update member points and level if upgraded
            if (newLevel && newLevel !== member.level) {
              await pool.execute(
                "UPDATE members SET points = ?, level = ? WHERE id = ?",
                [newPoints, newLevel, order.customer_id]
              );
              logger.info("Member upgraded", {
                memberId: order.customer_id,
                oldLevel: member.level,
                newLevel,
                points: newPoints,
              });
            } else {
              await pool.execute(
                "UPDATE members SET points = ? WHERE id = ?",
                [newPoints, order.customer_id]
              );
            }

            logger.info("Points added to member", {
              memberId: order.customer_id,
              pointsAdded: pointsToAdd,
              totalPoints: newPoints,
              orderId: order.id,
            });
          }
        }
      } catch (pointsError) {
        console.error("Error updating member points:", pointsError);
        // Don't fail the order update if points update fails
      }
    }

    // Create notification based on status
    try {
      if (order.staff_id) {
        if (status === "completed") {
          await notifyOrderCompleted(
            order.staff_id,
            order.id,
            parseFloat(order.final_amount),
            order.customer_name || null
          );
        } else if (status === "cancelled") {
          await notifyOrderCancelled(
            order.staff_id,
            order.id,
            parseFloat(order.final_amount),
            order.customer_name || null
          );
        }
      }
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.json({ message: "Order status updated", status });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    handleDatabaseError(error);
  }
});

export default router;
