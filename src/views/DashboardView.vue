<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="card bg-gradient-primary text-white">
      <h2 class="text-2xl font-semibold mb-2">Chào mừng trở lại, {{ user?.name }}!</h2>
      <p class="text-white/90">Đây là tổng quan hệ thống của bạn</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Doanh Thu Hôm Nay</p>
            <p class="text-2xl font-semibold text-gray-800">{{ formatCurrency(todaySales) }}</p>
            <p class="text-xs text-accent mt-1">+12% so với hôm qua</p>
          </div>
          <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tổng Số Thuốc</p>
            <p class="text-2xl font-semibold text-gray-800">{{ totalMedicines }}</p>
            <p class="text-xs text-blue-600 mt-1">{{ lowStockCount }} đang hết hàng</p>
          </div>
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Cảnh Báo Hết Hạn</p>
            <p class="text-2xl font-semibold text-gray-800">{{ expiringSoonCount }}</p>
            <p class="text-xs text-red-600 mt-1">Trong 30 ngày</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Đơn Hàng Hôm Nay</p>
            <p class="text-2xl font-semibold text-gray-800">{{ todayOrders }}</p>
            <p class="text-xs text-gray-600 mt-1">Trung bình {{ averageOrderValue }}k/đơn</p>
          </div>
          <div class="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Chart -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Doanh Thu 7 Ngày Gần Đây</h3>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="(day, index) in weeklySales"
            :key="index"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg hover:opacity-80 transition-all cursor-pointer"
              :style="{ height: `${(day.value / Math.max(...weeklySales.map(d => d.value))) * 100}%` }"
            ></div>
            <span class="text-xs text-gray-600 mt-2">{{ day.label }}</span>
            <span class="text-xs font-medium text-gray-800">{{ day.value }}K</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Đơn Hàng Gần Đây</h3>
        <div class="space-y-3">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ order.customer }}</p>
                <p class="text-xs text-gray-600">{{ order.time }}</p>
              </div>
            </div>
            <p class="font-semibold text-primary">{{ formatCurrency(order.total) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const todaySales = ref(0)
const totalMedicines = ref(0)
const lowStockCount = ref(0)
const expiringSoonCount = ref(0)
const todayOrders = ref(0)
const averageOrderValue = ref(0)
const loading = ref(false)

const weeklySales = ref([
  { label: 'T2', value: 1200 },
  { label: 'T3', value: 1500 },
  { label: 'T4', value: 1100 },
  { label: 'T5', value: 1800 },
  { label: 'T6', value: 2000 },
  { label: 'T7', value: 2200 },
  { label: 'CN', value: 1900 }
])

const recentOrders = ref<any[]>([])

async function fetchDashboardData() {
  loading.value = true
  try {
    // Fetch today's stats
    const statsResponse = await api.get('/sales/stats/today')
    todaySales.value = parseFloat(statsResponse.data.revenue) || 0
    todayOrders.value = parseInt(statsResponse.data.orders) || 0
    averageOrderValue.value = todayOrders.value > 0 ? Math.round(todaySales.value / todayOrders.value / 1000) : 0

    // Fetch medicines stats
    const medicinesResponse = await api.get('/medicines', { params: { page: 1, limit: 100 } })
    totalMedicines.value = medicinesResponse.data.total || 0
    
    const medicines = medicinesResponse.data.data || []
    lowStockCount.value = medicines.filter((m: any) => m.quantity <= m.stock_alert && m.quantity > 0).length
    
    const today = new Date()
    expiringSoonCount.value = medicines.filter((m: any) => {
      const expiryDate = new Date(m.expiry_date)
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0 && m.quantity > 0
    }).length

    // Fetch recent orders
    const ordersResponse = await api.get('/sales', { params: { page: 1, limit: 4 } })
    recentOrders.value = ordersResponse.data.data.map((order: any) => ({
      id: order.id,
      customer: order.customer_name || 'Khách vãng lai',
      total: parseFloat(order.final_amount) || 0,
      time: new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }))

    // TODO: Calculate weekly sales from orders
    // For now, keep mock data
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

