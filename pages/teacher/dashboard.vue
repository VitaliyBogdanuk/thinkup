<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 md:p-10 bg-lightGray">
    <h1 class="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Панель викладача</h1>

    <div v-if="!currentTeacher" class="text-center py-16 text-gray-500">
      <p>Викладач не знайдено</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Сповіщення -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg md:text-xl font-bold text-gray-800">
            Сповіщення
            <span v-if="teacherUnreadCount > 0" class="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
              {{ teacherUnreadCount }} нових
            </span>
          </h3>
          <div class="flex items-center gap-4">
            <button 
              v-if="teacherUnreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-savoy hover:text-savoy/80 transition-colors"
            >
              Позначити все як прочитане
            </button>
            <button
              @click="toggleNotifications"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {{ showNotifications ? 'Сховати' : 'Показати' }}
            </button>
          </div>
        </div>
        
        <div v-if="teacherNotifications.length === 0" class="text-center py-8 text-gray-500">
          <p>Немає нових сповіщень</p>
        </div>

        <div v-else-if="showNotifications" class="space-y-3">
          <div 
            v-for="notification in teacherNotifications"
            :key="notification.id"
            :class="[
              'p-3 md:p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm',
              notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-3">
              <!-- Іконка типу сповіщення -->
              <div class="flex-shrink-0 mt-1">
                <div v-if="notification.type === 'project_submission'" class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-purple-600 text-lg">📝</span>
                </div>
                <div v-else-if="notification.type === 'project_approval'" class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-green-600 text-lg">✅</span>
                </div>
                <div v-else-if="notification.type === 'student_application'" class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 text-lg">👤</span>
                </div>
                <div v-else-if="notification.type === 'project_update'" class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span class="text-yellow-600 text-lg">🔄</span>
                </div>
                <div v-else-if="notification.type === 'deadline_approaching'" class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span class="text-orange-600 text-lg">⏰</span>
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-600 text-lg">📢</span>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-1">
                  <h4 class="font-semibold text-gray-800 text-sm md:text-base">{{ notification.title }}</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500 whitespace-nowrap">
                      {{ formatTimeAgo(notification.createdAt) }}
                    </span>
                    <span 
                      v-if="!notification.read"
                      class="w-2 h-2 rounded-full bg-savoy"
                    ></span>
                  </div>
                </div>
                <p class="text-xs md:text-sm text-gray-600 mb-2">{{ notification.message }}</p>
                
                <!-- Додаткові дії для запрошень від студентів -->
                <div v-if="notification.type === 'student_application' && !notification.read" class="flex gap-2 mt-3">
                  <button
                    @click.stop="acceptStudentApplication(notification.projectId, notification.studentId, notification.id)"
                    class="px-3 md:px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs md:text-sm"
                  >
                    Прийняти
                  </button>
                  <button
                    @click.stop="declineStudentApplication(notification.projectId, notification.studentId, notification.id)"
                    class="px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs md:text-sm"
                  >
                    Відхилити
                  </button>
                </div>

                <!-- Додаткові дії для подачі проєкту -->
                <div v-if="notification.type === 'project_submission' && !notification.read" class="flex gap-2 mt-3">
                  <button
                    @click.stop="reviewProjectSubmission(notification.projectId)"
                    class="px-3 md:px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs md:text-sm"
                  >
                    Переглянути
                  </button>
                </div>

                <!-- Додаткові дії для апруву проєкту -->
                <div v-if="notification.type === 'project_approval' && !notification.read" class="flex gap-2 mt-3">
                  <button
                    @click.stop="approveProject(notification.projectId, notification.id)"
                    class="px-3 md:px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs md:text-sm"
                  >
                    Затвердити
                  </button>
                </div>

                <!-- Додаткові дії для наближення дедлайну -->
                <div v-if="notification.type === 'deadline_approaching' && !notification.read" class="flex gap-2 mt-3">
                  <button
                    @click.stop="navigateToProject(notification.projectId)"
                    class="px-3 md:px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs md:text-sm"
                  >
                    Перейти до проєкту
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 text-gray-500">
          <p>Сповіщень: {{ teacherUnreadCount }} непрочитаних з {{ teacherNotifications.length }}</p>
        </div>
      </div>

      <!-- Профіль викладача -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
            <span class="text-savoy text-2xl sm:text-3xl font-bold">
              {{ currentTeacher.fullName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ currentTeacher.fullName }}</h2>
            <p v-if="currentTeacher.department" class="text-gray-600 mb-1 text-sm sm:text-base">
              {{ currentTeacher.department }}
            </p>
            <p class="text-gray-500 text-xs sm:text-sm mb-4 break-all">{{ currentTeacher.email }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div>
                <span class="text-xs sm:text-sm text-gray-500">Статус:</span>
                <span class="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Активний
                </span>
              </div>
              <div>
                <span class="text-xs sm:text-sm text-gray-500">Проєктів під керівництвом:</span>
                <span class="ml-2 text-base sm:text-lg font-bold text-savoy">{{ totalProjectsCount }}</span>
              </div>
              <!-- Лічильник непрочитаних сповіщень -->
              <div v-if="teacherUnreadCount > 0">
                <span class="text-xs sm:text-sm text-gray-500">Нові сповіщення:</span>
                <span class="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {{ teacherUnreadCount }}
                </span>
              </div>
            </div>
            
            <!-- Спеціалізації -->
            <div v-if="currentTeacher.specialization && currentTeacher.specialization.length > 0" class="mt-4 flex flex-wrap gap-2 mb-4">
              <span
                v-for="spec in currentTeacher.specialization"
                :key="spec"
                class="px-3 py-1 bg-savoy/10 text-savoy rounded-full text-sm"
              >
                {{ spec }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Статистика проєктів -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">⏳</span>
                <div>
                  <p class="text-xs text-gray-500">Очікують затвердження</p>
                  <p class="text-2xl font-bold text-gray-800">{{ pendingProjects.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🚀</span>
                <div>
                  <p class="text-xs text-gray-500">Активних проєктів</p>
                  <p class="text-2xl font-bold text-gray-800">{{ activeProjects.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">✅</span>
                <div>
                  <p class="text-xs text-gray-500">Завершених</p>
                  <p class="text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Швидкі дії -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Швидкі дії</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            @click="navigateToCreateProject"
            class="p-4 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">➕</span>
            <span>Створити проєкт</span>
          </button>
          <button
            @click="navigateToPendingProjects"
            class="p-4 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">⏳</span>
            <span>На затвердження</span>
          </button>
          <button
            @click="navigateToStudents"
            class="p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">👥</span>
            <span>Студенти</span>
          </button>
          <button
            @click="navigateToAnalytics"
            class="p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm md:text-base font-semibold flex flex-col items-center justify-center gap-2"
          >
            <span class="text-xl">📊</span>
            <span>Аналітика</span>
          </button>
        </div>
      </div>

      <!-- Проєкти, що очікують затвердження -->
      <div v-if="pendingProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg md:text-xl font-bold text-gray-800">
            Проєкти, що очікують затвердження
            <span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              {{ pendingProjects.length }}
            </span>
          </h3>
          <button
            @click="navigateToPendingProjects"
            class="text-sm text-savoy hover:text-savoy/80 transition-colors"
          >
            Переглянути всі →
          </button>
        </div>
        
        <div class="space-y-3 md:space-y-4">
          <div
            v-for="project in pendingProjects.slice(0, 3)"
            :key="project.id"
            class="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-800 text-base md:text-lg mb-1 line-clamp-2">{{ project.name }}</h4>
                <p class="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{{ project.description }}</p>
                <div class="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                  <span class="px-2 py-1 bg-gray-100 rounded">{{ project.category }}</span>
                  <span>{{ getComplexityText(project.complexity) }}</span>
                  <span v-if="project.recommendations">
                    {{ project.recommendations.length }} рекомендацій
                  </span>
                </div>
              </div>
              <span class="px-2 md:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0">
                Очікує затвердження
              </span>
            </div>
            <button
              class="mt-2 w-full px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold"
              @click.stop="navigateToProject(project.id)"
            >
              Переглянути та затвердити
            </button>
          </div>
        </div>
      </div>

      <!-- Активні проєкти -->
      <div v-if="activeProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Активні проєкти</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div
            v-for="project in activeProjects.slice(0, 4)"
            :key="project.id"
            class="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{{ project.name }}</h4>
              <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold whitespace-nowrap">
                Активний
              </span>
            </div>
            <p class="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{{ project.description }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm">
              <span class="text-gray-500">Команда: {{ project.team.length }} студентів</span>
              <div v-if="project.deadline" class="text-xs text-gray-500">
                Дедлайн: {{ formatDate(project.deadline) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Завершені проєкти -->
      <div v-if="completedProjects.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Завершені проєкти
          <span class="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {{ completedProjects.length }}
          </span>
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div
            v-for="project in completedProjects.slice(0, 4)"
            :key="project.id"
            class="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{{ project.name }}</h4>
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold whitespace-nowrap">
                Завершений
              </span>
            </div>
            <p class="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{{ project.description }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm">
              <span class="text-gray-500">Команда: {{ project.team.length }} студентів</span>
              <div v-if="project.deadline" class="text-xs text-gray-500">
                Завершено: {{ formatDate(project.updatedAt || project.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Повідомлення про відсутність проєктів -->
      <div v-if="pendingProjects.length === 0 && activeProjects.length === 0 && completedProjects.length === 0" 
           class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">📊</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Ще немає проєктів</h3>
        <p class="text-gray-600 mb-6">
          Створіть перший проєкт або зачекайте на подання від партнерів
        </p>
        <button
          @click="navigateToCreateProject"
          class="px-8 py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-medium shadow-sm"
        >
          Створити перший проєкт
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import type { 
  Teacher, 
  Project, 
  TeacherNotification,
  ComplexityLevel 
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

// Реф для сповіщень
const teacherNotifications = ref<TeacherNotification[]>([
  {
    id: '1',
    type: 'project_submission',
    title: 'Новий проєкт подано на затвердження',
    message: 'Партнер "TechCorp" подав новий проєкт "Розробка AI-асистента для студентів"',
    projectId: 'project-789',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 хвилин тому
  },
  {
    id: '2',
    type: 'student_application',
    title: 'Заявка від студента',
    message: 'Іван Петренко подав заявку на проєкт "Розробка мобільного додатку для освіти"',
    projectId: 'project-123',
    studentId: 'student-456',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 хвилин тому
  },
  {
    id: '3',
    type: 'project_approval',
    title: 'Проєкт готовий до затвердження',
    message: 'AI завершив аналіз проєкту "Мобільний додаток для освіти"',
    projectId: 'project-456',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 години тому
  },
  {
    id: '4',
    type: 'project_update',
    title: 'Оновлення проєкту',
    message: 'У проєкті "Веб-портал для університету" додано нове завдання',
    projectId: 'project-789',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 годин тому
  },
  {
    id: '5',
    type: 'deadline_approaching',
    title: 'Наближається дедлайн',
    message: 'У проєкті "Розробка веб-додатку" залишилось 3 дні до дедлайну',
    projectId: 'project-123',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день тому
  },
]);

const showNotifications = ref(true);

// Комп'ютед властивості
const currentTeacher = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "teacher") {
    return null;
  }
  return projectsStore.teachers.find((t) => t.id === authStore.currentUser!.id);
});

const pendingProjects = computed(() => {
  return projectsStore.getProjectsPendingApproval || [];
});

const activeProjects = computed(() => {
  return projectsStore.projects.filter((p) => p.status === "active");
});

const completedProjects = computed(() => {
  return projectsStore.projects.filter((p) => p.status === "completed");
});

const totalProjectsCount = computed(() => {
  return pendingProjects.value.length + activeProjects.value.length + completedProjects.value.length;
});

const teacherUnreadCount = computed(() => {
  return teacherNotifications.value.filter(n => !n.read).length;
});

// Функції для роботи зі сповіщеннями
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'щойно';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} хв тому`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} год тому`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн тому`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} тиж тому`;
  return `${Math.floor(diffInSeconds / 2592000)} міс тому`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAsRead = (notificationId: string) => {
  const notification = teacherNotifications.value.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  teacherNotifications.value.forEach(n => n.read = true);
};

const handleNotificationClick = (notification: TeacherNotification) => {
  markAsRead(notification.id);
  
  if (notification.projectId) {
    navigateToProject(notification.projectId);
  }
};

// Функції для сповіщень
const acceptStudentApplication = async (projectId?: string, studentId?: string, notificationId?: string) => {
  if (!projectId || !studentId || !notificationId) return;
  
  console.log('Прийнято заявку студента:', studentId, 'на проєкт:', projectId);
  markAsRead(notificationId);
  alert('Заявку студента прийнято!');
};

const declineStudentApplication = (projectId?: string, studentId?: string, notificationId?: string) => {
  if (!projectId || !studentId || !notificationId) return;
  
  console.log('Відхилено заявку студента:', studentId, 'на проєкт:', projectId);
  markAsRead(notificationId);
  alert('Заявку студента відхилено!');
};

const reviewProjectSubmission = (projectId?: string) => {
  if (!projectId) return;
  navigateToProject(projectId);
};

const approveProject = (projectId?: string, notificationId?: string) => {
  if (!projectId || !notificationId) return;
  
  console.log('Затверджено проєкт:', projectId);
  markAsRead(notificationId);
  alert('Проєкт затверджено!');
};

// Функції для проєктів
const getComplexityText = (complexity: ComplexityLevel): string => {
  const map: Record<ComplexityLevel, string> = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

// Навігація
const navigateToProject = (projectId: string) => {
  router.push(`/projects/${projectId}`);
};

const navigateToCreateProject = () => {
  router.push('/projects/create');
};

const navigateToPendingProjects = () => {
  router.push('/projects?status=pending_approval');
};

const navigateToStudents = () => {
  router.push('/students');
};

const navigateToAnalytics = () => {
  router.push('/analytics');
};

// Сімуляція отримання нових сповіщень
let notificationInterval: NodeJS.Timeout;

const simulateNewTeacherNotification = () => {
  if (Math.random() > 0.7 && teacherNotifications.value.length < 10) {
    const types = ['project_submission', 'student_application', 'project_approval', 'project_update', 'deadline_approaching'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const messages = {
      project_submission: [
        'Партнер подав новий проєкт на затвердження',
        'Отримано новий проєкт від партнера',
        'Партнер запропонував новий проєкт для реалізації'
      ],
      student_application: [
        'Студент подав заявку на участь у проєкті',
        'Нова заявка від студента на проєкт',
        'Студент хоче приєднатися до команди проєкту'
      ],
      project_approval: [
        'AI завершив аналіз проєкту, готовий до затвердження',
        'Проєкт проаналізовано AI, чекає на ваше затвердження',
        'Готові рекомендації для нового проєкту'
      ],
      project_update: [
        'У проєкті з\'явилися нові завдання',
        'Команда проєкту оновила статус виконання',
        'Проєкт потребує вашого перегляду'
      ],
      deadline_approaching: [
        'У проєкті наближається дедлайн',
        'Залишилось мало часу до завершення проєкту',
        'Проєкт потребує термінового перегляду перед дедлайном'
      ]
    };

    const titles = {
      project_submission: 'Новий проєкт',
      student_application: 'Заявка студента',
      project_approval: 'Проєкт готовий',
      project_update: 'Оновлення проєкту',
      deadline_approaching: 'Наближається дедлайн'
    };

    const project = projectsStore.projects[Math.floor(Math.random() * projectsStore.projects.length)];
    const studentId = 'student-' + Math.floor(Math.random() * 100);
    
    const newNotification: TeacherNotification = {
      id: `teacher-notif-${Date.now()}`,
      type: randomType,
      title: titles[randomType],
      message: messages[randomType][Math.floor(Math.random() * messages[randomType].length)],
      projectId: project?.id,
      studentId: randomType === 'student_application' ? studentId : undefined,
      read: false,
      createdAt: new Date(),
    };
    
    teacherNotifications.value.unshift(newNotification);
    
    // Браузерні сповіщення
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: 'teacher-notification'
      });
    }
  }
};

// Запитуємо дозвіл на сповіщення при монтажі
onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Дозвіл на сповіщення отримано');
      }
    });
  }
  
  // Сімулюємо нові сповіщення кожні 2-5 хвилин
  notificationInterval = setInterval(simulateNewTeacherNotification, Math.random() * 180000 + 120000);
});

// Очищуємо інтервал при демонтажі
onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>