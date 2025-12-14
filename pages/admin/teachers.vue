<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 sm:p-4 md:p-10 bg-lightGray">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Управління викладачами</h1>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <p class="text-sm text-gray-600">Всього викладачів: {{ teachers.length }}</p>
        <button
          @click="showCreateModal = true"
          class="w-full sm:w-auto px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm font-semibold flex items-center gap-2 justify-center"
        >
          <span>+</span>
          <span>Додати викладача</span>
        </button>
      </div>

      <!-- Пошук -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Пошук викладачів за ім'ям, email або кафедрою..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
        />
      </div>

      <!-- Таблиця викладачів -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ім'я</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Кафедра</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Спеціалізація</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="teacher in filteredTeachers"
              :key="teacher.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 px-4 text-sm text-gray-800">{{ teacher.fullName }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ teacher.email }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ teacher.department || 'Не вказано' }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="spec in (teacher.specialization || []).slice(0, 2)"
                    :key="spec"
                    class="px-2 py-0.5 bg-gray-100 rounded text-xs"
                  >
                    {{ spec }}
                  </span>
                  <span v-if="(teacher.specialization || []).length > 2" class="text-xs text-gray-500">
                    +{{ (teacher.specialization || []).length - 2 }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editTeacher(teacher)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редагувати"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="!isProtectedUser(teacher.id)"
                    @click="confirmDelete(teacher)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Видалити"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-else
                    disabled
                    class="p-2 text-gray-400 cursor-not-allowed rounded-lg"
                    title="Демо-дані не можна видаляти"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredTeachers.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">Викладачів не знайдено</p>
        </div>
      </div>
    </div>

    <!-- Модальне вікно створення/редагування -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800">
            {{ showEditModal ? 'Редагувати викладача' : 'Додати викладача' }}
          </h3>
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form @submit.prevent="saveTeacher" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Повне ім'я *</label>
              <input
                v-model.trim="form.fullName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                v-model.trim="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Кафедра</label>
            <input
              v-model.trim="form.department"
              type="text"
              placeholder="напр. Кафедра комп'ютерних наук"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Спеціалізація (через кому)</label>
            <input
              v-model.trim="specializationInput"
              type="text"
              placeholder="напр. Веб-розробка, Бази даних, AI"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
            />
            <p class="text-xs text-gray-500 mt-1">Введіть спеціалізації через кому</p>
          </div>

          <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Скасувати
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Збереження...' : 'Зберегти' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальне вікно підтвердження видалення -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Підтвердження видалення</h3>
        <p class="text-gray-600 mb-6">
          Ви впевнені, що хочете видалити викладача <strong>"{{ teacherToDelete?.fullName }}"</strong>?
          <br />
          <span class="text-red-600 font-semibold">Цю дію неможливо скасувати!</span>
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteConfirm = false; teacherToDelete = null;"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Скасувати
          </button>
          <button
            @click="deleteTeacher"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isDeleting ? 'Видалення...' : 'Видалити' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useUsersApi } from "~/composables/useApi";
import { isProtectedUser } from "~/composables/useProtectedData";
import { v4 as uuidv4 } from "uuid";
import type { Teacher } from "~~/types";

const projectsStore = useProjectsStore();
const usersApi = useUsersApi();

const searchQuery = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const teacherToDelete = ref<Teacher | null>(null);
const isSaving = ref(false);
const isDeleting = ref(false);
const editingId = ref<string | null>(null);
const specializationInput = ref("");

const form = ref<{
  fullName: string;
  email: string;
  department?: string;
  specialization?: string[];
}>({
  fullName: "",
  email: "",
  department: "",
  specialization: [],
});

const teachers = computed(() => projectsStore.teachers);

const filteredTeachers = computed(() => {
  if (!searchQuery.value) {
    return teachers.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return teachers.value.filter((teacher) => {
    return (
      teacher.fullName.toLowerCase().includes(query) ||
      teacher.email.toLowerCase().includes(query) ||
      (teacher.department && teacher.department.toLowerCase().includes(query)) ||
      (teacher.specialization && teacher.specialization.some(s => s.toLowerCase().includes(query)))
    );
  });
});

// Синхронізація specializationInput з form.specialization
watch(specializationInput, (value) => {
  form.value.specialization = value
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
});

watch(() => form.value.specialization, (value) => {
  if (value && value.length > 0) {
    specializationInput.value = value.join(', ');
  } else {
    specializationInput.value = '';
  }
}, { immediate: true });

const editTeacher = (teacher: Teacher) => {
  editingId.value = teacher.id;
  form.value = {
    fullName: teacher.fullName,
    email: teacher.email,
    department: teacher.department || "",
    specialization: teacher.specialization || [],
  };
  specializationInput.value = (teacher.specialization || []).join(', ');
  showEditModal.value = true;
};

const confirmDelete = (teacher: Teacher) => {
  teacherToDelete.value = teacher;
  showDeleteConfirm.value = true;
};

const deleteTeacher = async () => {
  if (!teacherToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await usersApi.deleteUser(teacherToDelete.value.id);
    
    const index = projectsStore.teachers.findIndex(t => t.id === teacherToDelete.value!.id);
    if (index !== -1) {
      projectsStore.teachers.splice(index, 1);
    }
    
    showDeleteConfirm.value = false;
    teacherToDelete.value = null;
  } catch (error: any) {
    console.error('Failed to delete teacher:', error);
    const errorMessage = error?.data?.message || error?.message || 'Помилка при видаленні викладача. Спробуйте ще раз.';
    if (error?.statusCode === 403 || errorMessage.includes('demo data') || errorMessage.includes('protected')) {
      alert('Неможливо видалити демо-дані. Цей викладач захищений від видалення.');
    } else {
      alert(errorMessage);
    }
  } finally {
    isDeleting.value = false;
  }
};

const saveTeacher = async () => {
  isSaving.value = true;
  try {
    const teacherData: Omit<Teacher, '_id' | 'id' | 'createdAt'> = {
      name: form.value.email.split('@')[0],
      email: form.value.email,
      role: "teacher",
      fullName: form.value.fullName,
      department: form.value.department || undefined,
      specialization: form.value.specialization && form.value.specialization.length > 0 
        ? form.value.specialization 
        : undefined,
    };

    if (editingId.value) {
      const updatedTeacher = await usersApi.updateUser(editingId.value, teacherData);
      const index = projectsStore.teachers.findIndex(t => t.id === editingId.value);
      if (index !== -1) {
        projectsStore.teachers[index] = updatedTeacher as Teacher;
      }
    } else {
      const newTeacher = await usersApi.createUser({
        ...teacherData,
        id: uuidv4(),
      });
      // Перевіряємо, чи не існує вже викладач з таким id
      const existingIndex = projectsStore.teachers.findIndex(t => t.id === newTeacher.id);
      if (existingIndex === -1) {
        projectsStore.teachers.push(newTeacher as Teacher);
      } else {
        // Якщо існує, оновлюємо
        projectsStore.teachers[existingIndex] = newTeacher as Teacher;
      }
    }
    
    closeModal();
  } catch (error) {
    console.error('Failed to save teacher:', error);
    alert('Помилка при збереженні викладача. Спробуйте ще раз.');
  } finally {
    isSaving.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
  form.value = {
    fullName: "",
    email: "",
    department: "",
    specialization: [],
  };
  specializationInput.value = "";
};

onMounted(async () => {
  try {
    await projectsStore.loadAll();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});
</script>

