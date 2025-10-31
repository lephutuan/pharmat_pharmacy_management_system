<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-title text-gray-800">Quản Lý Thuốc</h1>
      <button @click="openAddModal" class="btn-primary">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Thêm Thuốc Mới
      </button>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm thuốc..." class="input-field" />
        <select v-model="selectedCategory" class="input-field">
          <option value="">Tất cả danh mục</option>
          <option value="Kháng sinh">Kháng sinh</option>
          <option value="Giảm đau">Giảm đau</option>
          <option value="Vitamin">Vitamin</option>
        </select>
        <select v-model="stockFilter" class="input-field">
          <option value="">Tất cả trạng thái</option>
          <option value="low">Hết hàng</option>
          <option value="expiring">Sắp hết hạn</option>
          <option value="available">Còn hàng</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredMedicines.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mt-4 text-gray-600 font-medium">Không tìm thấy thuốc nào</p>
        <p class="text-sm text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      </div>

      <!-- Table Content -->
      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Tên Thuốc</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Danh Mục</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Giá</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Số Lượng</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Hết Hạn</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Trạng Thái</th>
                <th class="text-center py-3 px-4 font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="medicine in pagedMedicines" :key="medicine.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 px-4">
                  <div>
                    <p class="font-medium text-gray-800">{{ medicine.name }}</p>
                    <p class="text-xs text-gray-500">{{ medicine.barcode }}</p>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">{{ medicine.category }}</td>
                <td class="py-3 px-4">
                  <span class="font-semibold text-primary">{{ formatCurrency(medicine.price) }}</span>
                </td>
                <td class="py-3 px-4">
                  <span :class="getStockClass(medicine.quantity)">
                    {{ medicine.quantity }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-600">{{ formatDate(medicine.expiryDate) }}</td>
                <td class="py-3 px-4">
                  <span :class="getStatusBadge(medicine)">
                    {{ getStatusText(medicine) }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center justify-center gap-2">
                    <button @click="openEditModal(medicine)" class="text-primary hover:text-blue-700" title="Sửa">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="confirmDelete(medicine)" class="text-red-600 hover:text-red-700" title="Xóa">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            {{ (currentPage - 1) * pageSize + (pagedMedicines.length ? 1 : 0) }}-
            {{ (currentPage - 1) * pageSize + pagedMedicines.length }}
            trong tổng số {{ filteredMedicines.length }} kết quả
          </p>
          <div class="flex gap-2">
            <button :disabled="currentPage === 1" @click="currentPage--"
              class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Trước</button>
            <button v-for="n in totalPages" :key="n" class="px-3 py-1"
              :class="n === currentPage ? 'bg-primary text-white rounded-lg' : 'border border-gray-300 rounded-lg hover:bg-gray-50'"
              @click="currentPage = n">{{ n }}</button>
            <button :disabled="currentPage === totalPages" @click="currentPage++"
              class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Sau</button>
          </div>
        </div>
      </template>
    </div>

    <!-- Medicine Modal -->
    <Modal v-model="showModal" :title="editingMedicine ? 'Sửa Thuốc' : 'Thêm Thuốc Mới'">
      <MedicineForm :medicine="editingMedicine" @success="handleFormSuccess" @cancel="closeModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Medicine } from '@/types'
import api from '@/services/api'
import Modal from '@/components/Modal.vue'
import MedicineForm from '@/components/MedicineForm.vue'
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()

const searchQuery = ref('')
const selectedCategory = ref('')
const stockFilter = ref('')
const medicines = ref<Medicine[]>([])
const loading = ref(false)
const totalItems = ref(0)
const showModal = ref(false)
const editingMedicine = ref<Medicine | null>(null)

// Fetch medicines from API
async function fetchMedicines() {
  loading.value = true
  try {
    const response = await api.get('/medicines', {
      params: {
        search: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        page: 1,
        limit: 100 // Get all for now
      }
    })

    // Transform backend data to frontend format
    medicines.value = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      category: item.category_name, // Backend returns category_name
      price: parseFloat(item.price),
      quantity: item.quantity,
      expiryDate: item.expiry_date, // Backend returns expiry_date
      stockAlert: item.stock_alert,
      barcode: item.barcode || '',
      manufacturer: item.manufacturer || ''
    }))

    totalItems.value = response.data.total
  } catch (error) {
    console.error('Error fetching medicines:', error)
    medicines.value = []
  } finally {
    loading.value = false
  }
}

// Client-side filtering (can be removed if using backend filtering only)
const filteredMedicines = computed(() => {
  return medicines.value.filter(med => {
    // Lọc theo tìm kiếm
    const matchesSearch = !searchQuery.value || med.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Lọc theo danh mục
    const matchesCategory = !selectedCategory.value || med.category === selectedCategory.value

    // Lọc theo trạng thái
    let matchesStock = true
    if (stockFilter.value) {
      const daysUntilExpiry = Math.floor((new Date(med.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      if (stockFilter.value === 'low') {
        matchesStock = med.quantity === 0
      } else if (stockFilter.value === 'expiring') {
        matchesStock = daysUntilExpiry <= 30 && med.quantity > 0
      } else if (stockFilter.value === 'available') {
        matchesStock = med.quantity > 0 && daysUntilExpiry > 30
      }
    }

    return matchesSearch && matchesCategory && matchesStock
  })
})

const pageSize = ref(6)
const currentPage = ref(1)

const pagedMedicines = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMedicines.value.slice(start, end)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMedicines.value.length / pageSize.value)))

watch(filteredMedicines, () => { currentPage.value = 1 })

// Fetch on mount
onMounted(() => {
  fetchMedicines()
})

// Watch for filter changes (optional - can refetch from backend)
watch([searchQuery, selectedCategory, stockFilter], () => {
  // Uncomment to refetch from backend on filter change
  // fetchMedicines()
})

// Modal handlers
function openAddModal() {
  editingMedicine.value = null
  showModal.value = true
}

function openEditModal(medicine: Medicine) {
  editingMedicine.value = medicine
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingMedicine.value = null
}

function handleFormSuccess() {
  closeModal()
  fetchMedicines()
  success('Thuốc đã được lưu thành công!')
}

async function confirmDelete(medicine: Medicine) {
  if (confirm(`Bạn có chắc chắn muốn xóa "${medicine.name}"?`)) {
    try {
      await api.delete(`/medicines/${medicine.id}`)
      success('Thuốc đã được xóa thành công!')
      fetchMedicines()
    } catch (err: any) {
      error(err.response?.data?.error || 'Lỗi khi xóa thuốc')
    }
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function getStockClass(quantity: number): string {
  if (quantity === 0) return 'text-red-600 font-semibold'
  if (quantity < 20) return 'text-orange-600 font-semibold'
  return 'text-gray-800'
}

function getStatusBadge(medicine: Medicine): string {
  const daysUntilExpiry = Math.floor((new Date(medicine.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (medicine.quantity === 0) return 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs'
  if (daysUntilExpiry <= 30) return 'px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs'
  return 'px-3 py-1 bg-accent/20 text-accent rounded-full text-xs'
}

function getStatusText(medicine: Medicine): string {
  const daysUntilExpiry = Math.floor((new Date(medicine.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (medicine.quantity === 0) return 'Hết hàng'
  if (daysUntilExpiry <= 30) return 'Sắp hết hạn'
  return 'Còn hàng'
}
</script>
