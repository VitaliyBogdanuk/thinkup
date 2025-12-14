/**
 * Composable для перевірки, чи є дані захищеними (демо-даними)
 * Ці списки мають відповідати серверним спискам у server/utils/protectedData.ts
 */

// Захищені ID користувачів (демо-дані)
const PROTECTED_USER_IDS = [
  'admin-1',
  'student-1', 'student-2', 'student-3', 'student-4', 'student-5',
  'student-6', 'student-7', 'student-8', 'student-9', 'student-10',
  'student-11', 'student-12',
  'teacher-1', 'teacher-2', 'teacher-3', 'teacher-4',
  'partner-1', 'partner-2', 'partner-3', 'partner-4', 'partner-5',
];

// Захищені ID проєктів (демо-дані)
const PROTECTED_PROJECT_IDS = [
  '6da38f9c-05db-4e0e-951b-b431fde053cb', // Розробка веб-додатку для управління проєктами
  '12331f9b-369a-4e06-88fd-79bf73cf4c71', // Мобільний додаток для доставки їжі
  '97430d13-d0d5-4ce9-8282-d687ae3ce35d', // Редизайн корпоративного сайту
  '188546c8-b4f3-46a1-8588-fa3a8d3a6640', // Система аналітики для e-commerce
  'fe160626-e72b-4603-a834-760c435a5fd8', // E-commerce платформа для продажу одягу
  '53dd0fad-f5da-4933-a3a8-eddb098a1ef3', // Лендінг-сторінка для стартапу
];

// Захищені ID дошок (демо-дані)
const PROTECTED_BOARD_IDS = [
  '499ff073-7759-45c4-a62b-020860056830', // Дефолтна дошка "Будь-яка дошка"
  '2bfafb2e-4e62-4834-85d7-76caf616e662', // Розробка веб-додатку для управління проєктами
  '689b29d7-904f-4d31-bf2e-f256e55ab756', // Мобільний додаток для доставки їжі
  'd35ee504-da83-41d2-acb1-224c796b9c2c', // Редизайн корпоративного сайту
  '8f896704-e5ce-4e0c-9070-bf393c5864e9', // Система аналітики для e-commerce
  '5522b176-d85e-4369-a122-9f28d83f276f', // E-commerce платформа для продажу одягу
  'fd99ecaf-ee55-4b3b-b403-44fe8e5e7de4', // Лендінг-сторінка для стартапу
];

/**
 * Перевіряє, чи є користувач захищеним (демо-даними)
 */
export function isProtectedUser(userId: string): boolean {
  // Перевіряємо паттерн демо-даних: role-number (наприклад, "student-1", "admin-1")
  const demoPattern = /^(admin|student|teacher|partner)-\d+$/;
  return PROTECTED_USER_IDS.includes(userId) || demoPattern.test(userId);
}

/**
 * Перевіряє, чи є проєкт захищеним (демо-даними)
 */
export function isProtectedProject(projectId: string): boolean {
  return PROTECTED_PROJECT_IDS.includes(projectId);
}

/**
 * Перевіряє, чи є дошка захищеною (демо-даними)
 */
export function isProtectedBoard(boardId: string): boolean {
  return PROTECTED_BOARD_IDS.includes(boardId);
}

