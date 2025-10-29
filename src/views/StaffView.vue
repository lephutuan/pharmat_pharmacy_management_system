<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-title text-gray-800">Quản Lý Nhân Viên</h1>
      <button class="btn-primary">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Thêm Nhân Viên
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tổng Nhân Viên</p>
            <p class="text-3xl font-bold text-gray-800">{{ totalStaff }}</p>
          </div>
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-green-50 border-2 border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-700 font-medium">Đang Hoạt Động</p>
            <p class="text-3xl font-bold text-green-700">{{ activeStaff }}</p>
          </div>
          <svg class="w-12 h-12 text-green-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bán Hàng</p>
            <p class="text-3xl font-bold text-gray-800">{{ salesStaff }}</p>
          </div>
          <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Quản Lý Kho</p>
            <p class="text-3xl font-bold text-gray-800">{{ inventoryStaff }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Nhân Viên</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Điện Thoại</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Vai Trò</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Trạng Thái</th>
              <th class="text-center py-3 px-4 font-semibold text-gray-700">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="staff in staffList"
              :key="staff.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <img :src="staff.avatar" :alt="staff.name" class="w-10 h-10 rounded-full" />
                  <span class="font-medium text-gray-800">{{ staff.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ staff.email }}</td>
              <td class="py-3 px-4 text-gray-600">{{ staff.phone }}</td>
              <td class="py-3 px-4">
                <span :class="getRoleBadgeClass(staff.role)">
                  {{ getRoleLabel(staff.role) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span :class="staff.active ? 'px-3 py-1 bg-green-100 text-green-700' : 'px-3 py-1 bg-red-100 text-red-700'">
                  {{ staff.active ? 'Hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button class="text-primary hover:text-blue-700" title="Sửa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="text-red-600 hover:text-red-700" title="Xóa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between">
        <p class="text-sm text-gray-600">Hiển thị 1-{{ staffList.length }} trong tổng số {{ totalStaff }} nhân viên</p>
        <div class="flex gap-2">
          <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Trước</button>
          <button class="px-3 py-1 bg-primary text-white rounded-lg">1</button>
          <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Sau</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserRole } from '@/types'
import type { Staff } from '@/types'
import api from '@/services/api'

const staffList = ref<Staff[]>([])
const loading = ref(false)

const totalStaff = computed(() => staffList.value.length)
const activeStaff = computed(() => staffList.value.filter(s => s.active).length)
const salesStaff = computed(() => staffList.value.filter(s => s.role === UserRole.SALES_STAFF).length)
const inventoryStaff = computed(() => staffList.value.filter(s => s.role === UserRole.INVENTORY_STAFF).length)

async function fetchStaff() {
  loading.value = true
  try {
    const response = await api.get('/staff')
    staffList.value = response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role as UserRole,
      phone: item.phone || '',
      avatar: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=313fb2&color=fff`,
      active: item.active === 1 || item.active === true,
      createdAt: item.created_at || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching staff:', error)
    staffList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStaff()
})

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Quản trị viên'
    case UserRole.SALES_STAFF:
      return 'Bán hàng'
    case UserRole.INVENTORY_STAFF:
      return 'Quản lý kho'
    default:
      return ''
  }
}

function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'px-3 py-1 bg-primary text-white rounded-full text-xs'
    case UserRole.SALES_STAFF:
      return 'px-3 py-1 bg-accent/20 text-accent rounded-full text-xs'
    case UserRole.INVENTORY_STAFF:
      return 'px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs'
    default:
      return 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs'
  }
}
</script>

