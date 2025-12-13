<template>
  <Transition name="slide-up">
    <div v-if="showInstallButton" class="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <!-- Банер для встановлення PWA -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="w-12 h-12 rounded-lg bg-savoy/10 flex items-center justify-center flex-shrink-0">
          <DevicePhoneMobileIcon class="w-6 h-6 text-savoy" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800 truncate">Встановити ThinkUp</p>
          <p class="text-xs text-gray-600">Додаток буде доступний офлайн</p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button
          @click="dismissInstallPrompt"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Закрити"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
        <button
          @click="installPWA"
          class="px-4 py-2 bg-savoy text-white rounded-lg font-semibold text-sm hover:bg-savoy/90 transition-colors active:scale-95 whitespace-nowrap"
        >
          Встановити
        </button>
      </div>
    </div>
  </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { DevicePhoneMobileIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useStorage } from "@vueuse/core";

const showInstallButton = ref(false);
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);

// Зберігаємо стан приховування в localStorage
const isDismissed = useStorage("pwa-install-dismissed", false);
const isInstalled = useStorage("pwa-installed", false);

// Перевіряємо, чи користувач на мобільному пристрої
const isMobile = () => {
  if (typeof window === "undefined") return false;
  
  // Перевірка через user agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
  
  // Перевірка через розмір екрану
  const isMobileScreen = window.innerWidth < 768;
  
  // Перевірка через touch events
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  
  return isMobileUA || (isMobileScreen && isTouchDevice);
};

// Перевіряємо, чи PWA вже встановлено
const checkIfInstalled = () => {
  if (typeof window === "undefined") return false;
  
  // Перевірка для standalone режиму
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }
  
  // Перевірка для iOS
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  return false;
};

// Обробка події beforeinstallprompt
const handleBeforeInstallPrompt = (e: Event) => {
  // Запобігаємо автоматичному показу підказки браузера
  e.preventDefault();
  
  // Зберігаємо подію для використання пізніше
  deferredPrompt.value = e as BeforeInstallPromptEvent;
  
  // Показуємо кнопку тільки на мобільних пристроях
  if (isMobile() && !isDismissed.value && !isInstalled.value) {
    showInstallButton.value = true;
  }
};

// Встановлення PWA
const installPWA = async () => {
  if (!deferredPrompt.value) {
    // Якщо подія не доступна, показуємо інструкції
    showInstallInstructions();
    return;
  }

  try {
    // Показуємо підказку встановлення
    deferredPrompt.value.prompt();
    
    // Очікуємо вибір користувача
    const { outcome } = await deferredPrompt.value.userChoice;
    
    if (outcome === "accepted") {
      console.log("PWA встановлено");
      isInstalled.value = true;
      showInstallButton.value = false;
    } else {
      console.log("Користувач відхилив встановлення");
    }
    
    // Очищаємо подію
    deferredPrompt.value = null;
  } catch (error) {
    console.error("Помилка при встановленні PWA:", error);
    showInstallInstructions();
  }
};

// Приховування підказки
const dismissInstallPrompt = () => {
  showInstallButton.value = false;
  isDismissed.value = true;
};

// Показ інструкцій для встановлення (якщо автоматичне встановлення недоступне)
const showInstallInstructions = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  let message = "";
  
  if (isIOS) {
    message = "Натисніть кнопку 'Поділитися' та виберіть 'На головний екран'";
  } else if (isAndroid) {
    message = "Натисніть меню браузера та виберіть 'Додати на головний екран'";
  } else {
    message = "Використайте меню браузера для встановлення додатку";
  }
  
  alert(message);
};

// Обробка події appinstalled (коли PWA встановлено)
const handleAppInstalled = () => {
  console.log("PWA встановлено");
  isInstalled.value = true;
  showInstallButton.value = false;
  deferredPrompt.value = null;
};

onMounted(() => {
  // Перевіряємо, чи PWA вже встановлено
  if (checkIfInstalled()) {
    isInstalled.value = true;
    return;
  }

  // Перевіряємо, чи користувач на мобільному пристрої
  if (!isMobile()) {
    return;
  }

  // Перевіряємо, чи користувач вже приховав підказку
  if (isDismissed.value) {
    return;
  }

  // Додаємо обробники подій
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  // Перевіряємо через невеликий інтервал (на випадок, якщо подія вже відбулася)
  setTimeout(() => {
    if (deferredPrompt.value && !showInstallButton.value) {
      showInstallButton.value = true;
    }
  }, 1000);
});

onUnmounted(() => {
  window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.removeEventListener("appinstalled", handleAppInstalled);
});

// Тип для beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Розширюємо Window interface для TypeScript
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}
</script>

