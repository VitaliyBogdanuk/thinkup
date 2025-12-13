<!-- pages/welcome.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-savoy/5 to-blue-50/30 flex flex-col items-center justify-center p-4">
    <!-- Header -->
    <div class="text-center mb-10 md:mb-16">
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="w-12 h-12 md:w-16 md:h-16 bg-savoy rounded-xl flex items-center justify-center">
          <ChartBarSquareIcon class="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">DeepWater</h1>
      </div>
      <p class="text-gray-600 text-lg md:text-xl max-w-2xl">
        Платформа для співпраці студентів, викладачів та партнерів у реалізації реальних проєктів
      </p>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-6xl">
      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-16">
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-savoy/10 rounded-xl flex items-center justify-center mb-4">
            <UserGroupIcon class="w-6 h-6 text-savoy" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Для студентів</h3>
          <p class="text-gray-600">
            Практичний досвід, робота з реальними проєктами, навчання в команді та можливість будувати портфоліо
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-savoy/10 rounded-xl flex items-center justify-center mb-4">
            <AcademicCapIcon class="w-6 h-6 text-savoy" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Для викладачів</h3>
          <p class="text-gray-600">
            Організація навчального процесу, менторство, затвердження проєктів та оцінка результатів
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-savoy/10 rounded-xl flex items-center justify-center mb-4">
            <BuildingOfficeIcon class="w-6 h-6 text-savoy" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Для партнерів</h3>
          <p class="text-gray-600">
            Доступ до талановитих студентів, реалізація проєктів, AI-аналіз ТЗ та автоматичне формування команд
          </p>
        </div>
      </div>

      <!-- Role Selection -->
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 mb-10 md:mb-16">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Обрати демо-режим</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            v-for="role in roles"
            :key="role.value"
            @click="selectRole(role.value)"
            :class="[
              'p-4 rounded-xl border-2 transition-all duration-200',
              selectedRole === role.value
                ? 'border-savoy bg-savoy/5 shadow-md scale-[1.02]'
                : 'border-gray-200 hover:border-savoy/50 hover:bg-gray-50'
            ]"
          >
            <div class="flex flex-col items-center text-center gap-3">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center',
                selectedRole === role.value ? 'bg-savoy' : 'bg-gray-100'
              ]">
                <component
                  :is="role.icon"
                  :class="[
                    'w-5 h-5',
                    selectedRole === role.value ? 'text-white' : 'text-gray-600'
                  ]"
                />
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ role.label }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ role.description }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Start Button -->
      <div class="text-center">
        <button
          @click="startApplication"
          :disabled="!selectedRole"
          :class="[
            'px-8 md:px-12 py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl transition-all duration-300',
            'transform hover:scale-105 active:scale-95',
            selectedRole
              ? 'bg-savoy text-white shadow-lg hover:shadow-xl hover:bg-savoy/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <span v-if="!isLoading">Почати роботу</span>
          <div v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Завантаження...</span>
          </div>
        </button>
        
        <p class="text-gray-500 text-sm mt-4">
          Натискаючи "Почати роботу", ви погоджуєтесь з нашими 
          <a href="#" class="text-savoy hover:underline">Умовами використання</a> та 
          <a href="#" class="text-savoy hover:underline">Політикою конфіденційності</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 md:mt-16 pt-8 border-t border-gray-200 w-full max-w-4xl">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-center md:text-left">
          <p class="text-gray-700 font-medium">DeepWater Education Platform</p>
          <p class="text-gray-500 text-sm">© 2024 Всі права захищені</p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#" class="text-gray-600 hover:text-savoy transition-colors">Про платформу</a>
          <a href="#" class="text-gray-600 hover:text-savoy transition-colors">Контакти</a>
          <a href="#" class="text-gray-600 hover:text-savoy transition-colors">Допомога</a>
          <a href="#" class="text-gray-600 hover:text-savoy transition-colors">FAQ</a>
        </div>
      </div>
    </div>

    <!-- Loading Modal -->
    <transition name="fade">
      <div
        v-if="showLoadingModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6">
              <svg class="animate-spin h-16 w-16 text-savoy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Завантаження даних</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Користувачі</span>
                <span :class="loadingSteps.users ? 'text-green-500' : 'text-gray-400'">
                  {{ loadingSteps.users ? '✓' : '...' }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Проєкти</span>
                <span :class="loadingSteps.projects ? 'text-green-500' : 'text-gray-400'">
                  {{ loadingSteps.projects ? '✓' : '...' }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Дошки</span>
                <span :class="loadingSteps.boards ? 'text-green-500' : 'text-gray-400'">
                  {{ loadingSteps.boards ? '✓' : '...' }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Налаштування</span>
                <span :class="loadingSteps.config ? 'text-green-500' : 'text-gray-500'">
                  {{ loadingSteps.config ? '✓' : '...' }}
                </span>
              </div>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                class="bg-savoy h-2 rounded-full transition-all duration-300"
                :style="{ width: loadingProgress + '%' }"
              ></div>
            </div>
            <p class="text-sm text-gray-500">Готуємо ваше робоче середовище...</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChartBarSquareIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  BriefcaseIcon,
  BeakerIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~~/stores/auth'
import { useProjectsStore } from '~~/stores/projects'
import { useKanbanStore } from '~~/stores'
import { mockPartners, mockStudents, mockTeachers, mockProjects } from '~~/utils/mockData'

const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const kanbanStore = useKanbanStore()

const selectedRole = ref<UserRole>('partner')
const isLoading = ref(false)
const showLoadingModal = ref(false)
const loadingProgress = ref(0)

const loadingSteps = ref({
  users: false,
  projects: false,
  boards: false,
  config: false
})

const roles = [
  {
    value: 'partner',
    label: 'Партнер',
    description: 'Створення проєктів, AI-аналіз, команда',
    icon: BuildingOfficeIcon
  },
  {
    value: 'student',
    label: 'Студент',
    description: 'Завдання, команда, портфоліо',
    icon: UserGroupIcon
  },
  {
    value: 'teacher',
    label: 'Викладач',
    description: 'Затвердження, менторство, оцінювання',
    icon: AcademicCapIcon
  },
  {
    value: 'admin',
    label: 'Адміністратор',
    description: 'Управління системою, налаштування',
    icon: Cog6ToothIcon
  }
]

const selectRole = (role: UserRole) => {
  selectedRole.value = role
}

const startApplication = async () => {
  if (!selectedRole.value) return
  
  isLoading.value = true
  showLoadingModal.value = true
  
  try {
    // Крок 1: Завантаження користувачів
    await loadUsers()
    loadingSteps.value.users = true
    loadingProgress.value = 25
    
    // Крок 2: Завантаження проєктів
    await loadProjects()
    loadingSteps.value.projects = true
    loadingProgress.value = 50
    
    // Крок 3: Завантаження дошок
    await loadBoards()
    loadingSteps.value.boards = true
    loadingProgress.value = 75
    
    // Крок 4: Налаштування середовища
    await setupEnvironment()
    loadingSteps.value.config = true
    loadingProgress.value = 100
    
    // Невелика затримка для показу завершення
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Перенаправлення на головну сторінку
    navigateToDashboard()
    
  } catch (error) {
    console.error('Помилка завантаження:', error)
    // Можна додати повідомлення про помилку
  } finally {
    isLoading.value = false
    // Автоматично закриваємо модалку після перенаправлення
  }
}

const loadUsers = async () => {
  // Імітація завантаження користувачів з LocalStorage
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Отримуємо дані з LocalStorage або використовуємо мокові
  const usersData = JSON.parse(localStorage.getItem('users') || 'null')
  
  if (!usersData) {
    // Якщо немає даних, ініціалізуємо мокові
    initializeMockUsers()
  }
}

const loadProjects = async () => {
  // Імітація завантаження проєктів
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  const projectsData = JSON.parse(localStorage.getItem('projects') || 'null')
  
  if (!projectsData) {
    initializeMockProjects()
  }
}

const loadBoards = async () => {
  // Імітація завантаження дошок
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const boardsData = JSON.parse(localStorage.getItem('boards') || 'null')
  
  if (!boardsData) {
    // Ініціалізуємо стандартні дошки
    kanbanStore.createNewBoard('Мій перший проєкт')
  }
}

const setupEnvironment = async () => {
  // Налаштування середовища на основі обраної ролі
  await new Promise(resolve => setTimeout(resolve, 400))
  
  let user
  
  switch (selectedRole.value) {
    case 'partner':
      user = mockPartners[0]
      break
    case 'student':
      user = mockStudents[0]
      break
    case 'teacher':
      user = mockTeachers[0]
      break
    case 'admin':
      user = {
        id: 'admin-1',
        name: 'admin-1',
        email: 'admin@thinkup.edu',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
      break
  }
  
  if (user) {
    authStore.login(user)
  }
}

const navigateToDashboard = () => {
  switch (selectedRole.value) {
    case 'partner':
      router.push('/projects')
      break
    case 'student':
      router.push('/student/dashboard')
      break
    case 'teacher':
      router.push('/teacher/dashboard')
      break
    case 'admin':
      router.push('/admin')
      break
    default:
      router.push('/')
  }
}

const initializeMockUsers = () => {
  // Зберігаємо мокові дані в LocalStorage
  localStorage.setItem('students', JSON.stringify(mockStudents))
  localStorage.setItem('teachers', JSON.stringify(mockTeachers))
  localStorage.setItem('partners', JSON.stringify(mockPartners))
}

const initializeMockProjects = () => {
  // Ініціалізуємо проєкти з моковими даними
  const now = new Date()
  
  const projectsWithIds = mockProjects.map((mockProject, index) => ({
    ...mockProject,
    id: `project-${index + 1}`,
    createdAt: new Date(now.getTime() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date().toISOString(),
  }))
  
  localStorage.setItem('projects', JSON.stringify(projectsWithIds))
}

// Перевіряємо, чи користувач вже ініціалізований
onMounted(() => {
  // Якщо користувач вже авторизований, перенаправляємо
  if (authStore.isAuthenticated) {
    const route = getRouteForRole(authStore.userRole!)
    router.push(route)
  }
})

const getRouteForRole = (role: UserRole): string => {
  switch (role) {
    case 'partner': return '/projects'
    case 'student': return '/student/dashboard'
    case 'teacher': return '/teacher/dashboard'
    case 'admin': return '/admin'
    default: return '/'
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>