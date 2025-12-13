<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-4 md:p-10 bg-lightGray">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
      <h1 class="text-xl md:text-2xl font-bold text-gray-800">Сповіщення</h1>
      <div class="flex items-center gap-3">
        <span v-if="unreadCount > 0" class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
          {{ unreadCount }} непрочитаних
        </span>
        <button 
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm font-medium"
        >
          Позначити все як прочитане
        </button>
      </div>
    </div>

    <div v-if="notifications.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <span class="text-4xl">🔔</span>
      </div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Немає сповіщень</h2>
      <p class="text-gray-600">Ви будете отримувати сповіщення про важливі події</p>
    </div>

    <div v-else class="space-y-3 md:space-y-4">
      <div 
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'rounded-xl border p-4 md:p-6 transition-all cursor-pointer hover:shadow-md',
          notification.read 
            ? 'bg-white border-gray-200 shadow-sm' 
            : 'bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-200/50'
        ]"
        @click="handleNotificationClick(notification)"
      >
        <div class="flex items-start gap-3 md:gap-4">
          <!-- Іконка типу сповіщення -->
          <div class="flex-shrink-0 mt-1">
            <div :class="getNotificationIconClass(notification)">
              <span class="text-lg md:text-xl">{{ getNotificationIconEmoji(notification) }}</span>
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h4 :class="[
                'font-semibold text-sm md:text-base',
                notification.read ? 'text-gray-800' : 'text-blue-900 font-bold'
              ]">{{ notification.title }}</h4>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span :class="[
                  'text-xs whitespace-nowrap',
                  notification.read ? 'text-gray-500' : 'text-blue-700 font-medium'
                ]">
                  {{ formatTimeAgo(notification.createdAt) }}
                </span>
                <span 
                  v-if="!notification.read"
                  class="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 ring-2 ring-blue-300"
                ></span>
              </div>
            </div>
            <p :class="[
              'text-sm mb-3',
              notification.read ? 'text-gray-600' : 'text-gray-700 font-medium'
            ]">{{ notification.message }}</p>
            
            <!-- Додаткові дії для сповіщень -->
            <div v-if="!notification.read && notification.projectId" class="flex flex-wrap gap-2 mt-3">
              <button
                @click.stop="navigateToProject(notification.projectId!, notification.id)"
                class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
              >
                Перейти до проєкту
              </button>
              
              <!-- Для партнера: нові заявки студентів -->
              <button
                v-if="authStore.isPartner && (notification as PartnerNotification).type === 'new_student_application'"
                @click.stop="viewProjectApplications(notification.projectId!, notification.id)"
                class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Переглянути заявки
              </button>
              
              <!-- Для партнера: дедлайн -->
              <button
                v-if="authStore.isPartner && (notification as PartnerNotification).type === 'project_deadline'"
                @click.stop="extendDeadline(notification.projectId!, notification.id)"
                class="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
              >
                Продовжити термін
              </button>
              
              <!-- Для студента: запрошення на проєкт -->
              <template v-if="authStore.isStudent && (notification as StudentNotification).type === 'project_invitation'">
                <button
                  @click.stop="acceptProjectInvitation(notification.projectId!, notification.id)"
                  class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
                >
                  Прийняти
                </button>
                <button
                  @click.stop="declineProjectInvitation(notification.projectId!, notification.id)"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Відхилити
                </button>
              </template>
              
              <!-- Для студента: новий проєкт -->
              <template v-if="authStore.isStudent && (notification as StudentNotification).type === 'new_project'">
                <button
                  @click.stop="navigateToProject(notification.projectId!, notification.id)"
                  class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
                >
                  Переглянути проєкт
                </button>
                <button
                  @click.stop="handleApply(notification.projectId!, notification.id)"
                  class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  Подати заявку
                </button>
              </template>
              
              <!-- Для викладача: затвердження проєкту -->
              <button
                v-if="authStore.isTeacher && (notification as TeacherNotification).type === 'project_submission'"
                @click.stop="reviewProjectSubmission(notification.projectId!, notification.id)"
                class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
              >
                Переглянути
              </button>
              
              <!-- Для викладача: заявка від студента -->
              <template v-if="authStore.isTeacher && (notification as TeacherNotification).type === 'student_application'">
                <button
                  @click.stop="acceptStudentApplication(notification.projectId!, (notification as TeacherNotification).studentId!, notification.id)"
                  class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
                >
                  Прийняти
                </button>
                <button
                  @click.stop="declineStudentApplication(notification.projectId!, (notification as TeacherNotification).studentId!, notification.id)"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Відхилити
                </button>
              </template>
              
              <!-- Для викладача: проєкт готовий до затвердження -->
              <button
                v-if="authStore.isTeacher && (notification as TeacherNotification).type === 'project_approval'"
                @click.stop="approveProject(notification.projectId!, notification.id)"
                class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm"
              >
                Затвердити проєкт
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import type { 
  PartnerNotification,
  StudentNotification,
  TeacherNotification,
  AdminNotification
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

// Об'єднаний тип сповіщень
type Notification = PartnerNotification | StudentNotification | TeacherNotification | AdminNotification;

// Реф для сповіщень
const notifications = ref<Notification[]>([]);

// Ініціалізація сповіщень залежно від ролі
const initializeNotifications = () => {
  // Отримуємо реальні проєкти зі store
  const allProjects = projectsStore.projects;
  const activeProjects = allProjects.filter(p => p.status === 'active');
  const pendingProjects = allProjects.filter(p => p.status === 'pending_approval');
  const completedProjects = allProjects.filter(p => p.status === 'completed');
  const projectsWithDeadline = allProjects.filter(p => p.deadline && p.status === 'active');
  
  if (authStore.isPartner) {
    const partnerProjects = allProjects.filter(p => p.partnerId === authStore.currentUser?.id);
    const activeProject = activeProjects.find(p => p.partnerId === authStore.currentUser?.id) || partnerProjects[0];
    const pendingProject = pendingProjects.find(p => p.partnerId === authStore.currentUser?.id) || partnerProjects[0];
    const completedProject = completedProjects.find(p => p.partnerId === authStore.currentUser?.id) || partnerProjects[0];
    const deadlineProject = projectsWithDeadline.find(p => p.partnerId === authStore.currentUser?.id) || partnerProjects[0];
    
    notifications.value = [
      ...(activeProject ? [{
        id: '1',
        type: 'project_status_update' as const,
        title: 'Статус проєкту оновлено',
        message: `Ваш проєкт "${activeProject.name}" переведено у статус "Активний"`,
        projectId: activeProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 хвилин тому
      }] : []),
      ...(pendingProject ? [{
        id: '2',
        type: 'project_approval' as const,
        title: 'Проєкт затверджено',
        message: `Ваш проєкт "${pendingProject.name}" затверджено викладачем`,
        projectId: pendingProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 години тому
      }] : []),
      ...(deadlineProject ? [{
        id: '3',
        type: 'project_deadline' as const,
        title: 'Наближається дедлайн',
        message: `У проєкті "${deadlineProject.name}" залишилось 5 днів до дедлайну`,
        projectId: deadlineProject.id,
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день тому
      }] : []),
      ...(completedProject ? [{
        id: '4',
        type: 'project_completed' as const,
        title: 'Проєкт завершено!',
        message: `Проєкт "${completedProject.name}" успішно завершено студентами`,
        projectId: completedProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 дні тому
      }] : []),
    ] as PartnerNotification[];
  } else if (authStore.isStudent) {
    const newProject = pendingProjects[0] || allProjects[0];
    const activeProject = activeProjects[0] || allProjects[0];
    const projectWithUpdate = activeProjects[0] || allProjects[0];
    
    notifications.value = [
      ...(newProject ? [{
        id: '1',
        type: 'new_project' as const,
        title: 'Новий проєкт доступний!',
        message: `З'явився новий проєкт "${newProject.name}", який відповідає вашим навичкам`,
        projectId: newProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 хвилин тому
      }] : []),
      ...(activeProject ? [{
        id: '2',
        type: 'project_invitation' as const,
        title: 'Запрошення на проєкт',
        message: `Вас запрошено приєднатися до проєкту "${activeProject.name}"`,
        projectId: activeProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 хвилин тому
      }] : []),
      ...(projectWithUpdate ? [{
        id: '3',
        type: 'project_update' as const,
        title: 'Оновлення проєкту',
        message: `У проєкті "${projectWithUpdate.name}" додано нове завдання`,
        projectId: projectWithUpdate.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 години тому
      }] : []),
      {
        id: '4',
        type: 'system' as const,
        title: 'Новий рейтинг',
        message: 'Ваш рейтинг було оновлено: +0.3 балів за успішне завершення проєкту',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день тому
      },
    ] as StudentNotification[];
  } else if (authStore.isTeacher) {
    const submissionProject = pendingProjects[0] || allProjects[0];
    const applicationProject = activeProjects[0] || allProjects[0];
    const approvalProject = pendingProjects[0] || allProjects[0];
    const updateProject = activeProjects[0] || allProjects[0];
    const deadlineProject = projectsWithDeadline[0] || allProjects[0];
    const student = projectsStore.students[0];
    
    notifications.value = [
      ...(submissionProject ? [{
        id: '1',
        type: 'project_submission' as const,
        title: 'Новий проєкт подано на затвердження',
        message: `Партнер подав новий проєкт "${submissionProject.name}"`,
        projectId: submissionProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 хвилин тому
      }] : []),
      ...(applicationProject && student ? [{
        id: '2',
        type: 'student_application' as const,
        title: 'Заявка від студента',
        message: `${student.fullName} подав заявку на проєкт "${applicationProject.name}"`,
        projectId: applicationProject.id,
        studentId: student.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 хвилин тому
      }] : []),
      ...(approvalProject ? [{
        id: '3',
        type: 'project_approval' as const,
        title: 'Проєкт готовий до затвердження',
        message: `AI завершив аналіз проєкту "${approvalProject.name}"`,
        projectId: approvalProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 години тому
      }] : []),
      ...(updateProject ? [{
        id: '4',
        type: 'project_update' as const,
        title: 'Оновлення проєкту',
        message: `У проєкті "${updateProject.name}" додано нове завдання`,
        projectId: updateProject.id,
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 годин тому
      }] : []),
      ...(deadlineProject ? [{
        id: '5',
        type: 'deadline_approaching' as const,
        title: 'Наближається дедлайн',
        message: `У проєкті "${deadlineProject.name}" залишилось 3 дні до дедлайну`,
        projectId: deadlineProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день тому
      }] : []),
    ] as TeacherNotification[];
  } else if (authStore.isAdmin) {
    const newProject = allProjects[0];
    const reportProject = allProjects[0];
    const partner = projectsStore.partners[0];
    const student = projectsStore.students[0];
    
    notifications.value = [
      ...(partner ? [{
        id: '1',
        type: 'new_user_registration' as const,
        title: 'Новий користувач зареєстровано',
        message: `Партнер "${partner.companyName}" зареєструвався в системі`,
        userId: partner.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
      }] : []),
      ...(newProject ? [{
        id: '2',
        type: 'project_created' as const,
        title: 'Створено новий проєкт',
        message: `Партнер створив проєкт "${newProject.name}"`,
        projectId: newProject.id,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      }] : []),
      {
        id: '3',
        type: 'system_alert' as const,
        title: 'Системне попередження',
        message: 'Виявлено високу активність користувачів. Рекомендується перевірити систему',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
      ...(reportProject && student ? [{
        id: '4',
        type: 'user_report' as const,
        title: 'Скарга від користувача',
        message: `Отримано скаргу від студента на проєкт "${reportProject.name}"`,
        projectId: reportProject.id,
        userId: student.id,
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      }] : []),
      {
        id: '5',
        type: 'system_update' as const,
        title: 'Оновлення системи',
        message: 'Завершено оновлення системи до версії 2.1.0',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
    ] as AdminNotification[];
  }
};

// Комп'ютед властивості
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
  return `${Math.floor(diffInSeconds / 604800)} тиж тому`;
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

const handleNotificationClick = (notification: Notification) => {
  if (notification.projectId) {
    navigateToProject(notification.projectId, notification.id);
  } else {
    markAsRead(notification.id);
  }
};

const navigateToProject = (projectId: string, notificationId?: string) => {
  if (!projectId) {
    alert('ID проєкту не вказано');
    return;
  }
  
  // Перевіряємо, чи проєкт існує
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    alert('Проєкт не знайдено');
    return;
  }
  
  // Виконуємо навігацію (не async, щоб не блокувати)
  router.push(`/projects/${projectId}`).then(() => {
    // Після успішної навігації позначаємо як прочитане
    if (notificationId) {
      // Використовуємо setTimeout для затримки, щоб навігація точно виконалася
      setTimeout(() => {
        markAsRead(notificationId);
      }, 200);
    }
  }).catch((error) => {
    console.error('Помилка навігації:', error);
    alert(`Не вдалося перейти до проєкту`);
  });
};

const viewProjectApplications = (projectId: string, notificationId?: string) => {
  // Переходимо на сторінку проєкту, де можна переглянути заявки
  if (notificationId) {
    markAsRead(notificationId);
  }
  navigateToProject(projectId);
};

const extendDeadline = (projectId: string, notificationId?: string) => {
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    alert('Проєкт не знайдено');
    return;
  }
  
  if (!project.deadline) {
    alert('У проєкту немає встановленого дедлайну');
    return;
  }
  
  projectsStore.extendProjectDeadline(projectId, 7);
  if (notificationId) {
    markAsRead(notificationId);
  }
  alert(`Термін проєкту "${project.name}" продовжено на 7 днів`);
};

const acceptProjectInvitation = async (projectId: string, notificationId: string) => {
  if (!authStore.currentUser || !authStore.isStudent) {
    alert('Помилка: необхідна авторизація як студент');
    return;
  }
  
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    alert('Проєкт не знайдено');
    return;
  }
  
  projectsStore.acceptProjectInvitation(projectId, authStore.currentUser.id);
  markAsRead(notificationId);
  alert(`Ви успішно приєдналися до проєкту "${project.name}"!`);
  navigateToProject(projectId);
};

