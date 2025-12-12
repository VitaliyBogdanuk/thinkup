<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4">AI Рекомендації студентів</h3>
    
    <div v-if="recommendations.length === 0" class="text-gray-500 text-center py-8">
      Рекомендації ще не згенеровані
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(roleGroup, roleName) in groupedByRole"
        :key="roleName"
        class="border-b border-gray-200 pb-6 last:border-0"
      >
        <h4 class="text-lg font-semibold text-gray-800 mb-4">{{ roleName }}</h4>
        
        <div class="grid gap-4">
          <div
            v-for="rec in roleGroup"
            :key="rec.studentId"
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:border-savoy transition-colors gap-3"
          >
            <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
                <span class="text-savoy font-bold text-sm sm:text-base">
                  {{ rec.student.fullName.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 truncate">{{ rec.student.fullName }}</p>
                <p class="text-xs sm:text-sm text-gray-600">
                  {{ rec.student.course }} курс, {{ rec.student.specialty }}
                </p>
                <div class="flex flex-wrap gap-1 sm:gap-2 mt-1">
                  <span
                    v-for="skill in rec.student.skills.slice(0, 3)"
                    :key="skill.id"
                    class="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700"
                  >
                    {{ skill.name }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div class="text-left sm:text-right">
                <div class="text-xl sm:text-2xl font-bold text-savoy">{{ rec.matchPercentage }}%</div>
                <div class="text-xs text-gray-500">відповідність</div>
              </div>
              <button
                v-if="!isAssigned(rec.studentId)"
                @click="assignStudent(rec.studentId, roleName)"
                class="px-3 sm:px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                Додати
              </button>
              <button
                v-else
                @click="removeStudent(rec.studentId)"
                class="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedStudents.length > 0" class="mt-6 pt-6 border-t border-gray-200">
      <h4 class="font-semibold text-gray-800 mb-3">Обрана команда ({{ selectedStudents.length }})</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="studentId in selectedStudents"
          :key="studentId"
          class="px-3 py-1 bg-savoy/10 text-savoy rounded-full text-sm"
        >
          {{ getStudentName(studentId) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useProjectsStore } from "~~/stores/projects";

const props = defineProps<{
  projectId: string;
  recommendations: StudentRecommendation[];
}>();

const emit = defineEmits<{
  (e: "students-selected", studentIds: string[]): void;
}>();

const projectsStore = useProjectsStore();
const selectedStudents = ref<string[]>([]);

const groupedByRole = computed(() => {
  const grouped: Record<string, StudentRecommendation[]> = {};
  
  props.recommendations.forEach((rec) => {
    if (!grouped[rec.role]) {
      grouped[rec.role] = [];
    }
    grouped[rec.role].push(rec);
  });

  // Сортуємо за відсотком відповідності
  Object.keys(grouped).forEach((role) => {
    grouped[role].sort((a, b) => b.matchPercentage - a.matchPercentage);
  });

  return grouped;
});

const isAssigned = (studentId: string): boolean => {
  return selectedStudents.value.includes(studentId);
};

const assignStudent = (studentId: string, role: string) => {
  if (!isAssigned(studentId)) {
    selectedStudents.value.push(studentId);
    emit("students-selected", selectedStudents.value);
  }
};

const removeStudent = (studentId: string) => {
  const index = selectedStudents.value.indexOf(studentId);
  if (index > -1) {
    selectedStudents.value.splice(index, 1);
    emit("students-selected", selectedStudents.value);
  }
};

const getStudentName = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  return student?.fullName || "Невідомий";
};
</script>

