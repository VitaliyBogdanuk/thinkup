<template>
  <div
    class="grid grid-flow-col gap-4 md:gap-10 p-3 md:p-5 overflow-x-auto h-[calc(100vh-100px)]"
    :class="isProjectBoard ? '' : 'bg-lightGray'"
  >
    <div
      v-for="column in getBoardColumns"
      :key="column.id"
      class="w-64 sm:w-72 md:w-80 overflow-y-auto select-none flex-shrink-0"
      @drop="onDrop($event, column.id)"
      @dragenter.prevent
      @dragover.prevent
    >
      <div class="w-full py-4 mb-5 pl-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <p class="text-gray-800 font-semibold">
          {{ column.name.toUpperCase() }} ({{ getTasksForColumn(column.id).value.length }})
        </p>
      </div>

      <TransitionGroup tag="div" name="tasks" class="flex flex-col gap-5">
        <TaskCard
          v-for="task in getTasksForColumn(column.id).value"
          :key="`${column.id}-${task.id}`"
          :task="task"
          :is-project-board="isProjectBoard || false"
          draggable="true"
          @click="openEditForm(task, column.id)"
          @dragstart="startDrag($event, task, column.id)"
        />
      </TransitionGroup>
    </div>
    <FormColumn :board-id="boardId" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";
import { useProjectsStore } from "~~/stores/projects";

const props = defineProps<{
  boardId?: string;
  'board-id'?: string;
  isProjectBoard?: boolean;
}>();

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
  // Якщо prop не передано, намагаємося отримати з маршруту
  const boardParam = route.params.board;
  if (boardParam) {
    if (Array.isArray(boardParam)) {
      return boardParam[0] || '';
    }
    return boardParam.toString();
  }
  return '';
});

//Store
const store = useKanbanStore();
const projectsStore = useProjectsStore();
const { editTask } = store;
const { boards } = storeToRefs(store);

//Refs
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

//Methods
const openEditForm = (task: Task, columnId: string): void => {
  isFormOpenState.value = true;
  taskToEditState.value = { ...task, columnParentId: columnId };
};

const startDrag = (
  event: DragEvent,
  item: Task,
  fromColumnId: string
): void => {
  event.dataTransfer!.dropEffect = "move";
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("itemID", item.id);
  event.dataTransfer!.setData("fromColumnId", fromColumnId.toString());
};

const onDrop = (event: DragEvent, columnId: string): void => {
  const itemID = event.dataTransfer!.getData("itemID");
  const fromColumnId = event.dataTransfer!.getData("fromColumnId");
  const item = getColumnTasks(fromColumnId).find(
    (task) => task.id === itemID
  );
  if (item && boardId.value) {
    editTask(boardId.value, fromColumnId, columnId, item);
  }
};

const currentBoard = computed(() => {
  if (!boardId.value) return null;
  return boards.value?.find((b) => b.id === boardId.value) || null;
});

const getBoardColumns = computed(() => {
  return currentBoard.value?.columns || [];
});

// Створюємо computed для задач кожної колонки для забезпечення реактивності
const getTasksForColumn = (columnId: string) => {
  return computed(() => {
    if (!currentBoard.value) return [];
    const column = currentBoard.value.columns.find((c) => c.id === columnId);
    return column?.tasks || [];
  });
};

const getColumnTasks = (columnId: string) => {
  return getTasksForColumn(columnId).value;
};

const countTasks = (columnId: string): number => {
  return getColumnTasks(columnId).length;
};
</script>
