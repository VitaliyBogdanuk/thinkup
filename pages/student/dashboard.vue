<template>
  <div class="w-full h-full">
    <section class="w-full h-full overflow-y-auto flex-1 p-3 sm:p-4 md:p-10 bg-lightGray">
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Мій профіль</h1>

      <div v-if="!currentStudent" class="text-center py-16 text-gray-500">
        <p>Студент не знайдено</p>
      </div>

      <div v-else class="space-y-4 sm:space-y-5 md:space-y-6">
        <!-- Профіль студента -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
            <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-savoy/20 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <span class="text-savoy text-xl sm:text-2xl md:text-3xl font-bold">
                {{ currentStudent.fullName.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0 w-full">
              <h2 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-2 text-center sm:text-left break-words">{{ currentStudent.fullName }}</h2>
              <p class="text-gray-600 mb-1 text-xs sm:text-sm md:text-base text-center sm:text-left">{{ currentStudent.course }} курс, {{ currentStudent.specialty }}</p>
              <p class="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 break-all text-center sm:text-left">{{ currentStudent.email }}</p>
              <div class="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 md:gap-4 flex-wrap">
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <span class="text-xs sm:text-sm text-gray-500">Рейтинг:</span>
                  <span class="text-sm sm:text-base md:text-lg font-bold text-savoy">{{ calculatedStudentRating.toFixed(1) }}/5.0</span>
                  <span v-if="studentReviews.length > 0" class="text-xs text-gray-500">({{ studentReviews.length }} {{ studentReviews.length === 1 ? 'відгук' : studentReviews.length < 5 ? 'відгуки' : 'відгуків' }})</span>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <span class="text-xs sm:text-sm text-gray-500">Доступність:</span>
                  <span class="text-sm sm:text-base md:text-lg font-semibold text-gray-800">{{ currentStudent.availability }} год/тиждень</span>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <span class="text-xs sm:text-sm text-gray-500">Статус:</span>
                  <span :class="getStatusClass(currentStudent.status)" class="px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
                    {{ getStudentStatusText(currentStudent.status) }}
                  </span>
                </div>
                <!-- Лічильник непрочитаних сповіщень -->
                <div v-if="unreadCount > 0" class="flex items-center gap-1.5 sm:gap-2">
                  <span class="text-xs sm:text-sm text-gray-500">Нові сповіщення:</span>
                  <span class="px-2 py-0.5 sm:py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    {{ unreadCount }}
                  </span>
                </div>
              </div>
              
              <!-- Портфоліо посилання -->
              <div v-if="currentStudent.portfolio" class="mt-4 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                <a 
                  v-if="currentStudent.portfolio.github"
                  :href="currentStudent.portfolio.github"
                  target="_blank"
                  class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-savoy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <span>📁</span>
                  <span>GitHub</span>
                </a>
                <a 
                  v-if="currentStudent.portfolio.behance"
                  :href="currentStudent.portfolio.behance"
                  target="_blank"
                  class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-savoy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <span>🎨</span>
                  <span>Behance</span>
                </a>
                <a 
                  v-if="currentStudent.portfolio.website"
                  :href="currentStudent.portfolio.website"
                  target="_blank"
                  class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-savoy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <span>🌐</span>
                  <span>Website</span>
                </a>
              </div>
              
              <!-- Статистика проєктів -->
              <div class="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 items-center text-center lg:text-left">
                      <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">✅</span>
                      <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                        <p class="text-xs text-gray-500">Завершених проєктів</p>
                        <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ completedProjects.length }}</p>
                      </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1.5 sm:mt-2 text-center lg:text-left">З {{ myProjects.length }} загальних проєктів</p>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2 items-center text-center lg:text-left">
                      <span class="text-lg sm:text-xl md:text-2xl flex-shrink-0">🤝</span>
                      <div class="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2 items-center lg:items-start">
                        <p class="text-xs text-gray-500">Партнерів</p>
                        <p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{{ partnersWorkedWith.length }}</p>
                      </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1.5 sm:mt-2 text-center lg:text-left">З якими працював</p>
                  </div>
                </div>
                
                <!-- Список відгуків -->
                <div v-if="partnerReviews.length > 0" class="mt-3 sm:mt-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-xs sm:text-sm font-semibold text-gray-700">Відгуки партнерів:</p>
                    <div class="flex items-center gap-1">
                      <div class="flex items-center gap-0.5">
                        <span class="text-amber-500 text-xs">★</span>
                        <span class="text-xs font-bold">{{ partnersReviewStats.averageRating.toFixed(1) }}</span>
                      </div>
                      <span class="text-xs text-gray-500">({{ partnersReviewStats.totalReviews }})</span>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="review in partnerReviews"
                      :key="review.id"
                      class="px-2 sm:px-3 py-1.5 sm:py-2 bg-savoy/10 text-gray-800 rounded-lg text-xs sm:text-sm font-medium border border-savoy/20 hover:bg-savoy/20 transition-all cursor-pointer break-words group relative"
                      @click="selectedPartnerReview = review"
                    >
                      <div class="flex items-center gap-1.5">
                        <!-- Аватар партнера -->
                        <div class="w-5 h-5 rounded-full bg-savoy/30 flex items-center justify-center flex-shrink-0">
                          <span class="text-xs font-bold text-savoy">{{ review.partnerName.charAt(0).toUpperCase() }}</span>
                        </div>
                        
                        <!-- Назва компанії -->
                        <span class="font-medium truncate max-w-[100px] sm:max-w-[120px]">{{ review.partnerName }}</span>
                        
                        <!-- Оцінка партнера -->
                        <div class="flex items-center gap-0.5 flex-shrink-0">
                          <span class="text-amber-500 text-xs">★</span>
                          <span class="text-xs font-bold">{{ review.rating.toFixed(1) }}</span>
                        </div>
                        
                        <!-- Іконка відгуку -->
                        <div class="flex-shrink-0">
                          <svg class="w-3.5 h-3.5 text-gray-500 group-hover:text-savoy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Навички -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Навички</h3>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
            <div
              v-for="skill in currentStudent.skills"
              :key="skill.id"
              class="p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div class="flex flex-col gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <span class="font-semibold text-sm sm:text-base text-gray-800 break-words">{{ skill.name }}</span>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    :class="getSkillLevelClass(skill.level)"
                    class="px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                  >
                    {{ getSkillLevelText(skill.level) }}
                  </span>
                  <span v-if="skill.verified" class="text-green-500 text-sm sm:text-base flex-shrink-0" title="Перевірена навичка">
                    ✓
                  </span>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <p class="text-xs text-gray-500 capitalize">{{ getSkillCategoryText(skill.category) }}</p>
                <div v-if="skill.verified" class="text-xs text-green-600 font-medium whitespace-nowrap">
                  Перевірено
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Рекомендовані проєкти -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">Рекомендовані проєкти</h3>
            <span v-if="recommendedProjects.length > 0" class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              {{ recommendedProjects.length }} проєктів
            </span>
          </div>
          
          <div v-if="recommendedProjects.length === 0" class="text-center py-5 sm:py-6 md:py-8 text-gray-500 px-4">
            <p class="text-sm sm:text-base">Наразі немає рекомендованих проєктів</p>
            <p class="text-xs sm:text-sm mt-2">Оновіть свої навички або зачекайте на нові проєкти</p>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div
              v-for="project in recommendedProjects"
              :key="project.id"
              class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all cursor-pointer"
              @click="navigateToProject(project.id)"
            >
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h4 class="font-bold text-sm sm:text-base text-gray-800 break-words flex-1 pr-2">{{ project.name }}</h4>
                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded whitespace-nowrap flex-shrink-0">
                  {{ getMatchPercentage(project) }}% відповідність
                </span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">{{ project.description }}</p>
              
              <!-- Рекомендована роль -->
              <div v-if="project.recommendations" class="mb-2 sm:mb-3">
                <p class="text-xs text-gray-500">Рекомендована роль:</p>
                <p class="text-xs sm:text-sm font-medium text-savoy break-words">
                  {{ getRecommendedRole(project) }}
                </p>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500 mb-2 sm:mb-3">
                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span class="px-2 py-0.5 sm:py-1 bg-gray-100 rounded whitespace-nowrap">{{ project.category }}</span>
                  <span class="whitespace-nowrap">{{ getComplexityText(project.complexity) }}</span>
                </div>
                <span v-if="project.deadline" class="text-gray-600 whitespace-nowrap">
                  Дедлайн: {{ formatDate(project.deadline) }}
                </span>
              </div>
              
              <div class="flex flex-col lg:flex-row gap-2">
                <button
                  v-if="!hasAppliedToProject(project)"
                  class="flex-1 lg:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors text-xs sm:text-sm font-medium"
                  @click.stop="handleApply(project.id)"
                >
                  Подати заявку
                </button>
                <button
                  v-else
                  class="flex-1 lg:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-yellow-100 text-yellow-700 rounded-lg cursor-default text-xs sm:text-sm font-medium"
                  disabled
                >
                  Ваша заявка на розгляді
                </button>
                <button
                  class="flex-1 lg:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium"
                  @click.stop="navigateToProject(project.id)"
                >
                  Детальніше
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Мої проєкти -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">Мої проєкти</h3>
            <span v-if="myProjects.length > 0" class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              {{ myProjects.length }} проєктів
            </span>
          </div>
          
          <div v-if="myProjects.length === 0" class="text-center py-5 sm:py-6 md:py-8 text-gray-500 px-4">
            <p class="text-sm sm:text-base">Ви ще не приймаєте участі в проєктах</p>
            <p class="text-xs sm:text-sm mt-2">Подайте заявку на рекомендовані проєкти або чекайте на запрошення</p>
          </div>

          <div v-else class="space-y-3 sm:space-y-4">
            <div
              v-for="project in myProjects"
              :key="project.id"
              class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-savoy hover:shadow-sm transition-all cursor-pointer"
              @click="navigateToProject(project.id)"
            >
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5 sm:mb-2">
                    <h4 class="font-bold text-sm sm:text-base text-gray-800 break-words pr-2">{{ project.name }}</h4>
                    <span
                      :class="getProjectStatusClass(project.status)"
                      class="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0"
                    >
                      {{ getProjectStatusText(project.status) }}
                    </span>
                  </div>
                  <p class="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">{{ project.description }}</p>
                  
                  <!-- Інформація про проєкт -->
                  <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <div class="flex items-center gap-1">
                      <span>👥</span>
                      <span>{{ project.team.length }} учасників</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span>🏷️</span>
                      <span>{{ project.category }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span>⚡</span>
                      <span>{{ getComplexityText(project.complexity) }}</span>
                    </div>
                    <div v-if="project.deadline" class="flex items-center gap-1">
                      <span>📅</span>
                      <span>{{ formatDate(project.deadline) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Прогрес (якщо є борд) -->
                <div v-if="project.boardId" class="sm:ml-4 text-left sm:text-right flex-shrink-0 mt-2 sm:mt-0">
                  <p class="text-xs text-gray-500 mb-1">Прогрес</p>
                  <div class="w-full sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-savoy transition-all duration-300"
                      :style="{ width: getProjectProgress(project.id) + '%' }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1">{{ getProjectProgress(project.id) }}%</p>
                </div>
              </div>
              
              <!-- Ваша роль у проєкті -->
              <div v-if="getMyRoleInProject(project)" class="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                <p class="text-xs text-gray-500">Ваша роль:</p>
                <p class="text-xs sm:text-sm font-medium text-gray-800 break-words">{{ getMyRoleInProject(project) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Модальне вікно для відгуку партнера -->
    <Teleport to="body">
      <div v-if="selectedPartnerReview" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-4 sm:p-6">
          <!-- Заголовок -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">Відгук партнера</h3>
            <button
              @click="selectedPartnerReview = null"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Інформація про партнера -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-savoy/20 flex items-center justify-center">
              <span class="text-savoy font-bold text-lg">
                {{ selectedPartnerReview.partnerName?.charAt(0) || '?' }}
              </span>
            </div>
            <div>
              <h4 class="font-bold text-gray-800">{{ selectedPartnerReview.partnerName }}</h4>
              <p class="text-sm text-gray-600">{{ selectedPartnerReview.projectName }}</p>
              <p class="text-xs text-gray-500">{{ formatReviewDate(selectedPartnerReview.date) }}</p>
            </div>
          </div>
          
          <!-- Оцінка -->
          <div class="mb-4">
            <div class="flex items-center  gap-2 mb-2">
              <span class="text-sm text-gray-600">Оцінка:</span>
              <div class="flex items-center gap-1">
                <span v-for="n in 5" :key="n" class="text-lg">
                  <span v-if="n <= Math.floor(selectedPartnerReview.rating)" class="text-amber-500">★</span>
                  <span v-else-if="n === Math.ceil(selectedPartnerReview.rating) && selectedPartnerReview.rating % 1 !== 0" class="text-amber-500">½</span>
                  <span v-else class="text-gray-300">☆</span>
                </span>
                <span class="font-bold text-gray-800 ml-2">{{ selectedPartnerReview.rating.toFixed(1) }}/5.0</span>
              </div>
            </div>
            <p class="text-xs text-gray-500">
              {{ getRatingDescription(selectedPartnerReview.rating) }}
            </p>
          </div>
          
          <!-- Текст відгуку -->
          <div class="mb-4">
            <p class="response-txt text-gray-700 leading-relaxed">{{ selectedPartnerReview.comment }}</p>
          </div>
          
          <!-- Навички -->
          <div v-if="selectedPartnerReview.skills && selectedPartnerReview.skills.length > 0" class="mb-6">
            <p class="text-sm text-gray-600 mb-2">Оцінені навички:</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="skill in selectedPartnerReview.skills"
                :key="skill"
                class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {{ skill }}
              </span>
            </div>
          </div>
          
          <!-- Кнопка закриття -->
          <button
            @click="selectedPartnerReview = null"
            class="w-full py-3 bg-savoy text-white rounded-lg hover:bg-savoy/90 transition-colors font-medium"
          >
            Закрити
          </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Попап для сповіщень -->
    <Teleport to="body">
      <NotificationPopup
        :is-open="notificationPopup.isOpen"
        :title="notificationPopup.title"
        :message="notificationPopup.message"
        :type="notificationPopup.type"
        @close="closeNotification"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~~/stores/auth";
import { useProjectsStore } from "~~/stores/projects";
import NotificationPopup from "~~/components/NotificationPopup.vue";
import type { 
  Student, 
  Project, 
  Partner,
  PartnerReview,
  ProjectCategory,
  ComplexityLevel,
  StudentRecommendation,
  Skill
} from "~~/types";

const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

// Попап для сповіщень
const notificationPopup = ref({
  isOpen: false,
  title: "",
  message: "",
  type: "info" as "success" | "error" | "warning" | "info",
});

const showNotification = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "info") => {
  notificationPopup.value = {
    isOpen: true,
    title,
    message,
    type,
  };
};

const closeNotification = () => {
  notificationPopup.value.isOpen = false;
};

const showAllReviews = ref(false);
const selectedPartnerReview = ref<PartnerReview | null>(null);

// Функція для отримання відгуку для існуючого партнера
const getPartnerReview = (partnerId: string) => {
  if (!currentStudent.value) return null;
  
  // Шукаємо реальний відгук від цього партнера про поточного студента
  const review = studentReviews.value.find(r => r.partnerId === partnerId);
  
  if (review) {
    return review;
  }
  
  // Якщо відгуку немає, повертаємо null (не показуємо моковані дані)
  return null;
};

// Функція для опису рейтингу
const getRatingDescription = (rating: number): string => {
  if (rating >= 4.8) return "Відмінно";
  if (rating >= 4.3) return "Дуже добре";
  if (rating >= 3.8) return "Добре";
  if (rating >= 3.3) return "Задовільно";
  return "Можна краще";
};

// Обчислювані властивості - реальні відгуки
const partnerReviews = computed(() => {
  const reviews = studentReviews.value;
  if (showAllReviews.value) {
    return reviews;
  }
  return reviews.slice(0, 4);
});

// Статистика для всіх відгуків
const partnersReviewStats = computed(() => {
  const reviews = studentReviews.value;
  
  if (reviews.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  return {
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalReviews: reviews.length
  };
});

// Обчислений рейтинг студента на основі відгуків партнерів
const calculatedStudentRating = computed(() => {
  const reviews = studentReviews.value;
  
  if (reviews.length === 0) {
    // Якщо відгуків немає, повертаємо початковий рейтинг студента
    return currentStudent.value?.rating || 0;
  }
  
  // Обчислюємо середній рейтинг з усіх відгуків
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  return parseFloat(averageRating.toFixed(1));
});

// Функція форматування дати для відгуків
const formatReviewDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Сьогодні";
    if (diffDays === 1) return "Вчора";
    if (diffDays < 30) return `${diffDays} днів тому`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'місяць' : months < 5 ? 'місяці' : 'місяців'} тому`;
    }
    
    return date.toLocaleDateString('uk-UA', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  } catch {
    return "Недавно";
  }
};

// Комп'ютед властивості
const currentStudent = computed(() => {
  if (!authStore.currentUser || authStore.currentUser.role !== "student") {
    return null;
  }
  return authStore.currentUser as Student;
});

// Проєкти, де студент є в команді
const myProjects = computed(() => {
  if (!currentStudent.value) return [];
  return projectsStore.projects.filter((p: Project) => p.team.includes(currentStudent.value!.id));
});

// Завершені проєкти
const completedProjects = computed(() => {
  if (!currentStudent.value) return [];
  return myProjects.value.filter((p: Project) => p.status === 'completed');
});

// Партнери, проєкти яких виконував студент (тільки з завершених проєктів)
const partnersWorkedWith = computed(() => {
  if (!currentStudent.value) return [];
  
  const partnerIds = new Set<string>();
  
  // Збираємо унікальні ID партнерів тільки з завершених проєктів, де студент брав участь
  completedProjects.value.forEach((project: Project) => {
    if (project.partnerId) {
      partnerIds.add(project.partnerId);
    }
  });
  
  // Отримуємо об'єкти партнерів
  return Array.from(partnerIds)
    .map((partnerId: string) => projectsStore.partners.find((p: Partner) => p.id === partnerId))
    .filter((p): p is Partner => p !== undefined);
});

// Реальні відгуки про студента + демо-відгуки
const studentReviews = computed(() => {
  if (!currentStudent.value) return [];
  
  const realReviews = projectsStore.getReviewsByStudent(currentStudent.value.id);
  
  // Якщо є реальні відгуки, повертаємо їх
  if (realReviews.length > 0) {
    return realReviews;
  }
  
  // Генеруємо демо-відгуки на основі завершених проєктів
  const demoReviews: PartnerReview[] = [];
  const student = currentStudent.value;
  
  completedProjects.value.forEach((project: Project) => {
    if (project.partnerId && project.team.includes(student.id)) {
      const partner = projectsStore.partners.find((p: Partner) => p.id === project.partnerId);
      if (partner) {
        // Генеруємо відгук на основі навичок студента та проєкту
        const studentSkills = student.skills?.map((s) => s.name) || [];
        const relevantSkills = studentSkills.slice(0, 3); // Беремо перші 3 навички
        
        // Генеруємо оцінку на основі рейтингу студента (з невеликою варіацією)
        const baseRating = student.rating;
        const rating = Math.min(5, Math.max(4, baseRating + (Math.random() * 0.5 - 0.25)));
        
        // Генеруємо коментар на основі проєкту та навичок
        const comments = [
          `Відмінно виконав завдання на проєкті "${project.name}". Показав високий рівень професійності та відповідальності.`,
          `Студент продемонстрував чудові навички під час роботи над проєктом "${project.name}". Рекомендую для подальшої співпраці.`,
          `Якісна робота на проєкті "${project.name}". Студент швидко адаптувався до вимог та ефективно вирішував поставлені задачі.`,
          `Професійний підхід до роботи на проєкті "${project.name}". Відмінна комунікація та готовність до навчання.`,
          `Студент показав високий рівень компетентності під час виконання проєкту "${project.name}". Готовий до складних завдань.`,
        ];
        
        const comment = comments[Math.floor(Math.random() * comments.length)];
        
        const review: PartnerReview = {
          id: `demo-review-${project.id}-${student.id}`,
          partnerId: partner.id,
          partnerName: partner.companyName,
          studentId: student.id,
          projectId: project.id,
          projectName: project.name,
          rating: Math.round(rating * 10) / 10, // Округлюємо до 1 знака після коми
          comment: comment,
          skills: relevantSkills.length > 0 ? relevantSkills : undefined,
          date: project.updatedAt || project.createdAt,
          createdAt: project.updatedAt || project.createdAt,
        };
        
        demoReviews.push(review);
      }
    }
  });
  
  return demoReviews;
});

// Рекомендовані проєкти на основі навичок
const recommendedProjects = computed(() => {
  if (!currentStudent.value) return [];

  return projectsStore.projects
    .filter((p: Project) => {
      // Показуємо тільки проєкти, де є рекомендації та студент ще не в команді
      return (
        p.status === 'pending_approval' &&
        p.recommendations &&
        !p.team.includes(currentStudent.value!.id)
      );
    })
    .map((project: Project) => {
      const recommendation = project.recommendations?.find(
        (r: StudentRecommendation) => r.studentId === currentStudent.value!.id
      );
      return {
        ...project,
        matchPercentage: recommendation?.matchPercentage || 0,
      };
    })
    .filter((p: any) => p.matchPercentage > 0)
    .sort((a: any, b: any) => b.matchPercentage - a.matchPercentage)
    .slice(0, 6);
});

// Відкрити відгук партнера (тепер використовуємо реальні відгуки)
const openPartnerReview = (review: PartnerReview) => {
  selectedPartnerReview.value = review;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Функції для навичок
const getSkillLevelText = (level: Skill["level"]): string => {
  const map: Record<Skill["level"], string> = {
    junior: "Початківець",
    middle: "Середній",
    senior: "Просунутий",
  };
  return map[level];
};

const getSkillLevelClass = (level: Skill["level"]): string => {
  const map: Record<Skill["level"], string> = {
    junior: "bg-blue-100 text-blue-700",
    middle: "bg-yellow-100 text-yellow-700",
    senior: "bg-green-100 text-green-700",
  };
  return map[level];
};

const getSkillCategoryText = (category: Skill["category"]): string => {
  const map: Record<Skill["category"], string> = {
    backend: "Backend",
    frontend: "Frontend",
    design: "Дизайн",
    analytics: "Аналітика",
    mobile: "Мобільна розробка",
    devops: "DevOps",
    other: "Інше",
  };
  return map[category];
};

// Функції для проєктів
const getMatchPercentage = (project: any): number => {
  return project.matchPercentage || 0;
};

const getRecommendedRole = (project: Project): string => {
  if (!project.recommendations || !currentStudent.value) return '';
  const recommendation = project.recommendations.find(
    (r: StudentRecommendation) => r.studentId === currentStudent.value!.id
  );
  return recommendation?.role || '';
};

const getProjectStatusText = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "Чернетка",
    pending_ai: "Очікує затвердження", // Показуємо як "Очікує затвердження", оскільки це проміжний статус
    pending_approval: "Очікує затвердження",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
  };
  return map[status];
};

const getProjectStatusClass = (status: Project["status"]): string => {
  const map: Record<Project["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    pending_ai: "bg-yellow-100 text-yellow-700", // Використовуємо той самий стиль, що й pending_approval
    pending_approval: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status];
};

const getStudentStatusText = (status: Student["status"]): string => {
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

const getComplexityText = (complexity: ComplexityLevel): string => {
  const map: Record<ComplexityLevel, string> = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };
  return map[complexity];
};

const getProjectProgress = (projectId: string): number => {
  // Спрощена логіка розрахунку прогресу
  // У реальному додатку це має бути на основі статусу завдань
  const project = projectsStore.getProjectById(projectId);
  if (!project) return 0;
  
  // Проста симуляція прогресу
  const statusProgress: Record<Project["status"], number> = {
    draft: 0,
    pending_ai: 10,
    pending_approval: 20,
    active: Math.floor(Math.random() * 60) + 30, // 30-90%
    completed: 100,
    cancelled: 0,
  };
  
  const status = project.status as keyof typeof statusProgress;
  return statusProgress[status] || 0;
};

const getMyRoleInProject = (project: Project): string => {
  if (!currentStudent.value) return '';
  
  for (const role of project.roles) {
    if (role.assigned.includes(currentStudent.value.id)) {
      return role.name;
    }
  }
  
  return 'Учасник';
};

const navigateToProject = (projectId?: string) => {
  if (!projectId) return;
  router.push(`/projects/${projectId}`);
};

// Навігація на опис проєкту (не на дошку)
const navigateToProjectDetails = (projectId?: string) => {
  if (!projectId) return;
  router.push(`/projects/${projectId}`);
};

const hasAppliedToProject = (project: Project): boolean => {
  if (!currentStudent.value || !project.applications) return false;
  return project.applications.includes(currentStudent.value.id);
};

const handleApply = (projectId?: string) => {
  if (!projectId || !currentStudent.value) return;
  
  const project = projectsStore.getProjectById(projectId);
  if (!project) {
    showNotification("Помилка", "Проєкт не знайдено", "error");
    return;
  }

  // Перевіряємо, чи студент вже подав заявку
  if (hasAppliedToProject(project)) {
    showNotification("Інформація", "Ви вже подали заявку на цей проєкт", "info");
    return;
  }

  // Перевіряємо, чи студент вже в команді
  if (project.team.includes(currentStudent.value.id)) {
    showNotification("Інформація", "Ви вже є учасником цього проєкту", "info");
    return;
  }

  projectsStore.applyToProject(projectId, currentStudent.value.id);
  showNotification("Успіх", `Заявку на проєкт "${project.name}" подано! Викладач розгляне вашу кандидатуру.`, "success");
};

const unreadCount = ref(0);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.response-txt {
  word-wrap: break-word;
}
</style>