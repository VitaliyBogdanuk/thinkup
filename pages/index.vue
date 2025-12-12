<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-10 bg-lightGray">
    <div v-if="authStore.isAuthenticated" class="mb-8">
      <NuxtLink
        to="/projects"
        class="inline-block px-6 py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors"
      >
        Перейти до проєктів
      </NuxtLink>
    </div>
    <h1 class="mb-24 text-gray-800">Ваші дошки:</h1>
    <div
      class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-10"
      v-if="boards!.length > 0"
    >
      <div
        v-for="board in boards"
        class="rounded-2xl bg-white p-5 cursor-pointer w-full h-full hover:bg-savoy hover:text-white transition-colors shadow-sm border border-gray-200"
        @click="() => $router.push(`/${board.id}`)"
      >
        <ViewColumnsIcon class="w-10 h-10 mb-5" />
        <h2 class="text-gray-800">{{ board.name }}</h2>
      </div>
    </div>
    <div
      @click="() => (addBoardState = true)"
      class="rounded-2xl bg-white p-5 cursor-pointer w-full sm:w-80 h-40 hover:bg-savoy hover:text-white transition-colors shadow-sm border border-gray-200"
      v-else
    >
      <ViewColumnsIcon class="w-10 h-10 mb-5" />
      <h2 class="text-gray-800">+ СТВОРИТИ ДОШКУ</h2>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";
import { useAuthStore } from "~~/stores/auth";

const store = useKanbanStore();
const authStore = useAuthStore();
const { boards } = storeToRefs(store);

const addBoardState = isAddBoardFormOpen();
</script>
