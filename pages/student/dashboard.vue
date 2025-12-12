<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 md:p-10 bg-lightGray">
    <h1 class="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Мій профіль</h1>

    <div v-if="!currentStudent" class="text-center py-16 text-gray-500">
      <p>Студент не знайдено</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Профіль студента -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
            <span class="text-savoy text-2xl sm:text-3xl font-bold">
              {{ currentStudent.fullName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ currentStudent.fullName }}</h2>
            <p class="text-gray-600 mb-1 text-sm sm:text-base">{{ currentStudent.course }} курс, {{ currentStudent.specialty }}</p>
            <p class="text-gray-500 text-xs sm:text-sm mb-4 break-all">{{ currentStudent.email }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div>
                <span class="text-xs sm:text-sm text-gray-500">Рейтинг:</span>
                <span class="ml-2 text-base sm:text-lg font-bold text-savoy">{{ currentStudent.rating }}/5.0</span>
              </div>
              <div>
                <span class="text-xs sm:text-sm text-gray-500">Доступність:</span>
                <span class="ml-2 text-base sm:text-lg font-semibold text-gray-800">{{ currentStudent.availability }} год/тиждень</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Навички -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Навички</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div
            v-for="skill in currentStudent.skills"
            :key="skill.id"
            class="p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-gray-800">{{ skill.name }}</span>
              <span
                :class="getLevelClass(skill.level)"
                class="px-2 py-0.5 rounded text-xs font-semibold"
              >
                {{ getLevelText(skill.level) }}
              </span>
            </div>
            <p class="text-xs text-gray-500 capitalize">{{ skill.category }}</p>
            <div v-if="skill.verified" class="mt-2 flex items-center gap-1 text-xs text-green-600">
              <span>✓</span>
              <span>Перевірено</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Рекомендовані проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Рекомендовані проєкти</h3>
        
        <div v-if="recommendedProjects.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm md:text-base">Наразі немає рекомендованих проєктів</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div
            v-for="project in recommendedProjects"
            :key="project.id"
            class="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex flex-col sm:flex-row items-start justify-between gap-2 mb-2">
              <h4 class="font-bold text-gray-800 text-sm md:text-base flex-1 line-clamp-2">{{ project.name }}</h4>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded whitespace-nowrap flex-shrink-0">
                {{ getMatchPercentage(project) }}% відповідність
              </span>
            </div>
            <p class="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{{ project.description }}</p>
            <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
              <span class="px-2 py-1 bg-gray-100 rounded">{{ project.category }}</span>
              <span>{{ getComplexityText(project.complexity) }}</span>
            </div>
            <button
              class="w-full px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm font-semibold"
              @click.stop="handleApply(project.id)"
            >
              Подати заявку
            </button>
          </div>
        </div>
      </div>

      <!-- Мої проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Мої проєкти</h3>
        
        <div v-if="myProjects.length === 0" class="text-center py-8 text-gray-500">
          <p>Ви ще не приймаєте участі в проєктах</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="project in myProjects"
            :key="project.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-gray-800">{{ project.name }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ project.description }}</p>
              </div>
              <span
                :class="getStatusClass(project.status)"
                class="px-3 py-1 rounded-lg text-xs font-semibold"
              >
                {{ getStatusText(project.status) }}
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

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

const currentStudent = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "student") {
    return null;
  }
  return projectsStore.getStudentById(authStore.currentUser.id);
});

// Проєкти, де студент є в команді
const myProjects = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "student") {
    return [];
  }
  return projectsStore.projects.filter((p) => p.team.includes(authStore.currentUser!.id));
});

// Рекомендовані проєкти на основі навичок
const recommendedProjects = computed(() => {
  if (!currentStudent.value) return [];

  return projectsStore.projects
    .filter((p) => {
      // Показуємо тільки проєкти, де є рекомендації та студент ще не в команді
      return (
        p.status === "pending_approval" &&
        p.recommendations &&
        !p.team.includes(currentStudent.value!.id)
      );
    })
    .map((project) => {
      const recommendation = project.recommendations?.find(
        (r) => r.studentId === currentStudent.value!.id
      );
      return {
        ...project,
        matchPercentage: recommendation?.matchPercentage || 0,
      };
    })
    .filter((p) => p.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 5);
});

const getMatchPercentage = (project: Project & { matchPercentage?: number }): number => {
  return project.matchPercentage || 0;
};

const getLevelText = (level: Skill["level"]): string => {
  const map = {
    junior: "Початківець",
    middle: "Середній",
    senior: "Просунутий",
  };
  return map[level];
};

const getLevelClass = (level: Skill["level"]): string => {
  const map = {
    junior: "bg-blue-100 text-blue-700",
    middle: "bg-yellow-100 text-yellow-700",
    senior: "bg-green-100 text-green-700",
  };
  return map[level];
};

const getStatusText = (status: Project["status"]): string => {
  const map = {
    draft: "Чернетка",
    pending_ai: "AI аналіз",
    pending_approval: "Очікує затвердження",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
  };
  return map[status];
};

const getStatusClass = (status: Project["status"]): string => {
  const map = {
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

const handleApply = (projectId: string) => {
  // Симуляція подачі заявки
  alert("Заявку подано! Викладач розгляне вашу кандидатуру.");
};
</script>

