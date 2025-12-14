<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 sm:p-4 md:p-10 bg-lightGray">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Управління студентами</h1>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <p class="text-sm text-gray-600">Всього студентів: {{ students.length }}</p>
        <button
          @click="showCreateModal = true"
          class="w-full sm:w-auto px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm font-semibold flex items-center gap-2 justify-center"
        >
          <span>+</span>
          <span>Додати студента</span>
        </button>
      </div>

      <!-- Пошук -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Пошук студентів за ім'ям, email або спеціальністю..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
        />
      </div>

      <!-- Таблиця студентів -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ім'я</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Курс</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Спеціальність</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Рейтинг</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Статус</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 px-4 text-sm text-gray-800">{{ student.fullName }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ student.email }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ student.course }} курс</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ student.specialty }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ student.rating.toFixed(1) }}/5.0</td>
              <td class="py-3 px-4">
                <span
                  :class="getStatusClass(student.status)"
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                >
                  {{ getStatusText(student.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editStudent(student)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редагувати"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="!isProtectedUser(student.id)"
                    @click="confirmDelete(student)"
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
        <div v-if="filteredStudents.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">Студентів не знайдено</p>
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
            {{ showEditModal ? 'Редагувати студента' : 'Додати студента' }}
          </h3>
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form @submit.prevent="saveStudent" class="space-y-4">
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Курс *</label>
              <input
                v-model.number="form.course"
                type="number"
                min="1"
                max="6"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Спеціальність *</label>
              <input
                v-model.trim="form.specialty"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Рейтинг</label>
              <input
                v-model.number="form.rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Доступність (год/тиждень)</label>
              <input
                v-model.number="form.availability"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Статус</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
            >
              <option value="available">Доступний</option>
              <option value="busy">Зайнятий</option>
              <option value="unavailable">Недоступний</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">GitHub (опціонально)</label>
            <input
              v-model.trim="form.portfolio.github"
              type="url"
              placeholder="https://github.com/username"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
            />
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
          Ви впевнені, що хочете видалити студента <strong>"{{ studentToDelete?.fullName }}"</strong>?
          <br />
          <span class="text-red-600 font-semibold">Цю дію неможливо скасувати!</span>
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteConfirm = false; studentToDelete = null;"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Скасувати
          </button>
          <button
            @click="deleteStudent"
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
import { computed, ref, onMounted } from "vue";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useUsersApi } from "~/composables/useApi";
import { isProtectedUser } from "~/composables/useProtectedData";
import { v4 as uuidv4 } from "uuid";
import type { Student } from "~~/types";

const projectsStore = useProjectsStore();
const usersApi = useUsersApi();

const searchQuery = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const studentToDelete = ref<Student | null>(null);
const isSaving = ref(false);
const isDeleting = ref(false);
const editingId = ref<string | null>(null);

const form = ref<{
  fullName: string;
  email: string;
  course: number;
  specialty: string;
  rating: number;
  availability: number;
  status: "available" | "busy" | "unavailable";
  portfolio: {
    github?: string;
  };
}>({
  fullName: "",
  email: "",
  course: 1,
  specialty: "",
  rating: 0,
  availability: 0,
  status: "available",
  portfolio: {},
});

const students = computed(() => projectsStore.students);

const filteredStudents = computed(() => {
  if (!searchQuery.value) {
    return students.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return students.value.filter((student) => {
    return (
      student.fullName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.specialty.toLowerCase().includes(query)
    );
  });
});

const getStatusText = (status: Student["status"]): string => {
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

const editStudent = (student: Student) => {
  editingId.value = student.id;
  form.value = {
    fullName: student.fullName,
    email: student.email,
    course: student.course,
    specialty: student.specialty,
    rating: student.rating,
    availability: student.availability,
    status: student.status,
    portfolio: {
      github: student.portfolio?.github || "",
    },
  };
  showEditModal.value = true;
};

const confirmDelete = (student: Student) => {
  studentToDelete.value = student;
  showDeleteConfirm.value = true;
};

const deleteStudent = async () => {
  if (!studentToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await usersApi.deleteUser(studentToDelete.value.id);
    
    const index = projectsStore.students.findIndex(s => s.id === studentToDelete.value!.id);
    if (index !== -1) {
      projectsStore.students.splice(index, 1);
    }
    
    showDeleteConfirm.value = false;
    studentToDelete.value = null;
  } catch (error: any) {
    console.error('Failed to delete student:', error);
    const errorMessage = error?.data?.message || error?.message || 'Помилка при видаленні студента. Спробуйте ще раз.';
    if (error?.statusCode === 403 || errorMessage.includes('demo data') || errorMessage.includes('protected')) {
      alert('Неможливо видалити демо-дані. Цей студент захищений від видалення.');
    } else {
      alert(errorMessage);
    }
  } finally {
    isDeleting.value = false;
  }
};

const saveStudent = async () => {
  isSaving.value = true;
  try {
    const studentData: Omit<Student, '_id' | 'id' | 'createdAt'> = {
      name: form.value.email.split('@')[0],
      email: form.value.email,
      role: "student",
      fullName: form.value.fullName,
      course: form.value.course,
      specialty: form.value.specialty,
      skills: [],
      rating: form.value.rating || 0,
      completedCourses: [],
      availability: form.value.availability || 0,
      status: form.value.status,
      portfolio: {
        github: form.value.portfolio.github || undefined,
      },
    };

    if (editingId.value) {
      const updatedStudent = await usersApi.updateUser(editingId.value, studentData);
      const index = projectsStore.students.findIndex(s => s.id === editingId.value);
      if (index !== -1) {
        projectsStore.students[index] = updatedStudent as Student;
      }
    } else {
      const newStudent = await usersApi.createUser({
        ...studentData,
        id: uuidv4(),
      });
      // Перевіряємо, чи не існує вже студент з таким id
      const existingIndex = projectsStore.students.findIndex(s => s.id === newStudent.id);
      if (existingIndex === -1) {
        projectsStore.students.push(newStudent as Student);
      } else {
        // Якщо існує, оновлюємо
        projectsStore.students[existingIndex] = newStudent as Student;
      }
    }
    
    closeModal();
  } catch (error) {
    console.error('Failed to save student:', error);
    alert('Помилка при збереженні студента. Спробуйте ще раз.');
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
    course: 1,
    specialty: "",
    rating: 0,
    availability: 0,
    status: "available",
    portfolio: {},
  };
};

onMounted(async () => {
  try {
    await projectsStore.loadAll();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});
</script>

