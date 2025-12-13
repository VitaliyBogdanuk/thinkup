<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-4 md:p-10 bg-lightGray">
    <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Мій профіль</h1>

    <div v-if="!currentPartner" class="text-center py-16 text-gray-500">
      <p>Партнер не знайдено</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Сповіщення для партнера -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">
            Сповіщення
            <span v-if="partnerUnreadCount > 0" class="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
              {{ partnerUnreadCount }} нових
            </span>
          </h3>
          <div class="flex items-center gap-4">
            <button 
              v-if="partnerUnreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-savoy hover:text-savoy/80 transition-colors"
            >
              Позначити все як прочитане
            </button>
            <button
              @click="toggleNotifications"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {{ showNotifications ? 'Сховати' : 'Показати' }}
            </button>
          </div>
        </div>
        
        <div v-if="partnerNotifications.length === 0" class="text-center py-8 text-gray-500">
          <p>Немає нових сповіщень</p>
        </div>

        <div v-else-if="showNotifications" class="space-y-3">
          <div 
            v-for="notification in partnerNotifications"
            :key="notification.id"
            :class="[
              'p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm',
              notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-3">
              <!-- Іконка типу сповіщення -->
              <div class="flex-shrink-0 mt-1">
                <div v-if="notification.type === 'project_status_update'" class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-green-600 text-lg">🔄</span>
                </div>
                <div v-else-if="notification.type === 'project_approval'" class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 text-lg">✅</span>
                </div>
                <div v-else-if="notification.type === 'new_student_application'" class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-purple-600 text-lg">👤</span>
                </div>
                <div v-else-if="notification.type === 'project_deadline'" class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span class="text-orange-600 text-lg">⏰</span>
                </div>
                <div v-else-if="notification.type === 'project_completed'" class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span class="text-yellow-600 text-lg">🏆</span>
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-600 text-lg">📢</span>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-1">
                  <h4 class="font-semibold text-gray-800">{{ notification.title }}</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500 whitespace-nowrap">
                      {{ formatTimeAgo(notification.createdAt) }}
                    </span>
                    <span 
                      v-if="!notification.read"
                      class="w-2 h-2 rounded-full bg-savoy"
                    ></span>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ notification.message }}</p>
                
                <!-- Додаткові дії для сповіщень -->
                <div v-if="!notification.read && notification.projectId" class="flex gap-2 mt-3">
                  <button
                    @click.stop="navigateToProject(notification.projectId)"
                    class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
                  >
                    Перейти до проєкту
                  </button>
                  
                  <!-- Для нових заявок студентів -->
                  <button
                    v-if="notification.type === 'new_student_application'"
                    @click.stop="viewProjectApplications(notification.projectId)"
                    class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    Переглянути заявки
                  </button>
                  
                  <!-- Для дедлайну -->
                  <button
                    v-if="notification.type === 'project_deadline'"
                    @click.stop="extendDeadline(notification.projectId)"
                    class="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                  >
                    Продовжити термін
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 text-gray-500">
          <p>Сповіщень: {{ partnerUnreadCount }} непрочитаних з {{ partnerNotifications.length }}</p>
        </div>
      </div>

      <!-- Профіль партнера -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
            <span class="text-savoy text-2xl sm:text-3xl font-bold">
              {{ currentPartner.companyName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ currentPartner.companyName }}</h2>
                <p v-if="currentPartner.companyDescription" class="text-gray-600 mb-1 text-sm sm:text-base">
                  {{ currentPartner.companyDescription }}
                </p>
                <p class="text-gray-500 text-xs sm:text-sm mb-2 break-all">{{ currentPartner.email }}</p>
                <div v-if="currentPartner.contactPhone" class="flex items-center gap-2 mb-2">
                  <span class="text-xs sm:text-sm text-gray-500">Телефон:</span>
                  <span class="text-sm sm:text-base font-semibold text-gray-800">{{ currentPartner.contactPhone }}</span>
                </div>
                <div v-if="currentPartner.website" class="flex items-center gap-2">
                  <span class="text-xs sm:text-sm text-gray-500">Вебсайт:</span>
                  <a 
                    :href="currentPartner.website" 
                    target="_blank"
                    class="text-sm sm:text-base text-savoy hover:text-savoy/80 transition-colors"
                  >
                    {{ currentPartner.website }}
                  </a>
                </div>
              </div>
              
              <!-- Лічильник непрочитаних сповіщень -->
              <div v-if="partnerUnreadCount > 0" class="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                <span class="text-sm text-gray-700 font-medium">Нові сповіщення:</span>
                <span class="text-lg font-bold text-red-700">{{ partnerUnreadCount }}</span>
              </div>
            </div>

            <!-- Статистика проєктів -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-2xl">📊</span>
                    <div>
                      <p class="text-xs text-gray-500">Всього проєктів</p>
                      <p class="text-2xl font-bold text-gray-800">{{ myProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2">{{ pendingProjects.length }} очікують</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-2xl">✅</span>
                    <div>
                      <p class="text-xs text-gray-500">Завершених</p>
                      <p class="text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2">{{ stats.successRate }}% успішних</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-2xl">🚀</span>
                    <div>
                      <p class="text-xs text-gray-500">Активних</p>
                      <p class="text-2xl font-bold text-gray-800">{{ activeProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2">{{ stats.activeStudents }} студентів</p>
                </div>
              </div>
              
              <!-- Додаткова статистика -->
              <div v-if="completedProjects.length > 0" class="mt-4 p-4 bg-savoy/5 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-700">Середня оцінка проєктів:</p>
                    <p class="text-2xl font-bold text-savoy">{{ stats.averageRating }}/5</p>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-700">Задоволеність:</p>
                    <p class="text-2xl font-bold text-green-600">{{ stats.satisfactionRate }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Швидкі дії -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Швидкі дії</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            @click="navigateToCreateProject"
            class="p-4 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">➕</span>
            <span>Створити проєкт</span>
          </button>
          <button
            @click="navigateToAllProjects"
            class="p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">📋</span>
            <span>Всі мої проєкти</span>
          </button>
          <button
            @click="navigateToActiveProjects"
            class="p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">🚀</span>
            <span>Активні проєкти</span>
          </button>
          <button
            @click="navigateToAnalytics"
            class="p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">📊</span>
            <span>Аналітика</span>
          </button>
        </div>
      </div>

      <!-- Активні проєкти -->
      <div v-if="activeProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg md:text-xl font-bold text-gray-800">
            Активні проєкти
            <span class="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {{ activeProjects.length }}
            </span>
          </h3>
          <button
            @click="navigateToActiveProjects"
            class="text-sm text-savoy hover:text-savoy/80 transition-colors"
          >
            Переглянути всі →
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="project in activeProjects.slice(0, 3)"
            :key="project.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-800">{{ project.name }}</h4>
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                    Активний
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ project.description }}</p>
                
                <!-- Інформація про проєкт -->
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <span>👥</span>
                    <span>{{ project.team.length }} студентів</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>🏷️</span>
                    <span>{{ project.category }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>⚡</span>
                    <span>{{ getComplexityText(project.complexity) }}</span>
                  </div>
                  <div v-if="project.deadline" class="flex items-center gap-1">
                    <span>📅</span>
                    <span>{{ formatDate(project.deadline) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Прогрес -->
              <div class="ml-4 text-right">
                <p class="text-xs text-gray-500 mb-1">Прогрес</p>
                <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-savoy transition-all duration-300"
                    :style="{ width: getProjectProgress(project.id) + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ getProjectProgress(project.id) }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Проєкти, що очікують затвердження -->
      <div v-if="pendingProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Проєкти, що очікують затвердження
          <span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            {{ pendingProjects.length }}
          </span>
        </h3>
        
        <div class="space-y-4">
          <div
            v-for="project in pendingProjects.slice(0, 3)"
            :key="project.id"
            class="p-4 border border-yellow-200 bg-yellow-50 rounded-lg hover:border-yellow-300 hover:shadow-sm transition-all cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-800">{{ project.name }}</h4>
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                    Очікує затвердження
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ project.description }}</p>
                
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <span>🏷️</span>
                    <span>{{ project.category }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>⚡</span>
                    <span>{{ getComplexityText(project.complexity) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-xs text-gray-500">
              <span>AI рекомендації: {{ project.recommendations?.length || 0 }} студентів</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Завершені проєкти -->
      <div v-if="completedProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Завершені проєкти
          <span class="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {{ completedProjects.length }}
          </span>
        </h3>
        
        <div class="space-y-4">
          <div
            v-for="project in completedProjects.slice(0, 3)"
            :key="project.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-800">{{ project.name }}</h4>
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                    Завершений
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ project.description }}</p>
                
                <!-- Інформація про проєкт -->
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <span>👥</span>
                    <span>{{ project.team.length }} студентів</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>🏷️</span>
                    <span>{{ project.category }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>⚡</span>
                    <span>{{ getComplexityText(project.complexity) }}</span>
                  </div>
                  <div v-if="project.updatedAt" class="flex items-center gap-1">
                    <span>✅</span>
                    <span>Завершено: {{ formatDate(project.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Повідомлення про відсутність проєктів -->
      <div v-if="myProjects.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">🚀</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Ще немає проєктів</h3>
        <p class="text-gray-600 mb-6">
          Створіть свій перший проєкт для співпраці зі студентами
        </p>
        <button
          @click="navigateToCreateProject"
          class="px-8 py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-medium shadow-sm"
        >
          Створити перший проєкт
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import type { 
  Partner, 
  Project, 
  PartnerNotification,
  ComplexityLevel 
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

// Реф для сповіщень
const partnerNotifications = ref<PartnerNotification[]>([
  {
    id: '1',
    type: 'project_status_update',
    title: 'Статус проєкту оновлено',
    message: 'Ваш проєкт "Розробка AI-асистента" переведено у статус "Активний"',
    projectId: 'project-789',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 хвилин тому
  },
  {
    id: '2',
    type: 'project_approval',
    title: 'Проєкт затверджено',
    message: 'Ваш проєкт "Мобільний додаток для освіти" затверджено викладачем',
    projectId: 'project-456',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 години тому
  },
  {
    id: '3',
    type: 'project_deadline',
    title: 'Наближається дедлайн',
    message: 'У проєкті "Веб-портал для університету" залишилось 5 днів до дедлайну',
    projectId: 'project-789',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день тому
  },
  {
    id: '4',
    type: 'project_completed',
    title: 'Проєкт завершено!',
    message: 'Проєкт "Розробка веб-додатку" успішно завершено студентами',
    projectId: 'project-123',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 дні тому
  },
]);

const showNotifications = ref(true);

// Комп'ютед властивості
const currentPartner = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "partner") {
    return null;
  }
  return authStore.currentUser as Partner;
});

// Проєкти партнера
const myProjects = computed(() => {
  if (!currentPartner.value) return [];
  return projectsStore.getProjectsByPartner(currentPartner.value.id);
});

// Завершені проєкти
const completedProjects = computed(() => {
  return myProjects.value.filter((p: Project) => p.status === 'completed');
});

// Активні проєкти
const activeProjects = computed(() => {
  return myProjects.value.filter((p: Project) => p.status === 'active');
});

// Проєкти на затвердженні
const pendingProjects = computed(() => {
  return myProjects.value.filter((p: Project) => 
    p.status === 'pending_approval' || p.status === 'pending_ai'
  );
});

// Статистика
const stats = computed(() => {
  const completed = completedProjects.value.length;
  const active = activeProjects.value.length;
  const total = myProjects.value.length;
  
  // Рахуємо унікальних студентів з активних проєктів
  const activeStudents = new Set();
  activeProjects.value.forEach((project: Project) => {
    if (project.team && Array.isArray(project.team)) {
      project.team.forEach((studentId: string) => activeStudents.add(studentId));
    }
  });

  // Симуляція рейтингів
  const averageRating = total > 0 ? (3.8 + Math.random() * 1.2).toFixed(1) : "0.0";
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const satisfactionRate = total > 0 ? Math.round(85 + Math.random() * 15) : 0;

  return {
    activeStudents: activeStudents.size,
    averageRating,
    successRate,
    satisfactionRate
  };
});

const partnerUnreadCount = computed(() => {
  return partnerNotifications.value.filter(n => !n.read).length;
});

// Функції для роботи зі сповіщеннями
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'щойно';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} хв тому`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} год тому`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн тому`;
  return `${Math.floor(diffInSeconds / 604800)} тиж тому`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAsRead = (notificationId: string) => {
  const notification = partnerNotifications.value.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  partnerNotifications.value.forEach(n => n.read = true);
};

const handleNotificationClick = (notification: PartnerNotification) => {
  markAsRead(notification.id);
  
  if (notification.projectId) {
    navigateToProject(notification.projectId);
  }
};

// Додаткові дії для сповіщень
const viewProjectApplications = (projectId: string) => {
  router.push(`/projects/${projectId}/applications`);
};

const extendDeadline = (projectId: string) => {
  console.log('Продовжено термін для проєкту:', projectId);
  alert('Запит на продовження терміну відправлено викладачу');
};

// Функції для проєктів
const getProjectStatusText = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "Чернетка",
    pending_ai: "AI аналіз",
    pending_approval: "Очікує затвердження",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
  };
  return map[status];
};

const getProjectStatusClass = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    pending_ai: "bg-blue-100 text-blue-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status];
};

const getComplexityText = (complexity: ComplexityLevel): string => {
  const map: Record<ComplexityLevel, string> = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

const getProjectProgress = (projectId: string): number => {
  const project = projectsStore.getProjectById(projectId);
  if (!project) return 0;
  
  // Проста симуляція прогресу
  const statusProgress: Record<Project["status"], number> = {
    draft: 10,
    pending_ai: 20,
    pending_approval: 30,
    active: Math.floor(Math.random() * 60) + 30, // 30-90%
    completed: 100,
    cancelled: 0,
  };
  
  return statusProgress[project.status] || 0;
};

// Навігація
const navigateToProject = (projectId: string) => {
  router.push(`/projects/${projectId}`);
};

const navigateToCreateProject = () => {
  router.push('/projects/create');
};

const navigateToAllProjects = () => {
  router.push('/projects');
};

const navigateToActiveProjects = () => {
  router.push('/projects?status=active');
};

const navigateToAnalytics = () => {
  router.push('/analytics');
};

// Сімуляція отримання нових сповіщень
let notificationInterval: NodeJS.Timeout;

const simulateNewPartnerNotification = () => {
  if (Math.random() > 0.7 && partnerNotifications.value.length < 10) {
    const types = ['project_status_update', 'new_student_application', 'project_approval', 'project_deadline', 'project_completed'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const messages = {
      project_status_update: [
        'Статус вашого проєкту було оновлено',
        'Змінено статус проєкту',
        'Проєкт переведено до нового статусу'
      ],
      new_student_application: [
        'Новий студент подав заявку на ваш проєкт',
        'Отримано нову заявку від студента',
        'Студент хоче приєднатися до вашого проєкту'
      ],
      project_approval: [
        'Ваш проєкт затверджено викладачем',
        'Проєкт схвалено для початку роботи',
        'Викладач затвердив ваш проєкт'
      ],
      project_deadline: [
        'Наближається дедлайн проєкту',
        'Залишилось мало часу до завершення проєкту',
        'Проєкт потребує уваги перед дедлайном'
      ],
      project_completed: [
        'Проєкт успішно завершено студентами',
        'Ваш проєкт виконано на відмінно',
        'Студенти завершили роботу над проєктом'
      ]
    };

    const titles = {
      project_status_update: 'Статус проєкту',
      new_student_application: 'Нова заявка',
      project_approval: 'Проєкт затверджено',
      project_deadline: 'Наближається дедлайн',
      project_completed: 'Проєкт завершено'
    };

    const project = myProjects.value[Math.floor(Math.random() * myProjects.value.length)];
    const studentId = 'student-' + Math.floor(Math.random() * 100);
    
    if (project) {
      const newNotification: PartnerNotification = {
        id: `partner-notif-${Date.now()}`,
        type: randomType,
        title: titles[randomType],
        message: messages[randomType][Math.floor(Math.random() * messages[randomType].length)],
        projectId: project.id,
        studentId: randomType === 'new_student_application' ? studentId : undefined,
        read: false,
        createdAt: new Date(),
      };
      
      partnerNotifications.value.unshift(newNotification);
      
      // Браузерні сповіщення
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico',
          tag: 'partner-notification'
        });
      }
    }
  }
};

// Запитуємо дозвіл на сповіщення при монтажі
onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Дозвіл на сповіщення отримано');
      }
    });
  }
  
  // Сімулюємо нові сповіщення кожні 2-5 хвилин
  notificationInterval = setInterval(simulateNewPartnerNotification, Math.random() * 180000 + 120000);
});

// Очищуємо інтервал при демонтажі
onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>