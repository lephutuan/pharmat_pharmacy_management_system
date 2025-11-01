<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-title text-gray-800">Quản Lý Thành Viên</h1>
      <button @click="openAddModal" class="btn-primary">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Thêm Thành Viên
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tổng Thành Viên</p>
            <p class="text-3xl font-bold text-gray-800">{{ totalMembers }}</p>
          </div>
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Thành Viên Vàng</p>
            <p class="text-3xl font-bold">{{ goldMembers }}</p>
          </div>
          <svg class="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
      </div>

      <div class="card bg-gradient-to-r from-blue-gray-500 to-blue-gray-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Thành Viên Bạc</p>
            <p class="text-3xl font-bold">{{ silverMembers }}</p>
          </div>
          <svg class="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Điểm Tích Lũy</p>
            <p class="text-3xl font-bold">{{ totalPoints.toLocaleString() }}</p>
          </div>
          <svg class="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm theo tên, SĐT..."
          class="input-field"
        />
        <select v-model="levelFilter" class="input-field">
          <option value="">Tất cả hạng</option>
          <option value="bronze">Đồng</option>
          <option value="silver">Bạc</option>
          <option value="gold">Vàng</option>
          <option value="platinum">Bạch kim</option>
        </select>
        <input
          v-model="phoneQuery"
          type="text"
          placeholder="Số điện thoại..."
          class="input-field"
        />
      </div>
    </div>

    <!-- Members Table -->
    <div class="card">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="pagedMembers.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="mt-4 text-gray-600 font-medium">Không tìm thấy thành viên nào</p>
      </div>

      <!-- Table Content -->
      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Thành Viên</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Điện Thoại</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Hạng</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Điểm Tích Lũy</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Ngày Tham Gia</th>
                <th class="text-center py-3 px-4 font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in pagedMembers"
                :key="member.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="`https://ui-avatars.com/api/?name=${member.name}&background=${getLevelColor(member.level)}&color=fff`"
                      :alt="member.name"
                      class="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p class="font-medium text-gray-800">{{ member.name }}</p>
                      <p v-if="member.email" class="text-xs text-gray-500">{{ member.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">{{ member.phone }}</td>
                <td class="py-3 px-4">
                  <span :class="getLevelBadgeClass(member.level)">
                    {{ getLevelLabel(member.level) }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="font-semibold text-primary">{{ member.points.toLocaleString() }} điểm</span>
                </td>
                <td class="py-3 px-4 text-gray-600">{{ formatDate(member.createdAt) }}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center justify-center gap-2">
                    <button @click="openEditModal(member)" class="text-accent hover:text-green-700" title="Sửa">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
          <p class="text-sm text-gray-600">
            Hiển thị
            {{ (currentPage - 1) * pageSize + (pagedMembers.length ? 1 : 0) }}-
            {{ (currentPage - 1) * pageSize + pagedMembers.length }}
            trong tổng số {{ filteredMembers.length }} kết quả
          </p>
          <div class="flex gap-2">
            <button :disabled="currentPage === 1" @click="currentPage--"
              class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
            <button v-for="n in totalPages" :key="n" class="px-3 py-1"
              :class="n === currentPage ? 'bg-primary text-white rounded-lg' : 'border border-gray-300 rounded-lg hover:bg-gray-50'"
              @click="currentPage = n">{{ n }}</button>
            <button :disabled="currentPage === totalPages" @click="currentPage++"
              class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Sau</button>
          </div>
        </div>
      </template>
    </div>

    <!-- Member Modal -->
    <Modal v-model="showModal" :title="editingMember ? 'Sửa Thành Viên' : 'Thêm Thành Viên Mới'">
      <MemberForm :member="editingMember" @success="handleFormSuccess" @cancel="closeModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Member } from '@/types'
import api from '@/services/api'
import Modal from '@/components/Modal.vue'
import MemberForm from '@/components/MemberForm.vue'
import { useToast } from '@/composables/useToast'

const { success } = useToast()

const searchQuery = ref('')
const levelFilter = ref('')
const phoneQuery = ref('')
const members = ref<Member[]>([])
const loading = ref(false)
const totalItems = ref(0)
const showModal = ref(false)
const editingMember = ref<Member | null>(null)

const pageSize = ref(10)
const currentPage = ref(1)

const totalMembers = computed(() => totalItems.value)
const goldMembers = computed(() => members.value.filter(m => m.level === 'gold').length)
const silverMembers = computed(() => members.value.filter(m => m.level === 'silver').length)
const totalPoints = computed(() => members.value.reduce((sum, m) => sum + m.points, 0))

async function fetchMembers() {
  loading.value = true
  try {
    const response = await api.get('/members', {
      params: {
        search: searchQuery.value || undefined,
        level: levelFilter.value || undefined,
        page: currentPage.value,
        limit: pageSize.value
      }
    })
    members.value = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email || undefined,
      phone: item.phone,
      level: item.level,
      points: item.points || 0,
      createdAt: item.created_at || new Date().toISOString()
    }))
    totalItems.value = response.data.total
  } catch (error) {
    console.error('Error fetching members:', error)
    members.value = []
  } finally {
    loading.value = false
  }
}

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const matchesSearch = !searchQuery.value || member.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesLevel = !levelFilter.value || member.level === levelFilter.value
    const matchesPhone = !phoneQuery.value || member.phone.includes(phoneQuery.value)
    return matchesSearch && matchesLevel && matchesPhone
  })
})

const pagedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMembers.value.slice(start, end)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMembers.value.length / pageSize.value)))

watch([searchQuery, levelFilter, phoneQuery], () => {
  currentPage.value = 1
  fetchMembers()
})

watch(currentPage, () => {
  fetchMembers()
})

// Modal handlers
function openAddModal() {
  editingMember.value = null
  showModal.value = true
}

function openEditModal(member: Member) {
  editingMember.value = member
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingMember.value = null
}

function handleFormSuccess() {
  closeModal()
  fetchMembers()
  success('Thành viên đã được lưu thành công!')
}

onMounted(() => {
  fetchMembers()
})

function getLevelLabel(level: string): string {
  switch (level) {
    case 'bronze':
      return 'Đồng'
    case 'silver':
      return 'Bạc'
    case 'gold':
      return 'Vàng'
    case 'platinum':
      return 'Bạch kim'
    default:
      return ''
  }
}

function getLevelBadgeClass(level: string): string {
  switch (level) {
    case 'bronze':
      return 'px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs'
    case 'silver':
      return 'px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs'
    case 'gold':
      return 'px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs'
    case 'platinum':
      return 'px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs'
    default:
      return 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs'
  }
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'bronze':
      return 'd97706'
    case 'silver':
      return '6b7280'
    case 'gold':
      return 'fbbf24'
    case 'platinum':
      return 'a78bfa'
    default:
      return '313fb2'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>

