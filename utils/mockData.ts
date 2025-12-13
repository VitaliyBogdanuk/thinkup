import { v4 as uuidv4 } from "uuid";

// Моковані студенти
export const mockStudents: Student[] = [
  {
    id: "student-1",
    name: "student-1",
    email: "ivan.petrov@example.com",
    role: "student",
    fullName: "Іван Петров",
    course: 3,
    specialty: "Комп'ютерні науки",
    skills: [
      { id: "skill-1", name: "Vue.js", category: "frontend", level: "middle", verified: true },
      { id: "skill-2", name: "TypeScript", category: "frontend", level: "middle", verified: true },
      { id: "skill-3", name: "Nuxt.js", category: "frontend", level: "junior", verified: true },
      { id: "skill-4", name: "CSS/SCSS", category: "frontend", level: "middle", verified: true },
    ],
    rating: 4.5,
    completedCourses: ["course-1", "course-2"],
    portfolio: {
      github: "https://github.com/ivan-petrov",
      projects: ["project-1", "project-2"],
    },
    availability: 20,
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "student-2",
    name: "student-2",
    email: "maria.kovalenko@example.com",
    role: "student",
    fullName: "Марія Коваленко",
    course: 4,
    specialty: "Комп'ютерні науки",
    skills: [
      { id: "skill-5", name: "Node.js", category: "backend", level: "middle", verified: true },
      { id: "skill-6", name: "PostgreSQL", category: "backend", level: "middle", verified: true },
      { id: "skill-7", name: "Express.js", category: "backend", level: "junior", verified: true },
      { id: "skill-8", name: "REST API", category: "backend", level: "middle", verified: true },
    ],
    rating: 4.7,
    completedCourses: ["course-1", "course-3", "course-4"],
    portfolio: {
      github: "https://github.com/maria-kovalenko",
      projects: ["project-3"],
    },
    availability: 15,
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "student-3",
    name: "student-3",
    email: "oleksandr.sydorenko@example.com",
    role: "student",
    fullName: "Олександр Сидоренко",
    course: 2,
    specialty: "Дизайн",
    skills: [
      { id: "skill-9", name: "Figma", category: "design", level: "middle", verified: true },
      { id: "skill-10", name: "Adobe XD", category: "design", level: "junior", verified: true },
      { id: "skill-11", name: "UI/UX Design", category: "design", level: "middle", verified: true },
    ],
    rating: 4.2,
    completedCourses: ["course-5"],
    portfolio: {
      behance: "https://behance.net/oleksandr-sydorenko",
      projects: ["project-4"],
    },
    availability: 25,
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "student-4",
    name: "student-4",
    email: "anna.melnyk@example.com",
    role: "student",
    fullName: "Анна Мельник",
    course: 3,
    specialty: "Комп'ютерні науки",
    skills: [
      { id: "skill-12", name: "React", category: "frontend", level: "middle", verified: true },
      { id: "skill-13", name: "Redux", category: "frontend", level: "junior", verified: true },
      { id: "skill-14", name: "JavaScript", category: "frontend", level: "middle", verified: true },
    ],
    rating: 4.3,
    completedCourses: ["course-1", "course-2"],
    portfolio: {
      github: "https://github.com/anna-melnyk",
    },
    availability: 18,
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "student-5",
    name: "student-5",
    email: "dmitro.ivanov@example.com",
    role: "student",
    fullName: "Дмитро Іванов",
    course: 4,
    specialty: "Комп'ютерні науки",
    skills: [
      { id: "skill-15", name: "Python", category: "backend", level: "middle", verified: true },
      { id: "skill-16", name: "Django", category: "backend", level: "junior", verified: true },
      { id: "skill-17", name: "Data Analysis", category: "analytics", level: "junior", verified: true },
    ],
    rating: 4.0,
    completedCourses: ["course-6"],
    portfolio: {
      github: "https://github.com/dmitro-ivanov",
    },
    availability: 12,
    status: "busy",
    createdAt: new Date().toISOString(),
  },
];

// Моковані партнери
export const mockPartners: Partner[] = [
  {
    id: "partner-1",
    name: "partner-1",
    email: "contact@techcompany.com",
    role: "partner",
    companyName: "Tech Solutions Ukraine",
    companyDescription: "Провідна IT компанія, що спеціалізується на веб-розробці",
    contactPhone: "+380501234567",
    createdAt: new Date().toISOString(),
  },
  {
    id: "partner-2",
    name: "partner-2",
    email: "info@designstudio.com",
    role: "partner",
    companyName: "Creative Design Studio",
    companyDescription: "Студія дизайну та брендингу",
    contactPhone: "+380502345678",
    createdAt: new Date().toISOString(),
  },
];

// Моковані викладачі
export const mockTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "teacher-1",
    email: "professor.smith@university.edu",
    role: "teacher",
    fullName: "Професор Сміт",
    department: "Кафедра комп'ютерних наук",
    specialization: ["Веб-розробка", "Архітектура ПЗ"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-2",
    name: "teacher-2",
    email: "mentor.johnson@university.edu",
    role: "teacher",
    fullName: "Ментор Джонсон",
    department: "Кафедра дизайну",
    specialization: ["UI/UX Design", "Графічний дизайн"],
    createdAt: new Date().toISOString(),
  },
];

