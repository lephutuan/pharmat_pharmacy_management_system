import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "@/types";
import { UserRole } from "@/types";
import api, { cancelAllPendingRequests } from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const isAuthenticated = ref<boolean>(!!token.value);

  async function login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      token.value = response.data.token;
      user.value = {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role as UserRole,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.user.name)}&background=313fb2&color=fff`,
      };
      isAuthenticated.value = true;
      
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value));
      
      return { success: true };
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = error.response?.data?.error || "Đăng nhập thất bại";
      // Chuyển đổi message tiếng Anh sang tiếng Việt
      if (errorMessage === "Invalid credentials") {
        errorMessage = "Sai email hoặc mật khẩu";
      }
      return { success: false, error: errorMessage };
    }
  }

  function logout() {
    // Cancel tất cả pending API requests trước khi logout
    cancelAllPendingRequests();

    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  function hasPermission(requiredRoles: UserRole[]): boolean {
    if (!user.value) return false;
    return requiredRoles.includes(user.value.role);
  }

  function initAuth() {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    initAuth,
  };
});
