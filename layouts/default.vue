<template>
  <main class="flex h-screen w-screen overflow-hidden">
    <div class="hidden md:block relative">
      <aside
        :class="[
          'sidebar h-full bg-charcoal border-r border-gray-200 text-gray-300 overflow-y-auto flex-shrink-0 transition-all duration-300',
          isSidebarCollapsed ? 'w-20' : 'w-72'
        ]"
      >
        <div class="w-full p-5 relative">
        <NuxtLink to="/" exact-active-class="text-savoy" class="block">
          <div class="flex flex-row gap-2 items-center justify-center" :class="isSidebarCollapsed ? '' : 'justify-start'">
            <ChartBarSquareIcon class="w-10 h-10 flex-shrink-0 text-white" />
            <h1 v-if="!isSidebarCollapsed" class="whitespace-nowrap text-white">ThinkUp</h1>
          </div>
        </NuxtLink>
      </div>
      
      <!-- Відображення поточної ролі -->
      <div v-if="authStore.isAuthenticated" class="px-2 mb-4">
        <div v-if="!isSidebarCollapsed" class="bg-gray-700 rounded-lg p-3 border border-gray-600">
          <div class="flex items-center gap-2">
            <div :class="getRoleIconClass(authStore.userRole || authStore.currentUser?.role || null)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon class="w-5 h-5" :class="getRoleIconColor(authStore.userRole || authStore.currentUser?.role || null)" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-400 mb-1">Поточна роль</p>
              <p class="text-sm font-semibold text-gray-200 truncate">{{ getRoleLabel(authStore.userRole || authStore.currentUser?.role || null) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center">
          <div :class="getRoleIconClass(authStore.userRole || authStore.currentUser?.role || null)" class="w-10 h-10 rounded-full flex items-center justify-center" :title="getRoleLabel(authStore.userRole || authStore.currentUser?.role || null)">
            <UserIcon class="w-5 h-5" :class="getRoleIconColor(authStore.userRole || authStore.currentUser?.role || null)" />
          </div>
        </div>
      </div>
      
      <!-- Пошук проєктів -->
      <div v-if="authStore.isAuthenticated && !isSidebarCollapsed" class="px-2 mb-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Пошук проєктів..."
            class="w-full px-3 py-2 pr-20 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-savoy focus:border-transparent text-sm placeholder-gray-400"
            @keyup.enter="handleSearch"
            @input="handleSearchInput"
          />
          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="text-gray-400 hover:text-red-400 transition-colors"
              title="Очистити"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
            <button
              @click="handleSearch"
              class="text-gray-400 hover:text-savoy transition-colors"
              title="Пошук"
            >
              <MagnifyingGlassIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Навігація залежно від ролі -->
      <div v-if="authStore.isPartner" class="px-2">
        <NuxtLink
          to="/partner/profile"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Мій профіль' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Мій профіль</span>
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
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
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Панель викладача' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Панель викладача</span>
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
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
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Мій профіль' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Мій профіль</span>
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Всі проєкти' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Всі проєкти</span>
        </NuxtLink>
      </div>
      
      <div v-if="authStore.isAdmin" class="px-2">
        <NuxtLink
          to="/"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
          :class="isSidebarCollapsed ? 'mr-0' : 'mr-5'"
          exact-active-class="bg-savoy text-white"
          :title="isSidebarCollapsed ? 'Головна' : ''"
        >
          <ViewColumnsIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isSidebarCollapsed">Головна</span>
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="flex gap-2 px-3 py-3 items-center hover:bg-gray-700 transition-colors rounded-r-3xl font-bold text-gray-300 justify-start"
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
import { ref, watch } from "vue";
import { useStorage } from "@vueuse/core";
import { useKanbanStore } from "~~/stores";
import { useAuthStore } from "~~/stores/auth";
import { ChartBarSquareIcon, ViewColumnsIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, XMarkIcon, UserIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import RoleSwitcher from "~~/components/RoleSwitcher.vue";
import MobileHeader from "~~/components/MobileHeader.vue";
import type { UserRole } from "~~/types";

const boardFormState = isAddBoardFormOpen();

const store = useKanbanStore();
const authStore = useAuthStore();

const { boards } = storeToRefs(store);

const boardsCount = computed(() => {
  return boards.value?.length;
});

// Стан згортання сайдбару (зберігається в localStorage)
const isSidebarCollapsed = useStorage("sidebar-collapsed", false);

// Пошук проєктів
const router = useRouter();
const route = useRoute();
const searchQuery = ref("");

// Синхронізуємо поле пошуку з query параметром
watch(() => route.query.search, (newSearch) => {
  if (newSearch && typeof newSearch === "string") {
    searchQuery.value = newSearch;
  } else {
    searchQuery.value = "";
  }
}, { immediate: true });

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: "/projects",
      query: { search: searchQuery.value.trim() }
    });
  } else {
    router.push("/projects");
  }
};

let searchTimeout: NodeJS.Timeout | null = null;

const handleSearchInput = () => {
  // Автоматичний пошук при введенні (з debounce)
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      handleSearch();
    } else if (route.query.search) {
      // Якщо поле порожнє, але є query параметр, очищаємо його
      router.push("/projects");
    }
  }, 500);
};

const clearSearch = () => {
  searchQuery.value = "";
  router.push("/projects");
};

// Функція для отримання назви ролі
const getRoleLabel = (role: UserRole | null): string => {
  if (!role) return "Не вибрано";
  const roleLabels: Record<UserRole, string> = {
    partner: "Партнер",
    student: "Студент",
    teacher: "Викладач",
    admin: "Адміністратор",
  };
  return roleLabels[role] || role;
};

// Функція для отримання класу іконки ролі
const getRoleIconClass = (role: UserRole | null): string => {
  if (!role) return "bg-gray-500/20";
  const roleClasses: Record<UserRole, string> = {
    partner: "bg-blue-500/20",
    student: "bg-green-500/20",
    teacher: "bg-purple-500/20",
    admin: "bg-red-500/20",
  };
  return roleClasses[role] || "bg-savoy/20";
};

// Функція для отримання кольору іконки ролі
const getRoleIconColor = (role: UserRole | null): string => {
  if (!role) return "text-gray-400";
  const roleColors: Record<UserRole, string> = {
    partner: "text-blue-400",
    student: "text-green-400",
    teacher: "text-purple-400",
    admin: "text-red-400",
  };
  return roleColors[role] || "text-savoy";
};
</script>

<style scoped>
  .sidebar {
    background: #333333;
  }

  .sidebox-tab {
    justify-content: flex-start;
  }
</style>