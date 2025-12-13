<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-4 md:p-10 bg-lightGray">
    <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Панель адміністратора</h1>

    <div v-if="!currentAdmin" class="text-center py-16 text-gray-500">
      <p>Адміністратор не знайдено</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Профіль адміністратора -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <span class="text-red-600 text-2xl sm:text-3xl font-bold">
              {{ currentAdmin.email.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-4 text-center sm:text-left">
            <div class="flex flex-col items-center sm:items-start">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Адміністратор</h2>
              <p class="text-gray-500 text-xs sm:text-sm mb-2 break-all">{{ currentAdmin.email }}</p>
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  Адміністратор системи
                </span>
              </div>
            </div>
          </div>

            <!-- Статистика системи -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-xl sm:text-2xl flex-shrink-0">👥</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Користувачі</p>
                      <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ totalUsersCount }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2 text-center lg:text-left">
                    {{ partnersCount }} партнерів, {{ studentsCount }} студентів, {{ teachersCount }} викладачів
                  </p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-xl sm:text-2xl flex-shrink-0">📊</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Проєкти</p>
                      <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ projectsCount }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2 text-center lg:text-left">
                    {{ activeProjectsCount }} активних, {{ completedProjectsCount }} завершених
                  </p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-xl sm:text-2xl flex-shrink-0">⚙️</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Система</p>
                      <p class="text-xl sm:text-2xl font-bold text-gray-800">2.1.0</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2 text-center lg:text-left">
                    <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Активна</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Останні події -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Останні події</h3>
        <div v-if="notifications.length === 0" class="text-center py-8 text-gray-500">
          Немає подій
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-2 h-2 rounded-full bg-savoy mt-2 flex-shrink-0"></div>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">{{ notification.title }}</p>
              <p class="text-sm text-gray-600">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import type { AdminNotification, User } from "~~/types";

const projectsStore = useProjectsStore();
const authStore = useAuthStore();

// Комп'ютед властивості
const currentAdmin = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "admin") {
    return null;
  }
  return authStore.currentUser as User;
});

const partnersCount = computed(() => projectsStore.partners.length);
const studentsCount = computed(() => projectsStore.students.length);
const teachersCount = computed(() => projectsStore.teachers.length);
const totalUsersCount = computed(() => 
  partnersCount.value + studentsCount.value + teachersCount.value + 1 // +1 для адміна
);
const projectsCount = computed(() => projectsStore.projects.length);
const activeProjectsCount = computed(() => 
  projectsStore.projects.filter(p => p.status === 'active').length
);
const completedProjectsCount = computed(() => 
  projectsStore.projects.filter(p => p.status === 'completed').length
);

// Отримуємо сповіщення адміністратора
const notifications = computed<AdminNotification[]>(() => {
  // Можна додати логіку для отримання сповіщень адміністратора
  return [];
});

const formatTime = (date: Date): string => {
  return new Date(date).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

