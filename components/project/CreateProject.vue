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
              :class="['w-full', validationErrors.name ? 'border-red-500 focus:ring-red-500' : '']"
              @blur="validateForm"
            />
            <span v-if="validationErrors.name" class="text-red-600 text-sm">{{ validationErrors.name }}</span>
          </div>

          <div class="flex flex-col gap-2">
            <label for="project_description" class="text-gray-800 font-semibold">Опис проєкту *</label>
            <textarea
              id="project_description"
              v-model.trim="formData.description"
              required
              rows="3"
              placeholder="Короткий опис проєкту"
              :class="['w-full', validationErrors.description ? 'border-red-500 focus:ring-red-500' : '']"
              @blur="validateForm"
            />
            <span v-if="validationErrors.description" class="text-red-600 text-sm">{{ validationErrors.description }}</span>
          </div>

          <div class="flex flex-col gap-2">
            <label for="technical_spec" class="text-gray-800 font-semibold">Технічне завдання (ТЗ) *</label>
            <div class="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="file"
                id="tz_file"
                ref="fileInput"
                accept=".txt"
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
            <!-- Помилка завантаження файлу -->
            <div v-if="fileUploadError" class="mb-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{{ fileUploadError }}</span>
            </div>
            <textarea
              id="technical_spec"
              v-model.trim="formData.technicalSpecification"
              required
              rows="8"
              placeholder="Детальне технічне завдання проєкту або завантажте файл..."
              :class="['w-full', validationErrors.technicalSpecification ? 'border-red-500 focus:ring-red-500' : '']"
              @blur="validateForm"
            />
            <span v-if="validationErrors.technicalSpecification" class="text-red-600 text-sm">{{ validationErrors.technicalSpecification }}</span>
            <p class="text-sm text-gray-600">AI проаналізує ТЗ та автоматично створить структуру проєкту</p>
            <p class="text-xs text-gray-500 mt-1">Підтримувані формати: .txt</p>
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
              :min="new Date().toISOString().split('T')[0]"
              :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 cursor-pointer', validationErrors.deadline ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-savoy/50']"
              @click="(e) => (e.target as HTMLInputElement).showPicker()"
              @change="validateForm"
            />
            <span v-if="validationErrors.deadline" class="text-red-600 text-sm">{{ validationErrors.deadline }}</span>
          </div>

          <div class="flex flex-col gap-4">
            <label class="text-gray-800 font-semibold">Потрібні ролі *</label>
            
            <div class="space-y-3">
              <div
                v-for="(role, index) in formData.roles"
                :key="index"
                class="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
              >
                <!-- Назва ролі -->
                <div class="w-full sm:flex-1">
                  <input
                    v-model="role.name"
                    type="text"
                    placeholder="напр. Frontend Developer"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
                    @blur="validateForm"
                  />
                </div>
                
                <!-- Кількість -->
                <div class="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    v-model.number="role.required"
                    type="number"
                    min="1"
                    placeholder="Кількість"
                    required
                    class="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
                    @blur="validateForm"
                    @input="() => { if (role.required < 1) role.required = 1; }"
                  />
                  
                  <!-- Кнопка видалення -->
                  <button
                    type="button"
                    @click="removeRole(index)"
                    :disabled="formData.roles.length <= 1"
                    :class="['p-2 rounded-lg transition-colors flex-shrink-0', formData.roles.length <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50']"
                    :title="formData.roles.length <= 1 ? 'Має бути мінімум одна роль' : 'Видалити роль'"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Кнопка додавання ролі -->
            <button
              type="button"
              @click="addRole"
              class="inline-flex items-center gap-2 text-savoy hover:text-savoy/80 font-semibold text-left mt-2 self-start"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Додати роль
            </button>
            <span v-if="validationErrors.roles" class="text-red-600 text-sm mt-1">{{ validationErrors.roles }}</span>
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
const fileUploadError = ref<string>("");
const validationErrors = ref<Record<string, string>>({});

