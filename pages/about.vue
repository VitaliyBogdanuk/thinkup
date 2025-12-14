<template>
  <section class="w-full h-full overflow-y-auto flex-1 p-4 md:p-10 bg-lightGray">
    <!-- Hero Section -->
    <div class="max-w-6xl mx-auto">
      <div class="bg-gradient-to-br from-savoy to-blue-600 rounded-2xl p-8 md:p-12 mb-8 text-white text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">DEEP WATER</h1>
        <p class="text-xl md:text-2xl opacity-90">by ThinkUp</p>
        <p class="text-lg md:text-xl mt-6 opacity-80">
          Платформа, яка назавжди покликана скоротити відстань між університетським навчанням та реальною роботою
        </p>
      </div>

      <!-- Проблема -->
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Проблема</h2>
        </div>
        <p class="text-lg text-gray-700 leading-relaxed">
          Немає постійної точки взаємодії між освітою та ринком праці. У ВУЗах ми роками вдосконалюємо професійні навички, 
          вивчаємо тонни теоретичного матеріалу, але не маємо можливості застосувати їх на практиці у повну силу. 
          Навіть найкраща теорія не замінює життєвого досвіду в справжньому проєкті.
        </p>
        <p class="text-lg text-gray-700 leading-relaxed mt-4">
          Бізнес також відчуває цю проблему: компанії витрачають ресурси на донавчання своїх молодих спеціалістів, 
          тому що університети не встигають адаптувати програми до швидких змін ринку.
        </p>
      </div>

      <!-- Наше вирішення -->
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-savoy rounded-full flex items-center justify-center">
            <LightBulbIcon class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Наше вирішення</h2>
        </div>
        <p class="text-lg text-gray-700 leading-relaxed mb-6">
          <strong class="text-savoy">DEEP WATER</strong> — це платформа, яка інтегрує реальні бізнес-завдання компаній-партнерів 
          у внутрішній навчальний процес "університету майбутнього".
        </p>
        <div class="bg-gradient-to-r from-savoy/10 to-blue-50 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Ідея = Партнер + Викладач + Студент</h3>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-white rounded-lg p-4 text-center">
              <BuildingOfficeIcon class="w-10 h-10 text-savoy mx-auto mb-2" />
              <h4 class="font-semibold text-gray-800">Партнери</h4>
              <p class="text-sm text-gray-600 mt-2">Розміщують реальні проєкти</p>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
              <AcademicCapIcon class="w-10 h-10 text-savoy mx-auto mb-2" />
              <h4 class="font-semibold text-gray-800">Викладачі</h4>
              <p class="text-sm text-gray-600 mt-2">Формують та супроводжують команди</p>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
              <UserGroupIcon class="w-10 h-10 text-savoy mx-auto mb-2" />
              <h4 class="font-semibold text-gray-800">Студенти</h4>
              <p class="text-sm text-gray-600 mt-2">Отримують реальний досвід</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Як це працює -->
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Cog6ToothIcon class="w-6 h-6 text-green-600" />
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Як це працює?</h2>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-savoy/10 rounded-lg p-6">
            <div class="w-12 h-12 bg-savoy text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              01
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Розміщення завдання</h3>
            <p class="text-gray-600 text-sm">
              Партнери університету розміщують на платформі свої реальні проєкти та прикріплюють до них технічне завдання
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-savoy/10 rounded-lg p-6">
            <div class="w-12 h-12 bg-savoy text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              02
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Формування команди</h3>
            <p class="text-gray-600 text-sm">
              ШІ агент підбирає студентів згідно оцінювання навичок та їхнього рівня знань. Викладач формує і затверджує команду
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-savoy/10 rounded-lg p-6">
            <div class="w-12 h-12 bg-savoy text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              03
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Контроль виконання</h3>
            <p class="text-gray-600 text-sm">
              Ментор (викладач) супроводжує виконання завдання, компанії можуть брати участь у процесі та давати фідбек
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-savoy/10 rounded-lg p-6">
            <div class="w-12 h-12 bg-savoy text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
              04
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Фідбек та оцінка</h3>
            <p class="text-gray-600 text-sm">
              По завершенню проєкту відбувається зустріч із замовником та оцінювання виконання з обох сторін
            </p>
          </div>
        </div>
      </div>

      <!-- Плюси -->
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <StarIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Плюси для всіх сторін</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Університет -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
            <AcademicCapIcon class="w-10 h-10 text-purple-600 mb-4" />
            <h3 class="text-xl font-bold text-gray-800 mb-4">Університет</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Підсилення навчальної програми</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Зростання рейтингу та репутаційний вплив</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Фінансова стабільність через партнерські угоди</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Конкурентна перевага на ринку освіти</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Середовище інновацій</span>
              </li>
            </ul>
          </div>

          <!-- Студенти -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <UserGroupIcon class="w-10 h-10 text-blue-600 mb-4" />
            <h3 class="text-xl font-bold text-gray-800 mb-4">Студентам</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Реальний досвід у справжніх проєктах</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Оновлення портфоліо</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Шанс потрапити в команду під час навчання</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Безпечні умови з супроводом професіоналів</span>
              </li>
            </ul>
          </div>

          <!-- Партнери -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <BuildingOfficeIcon class="w-10 h-10 text-green-600 mb-4" />
            <h3 class="text-xl font-bold text-gray-800 mb-4">Партнерам</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Частина завдань виконаних безкоштовно (кешбек за партнерство)</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Вивільнення дорогоцінного часу внутрішніх працівників</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Доступ до молодих талантів та можливість найму</span>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Можливість впливати на підготовку майбутніх професіоналів</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Функціонал демо -->
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-savoy rounded-full flex items-center justify-center">
            <ComputerDesktopIcon class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Функціонал демо-версії</h2>
        </div>

        <!-- Що працює -->
        <div class="mb-8">
          <h3 class="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircleIcon class="w-6 h-6" />
            Що вже працює
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🔐 Система аутентифікації</h4>
              <p class="text-sm text-gray-600">Перемикання між ролями (Партнер, Викладач, Студент, Адміністратор)</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">📋 Створення проєктів</h4>
              <p class="text-sm text-gray-600">Партнери можуть створювати проєкти з ТЗ, категоріями, складністю, дедлайнами та ролями</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🤖 AI-аналіз проєктів</h4>
              <p class="text-sm text-gray-600">Симуляція AI-аналізу ТЗ та автоматична генерація канбан-дошки з задачами</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">👥 Підбір студентів</h4>
              <p class="text-sm text-gray-600">AI рекомендації студентів згідно навичок та відповідності проєкту</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">✅ Затвердження команди</h4>
              <p class="text-sm text-gray-600">Викладачі можуть переглядати AI-аналіз та затверджувати команду студентів</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">📊 Канбан-дошки</h4>
              <p class="text-sm text-gray-600">Повнофункціональні канбан-дошки з drag & drop, призначенням задач студентам, оцінками часу</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">📝 Управління задачами</h4>
              <p class="text-sm text-gray-600">Створення, редагування, призначення задач, встановлення пріоритетів та дедлайнів</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">💬 Система сповіщень</h4>
              <p class="text-sm text-gray-600">Реальні сповіщення через БД для всіх подій (створення проєкту, затвердження, призначення тощо)</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">👨‍💼 Адмін-панель</h4>
              <p class="text-sm text-gray-600">CRUD операції для управління студентами, викладачами та партнерами</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">💾 MongoDB інтеграція</h4>
              <p class="text-sm text-gray-600">Повна інтеграція з MongoDB для збереження проєктів, користувачів, дошок та сповіщень</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">📱 Адаптивний дизайн</h4>
              <p class="text-sm text-gray-600">Повністю адаптивний інтерфейс для мобільних пристроїв та планшетів</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🔍 Пошук та фільтрація</h4>
              <p class="text-sm text-gray-600">Пошук проєктів, фільтрація за статусами, пошук користувачів в адмін-панелі</p>
            </div>
          </div>
        </div>

        <!-- Що потрібно допрацювати -->
        <div>
          <h3 class="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon class="w-6 h-6" />
            Що потрібно допрацювати
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🤖 Реальна AI інтеграція</h4>
              <p class="text-sm text-gray-600">Інтеграція з OpenAI/Claude для реального аналізу ТЗ та підбору студентів</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">👤 Профілі користувачів</h4>
              <p class="text-sm text-gray-600">Детальні профілі студентів з портфоліо, історією проєктів, навичками</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">💬 Коментарі та обговорення</h4>
              <p class="text-sm text-gray-600">Система коментарів до задач, обговорення проєктів, чат між учасниками</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">📎 Файли та вкладення</h4>
              <p class="text-sm text-gray-600">Завантаження файлів до задач, ТЗ, результатів роботи</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🔗 Інтеграція з GitHub</h4>
              <p class="text-sm text-gray-600">Синхронізація з GitHub репозиторіями, відстеження комітів</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">⏱️ Трекінг часу</h4>
              <p class="text-sm text-gray-600">Відстеження витраченого часу на задачі, звіти по продуктивності</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">📊 Статистика та звіти</h4>
              <p class="text-sm text-gray-600">Детальна статистика по проєктам, студентам, продуктивності команд</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">📧 Email сповіщення</h4>
              <p class="text-sm text-gray-600">Відправка email сповіщень про важливі події</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🎥 Відео-конференції</h4>
              <p class="text-sm text-gray-600">Інтеграція з Zoom/Teams для зустрічей та презентацій результатів</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">💳 Платежна система</h4>
              <p class="text-sm text-gray-600">Система оплати за проєкти, кешбек для партнерів</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🔒 Розширена безпека</h4>
              <p class="text-sm text-gray-600">JWT аутентифікація, ролі та права доступу, аудит логів</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-2">🌐 Багатомовність</h4>
              <p class="text-sm text-gray-600">Підтримка української, англійської та інших мов</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  StarIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
} from "@heroicons/vue/24/outline";

// SEO мета-теги
useHead({
  title: "Про нас - Deep Water by ThinkUp",
  meta: [
    {
      name: "description",
      content: "Deep Water - платформа для інтеграції реальних бізнес-завдань у навчальний процес університету",
    },
  ],
});
</script>

<style scoped>
/* Додаткові стилі можна додати тут */
</style>

