import pool from "../config/database";
import { logger } from "./logger";

/**
 * Helper function to create a notification for a user
 */
export async function createNotification(
  userId: string,
  title: string,
  message?: string
): Promise<void> {
  try {
    const id = `N${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await pool.execute(
      "INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)",
      [id, userId, title, message || null]
    );

    logger.info("Notification created", { notificationId: id, userId, title });
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't throw error - notifications are non-critical
  }
}

/**
 * Create notification for order completion
 */
export async function notifyOrderCompleted(
  userId: string,
  orderId: string,
  finalAmount: number,
  customerName?: string | null
): Promise<void> {
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(finalAmount);

  const title = `Đơn hàng ${orderId} đã hoàn thành`;
  const message = customerName
    ? `Đơn hàng của khách hàng ${customerName} với tổng giá trị ${formattedAmount} đã được thanh toán thành công.`
    : `Đơn hàng với tổng giá trị ${formattedAmount} đã được thanh toán thành công.`;

  await createNotification(userId, title, message);
}