// Дозволені формати файлів
const allowedFileTypes = [".txt"];
const allowedMimeTypes = ["text/plain"];

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
  
  // Очищаємо попередні помилки
  fileUploadError.value = "";
  
  if (!file) return;

  // Перевіряємо розширення файлу
  const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  const isValidExtension = allowedFileTypes.includes(fileExtension);
  
  // Перевіряємо MIME тип
  const isValidMimeType = allowedMimeTypes.includes(file.type);
  
  // Якщо формат не підходить
  if (!isValidExtension && !isValidMimeType) {
    fileUploadError.value = `Формат файлу "${fileExtension}" не підтримується. Будь ласка, завантажте файл у форматі .txt або введіть текст вручну.`;
    
    // Очищаємо input
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    
    // Не встановлюємо uploadedFileName
    uploadedFileName.value = "";
    return;
  }

  // Якщо формат підходить, обробляємо файл
  try {
    uploadedFileName.value = file.name;
    const text = await file.text();
    formData.value.technicalSpecification = text;
    fileUploadError.value = ""; // Очищаємо помилку, якщо все успішно
  } catch (error) {
    fileUploadError.value = "Помилка читання файлу. Будь ласка, перевірте файл або введіть текст вручну.";
    uploadedFileName.value = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};

const removeUploadedFile = () => {
  uploadedFileName.value = "";
  fileUploadError.value = "";
  formData.value.technicalSpecification = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const addRole = () => {
  formData.value.roles.push({ name: "", required: 1 });
};

const removeRole = (index: number) => {
  // Не дозволяємо видалити останню роль
  if (formData.value.roles.length <= 1) {
    return;
  }
  formData.value.roles.splice(index, 1);
  // Очищаємо помилку валідації для ролей
  if (validationErrors.value.roles) {
    delete validationErrors.value.roles;
  }
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
  fileUploadError.value = "";
  validationErrors.value = {};
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const validateForm = (): boolean => {
  validationErrors.value = {};

  // Валідація назви
  if (!formData.value.name || formData.value.name.trim().length < 3) {
    validationErrors.value.name = "Назва проєкту має містити мінімум 3 символи";
  }

  // Валідація опису
  if (!formData.value.description || formData.value.description.trim().length < 10) {
    validationErrors.value.description = "Опис проєкту має містити мінімум 10 символів";
  }

  // Валідація технічного завдання
  if (!formData.value.technicalSpecification || formData.value.technicalSpecification.trim().length < 20) {
    validationErrors.value.technicalSpecification = "Технічне завдання має містити мінімум 20 символів";
  }

  // Валідація дедлайну
  if (formData.value.deadline) {
    const deadlineDate = new Date(formData.value.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      validationErrors.value.deadline = "Дедлайн не може бути в минулому";
    }
  }

  // Валідація ролей
  if (!formData.value.roles || formData.value.roles.length === 0) {
    validationErrors.value.roles = "Потрібно додати мінімум одну роль";
  } else {
    const invalidRoles = formData.value.roles.filter(
      (role) => !role.name || role.name.trim().length === 0 || !role.required || role.required < 1
    );
    
    if (invalidRoles.length > 0) {
      validationErrors.value.roles = "Всі ролі повинні мати назву та кількість не менше 1";
    }
  }

  return Object.keys(validationErrors.value).length === 0;
};

const handleSubmit = async () => {
  if (!authStore.currentUser || authStore.currentUser.role !== "partner") {
    return;
  }

  // Валідація форми
  if (!validateForm()) {
    // Прокручуємо до першої помилки
    const firstErrorField = Object.keys(validationErrors.value)[0];
    const errorElement = document.getElementById(firstErrorField);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      errorElement.focus();
    }
    return;
  }

  const projectRoles: ProjectRole[] = formData.value.roles.map((role) => ({
    id: uuidv4(),
    name: role.name.trim(),
    required: role.required,
    assigned: [],
  }));

  const project = projectsStore.createProject({
    name: formData.value.name.trim(),
    description: formData.value.description.trim(),
    technicalSpecification: formData.value.technicalSpecification.trim(),
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

.popup-modal {
    top: 54%;
}
</style>

