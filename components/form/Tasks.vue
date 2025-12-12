<template>
  <transition name="fade">
    <div v-if="isFormOpenState" class="popup-modal">
      <div
        class="w-96 lg:w-1/3 h-4/5 flex flex-col p-8 bg-white rounded-xl gap-10 relative m-10 shadow-lg border border-gray-200"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-gray-200 hover:bg-gray-300 p-3 transition-colors"
          @click="toggleFormModal(false)"
        >
          <XMarkIcon class="w-5 h-5 text-gray-800" />
        </button>

        <h2 class="text-gray-800">{{ !!taskToEditState ? "Редагувати" : "Додати" }} завдання</h2>

        <div class="w-full h-full space-y-10 pr-8 flex flex-col">
          <div class="flex flex-col space-y-2">
            <label for="task_name" class="text-gray-800">Назва</label>
            <input
              v-model.trim="taskName"
              type="text"
              name="task_name"
              placeholder="напр. Вивчення Nuxt.js"
            />
          </div>

          <div class="flex flex-col space-y-2 h-full overflow-hidden">
            <label for="task_description" class="text-gray-800">Опис</label>
            <textarea
              v-model.trim="taskDescription"
              type="text"
              name="task_description"
              placeholder="напр. Вивчити як генерувати серверно-рендерені сторінки"
              class="h-full"
            />
          </div>

          <div class="space-y-2">
            <p class="text-gray-800">Поточний статус</p>
            <select name="status" v-model="taskColumnId">
              <option
                v-for="column in boardColumns"
                :key="column.id"
                :value="column.id"
              >
                {{ column.name }}
              </option>
            </select>
          </div>

          <div v-if="isProjectBoard" class="space-y-2">
            <p class="text-gray-800">Призначити студента</p>
            <select name="assigned_student" v-model="assignedStudentId">
              <option value="">Не призначено</option>
              <option
                v-for="student in availableStudents"
                :key="student.id"
                :value="student.id"
              >
                {{ student.fullName }}
              </option>
            </select>
          </div>

          <div v-if="isProjectBoard" class="space-y-2">
            <p class="text-gray-800">Пріоритет</p>
            <select name="priority" v-model="taskPriority">
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </div>

          <div v-if="isProjectBoard" class="space-y-2">
            <label for="estimated_hours" class="text-gray-800">Оцінка часу (години)</label>
            <input
              id="estimated_hours"
              v-model.number="estimatedHours"
              type="number"
              min="0"
              placeholder="напр. 8"
              class="w-full"
            />
          </div>
        </div>
        <BaseButton
          :label="buttonLabel"
          @action="taskToEditState ? editTaskInfos() : createNewTask()"
          class="bg-savoy text-white"
        />
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { computed, watch } from "vue";
import { useKanbanStore } from "~~/stores";
import { useProjectsStore } from "~~/stores/projects";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  boardId?: string;
  isProjectBoard?: boolean;
  projectId?: string;
}>();

const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const toggleFormModal = (isOpen: boolean): void => {
  isFormOpenState.value = isOpen;
  taskToEditState.value = null;
};

//Route
const route = useRoute();
const boardId = computed(() => props.boardId || route.params.board?.toString() || "");

//Store
const store = useKanbanStore();
const projectsStore = useProjectsStore();
const { addTaskToColumn, getBoardColumns, editTask } = store;

//Refs
const taskColumnId = ref<string>("");
const taskName = ref<string>("");
const taskDescription = ref<string>("");
const assignedStudentId = ref<string>("");
const taskPriority = ref<"low" | "medium" | "high">("medium");
const estimatedHours = ref<number | undefined>(undefined);

const isProjectBoard = computed(() => props.isProjectBoard || false);

// Колонки дошки
const boardColumns = computed(() => {
  const columns = getBoardColumns(boardId.value);
  return columns || [];
});

// Ініціалізуємо taskColumnId при зміні колонок
watch(boardColumns, (columns) => {
  if (columns.length > 0 && !taskColumnId.value) {
    taskColumnId.value = columns[0].id;
  }
}, { immediate: true });

