import axios, { CancelTokenSource } from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Lưu trữ tất cả pending requests để có thể cancel khi logout
const pendingRequests = new Map<string, CancelTokenSource>();

// Tạo unique key cho mỗi request
function getRequestKey(config: any): string {
  return `${config.method}-${config.url}-${Date.now()}`;
}

// Cancel tất cả pending requests (gọi khi logout)
export function cancelAllPendingRequests() {
  pendingRequests.forEach((source, key) => {
    source.cancel('Request cancelled due to logout');
    pendingRequests.delete(key);
  });
}

// Request interceptor to add auth token and track pending requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tạo cancel token cho request này
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;

    // Lưu vào pending requests
    const requestKey = getRequestKey(config);
    (config as any).requestKey = requestKey;
    pendingRequests.set(requestKey, source);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and cleanup pending requests
api.interceptors.response.use(
  (response) => {
    // Xóa request khỏi pending list khi hoàn thành
    const requestKey = (response.config as any).requestKey;
    if (requestKey) {
      pendingRequests.delete(requestKey);
    }
    return response;
  },
  (error) => {
    // Xóa request khỏi pending list khi có lỗi
    const requestKey = error.config?.requestKey;
    if (requestKey) {
      pendingRequests.delete(requestKey);
    }

    // Nếu request bị cancel, không cần xử lý thêm
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
