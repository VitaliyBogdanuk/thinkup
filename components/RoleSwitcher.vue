<template>
  <div class="hidden md:block fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
    <!-- Згорнутий стан -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="bg-savoy text-white rounded-full p-3 shadow-lg hover:bg-savoy/90 transition-colors active:scale-95"
      :title="`Поточна роль: ${getRoleLabel(currentRole)}`"
      aria-label="Розгорнути перемикач ролей"
    >
      <UserIcon class="w-5 h-5 sm:w-6 sm:h-6" />
    </button>

    <!-- Розгорнутий стан -->
    <div v-else class="bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-4 min-w-[200px] max-w-[90vw] sm:max-w-[250px]">
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm font-semibold text-gray-700">Демо: Перемикання ролі</p>
        <button
          @click="isExpanded = false"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          title="Згорнути"
        >
          <ChevronDownIcon class="w-5 h-5" />
        </button>
      </div>
      <div class="space-y-2">
        <button
          v-for="role in roles"
          :key="role.value"
          @click="switchRole(role.value)"
          :class="[
            'w-full text-left px-3 py-2 rounded text-sm transition-colors',
            currentRole === role.value
              ? 'bg-savoy text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ role.label }}
        </button>
      </div>
      <div v-if="currentUser" class="mt-3 pt-3 border-t border-gray-200">
        <p class="text-xs text-gray-500">Поточний користувач:</p>
        <p class="text-xs font-semibold text-gray-700 mt-1 truncate">
          {{ getUserDisplayName(currentUser) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { UserIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import { mockPartners, mockStudents, mockTeachers, mockAdmin } from "~~/utils/mockData";

const authStore = useAuthStore();
const projectsStore = useProjectsStore();

const isExpanded = ref(false);

const roles = [
  { value: "partner", label: "Партнер" },
  { value: "student", label: "Студент" },
  { value: "teacher", label: "Викладач" },
  { value: "admin", label: "Адміністратор" },
];

const currentRole = computed(() => authStore.userRole);

const currentUser = computed(() => authStore.currentUser);

const router = useRouter();

const switchRole = (role: UserRole) => {
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
    // Перенаправляємо на відповідну сторінку
    router.push(getRouteForRole(role));
  }
};

// Ініціалізуємо дефолтного користувача при завантаженні
onMounted(() => {
  if (!authStore.currentUser) {
    authStore.login(mockPartners[0]);
  }
});

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

const getRoleLabel = (role: UserRole | null): string => {
  if (!role) return "Не вибрано";
  const roleObj = roles.find((r) => r.value === role);
  return roleObj?.label || role;
};
</script>

