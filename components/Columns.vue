<template>
  <div
    class="grid grid-flow-col gap-4 md:gap-10 p-3 md:p-5 overflow-x-auto h-[calc(100vh-100px)]"
    :class="isProjectBoard ? '' : 'bg-lightGray'"
  >
    <div
      v-for="column in getBoardColumns(boardId.value)"
      :key="column.id"
      class="w-64 sm:w-72 md:w-80 overflow-y-auto select-none flex-shrink-0"
      @drop="onDrop($event, column.id)"
      @dragenter.prevent
      @dragover.prevent
    >
      <div class="w-full py-4 mb-5 pl-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <p class="text-gray-800 font-semibold">
          {{ column.name.toUpperCase() }} ({{ countTasks(column.id) }})
        </p>
      </div>

      <TransitionGroup tag="div" name="tasks" class="flex flex-col gap-5">
        <TaskCard
          v-for="task in getColumnTasks(boardId.value, column.id)"
          :key="task.id"
          :task="task"
          :is-project-board="isProjectBoard || false"
          draggable="true"
          @click="openEditForm(task, column.id)"
          @dragstart="startDrag($event, task, column.id)"
        />
      </TransitionGroup>
    </div>
    <FormColumn v-if="!isProjectBoard" />
  </div>
</template>

<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { useProjectsStore } from "~~/stores/projects";

const props = defineProps<{
  boardId?: string;
  isProjectBoard?: boolean;
}>();

//Route
const route = useRoute();
const boardId = computed(() => props.boardId || route.params.board.toString());

//Store
const store = useKanbanStore();
const projectsStore = useProjectsStore();
const { editTask } = store;

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
  const item = getColumnTasks(boardId.value, fromColumnId)?.find(
    (task) => task.id === itemID
  );
  editTask(boardId.value, fromColumnId, columnId, item!);
};

const getBoardColumns = (id: string) => {
  return store.getBoardColumns(id);
};

const getColumnTasks = (boardId: string, columnId: string) => {
  return store.getColumnTasks(boardId, columnId);
};

const countTasks = (columnId: string): number => {
  return getColumnTasks(boardId.value, columnId)!.length;
};
</script>
