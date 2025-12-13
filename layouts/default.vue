<template>
  <main class="flex h-screen w-screen overflow-hidden">
    <div class="hidden md:block relative">
      <aside
        :class="[
          'h-full bg-charcoal border-r border-gray-200 text-gray-300 overflow-y-auto flex-shrink-0 transition-all duration-300',
          isSidebarCollapsed ? 'w-20' : 'w-72'
        ]"
      >
        <div class="w-full p-5 relative">
        <NuxtLink to="/" exact-active-class="text-savoy" class="block">
          <div class="flex flex-row gap-2 items-center justify-center" :class="isSidebarCollapsed ? '' : 'justify-start'">
            <ChartBarSquareIcon class="w-10 h-10 flex-shrink-0 text-savoy" />
            <h1 v-if="!isSidebarCollapsed" class="whitespace-nowrap text-savoy">ThinkUp</h1>
          </div>
        </NuxtLink>
        <p v-if="!isSidebarCollapsed" class="mb-5 tracking-widest mt-5">НАВІГАЦІЯ</p>
      </div>
      
      <!-- Навігація залежно від ролі -->
      <div v-if="authStore.isPartner" class="px-2">
        <NuxtLink
          to="/partner/profile"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-center"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Мій профіль' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Мій профіль</span>
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-center"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Мої проєкти' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Мої проєкти</span>
        </NuxtLink>
      </div>
      
      <div v-if="authStore.isTeacher" class="px-2">
        <NuxtLink
          to="/teacher/dashboard"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-center"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Панель викладача' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Панель викладача</span>
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-center"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Всі проєкти' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Всі проєкти</span>
        </NuxtLink>
      </div>
      
      <div v-if="authStore.isStudent" class="px-2">
        <NuxtLink
          to="/student/dashboard"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-center"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Мій профіль' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Мій профіль</span>
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-center"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Всі проєкти' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Всі проєкти</span>
        </NuxtLink>
      </div>

      <!-- Старі дошки (для зворотної сумісності) -->
      <div v-if="boards!.length > 0 && !authStore.isAuthenticated" class="mt-4 px-2">
        <p v-if="!isSidebarCollapsed" class="mb-2 px-3 text-xs text-gray-400">ВСІ ДОШКИ ({{ boardsCount }})</p>
        <NuxtLink
          v-for="board in boards"
          :key="board.id"
          :to="`/${board.id}`"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-center"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? board.name : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">{{ board.name }}</span>
        </NuxtLink>
      </div>
      
      <div
        v-if="!authStore.isAuthenticated"
        class="px-3 py-3 flex gap-2 items-center text-savoy cursor-pointer hover:bg-gray-700 transition-colors rounded-r-3xl justify-center"
        :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
        @click="boardFormState = true"
        :title="isSidebarCollapsed ? 'Створити нову дошку' : ''"
      >
        <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isSidebarCollapsed">+ Створити нову дошку</span>
      </div>
      </aside>
      <button
        @click="toggleSidebar"
        class="absolute top-6 bg-savoy hover:bg-savoy/90 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-20 border-2 border-white/20 hover:scale-110 active:scale-95 ring-2 ring-white/10"
        :title="isSidebarCollapsed ? 'Розгорнути меню' : 'Згорнути меню'"
        aria-label="Toggle sidebar"
        style="right: 0px; transform: translateX(12px);"
      >
        <ChevronLeftIcon
          v-if="!isSidebarCollapsed"
          class="w-3 h-3"
        />
        <ChevronRightIcon
          v-else
          class="w-3 h-3"
        />
      </button>
    </div>
      <div class="flex-1 overflow-hidden flex flex-col min-w-0">
      <MobileHeader />
      <div class="flex-1 overflow-hidden mt-14 md:mt-0">
        <slot></slot>
      </div>
    </div>
    <FormAddBoard />
    <RoleSwitcher />
  </main>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useStorage } from "@vueuse/core";
import { useKanbanStore } from "~~/stores";
import { useAuthStore } from "~~/stores/auth";
import { ChartBarSquareIcon, ViewColumnsIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import RoleSwitcher from "~~/components/RoleSwitcher.vue";
import MobileHeader from "~~/components/MobileHeader.vue";

const boardFormState = isAddBoardFormOpen();

const store = useKanbanStore();
const authStore = useAuthStore();

const { boards } = storeToRefs(store);

const boardsCount = computed(() => {
  return boards.value?.length;
});

// Стан згортання сайдбару (зберігається в localStorage)
const isSidebarCollapsed = useStorage("sidebar-collapsed", false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>
