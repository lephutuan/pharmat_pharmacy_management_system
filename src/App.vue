<template>
  <router-view />
  <ToastContainer />
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p class="text-gray-700">Đang tải...</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ToastContainer.vue'
import { restorePendingToasts } from '@/composables/useToast'

const loading = ref(false)
const authStore = useAuthStore()
const route = useRoute()

onMounted(() => {
  authStore.initAuth()
})

// Khôi phục toast khi route thay đổi (sau khi login/logout)
// Delay để đợi page ổn định sau khi navigate
watch(() => route.path, () => {
  // Gọi nhiều lần với delay khác nhau để đảm bảo bắt được toast
  // ngay cả khi có HMR reload
  setTimeout(() => restorePendingToasts(), 50)
  setTimeout(() => restorePendingToasts(), 200)
  setTimeout(() => restorePendingToasts(), 500)
}, { immediate: true })
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
