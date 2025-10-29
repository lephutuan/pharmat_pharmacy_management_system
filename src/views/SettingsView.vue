<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-title text-gray-800">Cài Đặt Hệ Thống</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <div class="card sticky top-6">
          <nav class="space-y-2">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition-all',
                activeSection === section.id
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center gap-3">
                <component :is="section.icon" class="w-5 h-5" />
                <span>{{ section.label }}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Cài Đặt Chung</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tên Nhà Thuốc</label>
              <input
                v-model="settings.name"
                type="text"
                class="input-field"
                placeholder="Nhập tên nhà thuốc"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Địa Chỉ</label>
              <textarea
                v-model="settings.address"
                class="input-field"
                rows="3"
                placeholder="Nhập địa chỉ nhà thuốc"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                <input
                  v-model="settings.phone"
                  type="tel"
                  class="input-field"
                  placeholder="0901234567"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="settings.email"
                  type="email"
                  class="input-field"
                  placeholder="info@pharmat.com"
                />
              </div>
            </div>
            <button class="btn-primary">Lưu Thay Đổi</button>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeSection === 'security'" class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Bảo Mật</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mật Khẩu Hiện Tại</label>
              <input
                v-model="password.current"
                type="password"
                class="input-field"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mật Khẩu Mới</label>
              <input
                v-model="password.new"
                type="password"
                class="input-field"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Xác Nhận Mật Khẩu Mới</label>
              <input
                v-model="password.confirm"
                type="password"
                class="input-field"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
                <span class="ml-2 text-sm text-gray-600">Yêu cầu đổi mật khẩu mỗi 90 ngày</span>
              </label>
            </div>
            <button class="btn-primary">Đổi Mật Khẩu</button>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="activeSection === 'notifications'" class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Thông Báo</h2>
          <div class="space-y-6">
            <div v-for="item in notificationSettings" :key="item.id" class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800">{{ item.label }}</p>
                <p class="text-sm text-gray-600">{{ item.description }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="item.enabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <button class="btn-primary">Lưu Cài Đặt</button>
          </div>
        </div>

        <!-- Backup Settings -->
        <div v-if="activeSection === 'backup'" class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Sao Lưu & Khôi Phục</h2>
          <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium text-gray-800 mb-2">Sao lưu dữ liệu</p>
              <p class="text-sm text-gray-600 mb-4">Sao lưu tất cả dữ liệu hệ thống để bảo vệ khỏi mất mát.</p>
              <button class="btn-outline">Xuất Dữ Liệu</button>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium text-gray-800 mb-2">Khôi phục dữ liệu</p>
              <p class="text-sm text-gray-600 mb-4">Khôi phục dữ liệu từ file sao lưu.</p>
              <button class="btn-outline">Nhập Dữ Liệu</button>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="font-medium text-yellow-800">Cảnh báo</p>
                  <p class="text-sm text-yellow-700">Việc khôi phục sẽ ghi đè dữ liệu hiện tại. Hãy sao lưu dữ liệu trước khi khôi phục.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CogIcon, ShieldCheckIcon, BellAlertIcon, ServerIcon } from '@heroicons/vue/24/outline'

const activeSection = ref('general')

const sections = [
  { id: 'general', label: 'Cài Đặt Chung', icon: CogIcon },
  { id: 'security', label: 'Bảo Mật', icon: ShieldCheckIcon },
  { id: 'notifications', label: 'Thông Báo', icon: BellAlertIcon },
  { id: 'backup', label: 'Sao Lưu & Khôi Phục', icon: ServerIcon }
]

const settings = reactive({
  name: 'Nhà Thuốc PharmaT',
  address: '123 Đường ABC, Quận XYZ, TP.HCM',
  phone: '0901234567',
  email: 'info@pharmat.com'
})

const password = reactive({
  current: '',
  new: '',
  confirm: ''
})

const notificationSettings = reactive([
  {
    id: 1,
    label: 'Cảnh báo thuốc hết hạn',
    description: 'Nhận thông báo khi có thuốc sắp hết hạn',
    enabled: true
  },
  {
    id: 2,
    label: 'Cảnh báo hết hàng',
    description: 'Nhận thông báo khi hàng hóa sắp hết',
    enabled: true
  },
  {
    id: 3,
    label: 'Thông báo đơn hàng mới',
    description: 'Nhận thông báo khi có đơn hàng mới',
    enabled: false
  },
  {
    id: 4,
    label: 'Email báo cáo hàng tuần',
    description: 'Nhận email báo cáo định kỳ',
    enabled: true
  }
])
</script>

