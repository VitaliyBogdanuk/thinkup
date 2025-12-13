<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 sm:p-4 md:p-10 bg-lightGray">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Мій профіль</h1>

    <div v-if="!currentStudent" class="text-center py-16 text-gray-500">
      <p>Студент не знайдено</p>
    </div>

    <div v-else class="space-y-4 sm:space-y-5 md:space-y-6">
      <!-- Профіль студента -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <span class="text-savoy text-xl sm:text-2xl md:text-3xl font-bold">
              {{ currentStudent.fullName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0 w-full">
            <h2 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-2 text-center sm:text-left break-words">{{ currentStudent.fullName }}</h2>
            <p class="text-gray-600 mb-1 text-xs sm:text-sm md:text-base text-center sm:text-left">{{ currentStudent.course }} курс, {{ currentStudent.specialty }}</p>
            <p class="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 break-all text-center sm:text-left">{{ currentStudent.email }}</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Рейтинг:</span>
                <span class="text-sm sm:text-base md:text-lg font-bold text-savoy">{{ currentStudent.rating.toFixed(1) }}/5.0</span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Доступність:</span>
                <span class="text-sm sm:text-base md:text-lg font-semibold text-gray-800">{{ currentStudent.availability }} год/тиждень</span>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Статус:</span>
                <span :class="getStatusClass(currentStudent.status)" class="px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
                  {{ getStudentStatusText(currentStudent.status) }}
                </span>
              </div>
              <!-- Лічильник непрочитаних сповіщень -->
              <div v-if="unreadCount > 0" class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-500">Нові сповіщення:</span>
                <span class="px-2 py-0.5 sm:py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {{ unreadCount }}
                </span>
              </div>
            </div>
            
            <!-- Портфоліо посилання -->
            <div v-if="currentStudent.portfolio" class="mt-4 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
              <a 
                v-if="currentStudent.portfolio.github"
                :href="currentStudent.portfolio.github"
                target="_blank"
                class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-savoy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <span>📁</span>
                <span>GitHub</span>
              </a>
              <a 
                v-if="currentStudent.portfolio.behance"
                :href="currentStudent.portfolio.behance"
                target="_blank"
                class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-savoy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <span>🎨</span>
                <span>Behance</span>
              </a>
              <a 
                v-if="currentStudent.portfolio.website"
                :href="currentStudent.portfolio.website"
                target="_blank"
                class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-savoy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <span>🌐</span>
                <span>Website</span>
              </a>
            </div>
            
            <!-- Статистика проєктів -->
            <div class="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 items-center text-center lg:text-left">
                    <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">✅</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Завершених проєктів</p>
                      <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1.5 sm:mt-2 text-center lg:text-left">З {{ myProjects.length }} загальних проєктів</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 items-center text-center lg:text-left">
                    <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">🤝</span>
                    <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                      <p class="text-xs text-gray-500">Партнерів</p>
                      <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ partnersWorkedWith.length }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1.5 sm:mt-2 text-center lg:text-left">З якими працював</p>
                </div>
              </div>
              
              <!-- Список партнерів -->
              <div v-if="partnersWorkedWith.length > 0" class="mt-3 sm:mt-4">
                <p class="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Партнери:</p>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="partner in partnersWorkedWith"
                    :key="partner.id"
                    class="px-2 sm:px-3 py-1 sm:py-1.5 bg-savoy/10 text-savoy rounded-lg text-xs sm:text-sm font-medium border border-savoy/20 break-words"
                  >
                    {{ partner.companyName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Навички -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Навички</h3>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
          <div
            v-for="skill in currentStudent.skills"
            :key="skill.id"
            class="p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div class="flex flex-col gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <span class="font-semibold text-sm sm:text-base text-gray-800 break-words">{{ skill.name }}</span>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <span
                  :class="getSkillLevelClass(skill.level)"
                  class="px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                >
                  {{ getSkillLevelText(skill.level) }}
                </span>
                <span v-if="skill.verified" class="text-green-500 text-sm sm:text-base flex-shrink-0" title="Перевірена навичка">
                  ✓
                </span>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <p class="text-xs text-gray-500 capitalize">{{ getSkillCategoryText(skill.category) }}</p>
              <div v-if="skill.verified" class="text-xs text-green-600 font-medium whitespace-nowrap">
                Перевірено
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Рекомендовані проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">Рекомендовані проєкти</h3>
          <span v-if="recommendedProjects.length > 0" class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            {{ recommendedProjects.length }} проєктів
          </span>
        </div>
        
        <div v-if="recommendedProjects.length === 0" class="text-center py-5 sm:py-6 md:py-8 text-gray-500 px-4">
          <p class="text-sm sm:text-base">Наразі немає рекомендованих проєктів</p>
          <p class="text-xs sm:text-sm mt-2">Оновіть свої навички або зачекайте на нові проєкти</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div
            v-for="project in recommendedProjects"
            :key="project.id"
            class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <h4 class="font-bold text-sm sm:text-base text-gray-800 break-words flex-1 pr-2">{{ project.name }}</h4>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded whitespace-nowrap flex-shrink-0">
                {{ getMatchPercentage(project) }}% відповідність
              </span>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">{{ project.description }}</p>
            
            <!-- Рекомендована роль -->
            <div v-if="project.recommendations" class="mb-2 sm:mb-3">
              <p class="text-xs text-gray-500">Рекомендована роль:</p>
              <p class="text-xs sm:text-sm font-medium text-savoy break-words">
                {{ getRecommendedRole(project) }}
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500 mb-2 sm:mb-3">
              <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span class="px-2 py-0.5 sm:py-1 bg-gray-100 rounded whitespace-nowrap">{{ project.category }}</span>
                <span class="whitespace-nowrap">{{ getComplexityText(project.complexity) }}</span>
              </div>
              <span v-if="project.deadline" class="text-gray-600 whitespace-nowrap">
                Дедлайн: {{ formatDate(project.deadline) }}
              </span>
            </div>
            
            <div class="flex flex-col lg:flex-row gap-2">
              <button
                class="flex-1 lg:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs sm:text-sm font-medium"
                @click="handleApply(project.id)"
              >
                Подати заявку
              </button>
              <button
                class="flex-1 lg:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium"
                @click="navigateToProjectDetails(project.id)"
              >
                Детальніше
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Мої проєкти -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">Мої проєкти</h3>
          <span v-if="myProjects.length > 0" class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            {{ myProjects.length }} проєктів
          </span>
        </div>
        
        <div v-if="myProjects.length === 0" class="text-center py-5 sm:py-6 md:py-8 text-gray-500 px-4">
          <p class="text-sm sm:text-base">Ви ще не приймаєте участі в проєктах</p>
          <p class="text-xs sm:text-sm mt-2">Подайте заявку на рекомендовані проєкти або чекайте на запрошення</p>
        </div>

        <div v-else class="space-y-3 sm:space-y-4">
          <div
            v-for="project in myProjects"
            :key="project.id"
            class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all cursor-pointer"
            @click="navigateToProject(project.id)"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5 sm:mb-2">
                  <h4 class="font-bold text-sm sm:text-base text-gray-800 break-words pr-2">{{ project.name }}</h4>
                  <span
                    :class="getProjectStatusClass(project.status)"
                    class="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0"
                  >
                    {{ getProjectStatusText(project.status) }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">{{ project.description }}</p>
                
                <!-- Інформація про проєкт -->
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1">
                    <span>👥</span>
                    <span>{{ project.team.length }} учасників</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>🏷️</span>
                    <span>{{ project.category }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>⚡</span>
                    <span>{{ getComplexityText(project.complexity) }}</span>
                  </div>
                  <div v-if="project.deadline" class="flex items-center gap-1">
                    <span>📅</span>
                    <span>{{ formatDate(project.deadline) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Прогрес (якщо є борд) -->
              <div v-if="project.boardId" class="sm:ml-4 text-left sm:text-right flex-shrink-0 mt-2 sm:mt-0">
                <p class="text-xs text-gray-500 mb-1">Прогрес</p>
                <div class="w-full sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-savoy transition-all duration-300"
                    :style="{ width: getProjectProgress(project.id) + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ getProjectProgress(project.id) }}%</p>
              </div>
            </div>
            
            <!-- Ваша роль у проєкті -->
            <div v-if="getMyRoleInProject(project)" class="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
              <p class="text-xs text-gray-500">Ваша роль:</p>
              <p class="text-xs sm:text-sm font-medium text-gray-800 break-words">{{ getMyRoleInProject(project) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import type { 
  Student, 
  Project, 
  Skill, 
  Partner,
  ProjectCategory,
  ComplexityLevel,
  StudentRecommendation
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();


// Комп'ютед властивості
const currentStudent = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "student") {
    return null;
  }
  return authStore.currentUser as Student;
});

// Проєкти, де студент є в команді
const myProjects = computed(() => {
  if (!currentStudent.value) return [];
  return projectsStore.projects.filter((p: Project) => p.team.includes(currentStudent.value!.id));
});

// Завершені проєкти
const completedProjects = computed(() => {
  if (!currentStudent.value) return [];
  return myProjects.value.filter((p: Project) => p.status === 'completed');
});

// Партнери, проєкти яких виконував студент (тільки з завершених проєктів)
const partnersWorkedWith = computed(() => {
  if (!currentStudent.value) return [];
  
  const partnerIds = new Set<string>();
  
  // Збираємо унікальні ID партнерів тільки з завершених проєктів, де студент брав участь
  completedProjects.value.forEach((project: Project) => {
    if (project.partnerId) {
      partnerIds.add(project.partnerId);
    }
  });
  
  // Отримуємо об'єкти партнерів
  return Array.from(partnerIds)
    .map(partnerId => projectsStore.partners.find(p => p.id === partnerId))
    .filter((p): p is Partner => p !== undefined);
});

// Рекомендовані проєкти на основі навичок
const recommendedProjects = computed(() => {
  if (!currentStudent.value) return [];

  return projectsStore.projects
    .filter((p: Project) => {
      // Показуємо тільки проєкти, де є рекомендації та студент ще не в команді
      return (
        p.status === 'pending_approval' &&
        p.recommendations &&
        !p.team.includes(currentStudent.value!.id)
      );
    })
    .map((project: Project) => {
      const recommendation = project.recommendations?.find(
        (r: StudentRecommendation) => r.studentId === currentStudent.value!.id
      );
      return {
        ...project,
        matchPercentage: recommendation?.matchPercentage || 0,
      };
    })
    .filter((p: any) => p.matchPercentage > 0)
    .sort((a: any, b: any) => b.matchPercentage - a.matchPercentage)
    .slice(0, 6);
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Функції для навичок
const getSkillLevelText = (level: Skill["level"]): string => {
  const map: Record<Skill["level"], string> = {
    junior: "Початківець",
    middle: "Середній",
    senior: "Просунутий",
  };
  return map[level];
};

const getSkillLevelClass = (level: Skill["level"]): string => {
  const map: Record<Skill["level"], string> = {
    junior: "bg-blue-100 text-blue-700",
    middle: "bg-yellow-100 text-yellow-700",
    senior: "bg-green-100 text-green-700",
  };
  return map[level];
};

const getSkillCategoryText = (category: Skill["category"]): string => {
  const map: Record<Skill["category"], string> = {
    backend: "Backend",
    frontend: "Frontend",
    design: "Дизайн",
    analytics: "Аналітика",
    mobile: "Мобільна розробка",
    devops: "DevOps",
    other: "Інше",
  };
  return map[category];
};

// Функції для проєктів
const getMatchPercentage = (project: any): number => {
  return project.matchPercentage || 0;
};

const getRecommendedRole = (project: Project): string => {
  if (!project.recommendations || !currentStudent.value) return '';
  const recommendation = project.recommendations.find(
    (r: StudentRecommendation) => r.studentId === currentStudent.value!.id
  );
  return recommendation?.role || '';
};

const getProjectStatusText = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "Чернетка",
    pending_ai: "AI аналіз",
    pending_approval: "Очікує затвердження",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
  };
  return map[status];
};

const getProjectStatusClass = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    pending_ai: "bg-blue-100 text-blue-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status];
};

const getStudentStatusText = (status: Student["status"]): string => {
  const map: Record<Student["status"], string> = {
    available: "Доступний",
    busy: "Зайнятий",
    unavailable: "Недоступний",
  };
  return map[status];
};

const getStatusClass = (status: Student["status"]): string => {
  const map: Record<Student["status"], string> = {
    available: "bg-green-100 text-green-700",
    busy: "bg-yellow-100 text-yellow-700",
    unavailable: "bg-red-100 text-red-700",
  };
  return map[status];
};

const getComplexityText = (complexity: ComplexityLevel): string => {
  const map: Record<ComplexityLevel, string> = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

const getProjectProgress = (projectId: string): number => {
  // Спрощена логіка розрахунку прогресу
  // У реальному додатку це має бути на основі статусу завдань
  const project = projectsStore.getProjectById(projectId);
  if (!project) return 0;
  
  // Проста симуляція прогресу
  const statusProgress: Record<Project["status"], number> = {
    draft: 0,
    pending_ai: 10,
    pending_approval: 20,
    active: Math.floor(Math.random() * 60) + 30, // 30-90%
    completed: 100,
    cancelled: 0,
  };
  
  return statusProgress[project.status];
};

const getMyRoleInProject = (project: Project): string => {
  if (!currentStudent.value) return '';
  
  // Шукаємо роль студента в проєкті
  for (const role of project.roles) {
    if (role.assigned.includes(currentStudent.value.id)) {
      return role.name;
    }
  }
  
  return 'Учасник';
};

const navigateToProject = (projectId?: string) => {
  if (!projectId) return;
  router.push(`/projects/${projectId}`);
};

// Навігація на опис проєкту (не на дошку)
const navigateToProjectDetails = (projectId?: string) => {
  if (!projectId) return;
  router.push(`/projects/${projectId}`);
};

const handleApply = (projectId?: string) => {
  if (!projectId) return;
  
  // Симуляція подачі заявки
  const project = projectsStore.getProjectById(projectId);
  alert(`Заявку на проєкт "${project?.name || 'проєкт'}" подано! Викладач розгляне вашу кандидатуру.`);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>