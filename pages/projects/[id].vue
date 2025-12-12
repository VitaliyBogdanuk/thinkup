<template>
  <section class="w-full h-full overflow-y-auto flex-1">
    <HeaderComponent class="hidden md:block" />
    
    <div v-if="!project" class="p-10 text-center text-gray-500">
      Проєкт не знайдено
    </div>

    <div v-else class="p-3 md:p-5 bg-lightGray">
      <!-- Інформація про проєкт -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <div class="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-lg md:text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{{ project.name }}</h1>
            <p class="text-sm md:text-base text-gray-600 line-clamp-3">{{ project.description }}</p>
          </div>
          <span
            :class="getStatusClass(project.status)"
            class="px-3 py-1 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0"
          >
            {{ getStatusText(project.status) }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <p class="text-xs md:text-sm text-gray-500">Категорія</p>
            <p class="font-semibold text-gray-800 text-sm md:text-base">{{ project.category }}</p>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-500">Складність</p>
            <p class="font-semibold text-gray-800 text-sm md:text-base">{{ getComplexityText(project.complexity) }}</p>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-500">Команда</p>
            <p class="font-semibold text-gray-800 text-sm md:text-base">{{ project.team.length }} студентів</p>
          </div>
        </div>
      </div>

      <!-- AI Рекомендації (для викладачів) -->
      <div v-if="authStore.isTeacher && project.status === 'pending_approval'" class="mb-4 md:mb-6">
        <ApproveTeam
          :project-id="project.id"
          @approved="handleTeamApproved"
          @cancel="$router.push('/projects')"
        />
      </div>

      <!-- Рекомендації для партнерів -->
      <div v-if="authStore.isPartner && project.recommendations" class="mb-4 md:mb-6">
        <StudentRecommendations
          :project-id="project.id"
          :recommendations="project.recommendations"
        />
      </div>

      <!-- Канбан-дошка -->
      <div v-if="project && project.boardId" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 class="text-lg md:text-xl font-bold text-gray-800">Канбан-дошка проєкту</h2>
          <button
            @click="openTaskForm"
            type="button"
            class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold flex items-center gap-2 justify-center"
          >
            <span>+</span>
            <span>ДОДАТИ ЗАВДАННЯ</span>
          </button>
        </div>
        <FormTasks :board-id="project.boardId" :is-project-board="true" :project-id="project.id" />
        <Columns :board-id="project.boardId" :is-project-board="true" />
      </div>
      <div v-else-if="project" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <p class="text-gray-500 text-center py-8">Канбан-дошка ще не створена. Будь ласка, зачекайте...</p>
      </div>

      <!-- AI Аналіз для партнерів -->
      <div v-if="authStore.isPartner && project.aiAnalysis" class="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">AI Аналіз проєкту</h3>
        <div class="space-y-3 md:space-y-4">
          <div>
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Основні цілі:</h4>
            <ul class="list-disc list-inside space-y-1 text-sm md:text-base text-gray-600">
              <li v-for="goal in project.aiAnalysis.goals" :key="goal">{{ goal }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Етапи реалізації:</h4>
            <ul class="list-disc list-inside space-y-1 text-sm md:text-base text-gray-600">
              <li v-for="stage in project.aiAnalysis.stages" :key="stage">{{ stage }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Технічні вимоги:</h4>
            <ul class="list-disc list-inside space-y-1 text-sm md:text-base text-gray-600">
              <li v-for="req in project.aiAnalysis.technicalRequirements" :key="req">{{ req }}</li>
            </ul>
          </div>
          <div v-if="project.aiAnalysis.estimatedDuration">
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Оцінка тривалості:</h4>
            <p class="text-sm md:text-base text-gray-600">{{ project.aiAnalysis.estimatedDuration }} годин</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import HeaderComponent from "~~/components/HeaderComponent.vue";
import Columns from "~~/components/Columns.vue";
import FormTasks from "~~/components/form/Tasks.vue";
import ApproveTeam from "~~/components/project/ApproveTeam.vue";
import StudentRecommendations from "~~/components/project/StudentRecommendations.vue";

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();

const projectId = route.params.id as string;
const project = computed(() => projectsStore.getProjectById(projectId));

// Форма додавання завдання
const isTaskFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const openTaskForm = () => {
  taskToEditState.value = null;
  isTaskFormOpenState.value = true;
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

const handleTeamApproved = () => {
  router.push("/projects");
};
</script>

