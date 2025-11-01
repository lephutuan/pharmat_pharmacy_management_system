<template>
  <aside class="w-64 bg-white shadow-lg flex flex-col">
    <!-- Logo -->
    <div class="h-20 flex items-center justify-center border-b border-gray-200">
      <h1 class="text-2xl font-title text-primary">PharmaT</h1>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <router-link v-for="item in menuItems" :key="item.name" :to="item.path"
        :class="['sidebar-link', { 'sidebar-link-active': $route.name === item.name }]">
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
        <span v-if="item.name === 'Alerts' && unreadAlertsCount > 0"
          class="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {{ unreadAlertsCount > 9 ? '9+' : unreadAlertsCount }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types'
import api from '@/services/api'
import {
  HomeIcon,
  BeakerIcon,
  CubeIcon,
  ShoppingCartIcon,
  BellAlertIcon,
  ChartBarIcon,
  UserGroupIcon,
  UsersIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const authStore = useAuthStore()
const unreadAlertsCount = ref(0)

const allMenuItems = [
  { name: 'Dashboard', path: '/', label: 'Trang Chủ', icon: HomeIcon },
  { name: 'Medicines', path: '/medicines', label: 'Thuốc', icon: BeakerIcon },
  { name: 'Inventory', path: '/inventory', label: 'Kho', icon: CubeIcon },
  { name: 'Sales', path: '/sales', label: 'Bán Hàng', icon: ShoppingCartIcon },
  { name: 'Alerts', path: '/alerts', label: 'Cảnh Báo', icon: BellAlertIcon },
  { name: 'Reports', path: '/reports', label: 'Báo Cáo', icon: ChartBarIcon },
  { name: 'Staff', path: '/staff', label: 'Nhân Viên', icon: UserGroupIcon },
  { name: 'Members', path: '/members', label: 'Thành Viên', icon: UsersIcon },
  { name: 'Settings', path: '/settings', label: 'Cài Đặt', icon: CogIcon }
]

const menuItems = computed(() => {
  if (!authStore.user) return []

  const role = authStore.user.role

  // Filter menu items based on role
  return allMenuItems.filter(item => {
    if (item.name === 'Dashboard' || item.name === 'Alerts') return true

    switch (role) {
      case UserRole.ADMIN:
        return true
      case UserRole.SALES_STAFF:
        return ['Sales', 'Members'].includes(item.name)
      case UserRole.INVENTORY_STAFF:
        return ['Medicines', 'Inventory', 'Reports'].includes(item.name)
      default:
        return false
    }
  })
})

// Fetch unread alerts count
async function fetchUnreadAlertsCount() {
  try {
    const response = await api.get('/alerts/unread/count')
    unreadAlertsCount.value = response.data.count || 0
  } catch (error) {
    console.error('Error fetching unread alerts count:', error)
    unreadAlertsCount.value = 0
  }
}

let refreshInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  fetchUnreadAlertsCount()
  // Refresh every 5 seconds for faster updates
  refreshInterval = setInterval(fetchUnreadAlertsCount, 500)
})

// Refresh when route changes (user navigates)
watch(() => route.name, () => {
  fetchUnreadAlertsCount()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