const declineProjectInvitation = (projectId: string, notificationId: string) => {
  const project = projectsStore.getProjectById(projectId);
  markAsRead(notificationId);
  notifications.value = notifications.value.filter(n => n.id !== notificationId);
  if (project) {
    alert(`Запрошення на проєкт "${project.name}" відхилено`);
  }
};

const handleApply = (projectId: string, notificationId?: string) => {
  if (!authStore.currentUser || !authStore.isStudent) {
    alert('Помилка: необхідна авторизація як студент');
    return;
  }
  
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    alert('Проєкт не знайдено');
    return;
  }
  
  projectsStore.applyToProject(projectId, authStore.currentUser.id);
  if (notificationId) {
    markAsRead(notificationId);
  }
  alert(`Заявку на проєкт "${project.name}" подано! Викладач розгляне вашу кандидатуру.`);
  navigateToProject(projectId);
};

const reviewProjectSubmission = (projectId: string, notificationId?: string) => {
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    alert('Проєкт не знайдено');
    return;
  }
  
  if (notificationId) {
    markAsRead(notificationId);
  }
  navigateToProject(projectId);
};

const acceptStudentApplication = (projectId: string, studentId: string, notificationId: string) => {
  if (!authStore.currentUser || !authStore.isTeacher) {
    alert('Помилка: необхідна авторизація як викладач');
    return;
  }
  
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    alert('Проєкт не знайдено');
    return;
  }
  
  const student = projectsStore.getStudentById(studentId);
  if (!student) {
    alert('Студент не знайдено');
    return;
  }
  
  projectsStore.acceptStudentApplication(projectId, studentId, authStore.currentUser.id);
  markAsRead(notificationId);
  alert(`Заявку студента ${student.fullName} на проєкт "${project.name}" прийнято!`);
  navigateToProject(projectId);
};

