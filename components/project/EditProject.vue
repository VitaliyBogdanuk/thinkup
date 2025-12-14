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

        <h2 class="text-gray-800">Редагувати проєкт</h2>

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
              class="w-full"
            />
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
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50 cursor-pointer"
              @click="(e) => (e.target as HTMLInputElement).showPicker()"
            />
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
                  />
                  
                  <!-- Кнопка видалення -->
                  <button
                    type="button"
                    @click="removeRole(index)"
                    :disabled="formData.roles.length === 1"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Видалити роль"
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
          </div>

          <div v-if="rolesError" class="text-red-600 text-sm px-2">{{ rolesError }}</div>

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
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import type { ProjectCategory, ComplexityLevel, ProjectRole, Project } from "~~/types";

const props = defineProps<{
  isOpen: boolean;
  projectId: string | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated", projectId: string): void;
}>();

const projectsStore = useProjectsStore();
const authStore = useAuthStore();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFileName = ref<string>("");
const fileUploadError = ref<string>("");
const rolesError = ref<string>("");

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

// Заповнюємо форму даними проєкту при відкритті
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.projectId) {
    const project = projectsStore.getProjectById(props.projectId);
    if (project) {
      formData.value = {
        name: project.name,
        description: project.description,
        technicalSpecification: project.technicalSpecification,
        category: project.category,
        complexity: project.complexity,
        deadline: project.deadline,
        roles: project.roles.map(role => ({
          name: role.name,
          required: role.required,
        })),
      };
      uploadedFileName.value = "";
      fileUploadError.value = "";
      rolesError.value = "";
    }
  }
}, { immediate: true });

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  // Очищаємо попередні помилки
  fileUploadError.value = "";
  rolesError.value = "";
  
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
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const addRole = () => {
  formData.value.roles.push({ name: "", required: 1 });
  rolesError.value = "";
};

const removeRole = (index: number) => {
  if (formData.value.roles.length === 1) {
    rolesError.value = "Додайте принаймні одну роль на проєкті.";
    return;
  }
  formData.value.roles.splice(index, 1);
  rolesError.value = "";
};

watch(() => formData.value.roles.length, () => {
  if (formData.value.roles.length > 0) rolesError.value = "";
});

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  if (!props.projectId) return;
  
  if (!authStore.currentUser || (authStore.currentUser.role !== "admin" && authStore.currentUser.role !== "teacher")) {
    return;
  }

  if (!formData.value.roles || formData.value.roles.length === 0) {
    rolesError.value = "Додайте принаймні одну роль на проєкті.";
    return;
  }

  // Перевіряємо, що усі ролі мають назву та кількість
  for (const r of formData.value.roles) {
    if (!r.name || !r.name.trim() || !r.required || r.required < 1) {
      rolesError.value = "Усі ролі повинні мати назву та кількість (не менше 1).";
      return;
    }
  }

  const project = projectsStore.getProjectById(props.projectId);
  if (!project) return;

  // Оновлюємо ролі, зберігаючи існуючі ID та assigned студентів
  const updatedRoles: ProjectRole[] = formData.value.roles.map((role, index) => {
    // Якщо роль існує, зберігаємо її ID та assigned
    const existingRole = project.roles[index];
    return {
      id: existingRole?.id || uuidv4(),
      name: role.name,
      required: role.required,
      assigned: existingRole?.assigned || [],
    };
  });

  // Оновлюємо проєкт
  projectsStore.updateProject(props.projectId, {
    name: formData.value.name,
    description: formData.value.description,
    technicalSpecification: formData.value.technicalSpecification,
    category: formData.value.category,
    complexity: formData.value.complexity,
    deadline: formData.value.deadline,
    roles: updatedRoles,
    updatedAt: new Date().toISOString(),
  });

  emit("updated", props.projectId);
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

