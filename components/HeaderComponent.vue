<template>
  <header
    class="flex items-center justify-between px-5 h-24 w-full bg-white border-b border-gray-200"
  >

    <div class="md:hidden w-full">
  <select class="block md:hidden" v-model="boardIdInView">
      <option v-for="board in boards" :value="board.id">
        {{ board.name }}
      </option>
    </select>
    <h2 class="hidden md:block text-gray-800">{{ boardName }}</h2>
    <div class="hidden gap-2 items-center md:flex">
        <p v-if="boardDescription" class="text-gray-600">{{ boardDescription }}</p>
        <div v-if="boardTzInfo" class="flex items-center gap-2 text-blue-300">
          <DocumentIcon class="w-4 h-4" />
          <span class="text-sm">{{ boardTzInfo }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs px-2 py-1 rounded-full" 
                :class="statusClasses">
            {{ boardStatusText }}
          </span>
        </div>
      </div>
    </div>

 
    <div class="hidden md:flex flex-col">
      <h2 class="text-2xl font-bold">{{ boardName }}</h2>
      <div class="flex items-center gap-4 mt-2 text-sm ">
        <p v-if="boardDescription" class="text-gray-600 max-w-md">{{ boardDescription }}</p>
        <div v-if="boardTzInfo" class="flex items-center gap-2 text-blue-300">
          <DocumentIcon class="w-4 h-4" />
          <span class="text-sm">{{ boardTzInfo }}</span>
        </div>
        <span class="text-xs px-3 py-1 rounded-full" 
              :class="statusClasses">
          {{ boardStatusText }}
        </span>
      </div>
    </div>
    
    <div class="hidden gap-3 items-center md:flex">
      <button
        @click="toggleFormModal(true)"
        class="hidden md:flex gap-2 items-center bg-savoy text-white rounded-3xl px-5 py-3 font-semibold hover:scale-105 transition"
      >
        + ДОДАТИ ЗАВДАННЯ
      </button>
      <EllipsisVerticalIcon
        class="w-10 h-10 cursor-pointer hover:text-indigo-400 transition-colors"
        @click="() => (editBoardFormState = true)"
      />
    </div>
    
    <Bars2Icon
      class="md:hidden w-10 h-10 absolute top-4 right-5"
      @click="() => (isMobileMenuOpen = true)"
    />


    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="center-fixed w-full h-full bg-charcoal flex flex-col gap-10 items-center justify-center font-bold z-20"
      >
        <NuxtLink to="/" class="border-b border-gray-600 p-2 text-gray-300">ГОЛОВНА</NuxtLink>
        <p class="border-b border-gray-600 p-2 text-gray-300" @click="openAddBoardModal">
          + СТВОРИТИ НОВУ ДОШКУ
        </p>
        <p class="border-b border-gray-600 p-2 text-gray-300" @click="toggleFormModal(true)">+ ДОДАТИ ЗАВДАННЯ</p>
        <p class="border-b border-gray-600 p-2 text-gray-300" @click="openEditBoardModal">РЕДАГУВАТИ ДОШКУ</p>
        <XMarkIcon
          class="w-10 h-10 absolute top-8 right-5 z-10"
          @click="() => (isMobileMenuOpen = false)"
        />
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import {
  Bars2Icon,
  XMarkIcon,
  EllipsisVerticalIcon,
  DocumentIcon
} from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { computed } from "vue";


const route = useRoute();
const router = useRouter();


const store = useKanbanStore();
const { boards } = storeToRefs(store);

const boardId = route.params.board.toString();


const currentBoard = computed(() => {
  return boards.value?.find((board) => board.id === boardId);
});

const boardName = computed(() => {
  return currentBoard.value?.name || "Без назви";
});

const boardDescription = computed(() => {
  return currentBoard.value?.description;
});

const boardStatus = computed(() => {
  return currentBoard.value?.status || "active";
});

const boardStatusText = computed(() => {
  const statusMap: Record<string, string> = {
    "active": "Активний",
    "archived": "Архівований", 
    "draft": "Чернетка"
  };
  return statusMap[boardStatus.value] || "Активний";
});

const boardTzInfo = computed(() => {
  const tz = currentBoard.value?.tz;
  if (tz instanceof File) {
    return `ТЗ: ${tz.name} (${formatFileSize(tz.size)})`;
  }
  return null;
});

const statusClasses = computed(() => {
  const classes: Record<string, string> = {
    "active": "bg-green-900 text-green-300",
    "archived": "bg-gray-800 text-gray-300",
    "draft": "bg-yellow-900 text-yellow-300"
  };
  return classes[boardStatus.value] || "bg-green-900 text-green-300";
});

//Refs
const editBoardFormState = isEditBoardFormOpen();
const addBoardFormState = isAddBoardFormOpen();
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();
const boardIdInView = ref<string>(boardId);
const isMobileMenuOpen = ref<boolean>(false);

//Methods
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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


watch(boardIdInView, () => {
  router.push(boardIdInView.value.toString());
});
</script>