const declineStudentApplication = (projectId: string, studentId: string, notificationId: string) => {
  const project = projectsStore.getProjectById(projectId);
  const student = projectsStore.getStudentById(studentId);
  markAsRead(notificationId);
  notifications.value = notifications.value.filter(n => n.id !== notificationId);
  
  if (project && student) {
    alert(`Заявку студента ${student.fullName} на проєкт "${project.name}" відхилено`);
  }
};

const approveProject = (projectId: string, notificationId: string) => {
  if (!authStore.currentUser || !authStore.isTeacher) {
    alert('Помилка: необхідна авторизація як викладач');
    return;
  }
  
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    alert('Проєкт не знайдено');
    return;
  }
  
  projectsStore.approveProjectByTeacher(projectId, authStore.currentUser.id);
  markAsRead(notificationId);
  alert(`Проєкт "${project.name}" затверджено!`);
  navigateToProject(projectId);
};

// Функції для відображення іконок
const getNotificationIconClass = (notification: Notification): string => {
  const baseClass = "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center";
  
  if ('type' in notification) {
    if (authStore.isPartner) {
      const notif = notification as PartnerNotification;
      if (notif.type === 'project_status_update') return `${baseClass} bg-green-100`;
      if (notif.type === 'project_approval') return `${baseClass} bg-blue-100`;
      if (notif.type === 'new_student_application') return `${baseClass} bg-purple-100`;
      if (notif.type === 'project_deadline') return `${baseClass} bg-orange-100`;
      if (notif.type === 'project_completed') return `${baseClass} bg-yellow-100`;
    } else if (authStore.isStudent) {
      const notif = notification as StudentNotification;
      if (notif.type === 'project_invitation') return `${baseClass} bg-green-100`;
      if (notif.type === 'project_update') return `${baseClass} bg-blue-100`;
      if (notif.type === 'new_project') return `${baseClass} bg-purple-100`;
    } else if (authStore.isTeacher) {
      const notif = notification as TeacherNotification;
      if (notif.type === 'project_submission') return `${baseClass} bg-blue-100`;
      if (notif.type === 'student_application') return `${baseClass} bg-purple-100`;
      if (notif.type === 'project_approval') return `${baseClass} bg-green-100`;
      if (notif.type === 'deadline_approaching') return `${baseClass} bg-orange-100`;
    } else if (authStore.isAdmin) {
      const notif = notification as AdminNotification;
      if (notif.type === 'new_user_registration') return `${baseClass} bg-green-100`;
      if (notif.type === 'project_created') return `${baseClass} bg-blue-100`;
      if (notif.type === 'system_alert') return `${baseClass} bg-red-100`;
      if (notif.type === 'user_report') return `${baseClass} bg-yellow-100`;
      if (notif.type === 'system_update') return `${baseClass} bg-purple-100`;
    }
  }
  
  return `${baseClass} bg-gray-100`;
};

