<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-title text-gray-800">Báo Cáo & Phân Tích</h1>
      <div class="flex gap-3">
        <button class="btn-outline">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Xuất PDF
        </button>
        <button class="btn-outline">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Xuất Excel
        </button>
      </div>
    </div>

    <!-- Filter Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card bg-gradient-primary text-white">
        <p class="text-sm opacity-90 mb-2">Doanh Thu Tháng Này</p>
        <p class="text-3xl font-bold">{{ formatCurrency(monthlyRevenue) }}</p>
        <p class="text-sm mt-2 opacity-75">+15.3% so với tháng trước</p>
      </div>
      <div class="card bg-gradient-to-r from-green-500 to-green-600 text-white">
        <p class="text-sm opacity-90 mb-2">Số Đơn Hàng</p>
        <p class="text-3xl font-bold">{{ totalOrders }}</p>
        <p class="text-sm mt-2 opacity-75">Trung bình: {{ averageOrder }}đ/đơn</p>
      </div>
      <div class="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <p class="text-sm opacity-90 mb-2">Sản Phẩm Bán Được</p>
        <p class="text-3xl font-bold">{{ itemsSold }}</p>
        <p class="text-sm mt-2 opacity-75">{{ topCategory }} bán chạy nhất</p>
      </div>
      <div class="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <p class="text-sm opacity-90 mb-2">Khách Hàng Mới</p>
        <p class="text-3xl font-bold">{{ newCustomers }}</p>
        <p class="text-sm mt-2 opacity-75">Tăng 8% so với tháng trước</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Chart -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Doanh Thu Theo Ngày</h3>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="(day, index) in dailySales"
            :key="index"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg hover:opacity-80 transition-all cursor-pointer"
              :style="{ height: `${(day.value / Math.max(...dailySales.map(d => d.value))) * 100}%` }"
              :title="formatCurrency(day.value)"
            ></div>
            <span class="text-xs text-gray-600 mt-2">{{ day.label }}</span>
          </div>
        </div>
      </div>

      <!-- Category Distribution -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Phân Bố Danh Mục</h3>
        <div class="space-y-4">
          <div v-for="category in categorySales" :key="category.name" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
              <span class="text-sm font-semibold text-gray-800">{{ formatCurrency(category.value) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="['h-2 rounded-full transition-all', category.color]"
                :style="{ width: `${(category.value / Math.max(...categorySales.map(c => c.value))) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Performance -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Top 10 Sản Phẩm Bán Chạy</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">STT</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Tên Sản Phẩm</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Danh Mục</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Số Lượng</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Doanh Thu</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Tỷ Lệ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, index) in topProducts"
              :key="product.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 px-4 text-gray-600">#{{ index + 1 }}</td>
              <td class="py-3 px-4 font-medium text-gray-800">{{ product.name }}</td>
              <td class="py-3 px-4 text-gray-600">{{ product.category }}</td>
              <td class="py-3 px-4 text-gray-800">{{ product.quantity }}</td>
              <td class="py-3 px-4 font-semibold text-primary">{{ formatCurrency(product.revenue) }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-primary h-2 rounded-full"
                      :style="{ width: `${product.percentage}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ product.percentage }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const monthlyRevenue = 145_000_000
const totalOrders = 486
const averageOrder = 298_354
const itemsSold = 1245
const topCategory = 'Giảm đau'
const newCustomers = 89

const dailySales = [
  { label: '1', value: 4_200_000 },
  { label: '2', value: 5_100_000 },
  { label: '3', value: 4_800_000 },
  { label: '4', value: 6_200_000 },
  { label: '5', value: 5_900_000 },
  { label: '6', value: 7_300_000 },
  { label: '7', value: 6_800_000 }
]

const categorySales = [
  { name: 'Giảm đau', value: 45_000_000, color: 'bg-blue-500' },
  { name: 'Kháng sinh', value: 35_000_000, color: 'bg-green-500' },
  { name: 'Vitamin', value: 28_000_000, color: 'bg-yellow-500' },
  { name: 'Khác', value: 37_000_000, color: 'bg-purple-500' }
]

const topProducts = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Giảm đau', quantity: 156, revenue: 2_340_000, percentage: 18.5 },
  { id: 2, name: 'Amoxicillin 500mg', category: 'Kháng sinh', quantity: 89, revenue: 4_005_000, percentage: 15.2 },
  { id: 3, name: 'Vitamin C 1000mg', category: 'Vitamin', quantity: 120, revenue: 3_000_000, percentage: 12.8 },
  { id: 4, name: 'Ibuprofen 400mg', category: 'Giảm đau', quantity: 78, revenue: 1_950_000, percentage: 10.5 },
  { id: 5, name: 'Aspirin 75mg', category: 'Giảm đau', quantity: 95, revenue: 1_140_000, percentage: 9.2 }
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

