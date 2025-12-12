import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~~/stores/auth";
import { mockPartners } from "~~/utils/mockData";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  
  // Ініціалізуємо користувача як партнера за замовчуванням, якщо він не авторизований
  if (!authStore.currentUser) {
    authStore.login(mockPartners[0]);
  }
});

