import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~~/stores/auth";
import { mockAdmin } from "~~/utils/mockData";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  
  // Ініціалізуємо користувача як адміністратора за замовчуванням, якщо він не авторизований
  if (!authStore.currentUser) {
    authStore.login(mockAdmin);
  }
});