// Доступні студенти для призначення (з команди проєкту або всі доступні)
const availableStudents = computed(() => {
  if (!props.projectId) {
    // Якщо немає projectId, показуємо всіх доступних студентів
    return projectsStore.getAvailableStudents;
  }
  
  const project = projectsStore.getProjectById(props.projectId);
  if (!project) {
    // Якщо проєкт не знайдено, показуємо всіх доступних студентів
    return projectsStore.getAvailableStudents;
  }
  
  // Якщо команда проєкту не порожня, показуємо тільки студентів з команди
  if (project.team && project.team.length > 0) {
    return project.team
      .map((studentId) => projectsStore.getStudentById(studentId))
      .filter((s): s is Student => s !== undefined);
  }
  
  // Якщо команда порожня, показуємо всіх доступних студентів
  return projectsStore.getAvailableStudents;
});

//Methods
const createNewTask = (): void => {
  const newTask: Omit<Task, "id"> = {
    name: taskName.value,
    description: taskDescription.value,
  };

  if (isProjectBoard.value) {
    newTask.assignedTo = assignedStudentId.value || undefined;
    newTask.priority = taskPriority.value;
    newTask.estimatedHours = estimatedHours.value;
  }

  if (useValidator(taskDescription.value, taskName.value)) {
    addTaskToColumn(boardId.value, taskColumnId.value, newTask);
    
    // Якщо це проєктна дошка, призначаємо задачу студенту
    if (isProjectBoard.value && assignedStudentId.value && props.projectId) {
      // Отримуємо ID щойно створеної задачі (остання в колонці)
      const column = boardColumns.value.find((c) => c.id === taskColumnId.value);
      if (column && column.tasks.length > 0) {
        const lastTask = column.tasks[column.tasks.length - 1];
        projectsStore.assignTaskToStudent(props.projectId, lastTask.id, assignedStudentId.value);
      }
    }
    
    resetValues();
    toggleFormModal(false);
  }
};

const editTaskInfos = (): void => {
  const editedTask: Task = {
    id: taskToEditState.value!.id,
    name: taskName.value,
    description: taskDescription.value,
  };

  if (isProjectBoard.value) {
    editedTask.assignedTo = assignedStudentId.value || undefined;
    editedTask.priority = taskPriority.value;
    editedTask.estimatedHours = estimatedHours.value;

    // Оновлюємо призначення
    if (assignedStudentId.value && props.projectId) {
      projectsStore.assignTaskToStudent(props.projectId, editedTask.id, assignedStudentId.value);
    }
  }

  if (useValidator(taskDescription.value, taskName.value)) {
    editTask(
      boardId.value,
      taskToEditState.value!.columnParentId,
      taskColumnId.value,
      editedTask
    );
    resetValues();
    toggleFormModal(false);
  }
};

const resetValues = (): void => {
  if (boardColumns.value.length > 0) {
    taskColumnId.value = boardColumns.value[0].id;
  }
  taskName.value = "";
  taskDescription.value = "";
  assignedStudentId.value = "";
  taskPriority.value = "medium";
  estimatedHours.value = undefined;
};

const buttonLabel = computed(() => {
  return taskToEditState.value ? "Зберегти зміни" : "Додати завдання";
});

// Watch для відкриття форми та заповнення полів при редагуванні
watch(isFormOpenState, () => {
  if (isFormOpenState.value) {
    if (taskToEditState.value !== null) {
      // Редагування існуючої задачі
      taskName.value = taskToEditState.value.name;
      taskDescription.value = taskToEditState.value.description;
      taskColumnId.value = taskToEditState.value.columnParentId;
      
      if (isProjectBoard.value) {
        assignedStudentId.value = taskToEditState.value.assignedTo || "";
        taskPriority.value = taskToEditState.value.priority || "medium";
        estimatedHours.value = taskToEditState.value.estimatedHours;
      }
    } else {
      // Створення нової задачі
      resetValues();
    }
  }
});

// Додатковий watch для taskToEditState на випадок, якщо він змінюється після відкриття форми
watch(taskToEditState, (newTask) => {
  if (newTask && isFormOpenState.value) {
    taskName.value = newTask.name;
    taskDescription.value = newTask.description;
    taskColumnId.value = newTask.columnParentId;
    
    if (isProjectBoard.value) {
      assignedStudentId.value = newTask.assignedTo || "";
      taskPriority.value = newTask.priority || "medium";
      estimatedHours.value = newTask.estimatedHours;
    }
  }
});
</script>
