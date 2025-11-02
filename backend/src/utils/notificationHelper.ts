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

/**
 * Create notification for order cancellation
 */
export async function notifyOrderCancelled(
  userId: string,
  orderId: string,
  finalAmount: number,
  customerName?: string | null
): Promise<void> {
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(finalAmount);

  const title = `Đơn hàng ${orderId} đã bị hủy`;
  const message = customerName
    ? `Đơn hàng của khách hàng ${customerName} với tổng giá trị ${formattedAmount} đã bị hủy.`
    : `Đơn hàng với tổng giá trị ${formattedAmount} đã bị hủy.`;

  await createNotification(userId, title, message);
}

/**
 * Create notification for inventory operations (import/export)
 * Notifies all admin and inventory_staff users
 */
export async function notifyInventoryOperation(
  type: 'import' | 'export',
  medicineName: string,
  quantity: number,
  performedBy: string,
  performedByName?: string,
  notes?: string | null
): Promise<void> {
  try {
    // Get all admin and inventory_staff users
    const [users]: any = await pool.execute(
      "SELECT id FROM users WHERE (role = 'admin' OR role = 'inventory_staff') AND active = TRUE"
    );

    if (!users || users.length === 0) {
      logger.warn("No admin or inventory_staff users found to notify");
      return;
    }

    const operationLabel = type === 'import' ? 'Nhập kho' : 'Xuất kho';
    const title = `${operationLabel}: ${medicineName}`;
    
    let message = `${performedByName || 'Người dùng'} đã thực hiện ${operationLabel.toLowerCase()} `;
    message += `${quantity} ${medicineName}`;
    if (notes) {
      message += ` - Ghi chú: ${notes}`;
    }

    // Create notification for each user
    const notificationPromises = users.map((user: { id: string }) =>
      createNotification(user.id, title, message)
    );

    await Promise.all(notificationPromises);
    
    logger.info("Inventory operation notifications sent", {
      type,
      medicineName,
      quantity,
      notifiedUsers: users.length
    });
  } catch (error) {
    console.error("Error sending inventory operation notifications:", error);
    // Don't throw error - notifications are non-critical
  }
}
