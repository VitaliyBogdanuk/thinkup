import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationsApi } from "~/composables/useApi";
import type { BaseNotification } from "~~/types";

type NotificationWithMeta = BaseNotification & { userId: string; role: string };

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as NotificationWithMeta[],
    unreadCount: 0,
    isLoading: false,
    isInitialized: false,
  }),

  getters: {
    getNotificationsByUser: (state) => (userId: string, role: string): NotificationWithMeta[] => {
      return state.notifications.filter(
        (n) => n.userId === userId && n.role === role
      );
    },
    getUnreadNotifications: (state) => (userId: string, role: string): NotificationWithMeta[] => {
      return state.notifications.filter(
        (n) => n.userId === userId && n.role === role && !n.read
      );
    },
  },

  actions: {
    // Завантаження сповіщень для користувача
    async loadNotifications(userId: string, role: string) {
      if (!userId || !role) return;

      this.isLoading = true;
      try {
        const notificationsApi = useNotificationsApi();
        const notifications = await notificationsApi.getNotifications(userId, role);
        
        // Видаляємо дублікати за id
        const uniqueNotifications = notifications.reduce((acc, notification) => {
          if (!acc.find(n => n.id === notification.id)) {
            acc.push(notification);
          }
          return acc;
        }, [] as NotificationWithMeta[]);
        
        // Оновлюємо сповіщення для цього користувача
        this.notifications = [
          ...this.notifications.filter(n => !(n.userId === userId && n.role === role)),
          ...uniqueNotifications,
        ];
        
        await this.updateUnreadCount(userId, role);
        this.isInitialized = true;
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Оновлення кількості непрочитаних
    async updateUnreadCount(userId: string, role: string) {
      if (!userId || !role) return;

      try {
        const notificationsApi = useNotificationsApi();
        const count = await notificationsApi.getUnreadCount(userId, role);
        this.unreadCount = count;
      } catch (error) {
        console.error("Failed to update unread count:", error);
        // Fallback на локальний підрахунок
        this.unreadCount = this.getUnreadNotifications(userId, role).length;
      }
    },

    // Створення сповіщення
    async createNotification(
      notification: Omit<NotificationWithMeta, "id" | "createdAt">
    ): Promise<NotificationWithMeta> {
      const notificationsApi = useNotificationsApi();
      
      const newNotification: NotificationWithMeta = {
        ...notification,
        id: uuidv4(),
        createdAt: new Date(),
        read: false,
      };

      try {
        const created = await notificationsApi.createNotification(newNotification);
        
        // Додаємо в локальний стан
        const existingIndex = this.notifications.findIndex(n => n.id === created.id);
        if (existingIndex === -1) {
          this.notifications.push(created);
        } else {
          this.notifications[existingIndex] = created;
        }
        
        // Оновлюємо кількість непрочитаних
        await this.updateUnreadCount(created.userId, created.role);
        
        return created;
      } catch (error) {
        console.error("Failed to create notification:", error);
        throw error;
      }
    },

    // Позначити сповіщення як прочитане
    async markAsRead(notificationId: string, userId: string, role: string) {
      try {
        const notificationsApi = useNotificationsApi();
        await notificationsApi.updateNotification(notificationId, { read: true });
        
        // Оновлюємо локальний стан
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
        
        await this.updateUnreadCount(userId, role);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },

    // Позначити всі сповіщення як прочитані
    async markAllAsRead(userId: string, role: string) {
      try {
        const notificationsApi = useNotificationsApi();
        await notificationsApi.markAllAsRead(userId, role);
        
        // Оновлюємо локальний стан
        this.notifications.forEach((n) => {
          if (n.userId === userId && n.role === role) {
            n.read = true;
          }
        });
        
        this.unreadCount = 0;
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
      }
    },

    // Створення сповіщень для різних подій
    async notifyProjectCreated(projectId: string, projectName: string, partnerId: string, teachers: any[] = []) {
      // Сповіщення для адміна
      try {
        await this.createNotification({
          userId: "admin-1", // TODO: отримати з auth
          role: "admin",
          type: "project_created",
          title: "Новий проєкт створено",
          message: `Партнер створив новий проєкт "${projectName}"`,
          projectId,
        });
      } catch (error) {
        console.error('Failed to notify admin:', error);
      }

      // Сповіщення для викладачів
      for (const teacher of teachers) {
        try {
          await this.createNotification({
            userId: teacher.id,
            role: "teacher",
            type: "project_submission",
            title: "Новий проєкт потребує затвердження",
            message: `Партнер створив новий проєкт "${projectName}", який потребує вашого затвердження`,
            projectId,
          });
        } catch (error) {
          console.error(`Failed to notify teacher ${teacher.id}:`, error);
        }
      }
    },

    async notifyProjectApproved(projectId: string, projectName: string, partnerId: string, teacherId: string) {
      // Сповіщення для партнера
      await this.createNotification({
        userId: partnerId,
        role: "partner",
        type: "project_approval",
        title: "Проєкт затверджено",
        message: `Ваш проєкт "${projectName}" затверджено викладачем`,
        projectId,
      });
    },

    async notifyStudentAssigned(projectId: string, projectName: string, studentId: string) {
      // Сповіщення для студента
      await this.createNotification({
        userId: studentId,
        role: "student",
        type: "project_invitation",
        title: "Вас призначено на проєкт",
        message: `Вас призначено на проєкт "${projectName}"`,
        projectId,
      });
    },

    async notifyProjectStatusUpdate(projectId: string, projectName: string, partnerId: string, status: string) {
      await this.createNotification({
        userId: partnerId,
        role: "partner",
        type: "project_status_update",
        title: "Статус проєкту оновлено",
        message: `Статус проєкту "${projectName}" змінено на "${status}"`,
        projectId,
      });
    },
  },
});

