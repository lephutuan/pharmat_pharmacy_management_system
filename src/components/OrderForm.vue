<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Customer Selection -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Khách Hàng (Tùy chọn)
      </label>
      <select
        v-model="formData.customer_id"
        class="input-field"
        @change="selectedCustomer = members.find(m => m.id === formData.customer_id)"
      >
        <option value="">Khách vãng lai</option>
        <option
          v-for="member in members"
          :key="member.id"
          :value="member.id"
        >
          {{ member.name }} - {{ member.phone }}
        </option>
      </select>
    </div>

    <!-- Add Medicine to Order -->
    <div class="border border-gray-200 rounded-lg p-4">
      <h3 class="font-semibold text-gray-800 mb-3">Thêm Sản Phẩm</h3>
      <div class="flex gap-2 mb-3">
        <select v-model="selectedMedicineId" class="flex-1 input-field">
          <option value="">Chọn thuốc</option>
          <option
            v-for="medicine in availableMedicines"
            :key="medicine.id"
            :value="medicine.id"
            :disabled="medicine.quantity === 0"
          >
            {{ medicine.name }} - Còn {{ medicine.quantity }} - {{ formatCurrency(medicine.price) }}
          </option>
        </select>
        <input
          v-model.number="medicineQuantity"
          type="number"
          min="1"
          placeholder="Số lượng"
          class="w-24 input-field"
        />
        <button
          type="button"
          @click="addItem"
          :disabled="!selectedMedicineId || !medicineQuantity || medicineQuantity <= 0"
          class="btn-primary"
        >
          Thêm
        </button>
      </div>

      <!-- Order Items List -->
      <div v-if="formData.items.length > 0" class="space-y-2 mt-4">
        <div
          v-for="(item, index) in formData.items"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex-1">
            <p class="font-medium text-gray-800">{{ item.medicine?.name || 'Đang tải...' }}</p>
            <p class="text-sm text-gray-600">
              {{ item.quantity }} x {{ formatCurrency(item.price) }} = {{ formatCurrency(item.subtotal) }}
            </p>
          </div>
          <button
            type="button"
            @click="removeItem(index)"
            class="text-red-600 hover:text-red-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Discount -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Giảm Giá (VNĐ)
      </label>
      <input
        v-model.number="formData.discount"
        type="number"
        min="0"
        :max="totalAmount"
        step="1000"
        class="input-field"
        placeholder="0"
      />
    </div>

    <!-- Total -->
    <div class="bg-primary/10 rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="font-medium text-gray-700">Tổng tiền:</span>
        <span class="text-xl font-bold text-primary">{{ formatCurrency(totalAmount) }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-medium text-gray-700">Giảm giá:</span>
        <span class="text-lg font-semibold text-gray-600">- {{ formatCurrency(formData.discount) }}</span>
      </div>
      <div class="flex justify-between items-center pt-2 border-t border-gray-300 mt-2">
        <span class="font-bold text-gray-800">Thành tiền:</span>
        <span class="text-2xl font-bold text-primary">{{ formatCurrency(finalAmount) }}</span>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Hủy
      </button>
      <button
        type="submit"
        :disabled="loading || formData.items.length === 0"
        class="btn-primary"
      >
        {{ loading ? "Đang tạo..." : "Tạo Đơn Hàng" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Medicine, Member, SaleItem } from "@/types";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

const loading = ref(false);
const members = ref<Member[]>([]);
const medicines = ref<Medicine[]>([]);
const selectedCustomer = ref<Member | null>(null);
const selectedMedicineId = ref("");
const medicineQuantity = ref(1);

const formData = ref({
  customer_id: "",
  staff_id: authStore.user?.id || "",
  items: [] as SaleItem[],
  discount: 0,
});

const availableMedicines = computed(() => {
  return medicines.value.filter(m => m.quantity > 0);
});

const totalAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + item.subtotal, 0);
});

const finalAmount = computed(() => {
  return Math.max(0, totalAmount.value - (formData.value.discount || 0));
});

async function fetchMembers() {
  try {
    const response = await api.get("/members", { params: { limit: 100 } });
    members.value = response.data.data || [];
  } catch (error) {
    console.error("Error fetching members:", error);
  }
}

async function fetchMedicines() {
  try {
    const response = await api.get("/medicines", { params: { limit: 100 } });
    medicines.value = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      category: item.category_name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      expiryDate: item.expiry_date,
      stockAlert: item.stock_alert,
      barcode: item.barcode || "",
      manufacturer: item.manufacturer || "",
    }));
  } catch (error) {
    console.error("Error fetching medicines:", error);
  }
}

async function addItem() {
  if (!selectedMedicineId.value || !medicineQuantity.value) return;

  const medicine = medicines.value.find(m => m.id === selectedMedicineId.value);
  if (!medicine) return;

  // Check if already in cart
  const existingIndex = formData.value.items.findIndex(
    item => item.medicineId === selectedMedicineId.value
  );

  if (existingIndex > -1) {
    // Update quantity
    const item = formData.value.items[existingIndex];
    const newQuantity = item.quantity + medicineQuantity.value;
    if (newQuantity > medicine.quantity) {
      const { error } = await import("@/composables/useToast").then(m => m.useToast());
      error(`Số lượng không đủ. Chỉ còn ${medicine.quantity} sản phẩm.`);
      return;
    }
    item.quantity = newQuantity;
    item.subtotal = item.quantity * item.price;
  } else {
    // Add new item
    if (medicineQuantity.value > medicine.quantity) {
      const { error } = await import("@/composables/useToast").then(m => m.useToast());
      error(`Số lượng không đủ. Chỉ còn ${medicine.quantity} sản phẩm.`);
      return;
    }
    formData.value.items.push({
      medicineId: medicine.id,
      medicine: medicine,
      quantity: medicineQuantity.value,
      price: medicine.price,
      subtotal: medicine.price * medicineQuantity.value,
    });
  }

  selectedMedicineId.value = "";
  medicineQuantity.value = 1;
}

function removeItem(index: number) {
  formData.value.items.splice(index, 1);
}

async function handleSubmit() {
  if (formData.value.items.length === 0) {
    const { error } = await import("@/composables/useToast").then(m => m.useToast());
    error("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      customer_id: formData.value.customer_id || null,
      staff_id: authStore.user?.id,
      items: formData.value.items.map(item => ({
        medicine_id: item.medicineId,
        quantity: item.quantity,
        price: item.price,
      })),
      discount: formData.value.discount || 0,
    };

    await api.post("/sales", payload);
    const { success } = await import("@/composables/useToast").then(m => m.useToast());
    success("Đơn hàng đã được tạo thành công!");
    emit("success");
  } catch (error: any) {
    console.error("Error creating order:", error);
    const { error: showError } = await import("@/composables/useToast").then(m => m.useToast());
    showError(error.response?.data?.error || "Lỗi khi tạo đơn hàng");
  } finally {
    loading.value = false;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

onMounted(() => {
  fetchMembers();
  fetchMedicines();
});
</script>

