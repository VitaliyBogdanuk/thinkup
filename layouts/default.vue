<template>
  <main class="flex h-screen w-screen">
    <aside
      class="hidden md:block h-full w-96 bg-charcoal border-r border-gray-200 text-gray-300 overflow-y-auto"
    >
      <div class="w-full p-5">
        <NuxtLink to="/" exact-active-class="text-savoy ">
          <div class="flex flex-row gap-2">
            <ChartBarSquareIcon class="w-10 h-10" />
            <h1 class="mb-20">ThinkUp</h1>
          </div>
        </NuxtLink>
        <p class="mb-5 tracking-widest">ВСІ ДОШКИ ({{ boardsCount }})</p>
      </div>
      <div v-if="boards!.length > 0">
        <NuxtLink
          v-for="board in boards"
          :key="board.id"
          :to="`/${board.id}`"
          class="flex gap-2 px-5 py-3 mr-5 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300"
          exact-active-class="bg-savoy text-white"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          {{ board.name }}
        </NuxtLink>
      </div>
      <div
        class="px-5 py-3 mr-5 flex gap-2 items-center text-savoy cursor-pointer hover:bg-gray-700 transition-colors rounded-r-3xl"
        @click="boardFormState = true"
      >
        <ViewColumnsIcon class="w-5 h-5" />+ Створити нову дошку
      </div>
    </aside>
    <slot></slot>
    <FormAddBoard />
  </main>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { ChartBarSquareIcon, ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

const boardFormState = isAddBoardFormOpen();

const store = useKanbanStore();

const { boards } = storeToRefs(store);

const boardsCount = computed(() => {
  return boards.value?.length;
});
</script>
