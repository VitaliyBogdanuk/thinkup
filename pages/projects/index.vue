<template>
  <section class="w-full h-full p-4 md:p-10 overflow-y-auto bg-lightGray">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
      <h1 class="text-xl md:text-2xl font-bold text-gray-800">Мої проєкти</h1>
      <button
        v-if="authStore.isPartner"
        @click="showCreateModal = true"
        class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base"
      >
        + Створити проєкт
      </button>
    </div>

    <div
      v-if="projects.length === 0"
      class="text-center py-16 text-gray-500"
    >
      <p class="text-lg mb-2">Немає проєктів</p>
      <p v-if="authStore.isPartner" class="text-sm">Створіть свій перший проєкт</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateToProject(project.id)"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800">{{ project.name }}</h3>
          <span
            :class="getStatusClass(project.status)"
            class="px-2 py-1 rounded text-xs font-semibold"
          >
            {{ getStatusText(project.status) }}
          </span>
        </div>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ project.description }}</p>
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <span>{{ project.category }}</span>
          <span>{{ getComplexityText(project.complexity) }}</span>
        </div>
        <div v-if="project.team.length > 0" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">Команда: {{ project.team.length }} студентів</p>
        </div>
      </div>
    </div>

    <CreateProject
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProjectCreated"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import CreateProject from "~~/components/project/CreateProject.vue";

const router = useRouter();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();
const showCreateModal = ref(false);

const projects = computed(() => {
  if (!authStore.currentUser) return [];
  
  if (authStore.isPartner) {
    return projectsStore.getProjectsByPartner(authStore.currentUser.id);
  }
  
  // Для студентів та викладачів показуємо всі проєкти
  return projectsStore.projects;
});

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

const handleProjectCreated = (projectId: string) => {
  router.push(`/projects/${projectId}`);
};
</script>

