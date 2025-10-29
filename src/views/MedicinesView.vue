<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-title text-gray-800">Quản Lý Thuốc</h1>
      <button class="btn-primary">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Thêm Thuốc Mới
      </button>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm thuốc..."
          class="input-field"
        />
        <select v-model="selectedCategory" class="input-field">
          <option value="">Tất cả danh mục</option>
          <option value="antibiotic">Kháng sinh</option>
          <option value="analgesic">Giảm đau</option>
          <option value="vitamin">Vitamin</option>
        </select>
        <select v-model="stockFilter" class="input-field">
          <option value="">Trạng thái</option>
          <option value="low">Hết hàng</option>
          <option value="expiring">Sắp hết hạn</option>
        </select>
        <button class="btn-secondary">Lọc</button>
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
      <div v-else-if="medicines.length === 0" class="text-center py-12">
        <p class="text-gray-600">Không có thuốc nào</p>
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
              <tr
                v-for="medicine in filteredMedicines"
                :key="medicine.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
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
          <p class="text-sm text-gray-600">Hiển thị 1-{{ filteredMedicines.length }} trong tổng số {{ totalItems }} kết quả</p>
          <div class="flex gap-2">
            <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Trước</button>
            <button class="px-3 py-1 bg-primary text-white rounded-lg">1</button>
            <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Sau</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Medicine } from '@/types'
import api from '@/services/api'

const searchQuery = ref('')
const selectedCategory = ref('')
const stockFilter = ref('')
const medicines = ref<Medicine[]>([])
const loading = ref(false)
const totalItems = ref(0)

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
    const matchesSearch = !searchQuery.value || med.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || med.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Fetch on mount
onMounted(() => {
  fetchMedicines()
})

// Watch for filter changes (optional - can refetch from backend)
watch([searchQuery, selectedCategory], () => {
  // Uncomment to refetch from backend on filter change
  // fetchMedicines()
})

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

