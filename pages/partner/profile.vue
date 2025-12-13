<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-4 md:p-10 bg-lightGray">
    <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Мій профіль</h1>

    <div v-if="!currentPartner" class="text-center py-16 text-gray-500">
      <p>Партнер не знайдено</p>
    </div>

    <div v-else class="space-y-6">
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
              
            </div>

            <!-- Статистика проєктів -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-xl sm:text-2xl flex-shrink-0">📊</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Всього проєктів</p>
                      <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ myProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2 text-center lg:text-left">{{ pendingProjects.length }} очікують</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-xl sm:text-2xl flex-shrink-0">✅</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Завершених</p>
                      <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2 text-center lg:text-left">{{ stats.successRate }}% успішних</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-xl sm:text-2xl flex-shrink-0">🚀</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Активних</p>
                      <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ activeProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2 text-center lg:text-left">{{ stats.activeStudents }} студентів</p>
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import type { 
  Partner, 
  Project, 
  ComplexityLevel 
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();


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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
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

const navigateToActiveProjects = () => {
  router.push('/projects?status=active');
};

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