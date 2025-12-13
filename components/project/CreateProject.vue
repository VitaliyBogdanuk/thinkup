<template>
  <transition name="fade">
    <div v-if="isOpen" class="popup-modal">
      <div
        class="w-full sm:w-fit h-fit max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6 md:p-8 bg-white rounded-xl gap-6 md:gap-10 relative m-4 sm:m-10 shadow-lg border border-gray-200 overflow-y-auto scrollbar-hide"
      >
        <button
          class="absolute top-4 right-4 rounded-full bg-white hover:bg-gray-100 text-gray-800 p-2 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-30 border-2 border-gray-200 hover:scale-110 active:scale-95"
          @click="closeModal"
          title="Закрити"
          aria-label="Закрити модальне вікно"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <h2 class="text-gray-800">Створити новий проєкт</h2>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="project_name" class="text-gray-800 font-semibold">Назва проєкту *</label>
            <input
              id="project_name"
              v-model.trim="formData.name"
              type="text"
              required
              placeholder="напр. Розробка веб-додатку для управління проєктами"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="project_description" class="text-gray-800 font-semibold">Опис проєкту *</label>
            <textarea
              id="project_description"
              v-model.trim="formData.description"
              required
              rows="3"
              placeholder="Короткий опис проєкту"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="technical_spec" class="text-gray-800 font-semibold">Технічне завдання (ТЗ) *</label>
            <div class="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="file"
                id="tz_file"
                ref="fileInput"
                accept=".txt,.pdf,.doc,.docx"
                @change="handleFileUpload"
                class="hidden"
              />
              <label
                for="tz_file"
                class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-sm text-center"
              >
                Завантажити файл ТЗ
              </label>
              <a
                href="/sample-tz.txt"
                download
                class="w-full sm:w-auto px-4 py-2 bg-savoy/10 text-savoy rounded-lg hover:bg-savoy/20 transition-colors text-sm text-center"
              >
                Завантажити приклад ТЗ
              </a>
              <span v-if="uploadedFileName" class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-2 justify-center sm:justify-start">
                <span>✓</span>
                <span class="truncate">{{ uploadedFileName }}</span>
                <button
                  type="button"
                  @click="removeUploadedFile"
                  class="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Видалити файл"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </span>
            </div>
            <textarea
              id="technical_spec"
              v-model.trim="formData.technicalSpecification"
              required
              rows="8"
              placeholder="Детальне технічне завдання проєкту або завантажте файл..."
              class="w-full"
            />
            <p class="text-sm text-gray-600">AI проаналізує ТЗ та автоматично створить структуру проєкту</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label for="category" class="text-gray-800 font-semibold">Категорія *</label>
              <select id="category" v-model="formData.category" required class="w-full">
                <option value="IT">IT</option>
                <option value="Маркетинг">Маркетинг</option>
                <option value="Дизайн">Дизайн</option>
                <option value="Аналітика">Аналітика</option>
                <option value="Інше">Інше</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label for="complexity" class="text-gray-800 font-semibold">Рівень складності *</label>
              <select id="complexity" v-model="formData.complexity" required class="w-full">
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="deadline" class="text-gray-800 font-semibold">Дедлайн</label>
            <input
              id="deadline"
              v-model="formData.deadline"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50 cursor-pointer"
              @click="(e) => (e.target as HTMLInputElement).showPicker()"
            />
          </div>

          <div class="flex flex-col gap-4">
            <label class="text-gray-800 font-semibold">Потрібні ролі *</label>
            <div
              v-for="(role, index) in formData.roles"
              :key="index"
              class="flex gap-2 items-center"
            >
              <input
                v-model="role.name"
                type="text"
                placeholder="напр. Frontend Developer"
                required
                class="flex-1"
              />
              <input
                v-model.number="role.required"
                type="number"
                min="1"
                placeholder="Кількість"
                required
                class="w-24"
              />
              <button
                type="button"
                @click="removeRole(index)"
                class="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              @click="addRole"
              class="text-savoy hover:text-savoy/80 font-semibold text-left"
            >
              + Додати роль
            </button>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              @click="closeModal"
              class="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              class="w-full sm:w-auto px-6 py-2 rounded-lg bg-savoy text-white hover:bg-savoy/90"
            >
              Створити проєкт
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import type { ProjectCategory, ComplexityLevel, ProjectRole } from "~~/types";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created", projectId: string): void;
}>();

const projectsStore = useProjectsStore();
const authStore = useAuthStore();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFileName = ref<string>("");

const formData = ref<{
  name: string;
  description: string;
  technicalSpecification: string;
  category: ProjectCategory;
  complexity: ComplexityLevel;
  deadline?: string;
  roles: { name: string; required: number }[];
}>({
  name: "",
  description: "",
  technicalSpecification: "",
  category: "IT",
  complexity: "medium",
  roles: [{ name: "", required: 1 }],
});

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  uploadedFileName.value = file.name;

  // Читаємо файл як текст
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    const text = await file.text();
    formData.value.technicalSpecification = text;
  } else {
    // Для PDF та інших форматів показуємо повідомлення
    alert("Підтримуються тільки текстові файли (.txt). Будь ласка, скопіюйте вміст в поле ТЗ.");
  }
};

const removeUploadedFile = () => {
  uploadedFileName.value = "";
  formData.value.technicalSpecification = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const addRole = () => {
  formData.value.roles.push({ name: "", required: 1 });
};

const removeRole = (index: number) => {
  formData.value.roles.splice(index, 1);
};

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    technicalSpecification: "",
    category: "IT",
    complexity: "medium",
    roles: [{ name: "", required: 1 }],
  };
  uploadedFileName.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleSubmit = async () => {
  if (!authStore.currentUser || authStore.currentUser.role !== "partner") {
    return;
  }

  const projectRoles: ProjectRole[] = formData.value.roles.map((role) => ({
    id: uuidv4(),
    name: role.name,
    required: role.required,
    assigned: [],
  }));

  const project = projectsStore.createProject({
    name: formData.value.name,
    description: formData.value.description,
    technicalSpecification: formData.value.technicalSpecification,
    category: formData.value.category,
    complexity: formData.value.complexity,
    deadline: formData.value.deadline,
    partnerId: authStore.currentUser.id,
    roles: projectRoles,
    team: [],
  });

  // Запускаємо AI-аналіз
  await projectsStore.analyzeProjectWithAI(project.id);
  
  // Генеруємо рекомендації студентів
  await projectsStore.generateStudentRecommendations(project.id);

  emit("created", project.id);
  closeModal();
};
</script>

<style scoped>
/* Приховуємо скролбар для всіх браузерів */
.scrollbar-hide {
  /* Для Firefox */
  scrollbar-width: none;
  /* Для IE та Edge */
  -ms-overflow-style: none;
}

/* Для WebKit браузерів (Chrome, Safari, Opera) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>

