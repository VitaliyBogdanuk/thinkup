<template>
  <main class="flex h-screen w-screen overflow-hidden">
    <aside
      class="hidden md:block h-full w-96 bg-charcoal border-r border-gray-200 text-gray-300 overflow-y-auto flex-shrink-0"
    >
      <div class="w-full p-5">
        <NuxtLink to="/" exact-active-class="text-savoy ">
          <div class="flex flex-row gap-2">
            <ChartBarSquareIcon class="w-10 h-10" />
            <h1 class="mb-20">ThinkUp</h1>
          </div>
        </NuxtLink>
        <p class="mb-5 tracking-widest">НАВІГАЦІЯ</p>
      </div>
      
      <!-- Навігація залежно від ролі -->
      <div v-if="authStore.isPartner">
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-5 py-3 mr-5 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300"
          exact-active-class="bg-savoy text-white"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          Мої проєкти
        </NuxtLink>
      </div>
      
      <div v-if="authStore.isTeacher">
        <NuxtLink
          to="/teacher/dashboard"
          class="flex gap-2 px-5 py-3 mr-5 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300"
          exact-active-class="bg-savoy text-white"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          Панель викладача
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-5 py-3 mr-5 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300"
          exact-active-class="bg-savoy text-white"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          Всі проєкти
        </NuxtLink>
      </div>
      
      <div v-if="authStore.isStudent">
        <NuxtLink
          to="/student/dashboard"
          class="flex gap-2 px-5 py-3 mr-5 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300"
          exact-active-class="bg-savoy text-white"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          Мій профіль
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-5 py-3 mr-5 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300"
          exact-active-class="bg-savoy text-white"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          Всі проєкти
        </NuxtLink>
      </div>

      <!-- Старі дошки (для зворотної сумісності) -->
      <div v-if="boards!.length > 0 && !authStore.isAuthenticated" class="mt-4">
        <p class="mb-2 px-5 text-xs text-gray-400">ВСІ ДОШКИ ({{ boardsCount }})</p>
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
        v-if="!authStore.isAuthenticated"
        class="px-5 py-3 mr-5 flex gap-2 items-center text-savoy cursor-pointer hover:bg-gray-700 transition-colors rounded-r-3xl"
        @click="boardFormState = true"
      >
        <ViewColumnsIcon class="w-5 h-5" />+ Створити нову дошку
      </div>
    </aside>
    <div class="flex-1 overflow-hidden flex flex-col min-w-0">
      <slot></slot>
    </div>
    <FormAddBoard />
    <RoleSwitcher />
  </main>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { useAuthStore } from "~~/stores/auth";
import { ChartBarSquareIcon, ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import RoleSwitcher from "~~/components/RoleSwitcher.vue";

const boardFormState = isAddBoardFormOpen();

const store = useKanbanStore();
const authStore = useAuthStore();

const { boards } = storeToRefs(store);

const boardsCount = computed(() => {
  return boards.value?.length;
});
</script>
