<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-4 md:p-10 bg-lightGray">
    <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Мій профіль</h1>

    <div v-if="!currentStudent" class="text-center py-16 text-gray-500">
      <p>Студент не знайдено</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Сповіщення -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Сповіщення</h3>
          <div class="flex items-center gap-4">
            <button 
              v-if="unreadCount > 0"
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
        
        <div v-if="notifications.length === 0" class="text-center py-8 text-gray-500">
          <p>Немає нових сповіщень</p>
        </div>

        <div v-else-if="showNotifications" class="space-y-3">
          <div 
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm',
              notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-3">
              <!-- Іконка типу сповіщення -->
              <div class="flex-shrink-0 mt-1">
                <div v-if="notification.type === 'project_invitation'" class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-green-600 text-lg">🎯</span>
                </div>
                <div v-else-if="notification.type === 'project_update'" class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 text-lg">🔄</span>
                </div>
                <div v-else-if="notification.type === 'new_project'" class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-purple-600 text-lg">🚀</span>
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-600 text-lg">📢</span>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-1">
                  <h4 class="font-semibold text-gray-800">{{ notification.title }}</h4>
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
                <p class="text-sm text-gray-600 mb-2">{{ notification.message }}</p>
                
                <!-- Додаткові дії для запрошень на проєкт -->
                <div v-if="notification.type === 'project_invitation' && !notification.read" class="flex gap-2 mt-3">
                  <button
                    @click.stop="acceptProjectInvitation(notification.projectId, notification.id)"
                    class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
                  >
                    Прийняти
                  </button>
                  <button
                    @click.stop="declineProjectInvitation(notification.projectId, notification.id)"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Відхилити
                  </button>
                </div>

                <!-- Додаткові дії для нового проєкту -->
                <div v-if="notification.type === 'new_project' && !notification.read" class="flex gap-2 mt-3">
                  <button
                    @click.stop="navigateToProject(notification.projectId)"
                    class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
                  >
                    Переглянути проєкт
                  </button>
                  <button
                    @click.stop="handleApply(notification.projectId)"
                    class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    v-if="notification.projectId"
                  >
                    Подати заявку
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 text-gray-500">
          <p>Сповіщень: {{ unreadCount }} непрочитаних з {{ notifications.length }}</p>
        </div>
      </div>

      <!-- Профіль студента -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
            <span class="text-savoy text-2xl sm:text-3xl font-bold">
              {{ currentStudent.fullName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{{ currentStudent.fullName }}</h2>
            <p class="text-gray-600 mb-1 text-sm sm:text-base">{{ currentStudent.course }} курс, {{ currentStudent.specialty }}</p>
            <p class="text-gray-500 text-xs sm:text-sm mb-4 break-all">{{ currentStudent.email }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div>
                <span class="text-xs sm:text-sm text-gray-500">Рейтинг:</span>
                <span class="ml-2 text-base sm:text-lg font-bold text-savoy">{{ currentStudent.rating.toFixed(1) }}/5.0</span>
              </div>
              <div>
                <span class="text-xs sm:text-sm text-gray-500">Доступність:</span>
                <span class="ml-2 text-base sm:text-lg font-semibold text-gray-800">{{ currentStudent.availability }} год/тиждень</span>
              </div>
              <div>
                <span class="text-xs sm:text-sm text-gray-500">Статус:</span>
                <span :class="getStatusClass(currentStudent.status)" class="ml-2 px-2 py-1 rounded-full text-xs font-semibold">
                  {{ getStudentStatusText(currentStudent.status) }}
                </span>
              </div>
              <!-- Лічильник непрочитаних сповіщень -->
              <div v-if="unreadCount > 0">
                <span class="text-xs sm:text-sm text-gray-500">Нові сповіщення:</span>
                <span class="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {{ unreadCount }}
                </span>
              </div>
            </div>
            
            <!-- Портфоліо посилання -->
            <div v-if="currentStudent.portfolio" class="mt-4 flex flex-wrap gap-3">
              <a 
                v-if="currentStudent.portfolio.github"
                :href="currentStudent.portfolio.github"
                target="_blank"
                class="flex items-center gap-1 text-sm text-gray-600 hover:text-savoy transition-colors"
              >
                <span>📁</span>
                <span>GitHub</span>
              </a>
              <a 
                v-if="currentStudent.portfolio.behance"
                :href="currentStudent.portfolio.behance"
                target="_blank"
                class="flex items-center gap-1 text-sm text-gray-600 hover:text-savoy transition-colors"
              >
                <span>🎨</span>
                <span>Behance</span>
              </a>
              <a 
                v-if="currentStudent.portfolio.website"
                :href="currentStudent.portfolio.website"
                target="_blank"
                class="flex items-center gap-1 text-sm text-gray-600 hover:text-savoy transition-colors"
              >
                <span>🌐</span>
                <span>Website</span>
              </a>
            </div>
            
            <!-- Статистика проєктів -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-2xl">✅</span>
                    <div>
                      <p class="text-xs text-gray-500">Завершених проєктів</p>
                      <p class="text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2">З {{ myProjects.length }} загальних проєктів</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-2xl">🤝</span>
                    <div>
                      <p class="text-xs text-gray-500">Партнерів</p>
                      <p class="text-2xl font-bold text-gray-800">{{ partnersWorkedWith.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-2">З якими працював</p>
                </div>
              </div>
              
              <!-- Список партнерів -->
              <div v-if="partnersWorkedWith.length > 0" class="mt-4">
                <p class="text-sm font-semibold text-gray-700 mb-2">Партнери:</p>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="partner in partnersWorkedWith"
                    :key="partner.id"
                    class="px-3 py-1.5 bg-savoy/10 text-savoy rounded-lg text-sm font-medium border border-savoy/20"
                  >
                    {{ partner.companyName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Навички -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Навички</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div
            v-for="skill in currentStudent.skills"
            :key="skill.id"
            class="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-gray-800">{{ skill.name }}</span>
              <div class="flex items-center gap-1">
                <span
                  :class="getSkillLevelClass(skill.level)"
                  class="px-2 py-0.5 rounded text-xs font-semibold"
                >
                  {{ getSkillLevelText(skill.level) }}
                </span>
                <span v-if="skill.verified" class="text-green-500" title="Перевірена навичка">
                  ✓
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-500 capitalize">{{ getSkillCategoryText(skill.category) }}</p>
              <div v-if="skill.verified" class="text-xs text-green-600 font-medium">
                Перевірено
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Рекомендовані проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Рекомендовані проєкти</h3>
          <span v-if="recommendedProjects.length > 0" class="text-sm text-gray-500">
            {{ recommendedProjects.length }} проєктів
          </span>
        </div>
        
        <div v-if="recommendedProjects.length === 0" class="text-center py-8 text-gray-500">
          <p>Наразі немає рекомендованих проєктів</p>
          <p class="text-sm mt-2">Оновіть свої навички або зачекайте на нові проєкти</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="project in recommendedProjects"
            :key="project.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-bold text-gray-800">{{ project.name }}</h4>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {{ getMatchPercentage(project) }}% відповідність
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ project.description }}</p>
            
            <!-- Рекомендована роль -->
            <div v-if="project.recommendations" class="mb-3">
              <p class="text-xs text-gray-500">Рекомендована роль:</p>
              <p class="text-sm font-medium text-savoy">
                {{ getRecommendedRole(project) }}
              </p>
            </div>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center gap-3">
                <span class="px-2 py-1 bg-gray-100 rounded">{{ project.category }}</span>
                <span>{{ getComplexityText(project.complexity) }}</span>
              </div>
              <span v-if="project.deadline" class="text-gray-600">
                Дедлайн: {{ formatDate(project.deadline) }}
              </span>
            </div>
            
            <div class="mt-4 flex gap-2">
              <button
                class="flex-1 px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
                @click.stop="handleApply(project.id)"
              >
                Подати заявку
              </button>
              <button
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                @click.stop="navigateToProject(project.id)"
              >
                Детальніше
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Мої проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Мої проєкти</h3>
          <span v-if="myProjects.length > 0" class="text-sm text-gray-500">
            {{ myProjects.length }} проєктів
          </span>
        </div>
        
        <div v-if="myProjects.length === 0" class="text-center py-8 text-gray-500">
          <p>Ви ще не приймаєте участі в проєктах</p>
          <p class="text-sm mt-2">Подайте заявку на рекомендовані проєкти або чекайте на запрошення</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="project in myProjects"
            :key="project.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-800">{{ project.name }}</h4>
                  <span
                    :class="getProjectStatusClass(project.status)"
                    class="px-3 py-1 rounded-lg text-xs font-semibold"
                  >
                    {{ getProjectStatusText(project.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ project.description }}</p>
                
                <!-- Інформація про проєкт -->
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <span>👥</span>
                    <span>{{ project.team.length }} учасників</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>🏷️</span>
                    <span>{{ project.category }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>⚡</span>
                    <span>{{ getComplexityText(project.complexity) }}</span>
                  </div>
                  <div v-if="project.deadline" class="flex items-center gap-1">
                    <span>📅</span>
                    <span>{{ formatDate(project.deadline) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Прогрес (якщо є борд) -->
              <div v-if="project.boardId" class="ml-4 text-right">
                <p class="text-xs text-gray-500 mb-1">Прогрес</p>
                <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-savoy transition-all duration-300"
                    :style="{ width: getProjectProgress(project.id) + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ getProjectProgress(project.id) }}%</p>
              </div>
            </div>
            
            <!-- Ваша роль у проєкті -->
            <div v-if="getMyRoleInProject(project)" class="mt-3 pt-3 border-t border-gray-100">
              <p class="text-xs text-gray-500">Ваша роль:</p>
              <p class="text-sm font-medium text-gray-800">{{ getMyRoleInProject(project) }}</p>
            </div>
          </div>
        </div>
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
  Student, 
  Project, 
  Skill, 
  Partner,
  Notification as NotificationType,
  ProjectCategory,
  ComplexityLevel,
  StudentRecommendation
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

// Реф для сповіщень
const notifications = ref<NotificationType[]>([
  {
    id: '1',
    type: 'new_project',
    title: 'Новий проєкт доступний!',
    message: 'З\'явився новий проєкт "Розробка AI-асистента для студентів", який відповідає вашим навичкам',
    projectId: 'project-789',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 хвилин тому
  },
  {
    id: '2',
    type: 'project_invitation',
    title: 'Запрошення на проєкт',
    message: 'Вас запрошено приєднатися до проєкту "Розробка мобільного додатку для освіти"',
    projectId: 'project-123',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 хвилин тому
  },
  {
    id: '3',
    type: 'project_update',
    title: 'Оновлення проєкту',
    message: 'У проєкті "Веб-портал для університету" додано нове завдання',
    projectId: 'project-456',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 години тому
  },
  {
    id: '4',
    type: 'system',
    title: 'Новий рейтинг',
    message: 'Ваш рейтинг було оновлено: +0.3 балів за успішне завершення проєкту',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день тому
  },
]);

const showNotifications = ref(true);

// Комп'ютед властивості
const currentStudent = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "student") {
    return null;
  }
  return authStore.currentUser as Student;
});

// Проєкти, де студент є в команді
const myProjects = computed(() => {
  if (!currentStudent.value) return [];
  return projectsStore.projects.filter((p: Project) => p.team.includes(currentStudent.value!.id));
});

// Завершені проєкти
const completedProjects = computed(() => {
  if (!currentStudent.value) return [];
  return myProjects.value.filter((p: Project) => p.status === 'completed');
});

// Партнери, проєкти яких виконував студент
const partnersWorkedWith = computed(() => {
  if (!currentStudent.value) return [];
  
  const partnerIds = new Set<string>();
  
  // Збираємо унікальні ID партнерів з проєктів, де студент брав участь
  myProjects.value.forEach((project: Project) => {
    if (project.partnerId) {
      partnerIds.add(project.partnerId);
    }
  });
  
  // Отримуємо об'єкти партнерів
  return Array.from(partnerIds)
    .map(partnerId => projectsStore.partners.find(p => p.id === partnerId))
    .filter((p): p is Partner => p !== undefined);
});

// Рекомендовані проєкти на основі навичок
const recommendedProjects = computed(() => {
  if (!currentStudent.value) return [];

  return projectsStore.projects
    .filter((p: Project) => {
      // Показуємо тільки проєкти, де є рекомендації та студент ще не в команді
      return (
        p.status === 'pending_approval' &&
        p.recommendations &&
        !p.team.includes(currentStudent.value!.id)
      );
    })
    .map((project: Project) => {
      const recommendation = project.recommendations?.find(
        (r: StudentRecommendation) => r.studentId === currentStudent.value!.id
      );
      return {
        ...project,
        matchPercentage: recommendation?.matchPercentage || 0,
      };
    })
    .filter((p: any) => p.matchPercentage > 0)
    .sort((a: any, b: any) => b.matchPercentage - a.matchPercentage)
    .slice(0, 6);
});

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
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
  const notification = notifications.value.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};

const handleNotificationClick = (notification: NotificationType) => {
  // Позначаємо як прочитане
  markAsRead(notification.id);
  
  // Навігація в залежності від типу сповіщення
  if (notification.projectId) {
    navigateToProject(notification.projectId);
  }
};

const acceptProjectInvitation = async (projectId?: string, notificationId?: string) => {
  if (!projectId || !notificationId) return;
  
  // Тут логіка прийняття запрошення
  console.log('Прийнято запрошення на проєкт:', projectId);
  
  // Оновлюємо статус сповіщення
  markAsRead(notificationId);
  
  // Додаємо студента до команди проєкту
  if (currentStudent.value) {
    // Тут викликаємо метод зі стору або API
    // await projectsStore.addStudentToProject(projectId, currentStudent.value.id);
    
    // Оновлюємо список сповіщень
    notifications.value = notifications.value.filter(n => n.id !== notificationId);
    
    // Додаємо нове сповіщення про успіх
    const project = projectsStore.getProjectById(projectId);
    const successNotification: NotificationType = {
      id: `success-${Date.now()}`,
      type: 'system',
      title: 'Запрошення прийнято!',
      message: `Ви приєдналися до проєкту "${project?.name || 'проєкту'}"`,
      projectId,
      read: false,
      createdAt: new Date(),
    };
    notifications.value.unshift(successNotification);
  }
  
  // Перенаправляємо на сторінку проєкту
  navigateToProject(projectId);
};

const declineProjectInvitation = (projectId?: string, notificationId?: string) => {
  if (!notificationId) return;
  
  // Логіка відхилення запрошення
  console.log('Відхилено запрошення на проєкт:', projectId);
  
  // Позначаємо сповіщення як прочитане
  markAsRead(notificationId);
  
  // Оновлюємо список сповіщень
  notifications.value = notifications.value.filter(n => n.id !== notificationId);
  
  // Додаємо нове сповіщення
  const project = projectsStore.getProjectById(projectId || '');
  const declinedNotification: NotificationType = {
    id: `declined-${Date.now()}`,
    type: 'system',
    title: 'Запрошення відхилено',
    message: `Ви відхилили запрошення до проєкту "${project?.name || 'проєкту'}"`,
    read: false,
    createdAt: new Date(),
  };
  notifications.value.unshift(declinedNotification);
};

// Функції для навичок
const getSkillLevelText = (level: Skill["level"]): string => {
  const map: Record<Skill["level"], string> = {
    junior: "Початківець",
    middle: "Середній",
    senior: "Просунутий",
  };
  return map[level];
};

const getSkillLevelClass = (level: Skill["level"]): string => {
  const map: Record<Skill["level"], string> = {
    junior: "bg-blue-100 text-blue-700",
    middle: "bg-yellow-100 text-yellow-700",
    senior: "bg-green-100 text-green-700",
  };
  return map[level];
};

const getSkillCategoryText = (category: Skill["category"]): string => {
  const map: Record<Skill["category"], string> = {
    backend: "Backend",
    frontend: "Frontend",
    design: "Дизайн",
    analytics: "Аналітика",
    mobile: "Мобільна розробка",
    devops: "DevOps",
    other: "Інше",
  };
  return map[category];
};

// Функції для проєктів
const getMatchPercentage = (project: any): number => {
  return project.matchPercentage || 0;
};

const getRecommendedRole = (project: Project): string => {
  if (!project.recommendations || !currentStudent.value) return '';
  const recommendation = project.recommendations.find(
    (r: StudentRecommendation) => r.studentId === currentStudent.value!.id
  );
  return recommendation?.role || '';
};

const getProjectStatusText = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "Чернетка",
    pending_ai: "AI аналіз",
    pending_approval: "Очікує затвердження",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
  };
  return map[status];
};

const getProjectStatusClass = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    pending_ai: "bg-blue-100 text-blue-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status];
};

const getStudentStatusText = (status: Student["status"]): string => {
  const map: Record<Student["status"], string> = {
    available: "Доступний",
    busy: "Зайнятий",
    unavailable: "Недоступний",
  };
  return map[status];
};

const getStatusClass = (status: Student["status"]): string => {
  const map: Record<Student["status"], string> = {
    available: "bg-green-100 text-green-700",
    busy: "bg-yellow-100 text-yellow-700",
    unavailable: "bg-red-100 text-red-700",
  };
  return map[status];
};

const getComplexityText = (complexity: ComplexityLevel): string => {
  const map: Record<ComplexityLevel, string> = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

const getProjectProgress = (projectId: string): number => {
  // Спрощена логіка розрахунку прогресу
  // У реальному додатку це має бути на основі статусу завдань
  const project = projectsStore.getProjectById(projectId);
  if (!project) return 0;
  
  // Проста симуляція прогресу
  const statusProgress: Record<Project["status"], number> = {
    draft: 0,
    pending_ai: 10,
    pending_approval: 20,
    active: Math.floor(Math.random() * 60) + 30, // 30-90%
    completed: 100,
    cancelled: 0,
  };
  
  return statusProgress[project.status];
};

const getMyRoleInProject = (project: Project): string => {
  if (!currentStudent.value) return '';
  
  // Шукаємо роль студента в проєкті
  for (const role of project.roles) {
    if (role.assigned.includes(currentStudent.value.id)) {
      return role.name;
    }
  }
  
  return 'Учасник';
};

const navigateToProject = (projectId?: string) => {
  if (!projectId) return;
  router.push(`/projects/${projectId}`);
};

const handleApply = (projectId?: string) => {
  if (!projectId) return;
  
  // Симуляція подачі заявки
  const project = projectsStore.getProjectById(projectId);
  alert(`Заявку на проєкт "${project?.name || 'проєкт'}" подано! Викладач розгляне вашу кандидатуру.`);
  
  // Додаємо сповіщення про подачу заявки
  const applicationNotification: NotificationType = {
    id: `apply-${Date.now()}`,
    type: 'system',
    title: 'Заявку подано',
    message: `Ви подали заявку на проєкт "${project?.name || 'проєкт'}"`,
    projectId: projectId,
    read: false,
    createdAt: new Date(),
  };
  notifications.value.unshift(applicationNotification);
};

// Сімуляція отримання нових сповіщень
let notificationInterval: NodeJS.Timeout;

const simulateNewNotification = () => {
  // Іноді додаємо нові сповіщення
  if (Math.random() > 0.7) {
    const projectTypes = ['new_project', 'project_invitation', 'project_update'] as const;
    const randomType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    
    const messages = {
      new_project: [
        'З\'явився новий проєкт, який ідеально підходить під ваші навички!',
        'Новий проєкт чекає на вашу участь!',
        'Проєкт за вашим профілем щойно опубліковано'
      ],
      project_invitation: [
        'Вас запросили приєднатися до команди проєкту',
        'Нове запрошення на співпрацю в проєкті',
        'Ви отримали запрошення до проєкту'
      ],
      project_update: [
        'У вашому проєкті з\'явилися нові завдання',
        'Проєкт оновлено: перевірте нові деталі',
        'Змінено статус проєкту, в якому ви берете участь'
      ]
    };

    const titles = {
      new_project: 'Новий проєкт доступний!',
      project_invitation: 'Запрошення на проєкт',
      project_update: 'Оновлення проєкту'
    };

    const project = projectsStore.projects[Math.floor(Math.random() * projectsStore.projects.length)];
    
    const newNotification: NotificationType = {
      id: `notif-${Date.now()}`,
      type: randomType,
      title: titles[randomType],
      message: messages[randomType][Math.floor(Math.random() * messages[randomType].length)],
      projectId: project?.id,
      read: false,
      createdAt: new Date(),
    };
    
    notifications.value.unshift(newNotification);
    
    // Браузерні сповіщення
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: 'new-project'
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
  
  // Сімулюємо нове сповіщення кожні 1-3 хвилини (для демонстрації)
  notificationInterval = setInterval(simulateNewNotification, Math.random() * 120000 + 60000);
});

// Очищуємо інтервал при демонтажі
onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>