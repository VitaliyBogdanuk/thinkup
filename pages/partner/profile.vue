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
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ currentPartner.companyName }}</h2>
            <p v-if="currentPartner.companyDescription" class="text-gray-600 mb-1 text-sm sm:text-base">
              {{ currentPartner.companyDescription }}
            </p>
            <p class="text-gray-500 text-xs sm:text-sm mb-4 break-all">{{ currentPartner.email }}</p>
            <div v-if="currentPartner.contactPhone" class="flex items-center gap-2 mb-4">
              <span class="text-xs sm:text-sm text-gray-500">Телефон:</span>
              <span class="text-sm sm:text-base font-semibold text-gray-800">{{ currentPartner.contactPhone }}</span>
            </div>
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
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">✅</span>
                <div>
                  <p class="text-xs text-gray-500">Завершених</p>
                  <p class="text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🚀</span>
                <div>
                  <p class="text-xs text-gray-500">Активних</p>
                  <p class="text-2xl font-bold text-gray-800">{{ activeProjects.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Мої проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Мої проєкти</h3>
          <span v-if="myProjects.length > 0" class="text-sm text-gray-500">
            {{ myProjects.length }} проєктів
          </span>
        </div>
        
        <div v-if="myProjects.length === 0" class="text-center py-8 text-gray-500">
          <p>У вас ще немає проєктів</p>
          <p class="text-sm mt-2">Створіть свій перший проєкт</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="project in myProjects"
            :key="project.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-800">{{ project.name }}</h4>
                  <span
                    :class="getProjectStatusClass(project.status)"
                    class="px-3 py-1 rounded-lg text-xs font-semibold"
                  >
                    {{ getProjectStatusText(project.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ project.description }}</p>
                
                <!-- Інформація про проєкт -->
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <span>👥</span>
                    <span>{{ project.team.length }} учасників</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import type { Partner, Project, ComplexityLevel } from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const navigateToProject = (projectId: string) => {
  router.push(`/projects/${projectId}`);
};
</script>

