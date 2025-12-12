import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: useStorage<User | null>("currentUser", null),
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
    login(user: User) {
      this.currentUser = user;
    },
    logout() {
      this.currentUser = null;
    },
    updateUser(user: Partial<User>) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...user };
      }
    },
  },
});