// Мокований адмін
export const mockAdmin: User = {
  id: "admin-1",
  name: "admin-1",
  email: "admin@thinkup.edu",
  role: "admin",
  createdAt: new Date().toISOString(),
};

// Моковані тестові проєкти
export const mockProjects: Omit<Project, "id" | "createdAt" | "updatedAt" | "boardId" | "board">[] = [
  {
    name: "Розробка веб-додатку для управління проєктами",
    description: "Створення сучасного веб-додатку з канбан-дошками, призначенням задач та відстеженням прогресу команди",
    technicalSpecification: `ТЕХНІЧНЕ ЗАВДАННЯ
Розробка веб-додатку для управління проєктами

1. ОПИС ПРОЄКТУ
Необхідно розробити веб-додаток для управління проєктами з канбан-дошками, призначенням задач та відстеженням прогресу.

2. ФУНКЦІОНАЛЬНІ ВИМОГИ
- Аутентифікація та авторизація користувачів
- Створення та управління проєктами
- Канбан-дошки з drag & drop
- Призначення задач користувачам
- Коментарі та файли до задач

3. ТЕХНІЧНІ ВИМОГИ
Frontend: Vue.js 3 / Nuxt.js 3, TypeScript, Tailwind CSS
Backend: Node.js з Express, PostgreSQL
API: REST або GraphQL
Інтеграції: GitHub API, Email сервіс

4. ДИЗАЙН ТА UX
Сучасний інтуїтивний інтерфейс, темна/світла тема, адаптивний дизайн

5. БЕЗПЕКА
Хешування паролів, валідація даних, захист від XSS/CSRF

6. ДЕДЛАЙН
Проєкт має бути завершений через 3 місяці.`,
    category: "IT",
    complexity: "high",
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    partnerId: "partner-1",
    status: "pending_approval",
    roles: [
      { id: uuidv4(), name: "Frontend Developer", required: 2, assigned: [] },
      { id: uuidv4(), name: "Backend Developer", required: 2, assigned: [] },
      { id: uuidv4(), name: "UI/UX Designer", required: 1, assigned: [] },
    ],
    team: [],
  },
  {
    name: "Мобільний додаток для доставки їжі",
    description: "Розробка мобільного додатку для iOS та Android з функціоналом замовлення їжі, відстеження доставки та оплати",
    technicalSpecification: `ТЕХНІЧНЕ ЗАВДАННЯ
Мобільний додаток для доставки їжі

1. ОПИС
Розробка нативного мобільного додатку для платформ iOS та Android з повним функціоналом замовлення їжі.

2. ФУНКЦІОНАЛЬНІСТЬ
- Каталог ресторанів та страв
- Кошик та оформлення замовлення
- Система оплати (картки, готівка)
- Відстеження доставки в реальному часі
- Історія замовлень
- Реєстрація та профіль користувача

3. ТЕХНОЛОГІЇ
- React Native або Flutter
- Backend API на Node.js
- База даних MongoDB
- Push-сповіщення
- Інтеграція з платіжними системами

4. ДИЗАЙН
Сучасний мінімалістичний дизайн, зручна навігація, швидке завантаження

5. ДЕДЛАЙН
2 місяці з моменту початку.`,
    category: "IT",
    complexity: "high",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    partnerId: "partner-1",
    status: "active",
    roles: [
      { id: uuidv4(), name: "Mobile Developer (React Native)", required: 2, assigned: ["student-1", "student-4"] },
      { id: uuidv4(), name: "Backend Developer", required: 1, assigned: ["student-2"] },
      { id: uuidv4(), name: "UI/UX Designer", required: 1, assigned: ["student-3"] },
    ],
    team: ["student-1", "student-2", "student-3", "student-4"],
  },
  {
    name: "Редизайн корпоративного сайту",
    description: "Сучасний редизайн корпоративного сайту з покращеним UX та адаптивністю",
    technicalSpecification: `ТЕХНІЧНЕ ЗАВДАННЯ
Редизайн корпоративного сайту

1. МЕТА
Оновити дизайн та функціонал корпоративного сайту для покращення користувацького досвіду та конверсії.

2. ВИМОГИ
- Сучасний дизайн у корпоративних кольорах
- Адаптивність для всіх пристроїв
- Швидке завантаження сторінок
- SEO оптимізація
- Інтеграція з CRM системою

3. ТЕХНОЛОГІЇ
- HTML5, CSS3, JavaScript
- Можливо використання Vue.js для інтерактивних елементів
- CMS для управління контентом

4. СТРУКТУРА
- Головна сторінка
- Про компанію
- Послуги
- Портфоліо
- Контакти
- Блог

5. ДЕДЛАЙН
1.5 місяці.`,
    category: "Дизайн",
    complexity: "medium",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    partnerId: "partner-2",
    status: "pending_approval",
    roles: [
      { id: uuidv4(), name: "UI/UX Designer", required: 2, assigned: [] },
      { id: uuidv4(), name: "Frontend Developer", required: 1, assigned: [] },
    ],
    team: [],
  },
  {
    name: "Система аналітики для e-commerce",
    description: "Розробка системи збору та аналізу даних для інтернет-магазину з візуалізацією метрик",
    technicalSpecification: `ТЕХНІЧНЕ ЗАВДАННЯ
Система аналітики для e-commerce

1. ОПИС
Розробка системи збору, обробки та візуалізації даних для інтернет-магазину.

2. ФУНКЦІОНАЛЬНІСТЬ
- Збір даних про продажі, користувачів, товари
- Дашборд з ключовими метриками
- Звіти та аналітика
- Прогнози та рекомендації
- Експорт даних

3. ТЕХНОЛОГІЇ
- Python для обробки даних
- PostgreSQL для зберігання
- React для дашборду
- Chart.js для візуалізації
- API для інтеграції з магазином

4. МЕТРИКИ
- Обсяг продажів
- Конверсія
- Середній чек
- Популярні товари
- Географія покупців

5. ДЕДЛАЙН
2 місяці.`,
    category: "Аналітика",
    complexity: "medium",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    partnerId: "partner-1",
    status: "pending_approval",
    roles: [
      { id: uuidv4(), name: "Data Analyst", required: 1, assigned: [] },
      { id: uuidv4(), name: "Backend Developer (Python)", required: 1, assigned: [] },
      { id: uuidv4(), name: "Frontend Developer", required: 1, assigned: [] },
    ],
    team: [],
  },
  {
    name: "E-commerce платформа для продажу одягу",
    description: "Розробка повнофункціонального інтернет-магазину з системою управління товарами, кошиком та оплатою",
    technicalSpecification: `ТЕХНІЧНЕ ЗАВДАННЯ
E-commerce платформа для продажу одягу

1. ОПИС
Розробка сучасного інтернет-магазину для продажу одягу з повним функціоналом e-commerce.

2. ФУНКЦІОНАЛЬНІСТЬ
- Каталог товарів з фільтрами та пошуком
- Кошик та оформлення замовлення
- Система оплати та доставки
- Особистий кабінет користувача
- Адмін-панель для управління товарами

3. ТЕХНОЛОГІЇ
- Frontend: Vue.js 3, Nuxt.js
- Backend: Node.js, Express
- База даних: PostgreSQL
- Платіжна система: Stripe

4. ДЕДЛАЙН
Завершено.`,
    category: "IT",
    complexity: "high",
    deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    partnerId: "partner-1",
    status: "completed",
    roles: [
      { id: uuidv4(), name: "Frontend Developer", required: 2, assigned: ["student-1", "student-4"] },
      { id: uuidv4(), name: "Backend Developer", required: 1, assigned: ["student-2"] },
      { id: uuidv4(), name: "UI/UX Designer", required: 1, assigned: ["student-3"] },
    ],
    team: ["student-1", "student-2", "student-3", "student-4"],
    approvedBy: "teacher-1",
    approvedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "Лендінг-сторінка для стартапу",
    description: "Створення сучасної лендінг-сторінки з анімаціями та формою зворотного зв'язку",
    technicalSpecification: `ТЕХНІЧНЕ ЗАВДАННЯ
Лендінг-сторінка для стартапу

1. ОПИС
Розробка односторінкового сайту для презентації стартапу з формою зворотного зв'язку.

2. ВИМОГИ
- Сучасний дизайн
- Адаптивність
- Швидке завантаження
- SEO оптимізація

3. ТЕХНОЛОГІЇ
- HTML5, CSS3, JavaScript
- Анімації на CSS/JS

4. ДЕДЛАЙН
Завершено.`,
    category: "Дизайн",
    complexity: "low",
    deadline: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    partnerId: "partner-2",
    status: "completed",
    roles: [
      { id: uuidv4(), name: "UI/UX Designer", required: 1, assigned: ["student-3"] },
      { id: uuidv4(), name: "Frontend Developer", required: 1, assigned: ["student-1"] },
    ],
    team: ["student-1", "student-3"],
    approvedBy: "teacher-2",
    approvedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Функція для ініціалізації мокованих даних
export const initializeMockData = (
  students: Student[],
  partners: Partner[],
  teachers: Teacher[],
  projects: Project[]
) => {
  // Додаємо студентів, якщо їх немає
  if (students.length === 0) {
    students.push(...mockStudents);
  }

  // Додаємо партнерів, якщо їх немає
  if (partners.length === 0) {
    partners.push(...mockPartners);
  }

  // Додаємо викладачів, якщо їх немає
  if (teachers.length === 0) {
    teachers.push(...mockTeachers);
  }

  // Додаємо тестові проєкти, якщо їх немає
  if (projects.length === 0) {
    const now = new Date();
    mockProjects.forEach((mockProject) => {
      const project: Project = {
        ...mockProject,
        id: uuidv4(),
        createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        boardId: undefined,
        board: undefined,
      };
      projects.push(project);
    });
  }
};

