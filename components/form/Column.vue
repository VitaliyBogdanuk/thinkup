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
          <ButtonBase
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
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  boardId?: string;
}>();

const { createNewColumn } = useKanbanStore();

//Route
const route = useRoute();
const boardId = computed(() => props.boardId || route.params.board.toString());

//Refs
const isCreatingColumn = ref<boolean>(false);
const newColumnName = ref<string>("");

//Methods
const createColumn = (): void => {
  if (useValidator(newColumnName.value)) {
    createNewColumn(boardId.value, newColumnName.value);
    newColumnName.value = "";
    isCreatingColumn.value = false;
  }
};
</script>
