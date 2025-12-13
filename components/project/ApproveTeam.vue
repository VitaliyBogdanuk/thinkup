<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4">Затвердження команди проєкту</h3>

    <div v-if="!project" class="text-gray-500 text-center py-8">
      Проєкт не знайдено
    </div>

    <div v-else class="space-y-6">
      <!-- Інформація про проєкт -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-2">{{ project.name }}</h4>
        <p class="text-sm text-gray-600">{{ project.description }}</p>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm">
          <span class="text-gray-600">Категорія: <span class="font-semibold">{{ project.category }}</span></span>
          <span class="text-gray-600">Складність: <span class="font-semibold">{{ getComplexityText(project.complexity) }}</span></span>
        </div>
        
        <!-- Ролі проєкту -->
        <div v-if="project.roles && project.roles.length > 0" class="mt-4 pt-4 border-t border-gray-200">
          <h5 class="font-semibold text-gray-800 mb-3">Потрібні ролі на проєкті:</h5>
          <div class="space-y-2">
            <div
              v-for="role in project.roles"
              :key="role.id"
              class="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
            >
              <span class="text-sm font-medium text-gray-800">{{ role.name }}</span>
              <span class="text-xs text-gray-600">
                Потрібно: <span class="font-semibold">{{ role.required }}</span>
                <span v-if="role.assigned.length > 0" class="ml-2">
                  | Призначено: <span class="font-semibold">{{ role.assigned.length }}</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Аналіз -->
      <div v-if="project.aiAnalysis" class="bg-blue-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-2">AI Аналіз проєкту</h4>
        <div class="space-y-2 text-sm">
          <div>
            <span class="font-semibold">Цілі:</span>
            <ul class="list-disc list-inside ml-2">
              <li v-for="goal in project.aiAnalysis.goals" :key="goal">{{ goal }}</li>
            </ul>
          </div>
          <div>
            <span class="font-semibold">Етапи:</span>
            <ul class="list-disc list-inside ml-2">
              <li v-for="stage in project.aiAnalysis.stages" :key="stage">{{ stage }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Рекомендації студентів -->
      <StudentRecommendations
        v-if="project.recommendations"
        :project-id="project.id"
        :recommendations="project.recommendations"
        @students-selected="handleStudentsSelected"
      />

      <!-- Обрана команда -->
      <div v-if="selectedStudents.length > 0" class="border-t border-gray-200 pt-6">
        <h4 class="font-semibold text-gray-800 mb-4">Фінальна команда</h4>
        <div class="space-y-3">
          <div
            v-for="studentId in selectedStudents"
            :key="studentId"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-savoy/20 flex items-center justify-center">
                <span class="text-savoy font-bold">
                  {{ getStudentInitial(studentId) }}
                </span>
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ getStudentName(studentId) }}</p>
                <p class="text-sm text-gray-600">{{ getStudentInfo(studentId) }}</p>
              </div>
            </div>
            <button
              @click="removeStudent(studentId)"
              class="text-red-500 hover:text-red-700"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Дії -->
      <div class="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          @click="$emit('cancel')"
          class="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Скасувати
        </button>
        <button
          @click="handleApprove"
          :disabled="selectedStudents.length === 0"
          class="w-full sm:w-auto px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Затвердити команду
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import StudentRecommendations from "./StudentRecommendations.vue";

const props = defineProps<{
  projectId: string;
}>();

const emit = defineEmits<{
  (e: "approved"): void;
  (e: "cancel"): void;
  (e: "team-updated", count: number): void;
}>();

const projectsStore = useProjectsStore();
const authStore = useAuthStore();
const selectedStudents = ref<string[]>([]);

const project = computed(() => projectsStore.getProjectById(props.projectId));

const getComplexityText = (complexity: ComplexityLevel): string => {
  const map = {
    low: "Низький",
    medium: "Середній",
    high: "Високий",
  };
  return map[complexity];
};

const handleStudentsSelected = (studentIds: string[]) => {
  selectedStudents.value = studentIds;
  emit("team-updated", studentIds.length);
};

const removeStudent = (studentId: string) => {
  const index = selectedStudents.value.indexOf(studentId);
  if (index > -1) {
    selectedStudents.value.splice(index, 1);
    emit("team-updated", selectedStudents.value.length);
  }
};

const getStudentName = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  return student?.fullName || "Невідомий";
};

const getStudentInfo = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  if (!student) return "";
  return `${student.course} курс, ${student.specialty}`;
};

const getStudentInitial = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  return student?.fullName.charAt(0).toUpperCase() || "?";
};

const handleApprove = () => {
  if (!authStore.currentUser || authStore.currentUser.role !== "teacher") {
    return;
  }

  projectsStore.approveTeam(
    props.projectId,
    selectedStudents.value,
    authStore.currentUser.id
  );

  emit("approved");
};
</script>

