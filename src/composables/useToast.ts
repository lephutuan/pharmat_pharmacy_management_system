import { ref, onMounted } from "vue";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  createdAt: number;
}

const toasts = ref<Toast[]>([]);
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();
// Track pending toast ID đã được xử lý để tránh duplicate
let lastProcessedToastId: string | null = null;

// Khôi phục toast từ sessionStorage khi module load (để survive HMR/page reload)
function restorePendingToasts() {
  const pending = sessionStorage.getItem('pendingToast');
  if (pending) {
    try {
      const data = JSON.parse(pending);
      const now = Date.now();
      const elapsed = now - data.createdAt;

      // Tạo unique ID cho pending toast này
      const pendingId = `${data.message}-${data.createdAt}`;

      // Chỉ hiển thị nếu toast được tạo trong vòng 10 giây
      if (elapsed < 10000) {
        // Kiểm tra xem toast này đã được xử lý chưa
        if (lastProcessedToastId === pendingId) {
          return;
        }

        // Kiểm tra xem toast này đã được hiển thị chưa (tránh duplicate)
        const alreadyShown = toasts.value.some(t => t.message === data.message);
        if (alreadyShown) {
          lastProcessedToastId = pendingId;
          return;
        }

        // Đánh dấu đã xử lý
        lastProcessedToastId = pendingId;

        // Tính thời gian còn lại, đảm bảo ít nhất 2 giây
        const remainingDuration = Math.max(data.duration - elapsed, 2000);

        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = {
          id,
          message: data.message,
          type: data.type,
          duration: remainingDuration,
          createdAt: now
        };
        toasts.value.push(toast);

        const timer = setTimeout(() => {
          const index = toasts.value.findIndex((t) => t.id === id);
          if (index > -1) {
            toasts.value.splice(index, 1);
          }
          activeTimers.delete(id);
          // Chỉ xóa sessionStorage sau khi toast đã hết thời gian
          sessionStorage.removeItem('pendingToast');
          lastProcessedToastId = null;
        }, remainingDuration);
        activeTimers.set(id, timer);
      } else {
        // Toast đã quá cũ, xóa đi
        sessionStorage.removeItem('pendingToast');
      }
    } catch (e) {
      console.error('Failed to restore pending toast:', e);
      sessionStorage.removeItem('pendingToast');
    }
  }
}

// Export để có thể gọi từ App.vue khi route thay đổi
export { restorePendingToasts };

export function useToast() {
  const showToast = (
    message: string,
    type: Toast["type"] = "info",
    duration?: number
  ) => {
    // Nếu duration không được truyền vào, dùng giá trị mặc định
    const toastDuration = duration ?? (type === "error" ? 6000 : 3000);

    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration: toastDuration, createdAt: Date.now() };
    toasts.value.push(toast);

    // Lưu timer để có thể cancel nếu cần
    const timer = setTimeout(() => {
      removeToast(id);
      activeTimers.delete(id);
    }, toastDuration);
    activeTimers.set(id, timer);
  };

  const removeToast = (id: string) => {
    // Cancel timer nếu còn đang chạy
    const timer = activeTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      activeTimers.delete(id);
    }

    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  // Tạo toast và lưu vào sessionStorage để survive page reload
  const showPersistentToast = (
    message: string,
    type: Toast["type"] = "info",
    duration?: number
  ) => {
    const toastDuration = duration ?? (type === "error" ? 6000 : 3000);
    sessionStorage.setItem('pendingToast', JSON.stringify({
      message,
      type,
      duration: toastDuration,
      createdAt: Date.now()
    }));
  };

  return {
    toasts,
    showToast,
    showPersistentToast,
    removeToast,
    success: (message: string, duration?: number) =>
      showToast(message, "success", duration),
    error: (message: string, duration?: number) =>
      showToast(message, "error", duration),
    info: (message: string, duration?: number) =>
      showToast(message, "info", duration),
    warning: (message: string, duration?: number) =>
      showToast(message, "warning", duration),
    // Phiên bản persistent để survive page reload/HMR
    successPersistent: (message: string, duration?: number) =>
      showPersistentToast(message, "success", duration),
  };
}

