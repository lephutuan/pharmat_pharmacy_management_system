<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-title text-gray-800">Cảnh Báo</h1>
      <div class="flex gap-3">
        <button class="btn-outline" @click="filter = 'all'">Tất Cả</button>
        <button class="btn-outline" @click="filter = 'expiry'">Hết Hạn</button>
        <button class="btn-outline" @click="filter = 'stock'">Hết Hàng</button>
        <button class="btn-outline" @click="filter = 'system'">Hệ Thống</button>
      </div>
    </div>

    <!-- Alert Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card bg-red-50 border-2 border-red-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-red-700 font-medium">Cảnh Báo Cao</p>
            <p class="text-3xl font-bold text-red-700">{{ highAlerts }}</p>
          </div>
          <svg class="w-12 h-12 text-red-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <div class="card bg-orange-50 border-2 border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-700 font-medium">Cảnh Báo Trung Bình</p>
            <p class="text-3xl font-bold text-orange-700">{{ mediumAlerts }}</p>
          </div>
          <svg class="w-12 h-12 text-orange-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="card bg-yellow-50 border-2 border-yellow-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-yellow-700 font-medium">Cảnh Báo Thấp</p>
            <p class="text-3xl font-bold text-yellow-700">{{ lowAlerts }}</p>
          </div>
          <svg class="w-12 h-12 text-yellow-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <div class="card bg-green-50 border-2 border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-700 font-medium">Đã Xử Lý</p>
            <p class="text-3xl font-bold text-green-700">{{ resolvedAlerts }}</p>
          </div>
          <svg class="w-12 h-12 text-green-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Danh Sách Cảnh Báo</h3>
      <div class="space-y-3">
        <div
          v-for="alert in filteredAlerts"
          :key="alert.id"
          :class="[
            'p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all',
            getAlertBg(alert.severity)
          ]"
          @click="alert.read = !alert.read"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <component :is="getAlertIcon(alert.type)" class="w-5 h-5" />
                <h4 class="font-semibold text-gray-800">{{ alert.title }}</h4>
                <span :class="getBadgeClass(alert.severity)">
                  {{ getSeverityText(alert.severity) }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ alert.message }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ formatDateTime(alert.date) }}</p>
            </div>
            <div class="flex flex-col items-center gap-2">
              <button
                v-if="!alert.read"
                class="text-primary hover:text-primary/80 transition-colors"
                @click.stop="markAsRead(alert.id)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <span v-if="!alert.read" class="w-2 h-2 bg-primary rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BellAlertIcon, ExclamationTriangleIcon, CubeIcon, CogIcon } from '@heroicons/vue/24/outline'

interface Alert {
  id: string
  type: 'expiry' | 'low_stock' | 'system'
  title: string
  message: string
  severity: 'low' | 'medium' | 'high'
  date: Date
  read: boolean
}

const filter = ref('all')

const alerts: Alert[] = [
  {
    id: '1',
    type: 'expiry',
    title: 'Thuốc sắp hết hạn',
    message: 'Amoxicillin 500mg sẽ hết hạn trong 15 ngày (15/03/2024)',
    severity: 'high',
    date: new Date(),
    read: false
  },
  {
    id: '2',
    type: 'low_stock',
    title: 'Hàng sắp hết trong kho',
    message: 'Paracetamol 500mg còn 5 sản phẩm trong kho',
    severity: 'medium',
    date: new Date(Date.now() - 3600000),
    read: false
  },
  {
    id: '3',
    type: 'system',
    title: 'Hệ thống cập nhật',
    message: 'Có phiên bản mới của phần mềm. Vui lòng cập nhật.',
    severity: 'low',
    date: new Date(Date.now() - 7200000),
    read: true
  }
]

const filteredAlerts = computed(() => {
  if (filter.value === 'all') return alerts
  if (filter.value === 'expiry') return alerts.filter(a => a.type === 'expiry')
  if (filter.value === 'stock') return alerts.filter(a => a.type === 'low_stock')
  if (filter.value === 'system') return alerts.filter(a => a.type === 'system')
  return alerts
})

const highAlerts = computed(() => alerts.filter(a => a.severity === 'high' && !a.read).length)
const mediumAlerts = computed(() => alerts.filter(a => a.severity === 'medium' && !a.read).length)
const lowAlerts = computed(() => alerts.filter(a => a.severity === 'low' && !a.read).length)
const resolvedAlerts = computed(() => alerts.filter(a => a.read).length)

function getAlertIcon(type: string) {
  switch (type) {
    case 'expiry':
      return ExclamationTriangleIcon
    case 'low_stock':
      return CubeIcon
    case 'system':
      return CogIcon
    default:
      return BellAlertIcon
  }
}

function getAlertBg(severity: string): string {
  switch (severity) {
    case 'high':
      return 'bg-red-50 border-red-400'
    case 'medium':
      return 'bg-orange-50 border-orange-400'
    case 'low':
      return 'bg-yellow-50 border-yellow-400'
    default:
      return 'bg-gray-50 border-gray-400'
  }
}

function getBadgeClass(severity: string): string {
  switch (severity) {
    case 'high':
      return 'px-3 py-1 bg-red-600 text-white rounded-full text-xs'
    case 'medium':
      return 'px-3 py-1 bg-orange-600 text-white rounded-full text-xs'
    case 'low':
      return 'px-3 py-1 bg-yellow-600 text-white rounded-full text-xs'
    default:
      return 'px-3 py-1 bg-gray-600 text-white rounded-full text-xs'
  }
}

function getSeverityText(severity: string): string {
  switch (severity) {
    case 'high':
      return 'Cao'
    case 'medium':
      return 'Trung bình'
    case 'low':
      return 'Thấp'
    default:
      return ''
  }
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('vi-VN')
}

function markAsRead(id: string) {
  const alert = alerts.find(a => a.id === id)
  if (alert) alert.read = true
}
</script>

