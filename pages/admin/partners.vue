<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-3 sm:p-4 md:p-10 bg-lightGray">
    <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Управління партнерами</h1>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <p class="text-sm text-gray-600">Всього партнерів: {{ partners.length }}</p>
        <button
          @click="showCreateModal = true"
          class="w-full sm:w-auto px-4 py-2 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-sm font-semibold flex items-center gap-2 justify-center"
        >
          <span>+</span>
          <span>Додати партнера</span>
        </button>
      </div>

      <!-- Пошук -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Пошук партнерів за назвою компанії, email або описом..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
        />
      </div>

      <!-- Таблиця партнерів -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Назва компанії</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Телефон</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Опис</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="partner in filteredPartners"
              :key="partner.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 px-4 text-sm text-gray-800 font-semibold">{{ partner.companyName }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ partner.email }}</td>
              <td class="py-3 px-4 text-sm text-gray-600">{{ partner.contactPhone || 'Не вказано' }}</td>
              <td class="py-3 px-4 text-sm text-gray-600 line-clamp-2 max-w-xs">
                {{ partner.companyDescription || 'Немає опису' }}
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editPartner(partner)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редагувати"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="!isProtectedUser(partner.id)"
                    @click="confirmDelete(partner)"
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
        <div v-if="filteredPartners.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">Партнерів не знайдено</p>
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
            {{ showEditModal ? 'Редагувати партнера' : 'Додати партнера' }}
          </h3>
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form @submit.prevent="savePartner" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Назва компанії *</label>
            <input
              v-model.trim="form.companyName"
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

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Телефон</label>
            <input
              v-model.trim="form.contactPhone"
              type="tel"
              placeholder="+380501234567"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Опис компанії</label>
            <textarea
              v-model.trim="form.companyDescription"
              rows="4"
              placeholder="Опис діяльності компанії..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy/50 resize-none"
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
          Ви впевнені, що хочете видалити партнера <strong>"{{ partnerToDelete?.companyName }}"</strong>?
          <br />
          <span class="text-red-600 font-semibold">Цю дію неможливо скасувати!</span>
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteConfirm = false; partnerToDelete = null;"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Скасувати
          </button>
          <button
            @click="deletePartner"
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
import type { Partner } from "~~/types";

const projectsStore = useProjectsStore();
const usersApi = useUsersApi();

const searchQuery = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const partnerToDelete = ref<Partner | null>(null);
const isSaving = ref(false);
const isDeleting = ref(false);
const editingId = ref<string | null>(null);

const form = ref<{
  companyName: string;
  email: string;
  contactPhone?: string;
  companyDescription?: string;
}>({
  companyName: "",
  email: "",
  contactPhone: "",
  companyDescription: "",
});

const partners = computed(() => projectsStore.partners);

const filteredPartners = computed(() => {
  if (!searchQuery.value) {
    return partners.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return partners.value.filter((partner) => {
    return (
      partner.companyName.toLowerCase().includes(query) ||
      partner.email.toLowerCase().includes(query) ||
      (partner.companyDescription && partner.companyDescription.toLowerCase().includes(query)) ||
      (partner.contactPhone && partner.contactPhone.includes(query))
    );
  });
});

const editPartner = (partner: Partner) => {
  editingId.value = partner.id;
  form.value = {
    companyName: partner.companyName,
    email: partner.email,
    contactPhone: partner.contactPhone || "",
    companyDescription: partner.companyDescription || "",
  };
  showEditModal.value = true;
};

const confirmDelete = (partner: Partner) => {
  partnerToDelete.value = partner;
  showDeleteConfirm.value = true;
};

const deletePartner = async () => {
  if (!partnerToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await usersApi.deleteUser(partnerToDelete.value.id);
    
    const index = projectsStore.partners.findIndex(p => p.id === partnerToDelete.value!.id);
    if (index !== -1) {
      projectsStore.partners.splice(index, 1);
    }
    
    showDeleteConfirm.value = false;
    partnerToDelete.value = null;
  } catch (error: any) {
    console.error('Failed to delete partner:', error);
    const errorMessage = error?.data?.message || error?.message || 'Помилка при видаленні партнера. Спробуйте ще раз.';
    if (error?.statusCode === 403 || errorMessage.includes('demo data') || errorMessage.includes('protected')) {
      alert('Неможливо видалити демо-дані. Цей партнер захищений від видалення.');
    } else {
      alert(errorMessage);
    }
  } finally {
    isDeleting.value = false;
  }
};

const savePartner = async () => {
  isSaving.value = true;
  try {
    const partnerData: Omit<Partner, '_id' | 'id' | 'createdAt'> = {
      name: form.value.email.split('@')[0],
      email: form.value.email,
      role: "partner",
      companyName: form.value.companyName,
      contactPhone: form.value.contactPhone || undefined,
      companyDescription: form.value.companyDescription || undefined,
    };

    if (editingId.value) {
      const updatedPartner = await usersApi.updateUser(editingId.value, partnerData);
      const index = projectsStore.partners.findIndex(p => p.id === editingId.value);
      if (index !== -1) {
        projectsStore.partners[index] = updatedPartner as Partner;
      }
    } else {
      const newPartner = await usersApi.createUser({
        ...partnerData,
        id: uuidv4(),
      });
      // Перевіряємо, чи не існує вже партнер з таким id
      const existingIndex = projectsStore.partners.findIndex(p => p.id === newPartner.id);
      if (existingIndex === -1) {
        projectsStore.partners.push(newPartner as Partner);
      } else {
        // Якщо існує, оновлюємо
        projectsStore.partners[existingIndex] = newPartner as Partner;
      }
    }
    
    closeModal();
  } catch (error) {
    console.error('Failed to save partner:', error);
    alert('Помилка при збереженні партнера. Спробуйте ще раз.');
  } finally {
    isSaving.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
  form.value = {
    companyName: "",
    email: "",
    contactPhone: "",
    companyDescription: "",
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

