<template>
  <header
    class="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-3 md:py-0 h-auto md:h-24 w-full bg-white border-b border-gray-200 gap-3 md:gap-0"
  >
    <!-- Мобільна версія: кнопка додавання та дропдаун -->
    <div class="flex flex-col gap-3 md:hidden w-full">
      <button
        @click="toggleFormModal(true)"
        class="w-full flex gap-2 items-center justify-center bg-savoy text-white rounded-lg px-4 py-2.5 font-semibold hover:bg-savoy/90 transition active:scale-95"
      >
        <span>+</span>
        <span>ДОДАТИ ЗАВДАННЯ</span>
      </button>
      <select 
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-savoy focus:border-transparent text-sm"
        v-model="boardIdInView"
      >
        <option v-for="board in boards" :value="board.id">
          {{ board.name }}
        </option>
      </select>
    </div>

    <!-- Десктопна версія -->
    <h2 class="hidden md:block text-gray-800">{{ boardName }}</h2>
    <div class="hidden gap-2 items-center md:flex">
      <button
        @click="toggleFormModal(true)"
        class="hidden md:flex gap-2 items-center bg-savoy text-white rounded-3xl px-5 py-3 font-semibold hover:scale-105 transition"
      >
        + ДОДАТИ ЗАВДАННЯ
      </button>
      <EllipsisVerticalIcon
        class="w-10 h-10 cursor-pointer"
        @click="() => (editBoardFormState = true)"
      />
    </div>
    <!-- Мобільне меню приховано, використовується MobileHeader -->

    <!-- Mobile menu приховано - використовується MobileHeader -->
  </header>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { useProjectsStore } from "~~/stores/projects";
import {
  Bars2Icon,
  XMarkIcon,
  EllipsisVerticalIcon,
} from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

//Route
const route = useRoute();
const router = useRouter();

//Store
const store = useKanbanStore();
const projectsStore = useProjectsStore();
const { boards } = storeToRefs(store);

// Безпечно отримуємо boardId з параметрів маршруту
const boardId = computed(() => {
  const boardParam = route.params.board;
  if (Array.isArray(boardParam)) {
    return boardParam[0] || '';
  }
  return boardParam?.toString() || '';
});

const boardName = computed(() => {
  const currentBoardId = boardId.value;
  if (!currentBoardId) {
    return "Дошка";
  }
  
  // Спочатку шукаємо дошку
  const board = boards.value?.find((board) => board.id === currentBoardId);
  if (board?.name) {
    return board.name;
  }
  
  // Якщо дошка не знайдена, шукаємо проєкт за boardId
  const project = projectsStore.projects.find((p) => p.boardId === currentBoardId);
  if (project?.name) {
    return project.name;
  }
  
  return "Дошка";
});

//Refs
const editBoardFormState = isEditBoardFormOpen();
const addBoardFormState = isAddBoardFormOpen();
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();
const boardIdInView = ref<string>(boardId.value || '');
const isMobileMenuOpen = ref<boolean>(false);

//Methods
const toggleFormModal = (isOpen: boolean): void => {
  taskToEditState.value = null;
  isFormOpenState.value = isOpen;
  isMobileMenuOpen.value = false;
};

const openAddBoardModal = (): void => {
  addBoardFormState.value = true;
  isMobileMenuOpen.value = false;
};

const openEditBoardModal = (): void => {
  editBoardFormState.value = true;
  isMobileMenuOpen.value = false;
};

//Watcher for when user changes the board he wants to view in mobile
watch(boardIdInView, () => {
  router.push(boardIdInView.value.toString());
});
</script>
