<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 md:p-10 bg-lightGray">
    <h1 class="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Панель викладача</h1>

    <div v-if="!currentTeacher" class="text-center py-16 text-gray-500">
      <p>Викладач не знайдено</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Профіль викладача -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
            <span class="text-savoy text-2xl sm:text-3xl font-bold">
              {{ currentTeacher.fullName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ currentTeacher.fullName }}</h2>
            <p v-if="currentTeacher.department" class="text-gray-600 mb-1 text-sm sm:text-base">
              {{ currentTeacher.department }}
            </p>
            <p class="text-gray-500 text-xs sm:text-sm mb-4 break-all">{{ currentTeacher.email }}</p>
            <div v-if="currentTeacher.specialization && currentTeacher.specialization.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="spec in currentTeacher.specialization"
                :key="spec"
                class="px-3 py-1 bg-savoy/10 text-savoy rounded-full text-sm"
              >
                {{ spec }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Статистика проєктів -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">⏳</span>
                <div>
                  <p class="text-xs text-gray-500">Очікують затвердження</p>
                  <p class="text-2xl font-bold text-gray-800">{{ pendingProjects.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🚀</span>
                <div>
                  <p class="text-xs text-gray-500">Активних проєктів</p>
                  <p class="text-2xl font-bold text-gray-800">{{ activeProjects.length }}</p>
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
          </div>
        </div>
      </div>

      <!-- Проєкти, що очікують затвердження -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Проєкти, що очікують затвердження ({{ pendingProjects.length }})
        </h3>
        
        <div v-if="pendingProjects.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm md:text-base">Немає проєктів, що очікують затвердження</p>
        </div>

        <div v-else class="space-y-3 md:space-y-4">
          <div
            v-for="project in pendingProjects"
            :key="project.id"
            class="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-800 text-base md:text-lg mb-1 line-clamp-2">{{ project.name }}</h4>
                <p class="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{{ project.description }}</p>
                <div class="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                  <span class="px-2 py-1 bg-gray-100 rounded">{{ project.category }}</span>
                  <span>{{ getComplexityText(project.complexity) }}</span>
                  <span v-if="project.recommendations">
                    {{ project.recommendations.length }} рекомендацій
                  </span>
                </div>
              </div>
              <span class="px-2 md:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0">
                Очікує затвердження
              </span>
            </div>
            <button
              class="mt-2 w-full px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold"
              @click.stop="navigateToProject(project.id)"
            >
              Переглянути та затвердити
            </button>
          </div>
        </div>
      </div>

      <!-- Активні проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Активні проєкти</h3>
        
        <div v-if="activeProjects.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm md:text-base">Немає активних проєктів</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div
            v-for="project in activeProjects"
            :key="project.id"
            class="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <h4 class="font-bold text-gray-800 mb-2 text-sm md:text-base line-clamp-2">{{ project.name }}</h4>
            <p class="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{{ project.description }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm">
              <span class="text-gray-500">Команда: {{ project.team.length }} студентів</span>
              <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold whitespace-nowrap">
                Активний
              </span>
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
import type { ComplexityLevel } from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

const currentTeacher = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "teacher") {
    return null;
  }
  return projectsStore.teachers.find((t) => t.id === authStore.currentUser!.id);
});

const pendingProjects = computed(() => {
  return projectsStore.getProjectsPendingApproval;
});

const activeProjects = computed(() => {
  return projectsStore.projects.filter((p) => p.status === "active");
});

const completedProjects = computed(() => {
  return projectsStore.projects.filter((p) => p.status === "completed");
});

const getComplexityText = (complexity: ComplexityLevel): string => {
  const map = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

const navigateToProject = (projectId: string) => {
  router.push(`/projects/${projectId}`);
};
</script>

