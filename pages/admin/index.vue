<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 sm:p-4 md:p-10 bg-lightGray">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Панель адміністратора</h1>

    <div v-if="!currentAdmin" class="text-center py-16 text-gray-500">
      <p>Адміністратор не знайдено</p>
    </div>

    <div v-else class="space-y-4 sm:space-y-5 md:space-y-6">
      <!-- Профіль адміністратора -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <span class="text-red-600 text-xl sm:text-2xl md:text-3xl font-bold">
              {{ currentAdmin.email.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0 w-full">
            <h2 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-2 text-center sm:text-left break-words">Адміністратор системи</h2>
            <p class="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 break-all text-center sm:text-left">{{ currentAdmin.email }}</p>
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 md:gap-4 flex-wrap">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Статус:</span>
                <span class="px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Активний
                </span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Версія системи:</span>
                <span class="text-sm sm:text-base md:text-lg font-bold text-savoy">2.1.0</span>
              </div>
            </div>

            <!-- Статистика системи -->
            <div class="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">👥</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Користувачі</p>
                      <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ totalUsersCount }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1.5 sm:mt-2 text-center lg:text-left">
                    {{ partnersCount }} партнерів, {{ studentsCount }} студентів, {{ teachersCount }} викладачів
                  </p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">📊</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Проєкти</p>
                      <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ projectsCount }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1.5 sm:mt-2 text-center lg:text-left">
                    {{ activeProjectsCount }} активних, {{ completedProjectsCount }} завершених
                  </p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 items-center text-center lg:text-left">
                    <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">⚙️</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Система</p>
                      <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Активна</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1.5 sm:mt-2 text-center lg:text-left">
                    Всі сервіси працюють
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Швидкі посилання -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NuxtLink
          to="/admin/students"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">👨‍🎓</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Студенти</h3>
              <p class="text-sm text-gray-600">{{ studentsCount }} користувачів</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/teachers"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Викладачі</h3>
              <p class="text-sm text-gray-600">{{ teachersCount }} користувачів</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/partners"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🤝</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Партнери</h3>
              <p class="text-sm text-gray-600">{{ partnersCount }} користувачів</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Рейтинг студентів -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Рейтинг студентів</h3>
        <div v-if="topStudents.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm sm:text-base">Немає студентів</p>
        </div>
        <div v-else class="space-y-2 sm:space-y-3">
          <div
            v-for="(student, index) in topStudents"
            :key="student.id"
            class="flex items-center gap-3 sm:gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                 :class="getRankColor(index)">
              <span class="text-xs sm:text-sm font-bold text-white">{{ index + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm sm:text-base text-gray-800">{{ student.fullName }}</p>
              <p class="text-xs sm:text-sm text-gray-600">{{ student.course }} курс, {{ student.specialty }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <div class="flex items-center gap-1">
                <span class="text-amber-500 text-sm sm:text-base">★</span>
                <span class="text-sm sm:text-base font-bold text-gray-800">{{ student.rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="topStudents.length > 0" class="mt-4 pt-4 border-t border-gray-200">
          <NuxtLink
            to="/admin/students"
            class="text-sm sm:text-base text-savoy hover:text-savoy/80 transition-colors font-semibold"
          >
            Переглянути всіх студентів →
          </NuxtLink>
        </div>
      </div>

      <!-- Останні події -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Останні події</h3>
        <div v-if="notifications.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm sm:text-base">Немає подій</p>
          <p class="text-xs sm:text-sm mt-2">Події системи будуть відображатися тут</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-2 h-2 rounded-full flex-shrink-0 mt-2" :class="getNotificationColor(notification.type)"></div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm sm:text-base text-gray-800">{{ notification.title }}</p>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import type { AdminNotification, User } from "~~/types";

const projectsStore = useProjectsStore();
const authStore = useAuthStore();

// Комп'ютед властивості
const currentAdmin = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "admin") {
    return null;
  }
  return authStore.currentUser as User;
});

const partnersCount = computed(() => projectsStore.partners.length);
const studentsCount = computed(() => projectsStore.students.length);
const teachersCount = computed(() => projectsStore.teachers.length);
const totalUsersCount = computed(() => 
  partnersCount.value + studentsCount.value + teachersCount.value + 1 // +1 для адміна
);
const projectsCount = computed(() => projectsStore.projects.length);
const activeProjectsCount = computed(() => 
  projectsStore.projects.filter(p => p.status === 'active').length
);
const completedProjectsCount = computed(() => 
  projectsStore.projects.filter(p => p.status === 'completed').length
);

// Демо-дані для останніх подій
const getDemoNotifications = (): AdminNotification[] => {
  const now = new Date();
  return [
    {
      id: "notif-1",
      title: "Новий партнер зареєстрований",
      message: "Компанія 'Digital Innovations' зареєструвалась як партнер",
      read: false,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 година тому
      type: "new_user_registration",
      userId: "partner-new-1",
    },
    {
      id: "notif-2",
      title: "Створено новий проєкт",
      message: "Партнер 'Tech Solutions Ukraine' створив проєкт 'Розробка мобільного додатку для доставки'",
      read: false,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 години тому
      type: "project_created",
      projectId: "project-new-1",
    },
    {
      id: "notif-3",
      title: "Створено новий проєкт",
      message: "Партнер 'Creative Design Studio' створив проєкт 'Редизайн корпоративного сайту'",
      read: false,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 годин тому
      type: "project_created",
      projectId: "project-new-2",
    },
    {
      id: "notif-4",
      title: "Новий партнер зареєстрований",
      message: "Компанія 'Startup Hub' зареєструвалась як партнер",
      read: false,
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 годин тому
      type: "new_user_registration",
      userId: "partner-new-2",
    },
    {
      id: "notif-5",
      title: "Створено новий проєкт",
      message: "Партнер 'Tech Solutions Ukraine' створив проєкт 'E-commerce платформа для продажу одягу'",
      read: false,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 день тому
      type: "project_created",
      projectId: "project-new-3",
    },
    {
      id: "notif-6",
      title: "Створено новий проєкт",
      message: "Партнер 'Creative Design Studio' створив проєкт 'Лендінг-сторінка для стартапу'",
      read: false,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 дні тому
      type: "project_created",
      projectId: "project-new-4",
    },
    {
      id: "notif-7",
      title: "Новий партнер зареєстрований",
      message: "Компанія 'Web Agency Pro' зареєструвалась як партнер",
      read: false,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 дні тому
      type: "new_user_registration",
      userId: "partner-new-3",
    },
  ];
};

// Отримуємо сповіщення адміністратора
const notifications = computed<AdminNotification[]>(() => {
  // Повертаємо демо-дані, відсортовані за датою (нові зверху)
  return getDemoNotifications().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

// Топ студентів за рейтингом
const topStudents = computed(() => {
  return [...projectsStore.students]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10); // Топ 10 студентів
});

const formatTime = (date: Date): string => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffTime = now.getTime() - notificationDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} хвилин тому`;
  } else if (diffHours < 24) {
    return `${diffHours} годин тому`;
  } else if (diffDays === 1) {
    return 'Вчора';
  } else if (diffDays < 7) {
    return `${diffDays} днів тому`;
  } else {
    return notificationDate.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Функція для отримання кольору для типу сповіщення
const getNotificationColor = (type: AdminNotification['type']): string => {
  const colorMap: Record<AdminNotification['type'], string> = {
    new_user_registration: 'bg-blue-500',
    project_created: 'bg-green-500',
    system_alert: 'bg-red-500',
    user_report: 'bg-orange-500',
    system_update: 'bg-purple-500',
  };
  return colorMap[type] || 'bg-savoy';
};

// Функція для отримання кольору для рейтингу
const getRankColor = (index: number): string => {
  if (index === 0) return 'bg-yellow-500'; // Золото для 1 місця
  if (index === 1) return 'bg-gray-400'; // Срібло для 2 місця
  if (index === 2) return 'bg-amber-600'; // Бронза для 3 місця
  return 'bg-gray-300'; // Сірий для інших
};

// Завантажуємо дані при монтуванні
onMounted(async () => {
  try {
    await projectsStore.loadAll();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});
</script>

