import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~~/stores/auth";
import { mockAdmin } from "~~/utils/mockData";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  
  // Ініціалізуємо користувача як адміністратора за замовчуванням для демо
  // Перевіряємо, чи користувач не встановлений або не є адміністратором
  if (!authStore.currentUser || authStore.currentUser.role !== "admin") {
    authStore.login(mockAdmin);
  }
});

