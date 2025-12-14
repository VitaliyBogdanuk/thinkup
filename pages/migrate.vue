<template>
  <div class="min-h-screen bg-lightGray p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Міграція даних в MongoDB</h1>
      
      <!-- Статус підключення -->
      <div class="mb-6 p-4 rounded-lg" :class="connectionStatus === 'connected' ? 'bg-green-50 border border-green-200' : connectionStatus === 'error' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'">
        <div class="flex items-center gap-2 mb-2">
          <span v-if="connectionStatus === 'connected'" class="text-green-600">✅</span>
          <span v-else-if="connectionStatus === 'error'" class="text-red-600">❌</span>
          <span v-else class="text-gray-600">⏳</span>
          <span class="font-semibold">Статус підключення:</span>
          <span :class="connectionStatus === 'connected' ? 'text-green-600' : connectionStatus === 'error' ? 'text-red-600' : 'text-gray-600'">
            {{ connectionStatusText }}
          </span>
        </div>
        <div v-if="healthData" class="text-sm text-gray-600 mt-2">
          <p>База даних: <strong>{{ healthData.database }}</strong></p>
          <p>Колекції: <strong>{{ healthData.collections?.length || 0 }}</strong></p>
        </div>
      </div>

      <!-- Інформація про дані в localStorage -->
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 class="font-semibold text-gray-800 mb-3">Дані в localStorage:</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Користувачі:</span>
            <strong>{{ localStorageData.users }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Проєкти:</span>
            <strong>{{ localStorageData.projects }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Дошки:</span>
            <strong>{{ localStorageData.boards }}</strong>
          </div>
          <div class="flex justify-between">
            <span>Відгуки:</span>
            <strong>{{ localStorageData.reviews }}</strong>
          </div>
        </div>
      </div>

      <!-- Кнопка міграції -->
      <button
        @click="startMigration"
        :disabled="isMigrating || connectionStatus !== 'connected'"
        class="w-full px-6 py-3 bg-savoy text-white rounded-lg font-semibold hover:bg-savoy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {{ isMigrating ? 'Міграція в процесі...' : 'Запустити міграцію' }}
      </button>

      <!-- Результат міграції -->
      <div v-if="migrationResult" class="mt-6 p-4 rounded-lg" :class="migrationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
        <h3 class="font-semibold mb-2">{{ migrationResult.success ? '✅ Міграція успішна!' : '❌ Помилка міграції' }}</h3>
        <div v-if="migrationResult.migrated" class="text-sm space-y-1">
          <p>Користувачів: <strong>{{ migrationResult.migrated.users }}</strong></p>
          <p>Проєктів: <strong>{{ migrationResult.migrated.projects }}</strong></p>
          <p>Дошок: <strong>{{ migrationResult.migrated.boards }}</strong></p>
          <p>Відгуків: <strong>{{ migrationResult.migrated.reviews }}</strong></p>
        </div>
        <p v-if="migrationResult.error" class="text-sm text-red-600 mt-2">
          {{ migrationResult.error }}
        </p>
      </div>

      <!-- Інструкції -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p class="font-semibold mb-2">💡 Інструкції:</p>
        <ol class="list-decimal list-inside space-y-1">
          <li>Переконайтеся, що підключення до MongoDB працює (зелений статус вище)</li>
          <li>Перевірте дані в localStorage</li>
          <li>Натисніть "Запустити міграцію"</li>
          <li>Після успішної міграції дані будуть доступні в MongoDB Atlas</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { migrateLocalStorageToMongo } from '~/utils/migrateToMongo';

const connectionStatus = ref<'checking' | 'connected' | 'error'>('checking');
const healthData = ref<any>(null);
const isMigrating = ref(false);
const migrationResult = ref<any>(null);

const localStorageData = computed(() => {
  if (typeof window === 'undefined') {
    return { users: 0, projects: 0, boards: 0, reviews: 0 };
  }

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const partners = JSON.parse(localStorage.getItem('partners') || '[]');
  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const boards = JSON.parse(localStorage.getItem('board') || '[]');
  const reviews = JSON.parse(localStorage.getItem('partnerReviews') || '[]');

  return {
    users: students.length + partners.length + teachers.length,
    projects: projects.length,
    boards: boards.length,
    reviews: reviews.length,
  };
});

const connectionStatusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'Підключено';
    case 'error':
      return 'Помилка підключення';
    default:
      return 'Перевірка...';
  }
});

// Перевірка підключення
const checkConnection = async () => {
  try {
    connectionStatus.value = 'checking';
    const data = await $fetch('/api/health');
    healthData.value = data;
    connectionStatus.value = data.status === 'connected' ? 'connected' : 'error';
  } catch (error) {
    connectionStatus.value = 'error';
    console.error('Connection check failed:', error);
  }
};

// Запуск міграції
const startMigration = async () => {
  if (connectionStatus.value !== 'connected') {
    alert('Спочатку переконайтеся, що підключення до MongoDB працює');
    return;
  }

  isMigrating.value = true;
  migrationResult.value = null;

  try {
    const result = await migrateLocalStorageToMongo();
    migrationResult.value = result;
  } catch (error: any) {
    migrationResult.value = {
      success: false,
      error: error.message || 'Невідома помилка',
    };
  } finally {
    isMigrating.value = false;
  }
};

// Перевіряємо підключення при завантаженні
onMounted(() => {
  checkConnection();
});
</script>

