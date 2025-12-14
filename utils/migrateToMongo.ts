/**
 * Скрипт для міграції даних з localStorage в MongoDB
 * Використовуйте цей скрипт один раз для переносу існуючих даних
 */

import type { User, Project, Board, PartnerReview } from '~/types';

// Допоміжна функція для безпечного отримання даних з localStorage
function getLocalStorageData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    
    // Якщо немає даних, повертаємо значення за замовчуванням
    if (!item || item === 'null' || item === 'undefined') {
      return defaultValue;
    }

    // Спробуємо парсити як JSON
    // useStorage зберігає дані як JSON рядки
    const parsed = JSON.parse(item);
    
    // Перевіряємо, чи це масив або об'єкт
    if (parsed === null || parsed === undefined) {
      return defaultValue;
    }
    
    return parsed as T;
  } catch (error: any) {
    // Якщо помилка парсингу, можливо це не JSON
    // Спробуємо отримати через useStorage напряму (якщо доступно)
    try {
      // Перевіряємо, чи є дані в іншому форматі
      const rawItem = localStorage.getItem(key);
      if (rawItem) {
        // Можливо, це вже об'єкт, який був збережений як "[object Object]"
        // У такому випадку спробуємо знайти правильні дані
        console.warn(`⚠️ Failed to parse ${key}: ${error.message}`);
      }
    } catch (e) {
      // Ігноруємо помилку
    }

    console.warn(`⚠️ Failed to parse ${key} from localStorage, using default value. Error: ${error?.message || error}`);
    return defaultValue;
  }
}

export async function migrateLocalStorageToMongo() {
  if (typeof window === 'undefined') {
    console.error('Migration script can only run in browser');
    return {
      success: false,
      error: 'Migration script can only run in browser',
    };
  }

  try {
    // Спробуємо отримати дані через stores (якщо доступні)
    let students: User[] = [];
    let partners: User[] = [];
    let teachers: User[] = [];
    let projects: Project[] = [];
    let boards: Board[] = [];
    let reviews: PartnerReview[] = [];
    let currentUser: User | null = null;

    try {
      // Спробуємо отримати через Pinia stores
      const { useProjectsStore } = await import('~/stores/projects');
      const { useKanbanStore } = await import('~/stores/index');
      const { useAuthStore } = await import('~/stores/auth');
      
      const projectsStore = useProjectsStore();
      const kanbanStore = useKanbanStore();
      const authStore = useAuthStore();
      
      students = projectsStore.students || [];
      partners = projectsStore.partners || [];
      teachers = projectsStore.teachers || [];
      projects = projectsStore.projects || [];
      reviews = projectsStore.partnerReviews || [];
      boards = kanbanStore.boards || [];
      currentUser = authStore.currentUser;
      
      console.log('✅ Got data from Pinia stores');
    } catch (storeError) {
      // Якщо stores не доступні, отримуємо з localStorage напряму
      console.log('⚠️ Could not get data from stores, trying localStorage...');
      students = getLocalStorageData<User[]>('students', []);
      partners = getLocalStorageData<User[]>('partners', []);
      teachers = getLocalStorageData<User[]>('teachers', []);
      projects = getLocalStorageData<Project[]>('projects', []);
      boards = getLocalStorageData<Board[]>('board', []);
      reviews = getLocalStorageData<PartnerReview[]>('partnerReviews', []);
      currentUser = getLocalStorageData<User | null>('currentUser', null);
    }

    // Переконуємося, що це масиви
    const studentsArray = Array.isArray(students) ? students : [];
    const partnersArray = Array.isArray(partners) ? partners : [];
    const teachersArray = Array.isArray(teachers) ? teachers : [];
    const projectsArray = Array.isArray(projects) ? projects : [];
    const boardsArray = Array.isArray(boards) ? boards : [];
    const reviewsArray = Array.isArray(reviews) ? reviews : [];

    console.log('🔄 Starting migration...');
    console.log(`📊 Found: ${studentsArray.length} students, ${partnersArray.length} partners, ${teachersArray.length} teachers`);
    console.log(`📊 Found: ${projectsArray.length} projects, ${boardsArray.length} boards, ${reviewsArray.length} reviews`);

    // Об'єднуємо всіх користувачів
    const allUsers = [...studentsArray, ...partnersArray, ...teachersArray];
    if (currentUser && !allUsers.find(u => u.id === currentUser.id)) {
      allUsers.push(currentUser);
    }

    // Мігруємо користувачів
    if (allUsers.length > 0) {
      console.log('👥 Migrating users...');
      for (const user of allUsers) {
        try {
          await $fetch('/api/users', {
            method: 'POST',
            body: user,
          });
        } catch (error) {
          // Можливо користувач вже існує, спробуємо оновити
          try {
            await $fetch(`/api/users/${user.id}`, {
              method: 'PATCH',
              body: user,
            });
          } catch (updateError) {
            console.warn(`⚠️ Failed to migrate user ${user.id}:`, updateError);
          }
        }
      }
      console.log(`✅ Migrated ${allUsers.length} users`);
    }

    // Мігруємо проєкти
    if (projectsArray.length > 0) {
      console.log('📁 Migrating projects...');
      for (const project of projectsArray) {
        try {
          await $fetch('/api/projects', {
            method: 'POST',
            body: project,
          });
        } catch (error) {
          try {
            await $fetch(`/api/projects/${project.id}`, {
              method: 'PATCH',
              body: project,
            });
          } catch (updateError) {
            console.warn(`⚠️ Failed to migrate project ${project.id}:`, updateError);
          }
        }
      }
      console.log(`✅ Migrated ${projectsArray.length} projects`);
    }

    // Мігруємо дошки
    if (boardsArray.length > 0) {
      console.log('📋 Migrating boards...');
      for (const board of boardsArray) {
        try {
          await $fetch('/api/boards', {
            method: 'POST',
            body: board,
          });
        } catch (error) {
          try {
            await $fetch(`/api/boards/${board.id}`, {
              method: 'PATCH',
              body: board,
            });
          } catch (updateError) {
            console.warn(`⚠️ Failed to migrate board ${board.id}:`, updateError);
          }
        }
      }
      console.log(`✅ Migrated ${boardsArray.length} boards`);
    }

    // Мігруємо відгуки
    if (reviewsArray.length > 0) {
      console.log('⭐ Migrating reviews...');
      for (const review of reviewsArray) {
        try {
          await $fetch('/api/reviews', {
            method: 'POST',
            body: review,
          });
        } catch (error) {
          console.warn(`⚠️ Failed to migrate review ${review.id}:`, error);
        }
      }
      console.log(`✅ Migrated ${reviewsArray.length} reviews`);
    }

    console.log('🎉 Migration completed!');
    console.log('💡 You can now clear localStorage if needed');
    
    return {
      success: true,
      migrated: {
        users: allUsers.length,
        projects: projectsArray.length,
        boards: boardsArray.length,
        reviews: reviewsArray.length,
      },
    };
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error?.message || String(error),
    };
  }
}

