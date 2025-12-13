<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 sm:p-4 md:p-10 bg-lightGray">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-8 gap-3">
      <div class="flex-1">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Панель викладача</h1>
      </div>
      <button
        @click="showCreateModal = true"
        class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold"
      >
        + Створити проєкт
      </button>
    </div>

    <div v-if="!currentTeacher" class="text-center py-16 text-gray-500">
      <p>Викладач не знайдено</p>
    </div>

    <div v-else class="space-y-4 sm:space-y-5 md:space-y-6">
      <!-- Профіль викладача -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <span class="text-savoy text-xl sm:text-2xl md:text-3xl font-bold">
              {{ currentTeacher.fullName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0 w-full">
            <h2 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-2 text-center sm:text-left break-words">{{ currentTeacher.fullName }}</h2>
            <p v-if="currentTeacher.department" class="text-gray-600 mb-1 text-xs sm:text-sm md:text-base text-center sm:text-left">
              {{ currentTeacher.department }}
            </p>
            <p class="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 break-all text-center sm:text-left">{{ currentTeacher.email }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Статус:</span>
                <span class="px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Активний
                </span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Проєктів під керівництвом:</span>
                <span class="text-sm sm:text-base md:text-lg font-bold text-savoy">{{ totalProjectsCount }}</span>
              </div>
            </div>
            
            <!-- Спеціалізації -->
            <div v-if="currentTeacher.specialization && currentTeacher.specialization.length > 0" class="mt-3 sm:mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span
                v-for="spec in currentTeacher.specialization"
                :key="spec"
                class="px-2 sm:px-3 py-1 bg-savoy/10 text-savoy rounded-full text-xs sm:text-sm"
              >
                {{ spec }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Статистика проєктів -->
        <div class="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">⏳</span>
                <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                  <p class="text-xs text-gray-500">Очікують затвердження</p>
                  <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ pendingProjects.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">🚀</span>
                <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                  <p class="text-xs text-gray-500">Активних проєктів</p>
                  <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ activeProjects.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">✅</span>
                <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                  <p class="text-xs text-gray-500">Завершених</p>
                  <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Проєкти, що очікують затвердження -->
      <div v-if="pendingProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">
              Проєкти, що очікують затвердження
            </h3>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
              {{ pendingProjects.length }}
            </span>
          </div>
          <button
            @click="navigateToPendingProjects"
            class="text-xs sm:text-sm text-savoy hover:text-savoy/80 transition-colors px-2 py-1 rounded-md hover:bg-savoy/5 whitespace-nowrap"
          >
            Переглянути всі →
          </button>
        </div>
        
        <div class="space-y-3 sm:space-y-4">
          <div
            v-for="project in pendingProjects.slice(0, 3)"
            :key="project.id"
            class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5 sm:mb-2">
                  <h4 class="font-bold text-sm sm:text-base md:text-lg text-gray-800 line-clamp-2 pr-2">{{ project.name }}</h4>
                  <span class="px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0">
                    Очікує затвердження
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">{{ project.description }}</p>
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-500">
                  <span class="px-2 py-0.5 sm:py-1 bg-gray-100 rounded whitespace-nowrap">{{ project.category }}</span>
                  <span class="whitespace-nowrap">{{ getComplexityText(project.complexity) }}</span>
                  <span v-if="project.recommendations" class="whitespace-nowrap">
                    {{ project.recommendations.length }} рекомендацій
                  </span>
                </div>
              </div>
            </div>
            <button
              class="mt-2 sm:mt-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs sm:text-sm md:text-base font-semibold"
              @click.stop="navigateToProject(project.id)"
            >
              Переглянути та затвердити
            </button>
          </div>
        </div>
      </div>

      <!-- Активні проєкти -->
      <div v-if="activeProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Активні проєкти</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div
            v-for="project in activeProjects.slice(0, 4)"
            :key="project.id"
            class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h4 class="font-bold text-sm sm:text-base text-gray-800 line-clamp-1 pr-2 flex-1">{{ project.name }}</h4>
              <span class="px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
                Активний
              </span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">{{ project.description }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <span class="text-gray-500">Команда: {{ project.team.length }} студентів</span>
              <div v-if="project.deadline" class="text-xs text-gray-500 whitespace-nowrap">
                Дедлайн: {{ formatDate(project.deadline) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Завершені проєкти -->
      <div v-if="completedProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div class="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">
            Завершені проєкти
          </h3>
          <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
            {{ completedProjects.length }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div
            v-for="project in completedProjects.slice(0, 4)"
            :key="project.id"
            class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h4 class="font-bold text-sm sm:text-base text-gray-800 line-clamp-1 pr-2 flex-1">{{ project.name }}</h4>
              <span class="px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
                Завершений
              </span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">{{ project.description }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <span class="text-gray-500">Команда: {{ project.team.length }} студентів</span>
              <div v-if="project.deadline" class="text-xs text-gray-500 whitespace-nowrap">
                Завершено: {{ formatDate(project.updatedAt || project.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Повідомлення про відсутність проєктів -->
      <div v-if="pendingProjects.length === 0 && activeProjects.length === 0 && completedProjects.length === 0" 
           class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">📊</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Ще немає проєктів</h3>
        <p class="text-gray-600 mb-6">
          Створіть перший проєкт або зачекайте на подання від партнерів
        </p>
        <button
          @click="showCreateModal = true"
          class="px-8 py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-medium shadow-sm"
        >
          Створити перший проєкт
        </button>
      </div>
    </div>

    <!-- Модальне вікно створення проєкту -->
    <CreateProject
      v-if="showCreateModal"
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProjectCreated"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import CreateProject from "~~/components/project/CreateProject.vue";
import type { 
  Teacher, 
  Project, 
  ComplexityLevel 
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();
const showCreateModal = ref(false);


// Комп'ютед властивості
const currentTeacher = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "teacher") {
    return null;
  }
  return projectsStore.teachers.find((t) => t.id === authStore.currentUser!.id);
});

const pendingProjects = computed(() => {
  return projectsStore.getProjectsPendingApproval || [];
});

const activeProjects = computed(() => {
  return projectsStore.projects.filter((p) => p.status === "active");
});

const completedProjects = computed(() => {
  return projectsStore.projects.filter((p) => p.status === "completed");
});

const totalProjectsCount = computed(() => {
  return pendingProjects.value.length + activeProjects.value.length + completedProjects.value.length;
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
const getComplexityText = (complexity: ComplexityLevel): string => {
  const map: Record<ComplexityLevel, string> = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

// Навігація
const navigateToProject = (projectId: string) => {
  router.push(`/projects/${projectId}`);
};

const navigateToPendingProjects = () => {
  router.push('/projects?status=pending_approval');
};

const navigateToProjects = () => {
  router.push('/projects');
};

const handleProjectCreated = (projectId: string) => {
  showCreateModal.value = false;
  router.push(`/projects/${projectId}`);
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