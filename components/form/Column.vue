<template>
  <div
    :class="isCreatingColumn ? '' : 'cursor-pointer hover:text-savoy'"
    class="w-80 h-full flex flex-col items-center justify-center rounded-xl bg-white border-2 border-dashed border-gray-300 text-2xl font-bold text-gray-600 hover:border-savoy transition-colors shadow-sm"
    @click.self="() => (isCreatingColumn = true)"
  >
    + Нова колонка

    <transition name="fade">
      <div
        v-if="isCreatingColumn"
        class="mt-10 flex flex-col justify-center text-base font-semibold text-gray-800"
      >
        <input
          type="text"
          v-model="newColumnName"
          @keyup.enter="createColumn"
          autofocus
        />
        <div class="flex justify-between gap-5 mt-4">
          <BaseButton
            label="Створити колонку"
            @action="createColumn"
            class="bg-savoy text-white"
          />
          <button @click="() => (isCreatingColumn = false)" class="hover:bg-gray-100 rounded p-1 transition-colors">
            <XMarkIcon class="w-10 h-10 text-gray-600" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { useProjectsStore } from "~~/stores/projects";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import BaseButton from "~~/components/base/Button.vue";

const props = defineProps<{
  boardId?: string;
  'board-id'?: string;
}>();

const kanbanStore = useKanbanStore();
const projectsStore = useProjectsStore();
const { createNewColumn } = kanbanStore;

//Route
const route = useRoute();
const boardId = computed(() => {
  // Спочатку перевіряємо camelCase prop
  if (props.boardId) {
    return props.boardId;
  }
  // Потім перевіряємо kebab-case prop
  if (props['board-id']) {
    return props['board-id'];
  }
  
  // Якщо prop не передано, намагаємося знайти проєкт за маршрутом
  const projectId = route.params.id;
  if (projectId) {
    const project = projectsStore.getProjectById(projectId as string);
    if (project?.boardId) {
      return project.boardId;
    }
  }
  
  // Якщо не знайдено через проєкт, намагаємося отримати з маршруту
  const boardParam = route.params.board;
  if (boardParam) {
    if (Array.isArray(boardParam)) {
      return boardParam[0] || '';
    }
    return boardParam.toString();
  }
  
  return '';
});

//Refs
const isCreatingColumn = ref<boolean>(false);
const newColumnName = ref<string>("");

//Methods
const createColumn = (): void => {
  let currentBoardId = boardId.value;
  
  // Якщо boardId не знайдено, спробуємо знайти через проєкт
  if (!currentBoardId) {
    const projectId = route.params.id;
    if (projectId) {
      const project = projectsStore.getProjectById(projectId as string);
      if (project?.boardId) {
        currentBoardId = project.boardId;
      }
    }
  }

  if (!currentBoardId) {
    console.error('Board ID is not available', {
      props: props,
      routeParams: route.params,
      projectId: route.params.id
    });
    alert('Помилка: ID дошки не знайдено. Спробуйте оновити сторінку.');
    return;
  }

  // Перевіряємо, чи дошка існує
  const board = kanbanStore.boards?.find(b => b.id === currentBoardId);
  if (!board) {
    console.error(`Board with id ${currentBoardId} not found in store`, {
      availableBoards: kanbanStore.boards?.map(b => ({ id: b.id, name: b.name }))
    });
    alert('Помилка: Дошки не знайдено. Спробуйте оновити сторінку.');
    return;
  }

  if (useValidator(newColumnName.value)) {
    createNewColumn(currentBoardId, newColumnName.value);
    newColumnName.value = "";
    isCreatingColumn.value = false;
  }
};
</script>
