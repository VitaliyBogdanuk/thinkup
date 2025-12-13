<template>
  <section class="w-full h-full overflow-y-auto flex-1">
    <HeaderComponent class="hidden md:block" />
    
    <div v-if="!project" class="p-10 text-center text-gray-500">
      Проєкт не знайдено
    </div>

    <div v-else class="p-3 md:p-5 bg-lightGray">
      <!-- Інформація про проєкт -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <div class="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-lg md:text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{{ project.name }}</h1>
            <p class="text-sm md:text-base text-gray-600 line-clamp-3">{{ project.description }}</p>
          </div>
          <div class="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
            <button
              v-if="(authStore.isAdmin || authStore.isTeacher) && project"
              @click="showEditModal = true"
              class="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
              title="Редагувати проєкт"
            >
              <PencilIcon class="w-4 h-4" />
              <span>Редагувати</span>
            </button>
            <a
              v-if="project.technicalSpecification"
              href="#technical-spec"
              class="px-3 py-1.5 md:px-4 md:py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
            >
              <span>📄</span>
              <span>Перейти до ТЗ</span>
            </a>
            <span
              :class="getStatusClass(project.status)"
              class="px-3 py-1 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0"
            >
              {{ getStatusText(project.status) }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <p class="text-xs md:text-sm text-gray-500">Категорія</p>
            <p class="font-semibold text-gray-800 text-sm md:text-base">{{ project.category }}</p>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-500">Складність</p>
            <p class="font-semibold text-gray-800 text-sm md:text-base">{{ getComplexityText(project.complexity) }}</p>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-500">Команда</p>
            <p class="font-semibold text-gray-800 text-sm md:text-base">
              {{ authStore.isTeacher && project.status === 'pending_approval' && teamCount > 0 ? teamCount : project.team.length }} студентів
            </p>
          </div>
        </div>

        <!-- Потрібні ролі на проєкті -->
        <div v-if="project.roles && project.roles.length > 0" class="mt-4 pt-4 border-t border-gray-200">
          <h3 class="text-sm md:text-base font-bold text-gray-800 mb-3">Потрібні ролі на проєкті:</h3>
          <div class="space-y-2">
            <div
              v-for="role in project.roles"
              :key="role.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span class="text-sm md:text-base text-gray-800 font-medium">{{ role.name }}</span>
              <span class="text-sm md:text-base text-gray-600">Потрібно: {{ role.required }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Рекомендації (для викладачів) -->
      <div v-if="authStore.isTeacher && project.status === 'pending_approval'" class="mb-4 md:mb-6">
        <ApproveTeam
          :project-id="project.id"
          @approved="handleTeamApproved"
          @cancel="$router.push('/projects')"
          @team-updated="handleTeamUpdated"
        />
      </div>

      <!-- Команда проєкту для партнерів (тільки для активних проєктів) -->
      <div v-if="authStore.isPartner && (project.status === 'active' || project.status === 'completed')" class="mb-4 md:mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Команда проєкту</h3>
          <div v-if="project.team && project.team.length > 0" class="space-y-3">
            <div
              v-for="studentId in project.team"
              :key="studentId"
              class="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-200 rounded-lg"
            >
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
                <span class="text-savoy font-bold text-sm md:text-base">
                  {{ getStudentInitial(studentId) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800">{{ getStudentName(studentId) }}</p>
                <p class="text-xs md:text-sm text-gray-600">{{ getStudentInfo(studentId) }}</p>
                <p class="text-xs md:text-sm text-gray-500 mt-1">{{ getStudentRole(studentId) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            Команда ще не сформована
          </div>
        </div>
      </div>

      <!-- Канбан-дошка -->
      <div v-if="project && project.boardId" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 class="text-lg md:text-xl font-bold text-gray-800">Канбан-дошка проєкту</h2>
          <button
            @click="openTaskForm"
            type="button"
            class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm md:text-base font-semibold flex items-center gap-2 justify-center"
          >
            <span>+</span>
            <span>ДОДАТИ ЗАВДАННЯ</span>
          </button>
        </div>
        <FormTasks :board-id="project.boardId" :is-project-board="true" :project-id="project.id" />
        <Columns :board-id="project.boardId" :is-project-board="true" />
      </div>
      <div v-else-if="project" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <p class="text-gray-500 text-center py-8">Канбан-дошка ще не створена. Будь ласка, зачекайте...</p>
      </div>

      <!-- Технічне завдання -->
      <div v-if="project.technicalSpecification" id="technical-spec" class="mb-4 md:mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 scroll-mt-4">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">Технічне завдання (ТЗ)</h3>
        <div class="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
          <pre class="whitespace-pre-wrap text-sm md:text-base text-gray-700 font-sans overflow-x-auto">{{ project.technicalSpecification }}</pre>
        </div>
      </div>

      <!-- AI Аналіз проєкту -->
      <div v-if="project.aiAnalysis" class="mb-4 md:mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4">AI Аналіз проєкту</h3>
        <div class="space-y-3 md:space-y-4">
          <div>
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Основні цілі:</h4>
            <ul class="list-disc list-inside space-y-1 text-sm md:text-base text-gray-600">
              <li v-for="goal in project.aiAnalysis.goals" :key="goal">{{ goal }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Етапи реалізації:</h4>
            <ul class="list-disc list-inside space-y-1 text-sm md:text-base text-gray-600">
              <li v-for="stage in project.aiAnalysis.stages" :key="stage">{{ stage }}</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Технічні вимоги:</h4>
            <ul class="list-disc list-inside space-y-1 text-sm md:text-base text-gray-600">
              <li v-for="req in project.aiAnalysis.technicalRequirements" :key="req">{{ req }}</li>
            </ul>
          </div>
          <div v-if="project.aiAnalysis.estimatedDuration">
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Оцінка тривалості:</h4>
            <p class="text-sm md:text-base text-gray-600">{{ project.aiAnalysis.estimatedDuration }} годин</p>
          </div>
          <div v-if="project.aiAnalysis.riskFactors && project.aiAnalysis.riskFactors.length > 0">
            <h4 class="font-semibold text-gray-800 mb-2 text-sm md:text-base">Фактори ризику:</h4>
            <ul class="list-disc list-inside space-y-1 text-sm md:text-base text-gray-600">
              <li v-for="risk in project.aiAnalysis.riskFactors" :key="risk">{{ risk }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальне вікно редагування проєкту -->
    <EditProject
      v-if="project"
      :is-open="showEditModal"
      :project-id="project.id"
      @close="showEditModal = false"
      @updated="handleProjectUpdated"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PencilIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import HeaderComponent from "~~/components/HeaderComponent.vue";
import Columns from "~~/components/Columns.vue";
import FormTasks from "~~/components/form/Tasks.vue";
import ApproveTeam from "~~/components/project/ApproveTeam.vue";
import StudentRecommendations from "~~/components/project/StudentRecommendations.vue";
import EditProject from "~~/components/project/EditProject.vue";

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();

const projectId = route.params.id as string;
const project = computed(() => projectsStore.getProjectById(projectId));

// Локальний стан для лічильника команди (для оновлення в реальному часі)
const teamCount = ref(0);

// Модальне вікно редагування проєкту
const showEditModal = ref(false);

// Ініціалізуємо teamCount при завантаженні проєкту
watch(project, (newProject) => {
  if (newProject) {
    teamCount.value = newProject.team.length;
  }
}, { immediate: true });

// Форма додавання завдання
const isTaskFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const openTaskForm = () => {
  taskToEditState.value = null;
  isTaskFormOpenState.value = true;
};

const getStatusText = (status: Project["status"]): string => {
  const map = {
    draft: "Чернетка",
    pending_ai: "AI аналіз",
    pending_approval: "Очікує затвердження",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
  };
  return map[status];
};

const getStatusClass = (status: Project["status"]): string => {
  const map = {
    draft: "bg-gray-100 text-gray-700",
    pending_ai: "bg-blue-100 text-blue-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status];
};

const getComplexityText = (complexity: ComplexityLevel): string => {
  const map = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

const handleTeamApproved = () => {
  router.push("/projects");
};

const handleTeamUpdated = (count: number) => {
  teamCount.value = count;
};

// Функції для отримання інформації про студентів (для партнерів)
const getStudentName = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  return student?.fullName || "Невідомий студент";
};

const getStudentInitial = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  return student?.fullName?.charAt(0).toUpperCase() || "?";
};

const getStudentInfo = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  if (!student) return "";
  return `${student.course} курс, ${student.specialty}`;
};

const getStudentRole = (studentId: string): string => {
  if (!project.value) return "";
  const role = project.value.roles.find(r => r.assigned.includes(studentId));
  return role ? role.name : "Учасник";
};

const handleProjectUpdated = (updatedProjectId: string) => {
  showEditModal.value = false;
  // Проєкт оновлюється автоматично через реактивність store
};
</script>