const getNotificationIconEmoji = (notification: Notification): string => {
  if ('type' in notification) {
    if (authStore.isPartner) {
      const notif = notification as PartnerNotification;
      if (notif.type === 'project_status_update') return '🔄';
      if (notif.type === 'project_approval') return '✅';
      if (notif.type === 'new_student_application') return '👤';
      if (notif.type === 'project_deadline') return '⏰';
      if (notif.type === 'project_completed') return '🏆';
    } else if (authStore.isStudent) {
      const notif = notification as StudentNotification;
      if (notif.type === 'project_invitation') return '🎯';
      if (notif.type === 'project_update') return '🔄';
      if (notif.type === 'new_project') return '🚀';
    } else if (authStore.isTeacher) {
      const notif = notification as TeacherNotification;
      if (notif.type === 'project_submission') return '📝';
      if (notif.type === 'student_application') return '👤';
      if (notif.type === 'project_approval') return '✅';
      if (notif.type === 'deadline_approaching') return '⏰';
    } else if (authStore.isAdmin) {
      const notif = notification as AdminNotification;
      if (notif.type === 'new_user_registration') return '👤';
      if (notif.type === 'project_created') return '📁';
      if (notif.type === 'system_alert') return '⚠️';
      if (notif.type === 'user_report') return '🚨';
      if (notif.type === 'system_update') return '🔧';
    }
  }
  
  return '📢';
};

// Ініціалізація при монтажі
onMounted(() => {
  initializeNotifications();
});
</script>

