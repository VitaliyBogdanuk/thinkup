<template>
  <header class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 shadow-sm">
    <!-- Логотип -->
    <NuxtLink to="/" class="flex items-center gap-2">
      <ChartBarSquareIcon class="w-7 h-7 text-savoy" />
      <h1 class="text-base font-bold text-savoy">DeepWater</h1>
    </NuxtLink>

    <!-- Кнопки справа -->
    <div class="flex items-center gap-3">
      <!-- Перемикач ролей -->
      <button
        @click="isRoleMenuOpen = true"
        class="bg-savoy text-white rounded-full p-2 shadow-md hover:bg-savoy/90 transition-colors active:scale-95"
        :title="`Поточна роль: ${getRoleLabel(currentRole)}`"
        aria-label="Перемикач ролей"
      >
        <UserIcon class="w-5 h-5" />
      </button>

      <!-- Бургер меню -->
      <button
        @click="isNavMenuOpen = true"
        class="text-gray-700 hover:text-gray-900 transition-colors active:scale-95"
        aria-label="Відкрити меню"
      >
        <Bars3Icon class="w-7 h-7" />
      </button>
    </div>

    <!-- Меню навігації (повний екран) -->
    <transition name="fade">
      <div
        v-if="isNavMenuOpen"
        class="fixed inset-0 bg-charcoal z-50 flex flex-col"
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 class="text-xl font-bold text-gray-300">Навігація</h2>
          <button
            @click="isNavMenuOpen = false"
            class="text-gray-300 hover:text-white transition-colors"
            aria-label="Закрити меню"
          >
            <XMarkIcon class="w-8 h-8" />
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- Навігація залежно від ролі -->
          <div v-if="authStore.isPartner" class="space-y-4">
            <NuxtLink
              to="/partner/profile"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <UserIcon class="w-5 h-5 flex-shrink-0" />
              Мій профіль
            </NuxtLink>
            <NuxtLink
              to="/projects"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <BriefcaseIcon class="w-5 h-5 flex-shrink-0" />
              Мої проєкти
            </NuxtLink>
            <NuxtLink
              to="/notifications"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors relative"
              active-class="bg-savoy text-white"
            >
              <div class="relative">
                <BellIcon class="w-5 h-5 flex-shrink-0" />
                <span
                  v-if="notificationsStore.unreadCount > 0"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
                </span>
              </div>
              Сповіщення
              <span
                v-if="notificationsStore.unreadCount > 0"
                class="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full"
              >
                {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
              </span>
            </NuxtLink>
          </div>

          <div v-if="authStore.isTeacher" class="space-y-4">
            <NuxtLink
              to="/teacher/dashboard"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <Squares2X2Icon class="w-5 h-5 flex-shrink-0" />
              Панель викладача
            </NuxtLink>
            <NuxtLink
              to="/projects"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <BriefcaseIcon class="w-5 h-5 flex-shrink-0" />
              Всі проєкти
            </NuxtLink>
            <NuxtLink
              to="/notifications"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors relative"
              active-class="bg-savoy text-white"
            >
              <div class="relative">
                <BellIcon class="w-5 h-5 flex-shrink-0" />
                <span
                  v-if="notificationsStore.unreadCount > 0"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
                </span>
              </div>
              Сповіщення
              <span
                v-if="notificationsStore.unreadCount > 0"
                class="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full"
              >
                {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
              </span>
            </NuxtLink>
          </div>

          <div v-if="authStore.isStudent" class="space-y-4">
            <NuxtLink
              to="/student/dashboard"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <UserIcon class="w-5 h-5 flex-shrink-0" />
              Мій профіль
            </NuxtLink>
            <NuxtLink
              to="/projects"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <BriefcaseIcon class="w-5 h-5 flex-shrink-0" />
              Всі проєкти
            </NuxtLink>
            <NuxtLink
              to="/notifications"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors relative"
              active-class="bg-savoy text-white"
            >
              <div class="relative">
                <BellIcon class="w-5 h-5 flex-shrink-0" />
                <span
                  v-if="notificationsStore.unreadCount > 0"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
                </span>
              </div>
              Сповіщення
              <span
                v-if="notificationsStore.unreadCount > 0"
                class="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full"
              >
                {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
              </span>
            </NuxtLink>
          </div>

          <!-- Старі дошки (для зворотної сумісності) -->
          <div v-if="boards!.length > 0 && !authStore.isAuthenticated" class="space-y-2">
            <p class="px-4 text-xs text-gray-400 mb-2">ВСІ ДОШКИ ({{ boardsCount }})</p>
            <NuxtLink
              v-for="board in boards"
              :key="board.id"
              :to="`/${board.id}`"
              @click="isNavMenuOpen = false"
              class="block px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              {{ board.name }}
            </NuxtLink>
          </div>

          <div v-if="authStore.isAdmin" class="space-y-4">
            <NuxtLink
              to="/admin"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <Squares2X2Icon class="w-5 h-5 flex-shrink-0" />
              Панель адміністратора
            </NuxtLink>
            <NuxtLink
              to="/admin/students"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <UserGroupIcon class="w-5 h-5 flex-shrink-0" />
              Студенти
            </NuxtLink>
            <NuxtLink
              to="/admin/teachers"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <AcademicCapIcon class="w-5 h-5 flex-shrink-0" />
              Викладачі
            </NuxtLink>
            <NuxtLink
              to="/admin/partners"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <BuildingOfficeIcon class="w-5 h-5 flex-shrink-0" />
              Партнери
            </NuxtLink>
            <NuxtLink
              to="/projects"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              active-class="bg-savoy text-white"
            >
              <BriefcaseIcon class="w-5 h-5 flex-shrink-0" />
              Всі проєкти
            </NuxtLink>
            <NuxtLink
              to="/notifications"
              @click="isNavMenuOpen = false"
              class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors relative"
              active-class="bg-savoy text-white"
            >
              <div class="relative">
                <BellIcon class="w-5 h-5 flex-shrink-0" />
                <span
                  v-if="notificationsStore.unreadCount > 0"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
                </span>
              </div>
              Сповіщення
              <span
                v-if="notificationsStore.unreadCount > 0"
                class="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full"
              >
                {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
              </span>
            </NuxtLink>
          </div>

          <div
            v-if="!authStore.isAuthenticated"
            @click="openAddBoardModal"
            class="block px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-savoy font-semibold cursor-pointer transition-colors"
          >
            + Створити нову дошку
          </div>
        </nav>

        <!-- Футер мобільного меню -->
        <div class="border-t border-gray-600 p-6">
          <NuxtLink
            to="/about"
            @click="isNavMenuOpen = false"
            class="flex items-center gap-3 px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
            active-class="bg-savoy text-white"
          >
            <InformationCircleIcon class="w-5 h-5 flex-shrink-0" />
            Про нас
          </NuxtLink>
        </div>
      </div>
    </transition>

    <!-- Меню перемикання ролей (повний екран) -->
    <transition name="fade">
      <div
        v-if="isRoleMenuOpen"
        class="fixed inset-0 bg-white z-50 flex flex-col"
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-800">Демо: Перемикання ролі</h2>
          <button
            @click="isRoleMenuOpen = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Закрити меню"
          >
            <XMarkIcon class="w-8 h-8" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-3">
            <button
              v-for="role in roles"
              :key="role.value"
              @click="handleRoleSwitch(role.value)"
              :class="[
                'w-full text-left px-6 py-4 rounded-lg text-base font-semibold transition-colors',
                currentRole === role.value
                  ? 'bg-savoy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ role.label }}
            </button>
          </div>

          <div v-if="currentUser" class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-500 mb-2">Поточний користувач:</p>
            <p class="text-lg font-bold text-gray-800">
              {{ getUserDisplayName(currentUser) }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { 
  ChartBarSquareIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  BellIcon,
  BriefcaseIcon,
  Squares2X2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  InformationCircleIcon
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "~~/stores/auth";
import { useKanbanStore } from "~~/stores";
import { useProjectsStore } from "~~/stores/projects";
import { useNotificationsStore } from "~~/stores/notifications";
import { storeToRefs } from "pinia";
import { mockPartners, mockStudents, mockTeachers, mockAdmin } from "~~/utils/mockData";
import type { UserRole, User, Student, Teacher, Partner } from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();
const notificationsStore = useNotificationsStore();
const store = useKanbanStore();

const { boards } = storeToRefs(store);

const isNavMenuOpen = ref(false);
const isRoleMenuOpen = ref(false);

const roles = [
  { value: "partner", label: "Партнер" },
  { value: "student", label: "Студент" },
  { value: "teacher", label: "Викладач" },
  { value: "admin", label: "Адміністратор" },
];

const currentRole = computed(() => authStore.userRole);
const currentUser = computed(() => authStore.currentUser);

const boardsCount = computed(() => {
  return boards.value?.length;
});

const getRoleLabel = (role: UserRole | null): string => {
  if (!role) return "Не вибрано";
  const roleObj = roles.find((r) => r.value === role);
  return roleObj?.label || role;
};

const getUserDisplayName = (user: User | null): string => {
  if (!user) return "Не авторизовано";
  
  if (user.role === "student") {
    return (user as Student).fullName;
  } else if (user.role === "teacher") {
    return (user as Teacher).fullName;
  } else if (user.role === "partner") {
    return (user as Partner).companyName;
  } else if (user.role === "admin") {
    return "Адміністратор";
  }
  
  return user.email;
};

const getRouteForRole = (role: UserRole): string => {
  switch (role) {
    case "partner":
      return "/projects";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
};

const handleRoleSwitch = (role: UserRole) => {
  let user: User | null = null;

  switch (role) {
    case "partner":
      user = mockPartners[0];
      break;
    case "student":
      user = mockStudents[0];
      break;
    case "teacher":
      user = mockTeachers[0];
      break;
    case "admin":
      user = mockAdmin;
      break;
  }

  if (user) {
    authStore.login(user);
    isRoleMenuOpen.value = false;
    router.push(getRouteForRole(role));
  }
};

const openAddBoardModal = () => {
  const boardFormState = isAddBoardFormOpen();
  boardFormState.value = true;
  isNavMenuOpen.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

