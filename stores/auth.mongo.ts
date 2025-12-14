import { defineStore } from "pinia";
import { useUsersApi } from "~/composables/useApi";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: null as User | null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state): boolean => {
      return !!state.currentUser;
    },
    userRole: (state): UserRole | null => {
      return state.currentUser?.role || null;
    },
    isPartner: (state): boolean => {
      return state.currentUser?.role === "partner";
    },
    isStudent: (state): boolean => {
      return state.currentUser?.role === "student";
    },
    isTeacher: (state): boolean => {
      return state.currentUser?.role === "teacher";
    },
    isAdmin: (state): boolean => {
      return state.currentUser?.role === "admin";
    },
  },
  actions: {
    async login(user: User) {
      this.currentUser = user;
      // Синхронізуємо з API
      try {
        const usersApi = useUsersApi();
        await usersApi.createUser(user).catch(() => {
          // Якщо користувач вже існує, оновлюємо
          usersApi.updateUser(user.id, user);
        });
      } catch (error) {
        console.warn('Failed to sync user to MongoDB:', error);
      }
    },
    logout() {
      this.currentUser = null;
    },
    async updateUser(user: Partial<User>) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...user };
        // Синхронізуємо з API
        try {
          const usersApi = useUsersApi();
          await usersApi.updateUser(this.currentUser.id, this.currentUser);
        } catch (error) {
          console.warn('Failed to sync user update to MongoDB:', error);
        }
      }
    },
    async loadUser(userId: string) {
      try {
        this.isLoading = true;
        const usersApi = useUsersApi();
        const user = await usersApi.getUserById(userId);
        this.currentUser = user;
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});

