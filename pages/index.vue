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
        
        <!-- Кнопка створення нової дошки -->
        <button
          @click="() => (addBoardState = true)"
          class="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
        >
          + Створити дошку
        </button>
      </div>
      
      <!-- Інформація про користувача -->
      <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
        <div class="flex items-center gap-2 text-sm text-gray-700">
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
          <span>{{ authStore.currentUser?.email }}</span>
          <span class="px-2 py-1 bg-gray-100 rounded text-xs">
            {{ authStore.currentUser?.role === 'partner' ? 'Партнер' : 'Студент' }}
          </span>
        </div>
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
        class="board-card rounded-xl bg-white p-5 cursor-pointer w-full h-52 hover:shadow-lg transition-all duration-300 border border-gray-200 group relative overflow-hidden"
        @click="() => navigateToBoard(board)"
      >
        <!-- Індикатор активності -->
        <div class="absolute top-3 right-3">
          <div class="w-2 h-2 rounded-full" :class="getBoardStatusColor(board)"></div>
        </div>
        
        <!-- Іконка та назва -->
        <div class="flex flex-col h-full">
          <div class="mb-4">
            <ViewColumnsIcon class="board-card-icon w-8 h-8 text-savoy group-hover:text-white transition-colors" />
          </div>
          
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-white mb-2 line-clamp-2">
            {{ board.name }}
          </h2>
          
          <!-- Метадані дошки -->
          <div class="mt-auto pt-3 border-t border-gray-100 group-hover:border-white/30">
            <div class="flex items-center justify-between text-sm text-gray-600 group-hover:text-white/80">
              <div class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                <span>{{ formatDate(board.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <!-- Показуємо кількість завдань -->
                <span class="px-2 py-1 bg-gray-100 group-hover:bg-white/20 rounded text-xs">
                  {{ getTaskCount(board) }} завд.
                </span>
                <!-- Показуємо прогрес, якщо є завдання -->
                <div v-if="getTaskCount(board) > 0" class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-green-500" 
                    :style="{ width: `${getCompletionPercentage(board)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Фон при наведенні -->
        <div class="absolute inset-0 bg-gradient-to-br from-savoy to-savoy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>

      <!-- Кнопка створення нової дошки -->
      <div
        @click="() => (addBoardState = true)"
        class="rounded-xl bg-white p-5 cursor-pointer w-full h-52 border-2 border-dashed border-gray-300 hover:border-savoy hover:bg-savoy/5 transition-all duration-300 flex flex-col items-center justify-center group"
      >
        <div class="w-12 h-12 rounded-full bg-savoy/10 group-hover:bg-savoy/20 flex items-center justify-center mb-4 transition-colors">
          <PlusIcon class="w-6 h-6 text-savoy" />
        </div>
        <h2 class="text-lg font-semibold text-gray-800 group-hover:text-savoy mb-2">
          + Створити дошку
        </h2>
        <p class="text-sm text-gray-500 text-center group-hover:text-savoy/80">
          Почніть новий проект з чистої дошки
        </p>
      </div>
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
    <AddProjectForm 
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
import { ViewColumnsIcon, ClockIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";
import { useAuthStore } from "~~/stores/auth";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = useKanbanStore();
const authStore = useAuthStore();
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

// Отримуємо колір статусу дошки
const getBoardStatusColor = (board: any) => {
  const percentage = getCompletionPercentage(board);
  if (percentage === 100) return 'bg-green-500';
  if (percentage > 50) return 'bg-blue-500';
  if (percentage > 0) return 'bg-amber-500';
  return 'bg-gray-400';
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
  }, 50);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
.board-card:hover {
  background-color: #14B8A6;
}

.board-card-icon {
  color: #14B8A6;
}
</style>