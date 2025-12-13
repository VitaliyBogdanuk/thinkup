import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~~/stores/auth";
import { mockPartners } from "~~/utils/mockData";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  // Ініціалізуємо користувача як партнера за замовчуванням для демо
  if (!authStore.currentUser || authStore.currentUser.role !== "partner") {
    authStore.login(mockPartners[0]);
  }
});

