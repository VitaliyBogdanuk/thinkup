<template>
  <div
    class="w-full p-4 rounded-xl bg-white shadow-sm border border-gray-200 cursor-pointer hover:border-savoy transition-colors"
    :class="priorityClass"
  >
    <div class="flex items-start justify-between gap-2 mb-2">
      <span class="font-medium select-none break-all text-gray-800 flex-1">{{
        task.name
      }}</span>
      <span
        v-if="task.priority"
        :class="getPriorityClass(task.priority)"
        class="px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
      >
        {{ getPriorityText(task.priority) }}
      </span>
    </div>
    
    <p v-if="task.description" class="text-sm text-gray-600 mb-2 line-clamp-2">
      {{ task.description }}
    </p>

    <div v-if="isProjectBoard" class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
      <div v-if="task.assignedTo" class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-savoy/20 flex items-center justify-center">
          <span class="text-savoy text-xs font-bold">
            {{ getStudentInitial(task.assignedTo) }}
          </span>
        </div>
        <span class="text-xs text-gray-600">{{ getStudentName(task.assignedTo) }}</span>
      </div>
      <div v-else class="text-xs text-gray-400">Не призначено</div>
      
      <div v-if="task.estimatedHours" class="text-xs text-gray-500">
        {{ task.estimatedHours }} год
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useProjectsStore } from "~~/stores/projects";

const props = defineProps<{
  task: Task;
  isProjectBoard?: boolean;
}>();

const projectsStore = useProjectsStore();

const task = computed(() => props.task);
const isProjectBoard = computed(() => props.isProjectBoard || false);

const priorityClass = computed(() => {
  if (!task.value.priority) return "";
  const map = {
    low: "border-l-4 border-l-green-500",
    medium: "border-l-4 border-l-yellow-500",
    high: "border-l-4 border-l-red-500",
  };
  return map[task.value.priority];
});

const getPriorityText = (priority: Task["priority"]): string => {
  const map = {
    low: "Низький",
    medium: "Середній",
    high: "Високий",
  };
  return map[priority] || "";
};

const getPriorityClass = (priority: Task["priority"]): string => {
  const map = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return map[priority] || "";
};

const getStudentName = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  return student?.fullName || "Невідомий";
};

const getStudentInitial = (studentId: string): string => {
  const student = projectsStore.getStudentById(studentId);
  return student?.fullName.charAt(0).toUpperCase() || "?";
};
</script>

