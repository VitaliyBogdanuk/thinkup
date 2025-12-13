<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="close">
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md w-full">
        <div class="flex items-start gap-4">
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
              type === 'success' ? 'bg-green-100' : type === 'error' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
            ]"
          >
            <CheckCircleIcon v-if="type === 'success'" class="w-6 h-6 text-green-600" />
            <XCircleIcon v-else-if="type === 'error'" class="w-6 h-6 text-red-600" />
            <ExclamationTriangleIcon v-else-if="type === 'warning'" class="w-6 h-6 text-yellow-600" />
            <InformationCircleIcon v-else class="w-6 h-6 text-blue-600" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 
              v-if="title"
              :class="[
                'text-lg font-bold mb-2',
                type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
              ]"
            >
              {{ title }}
            </h3>
            <p class="text-gray-700">{{ message }}</p>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Закрити"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="close"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-colors',
              type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 
              type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 
              type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 
              'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  isOpen: boolean;
  message: string;
  title?: string;
  type?: "success" | "error" | "warning" | "info";
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};

// Автоматичне закриття через 5 секунд для success та info
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && (props.type === "success" || props.type === "info")) {
    const timer = setTimeout(() => {
      close();
    }, 5000);
    
    return () => clearTimeout(timer);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

