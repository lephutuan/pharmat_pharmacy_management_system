<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-primary px-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-title text-primary mb-2">PharmaT</h1>
        <p class="text-gray-600">Hệ Thống Quản Lý Nhà Thuốc</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="input-field"
            placeholder="Nhập email của bạn"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            required
            class="input-field"
            placeholder="Nhập mật khẩu của bạn"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <span class="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
          </label>
          <a href="#" class="text-sm text-primary hover:underline">Quên mật khẩu?</a>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
        </button>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-xs text-gray-600 mb-2">Thông tin demo:</p>
        <div class="space-y-1 text-xs">
          <p><strong>Admin:</strong> admin@pharmat.com / password</p>
          <p><strong>Sales:</strong> sales@pharmat.com / password</p>
          <p><strong>Inventory:</strong> inventory@pharmat.com / password</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.error || 'Đăng nhập thất bại'
    }
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'Đã có lỗi xảy ra'
  } finally {
    loading.value = false
  }
}
</script>

