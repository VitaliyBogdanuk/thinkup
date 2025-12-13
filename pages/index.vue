<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-4 sm:p-6 lg:p-10 bg-lightGray">
    <!-- Панель навігації для аутентифікованих користувачів -->
    <div v-if="authStore.isAuthenticated" class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <NuxtLink
          to="/projects"
          class="inline-block px-6 py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-medium shadow-sm"
        >
          Перейти до проєктів
        </NuxtLink>
        
      </div>
      
    </div>

    <!-- Заголовок та статистика -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Ваші дошки</h1>
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <div class="w-3 h-3 rounded-full bg-savoy"></div>
          <span>Всього: <span class="font-semibold">{{ boards?.length || 0 }}</span></span>
        </div>
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Активні: <span class="font-semibold">{{ activeBoardsCount }}</span></span>
        </div>
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <div class="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Завдань: <span class="font-semibold">{{ totalTasksCount }}</span></span>
        </div>
      </div>
    </div>

    <!-- Сітка дошок -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4 sm:gap-6">
      <!-- Існуючі дошки -->
      <div
        v-for="board in boards"
        :key="board.id"
        class="board-card rounded-xl bg-white p-5 cursor-pointer w-full hover:shadow-lg transition-all duration-300 border border-gray-200 group relative overflow-hidden"
        @click="() => navigateToBoard(board)"
      >
        <!-- Іконка та назва -->
        <div class="flex flex-col relative z-10">
          <div class="mb-3 flex-shrink-0">
            <ViewColumnsIcon class="board-card-icon w-8 h-8 text-savoy group-hover:text-white transition-colors" />
          </div>
          
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-white mb-3 line-clamp-2">
            {{ getBoardDisplayName(board) }}
          </h2>
          
          <!-- Метадані дошки -->
          <div class="mt-auto pt-3 border-t border-gray-100 group-hover:border-white/30 space-y-2 flex-shrink-0">
            <!-- Дедлайн -->
            <div class="flex items-center gap-1 text-sm text-gray-600 group-hover:text-white/80">
              <CalendarIcon class="w-4 h-4" />
              <span>{{ getDeadlineText(board) }}</span>
            </div>
            
            <!-- Кількість не завершених завдань та статус проєкту -->
            <div class="flex items-center justify-between gap-1">
              <span class="px-2 py-1 bg-gray-100 group-hover:bg-white/20 rounded text-xs text-gray-600 group-hover:text-white/80">
                {{ getIncompleteTasksCount(board) }} не завершених
              </span>
              <span v-if="getProjectStatus(board)" :class="getProjectStatusClass(getProjectStatus(board))" class="px-2 py-1 rounded text-xs font-semibold group-hover:opacity-90">
                {{ getProjectStatusText(getProjectStatus(board)) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Фон при наведенні -->
        <div class="absolute inset-0 bg-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-xl"></div>
      </div>

      <!-- Кнопка створення нової дошки -->
    
    </div>

    <!-- Повідомлення, якщо дошок немає -->
    <div v-if="!boards || boards.length === 0" class="mt-12">
      <div class="max-w-lg mx-auto text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ViewColumnsIcon class="w-10 h-10 text-gray-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">У вас ще немає дошок</h2>
        <p class="text-gray-600 mb-6">
          Створіть свою першу дошку для організації завдань та управління проектами
        </p>
        <button
          @click="() => (addBoardState = true)"
          class="px-8 py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-medium shadow-sm"
        >
          Створити першу дошку
        </button>
      </div>
    </div>

    <!-- Модальне вікно створення проєкту -->
    <CreateProject 
      v-if="addBoardState"
      :is-open="addBoardState"
      @close="addBoardState = false"
      @created="handleProjectCreated"
    />
    
    <!-- Лоадер -->
    <div v-if="loading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-savoy/30 border-t-savoy rounded-full animate-spin"></div>
        <p class="text-gray-700">Завантаження дошок...</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ViewColumnsIcon, CalendarIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { Project } from "~~/types";
import CreateProject from "~~/components/project/CreateProject.vue";

const store = useKanbanStore();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();
const router = useRouter();
const { boards } = storeToRefs(store);
const loading = ref(false);

const addBoardState = ref(false);

// Завантажуємо дошки при монтажі
onMounted(async () => {
  loading.value = true;
  try {
    // Викликаємо метод завантаження дошок, якщо він є в store
    if (store.loadBoards) {
      await store.loadBoards();
    }
  } catch (error) {
    console.error('Помилка завантаження дошок:', error);
  } finally {
    loading.value = false;
  }
});

// Комп'ютерована властивість для підрахунку активних дошок
const activeBoardsCount = computed(() => {
  if (!boards.value) return 0;
  return boards.value.filter(board => {
    // Вважаємо дошку активною, якщо вона має хоча б одне завдання
    return getTaskCount(board) > 0;
  }).length;
});

// Загальна кількість завдань
const totalTasksCount = computed(() => {
  if (!boards.value) return 0;
  return boards.value.reduce((total, board) => {
    return total + getTaskCount(board);
  }, 0);
});

// Отримуємо кількість завдань у дошці
const getTaskCount = (board: any) => {
  // Перевіряємо різні можливі шляхи до завдань
  if (board.tasks && Array.isArray(board.tasks)) {
    return board.tasks.length;
  }
  if (board.columns) {
    // Якщо завдання зберігаються в колонках
    return board.columns.reduce((total: number, column: any) => {
      return total + (column.tasks?.length || 0);
    }, 0);
  }
  return 0;
};

// Отримуємо відсоток завершення завдань
const getCompletionPercentage = (board: any) => {
  const totalTasks = getTaskCount(board);
  if (totalTasks === 0) return 0;
  
  // Якщо є властивість для завершених завдань
  if (board.completedTasks !== undefined) {
    return Math.round((board.completedTasks / totalTasks) * 100);
  }
  
  // Спробуємо порахувати з колонок
  if (board.columns) {
    const completedTasks = board.columns.reduce((total: number, column: any) => {
      if (column.name?.toLowerCase().includes('done') || column.name?.toLowerCase().includes('завершено')) {
        return total + (column.tasks?.length || 0);
      }
      return total;
    }, 0);
    return Math.round((completedTasks / totalTasks) * 100);
  }
  
  return 0;
};

// Отримуємо проєкт за boardId
const getProjectForBoard = (board: any): Project | undefined => {
  if (!board.id) return undefined;
  // Шукаємо проєкт, який має цей boardId
  return projectsStore.projects.find((p: Project) => p.boardId === board.id);
};

// Отримуємо назву для відображення на картці
const getBoardDisplayName = (board: any): string => {
  if (!board || !board.id) {
    return "Дошка";
  }
  
  // Спочатку перевіряємо, чи це проєктна дошка
  const project = getProjectForBoard(board);
  if (project && project.name) {
    return project.name;
  }
  
  // Якщо не проєкт, повертаємо назву дошки
  return board.name || "Дошка";
};

// Отримуємо текст дедлайну
const getDeadlineText = (board: any): string => {
  const project = getProjectForBoard(board);
  if (project?.deadline) {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Прострочено: ${deadline.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    if (diffDays === 0) {
      return 'Дедлайн сьогодні';
    }
    if (diffDays === 1) {
      return 'Дедлайн завтра';
    }
    if (diffDays < 7) {
      return `Дедлайн через ${diffDays} днів`;
    }
    
    return deadline.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  // Якщо немає дедлайну, показуємо дату створення
  return formatDate(board.createdAt);
};

// Отримуємо кількість не завершених завдань
const getIncompleteTasksCount = (board: any): number => {
  const totalTasks = getTaskCount(board);
  if (totalTasks === 0) return 0;
  
  if (board.columns) {
    const completedTasks = board.columns.reduce((total: number, column: any) => {
      if (column.name?.toLowerCase().includes('done') || column.name?.toLowerCase().includes('завершено')) {
        return total + (column.tasks?.length || 0);
      }
      return total;
    }, 0);
    return totalTasks - completedTasks;
  }
  
  return totalTasks;
};

// Отримуємо статус проєкту
const getProjectStatus = (board: any): Project["status"] | null => {
  const project = getProjectForBoard(board);
  return project?.status || null;
};

// Отримуємо текст статусу проєкту
const getProjectStatusText = (status: Project["status"] | null): string => {
  if (!status) return "";
  const map: Record<Project["status"], string> = {
    draft: "Чернетка",
    pending_ai: "AI аналіз",
    pending_approval: "Очікує затвердження",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
  };
  return map[status] || "";
};

// Отримуємо клас статусу проєкту
const getProjectStatusClass = (status: Project["status"] | null): string => {
  if (!status) return "";
  const map: Record<Project["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    pending_ai: "bg-blue-100 text-blue-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status] || "";
};

// Форматування дати
const formatDate = (dateString?: string) => {
  if (!dateString) return 'сьогодні';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'недавно';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'сьогодні';
    if (diffDays === 1) return 'вчора';
    if (diffDays < 7) return `${diffDays} днів тому`;
    
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  } catch (error) {
    return 'недавно';
  }
};

// Навігація до дошки
const navigateToBoard = (board: any) => {
  // Спочатку завантажуємо завдання, якщо потрібно
  if (store.loadBoardTasks && !board.tasks) {
    store.loadBoardTasks(board.id);
  }
  router.push(`/${board.id}`);
};

// Обробка створення проекту
const handleProjectCreated = (projectId: string) => {
  console.log('Project created with ID:', projectId);
  // Оновлюємо список дошок
  if (store.loadBoards) {
    store.loadBoards();
  }
  addBoardState.value = false;
};

// Перенаправляємо партнера на сторінку проєктів при першому відкритті
onMounted(() => {
  // Невелика затримка для забезпечення ініціалізації користувача
  setTimeout(() => {
    if (authStore.isPartner) {
      router.push("/projects");
    }
    // Адміністратор залишається на головній сторінці
  }, 50);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.5;
  max-height: 3.6rem;
  min-height: 3rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.popup-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>

<style scoped>
.board-card {
  position: relative;
}

.board-card:hover {
  background-color: #14B8A6 !important;
}

.board-card:hover .board-card-icon,
.board-card:hover h2,
.board-card:hover .text-gray-600,
.board-card:hover .text-gray-800 {
  color: white !important;
}

.board-card-icon {
  color: #14B8A6;
}

/* Забезпечуємо, що контент завжди видимий */
.board-card > div {
  position: relative;
  z-index: 10;
}
</style>