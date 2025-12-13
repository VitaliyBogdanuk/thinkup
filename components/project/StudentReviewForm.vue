<template>
  <transition name="fade">
    <div v-if="isOpen" class="popup-modal" @click.self="closeModal">
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

        <h2 class="text-gray-800">Відгук про роботу студента</h2>

        <div v-if="student" class="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
          <div class="w-12 h-12 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0">
            <span class="text-savoy font-bold text-lg">
              {{ student.fullName?.charAt(0).toUpperCase() || '?' }}
            </span>
          </div>
          <div>
            <p class="font-semibold text-gray-800">{{ student.fullName }}</p>
            <p class="text-sm text-gray-600">{{ student.course }} курс, {{ student.specialty }}</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-gray-800 font-semibold">Оцінка *</label>
            <div class="flex items-center gap-2">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                @click="formData.rating = n"
                class="text-3xl transition-transform hover:scale-110 focus:outline-none"
                :class="n <= formData.rating ? 'text-amber-500' : 'text-gray-300'"
              >
                ★
              </button>
              <span class="ml-2 text-gray-600 font-semibold">{{ formData.rating }}/5</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ getRatingDescription(formData.rating) }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label for="review_comment" class="text-gray-800 font-semibold">Відгук *</label>
            <textarea
              id="review_comment"
              v-model.trim="formData.comment"
              required
              rows="6"
              placeholder="Опишіть роботу студента, його сильні сторони, досягнення та рекомендації..."
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-gray-800 font-semibold">Відзначені навички (опціонально)</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="skill in availableSkills"
                :key="skill"
                type="button"
                @click="toggleSkill(skill)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                :class="formData.skills?.includes(skill) 
                  ? 'bg-savoy text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ skill }}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Оберіть навички, які студент проявив під час роботи над проєктом
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Скасувати
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-semibold"
            >
              Зберегти відгук
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useProjectsStore } from "~~/stores/projects";
import { useAuthStore } from "~~/stores/auth";
import type { PartnerReview, Student } from "~~/types";

interface Props {
  isOpen: boolean;
  studentId: string;
  projectId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  saved: [review: PartnerReview];
}>();

const projectsStore = useProjectsStore();
const authStore = useAuthStore();

const student = computed<Student | undefined>(() => 
  projectsStore.getStudentById(props.studentId)
);

const project = computed(() => 
  projectsStore.getProjectById(props.projectId)
);

const existingReview = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "partner") {
    return undefined;
  }
  return projectsStore.getReviewByPartnerAndStudent(
    authStore.currentUser.id,
    props.studentId,
    props.projectId
  );
});

const formData = ref<{
  rating: number;
  comment: string;
  skills?: string[];
}>({
  rating: 5,
  comment: "",
  skills: [],
});

// Доступні навички для вибору
const availableSkills = [
  "Комунікація",
  "Командна робота",
  "Відповідальність",
  "Професійність",
  "Технічні навички",
  "Креативність",
  "Проблемне мислення",
  "Тайм-менеджмент",
  "Самостійність",
  "Навчальність",
];

// Ініціалізація форми з існуючим відгуком, якщо він є
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && existingReview.value) {
    formData.value = {
      rating: existingReview.value.rating,
      comment: existingReview.value.comment,
      skills: existingReview.value.skills || [],
    };
  } else if (isOpen) {
    formData.value = {
      rating: 5,
      comment: "",
      skills: [],
    };
  }
}, { immediate: true });

const toggleSkill = (skill: string) => {
  if (!formData.value.skills) {
    formData.value.skills = [];
  }
  const index = formData.value.skills.indexOf(skill);
  if (index > -1) {
    formData.value.skills.splice(index, 1);
  } else {
    formData.value.skills.push(skill);
  }
};

const getRatingDescription = (rating: number): string => {
  if (rating >= 4.8) return "Відмінно";
  if (rating >= 4.3) return "Дуже добре";
  if (rating >= 3.8) return "Добре";
  if (rating >= 3.3) return "Задовільно";
  return "Можна краще";
};

const closeModal = () => {
  emit("close");
};

const handleSubmit = () => {
  if (!authStore.currentUser || authStore.currentUser.role !== "partner") {
    return;
  }

  if (!project.value) {
    return;
  }

  const partner = authStore.currentUser;
  const review = projectsStore.addPartnerReview({
    partnerId: partner.id,
    partnerName: partner.companyName,
    studentId: props.studentId,
    projectId: props.projectId,
    projectName: project.value.name,
    rating: formData.value.rating,
    comment: formData.value.comment,
    skills: formData.value.skills && formData.value.skills.length > 0 
      ? formData.value.skills 
      : undefined,
  });

  emit("saved", review);
  closeModal();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

