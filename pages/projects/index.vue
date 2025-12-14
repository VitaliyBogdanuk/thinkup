<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 md:p-10 bg-lightGray">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-8 gap-3">
      <div class="flex-1">
        <h1 class="text-lg md:text-2xl font-bold text-gray-800 mb-2">Мої проєкти</h1>
        <p v-if="searchQuery" class="text-sm text-gray-600">
          Результати пошуку: "{{ searchQuery }}" ({{ projects.length }} проєктів)
        </p>
      </div>
      <button
        v-if="authStore.isPartner"
        @click="showCreateModal = true"
        class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold"
      >
        + Створити проєкт
      </button>
    </div>

    <div
      v-if="projects.length === 0"
      class="text-center py-16 text-gray-500"
    >
      <p v-if="searchQuery" class="text-lg mb-2">Проєкти не знайдено</p>
      <p v-else class="text-lg mb-2">Немає проєктів</p>
      <p v-if="authStore.isPartner && !searchQuery" class="text-sm">Створіть свій перший проєкт</p>
      <p v-else-if="searchQuery" class="text-sm">Спробуйте змінити пошуковий запит</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer relative group"
        @click="navigateToProject(project.id)"
      >
        <!-- Кнопка видалення для адмінів -->
        <button
          v-if="authStore.isAdmin && !isProtectedProject(project.id)"
          @click.stop="handleDeleteProject(project.id)"
          class="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100 z-10"
          title="Видалити проєкт"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
        <button
          v-else-if="authStore.isAdmin && isProtectedProject(project.id)"
          disabled
          class="absolute top-3 right-3 p-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed opacity-0 group-hover:opacity-100 z-10"
          title="Демо-дані не можна видаляти"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
        <div class="mb-3">
          <h3 class="text-base md:text-lg font-bold text-gray-800 mb-2 line-clamp-2">{{ project.name }}</h3>
          <div class="flex items-center gap-2 mb-2">
            <span
              :class="getStatusClass(project.status)"
              class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
            >
              {{ getStatusText(project.status) }}
            </span>
          </div>
        </div>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ project.description }}</p>
        <div class="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
          <span class="px-2 py-1 bg-gray-100 rounded">{{ project.category }}</span>
          <span>{{ getComplexityText(project.complexity) }}</span>
        </div>
        <div v-if="project.team.length > 0" class="mt-3 pt-3 border-t border-gray-200">
          <p class="text-xs md:text-sm text-gray-600">Команда: {{ project.team.length }} студентів</p>
        </div>
      </div>
    </div>

    <CreateProject
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProjectCreated"
    />

    <!-- Модальне вікно успішного створення проєкту -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeSuccessModal"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div class="flex items-center justify-center mb-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2 text-center">Проєкт успішно створено!</h3>
        <p class="text-gray-600 mb-6 text-center">
          Ваш проєкт було створено та відправлено на AI-аналіз. Ви можете переглянути його у списку проєктів.
        </p>
        <div class="flex gap-3 justify-center">
          <button
            @click="closeSuccessModal"
            class="px-6 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-semibold"
          >
            ОК
          </button>
        </div>
      </div>
    </div>

    <!-- Модальне вікно підтвердження видалення -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Підтвердження видалення</h3>
        <p class="text-gray-600 mb-6">
          Ви впевнені, що хочете видалити проєкт <strong>"{{ projectToDelete ? getProjectName(projectToDelete) : '' }}"</strong>?
          <br />
          <span class="text-red-600 font-semibold">Цю дію неможливо скасувати!</span>
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteConfirm = false; projectToDelete = null;"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Скасувати
          </button>
          <button
            @click="confirmDelete"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="isDeleting">Видалення...</span>
            <span v-else>Видалити</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import { isProtectedProject } from "~/composables/useProtectedData";
import CreateProject from "~~/components/project/CreateProject.vue";

const router = useRouter();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();
const showCreateModal = ref(false);
const showSuccessModal = ref(false);
const showDeleteConfirm = ref(false);
const projectToDelete = ref<string | null>(null);
const isDeleting = ref(false);

const route = useRoute();
const searchQuery = computed(() => {
  return (route.query.search as string) || "";
});

const projects = computed(() => {
  if (!authStore.currentUser) return [];
  
  let filteredProjects: Project[] = [];
  
  if (authStore.isPartner) {
    filteredProjects = projectsStore.getProjectsByPartner(authStore.currentUser.id);
  } else {
    // Для студентів та викладачів показуємо всі проєкти
    filteredProjects = projectsStore.projects;
  }
  
  // Фільтруємо за пошуковим запитом
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filteredProjects = filteredProjects.filter((project) => {
      return (
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.technicalSpecification.toLowerCase().includes(query)
      );
    });
  }
  
  return filteredProjects;
});

const getStatusText = (status: Project["status"]): string => {
  const map = {
    draft: "Чернетка",
    pending_ai: "Очікує затвердження", // Показуємо як "Очікує затвердження", оскільки це проміжний статус
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
    pending_ai: "bg-yellow-100 text-yellow-700", // Використовуємо той самий стиль, що й pending_approval
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

const handleProjectCreated = async (projectId: string) => {
  // Закриваємо модальне вікно створення
  showCreateModal.value = false;
  
  // Оновлюємо список проєктів
  try {
    await projectsStore.loadAll();
  } catch (error) {
    console.error('Failed to reload projects:', error);
  }
  
  // Показуємо попап про успішне створення
  showSuccessModal.value = true;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  // Партнер залишається на сторінці "Мої проєкти"
};

// Автоматичне закриття попапа через 5 секунд
watch(showSuccessModal, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      closeSuccessModal();
    }, 5000);
  }
});

// Видалення проєкту
const handleDeleteProject = (projectId: string) => {
  projectToDelete.value = projectId;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!projectToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await projectsStore.deleteProject(projectToDelete.value);
    showDeleteConfirm.value = false;
    projectToDelete.value = null;
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    const errorMessage = error?.data?.message || error?.message || 'Помилка при видаленні проєкту. Спробуйте ще раз.';
    if (error?.statusCode === 403 || errorMessage.includes('demo data') || errorMessage.includes('protected')) {
      alert('Неможливо видалити демо-дані. Цей проєкт захищений від видалення.');
    } else {
      alert(errorMessage);
    }
  } finally {
    isDeleting.value = false;
  }
};

const getProjectName = (projectId: string): string => {
  const proj = projectsStore.getProjectById(projectId);
  return proj?.name || 'Проєкт';
};
</script>

