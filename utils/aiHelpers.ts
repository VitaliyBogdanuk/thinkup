// Допоміжні функції для AI симуляції

interface Subtask {
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  hours: number;
}

export const getSubtasksForStage = (
  stage: string,
  complexity: ComplexityLevel
): Subtask[] => {
  const stageLower = stage.toLowerCase();
  const baseHours = complexity === "low" ? 8 : complexity === "medium" ? 15 : 25;

  if (stageLower.includes("аналіз") || stageLower.includes("планування")) {
    return [
      {
        name: "Збір та аналіз вимог",
        description: "Детальний аналіз технічного завдання та вимог замовника",
        priority: "high",
        hours: baseHours,
      },
      {
        name: "Створення плану проєкту",
        description: "Розробка детального плану виконання проєкту",
        priority: "high",
        hours: baseHours * 0.5,
      },
    ];
  }

  if (stageLower.includes("архітектур") || stageLower.includes("проектування")) {
    return [
      {
        name: "Проектування бази даних",
        description: "Створення ER-діаграми та схемі БД",
        priority: "high",
        hours: baseHours * 0.8,
      },
      {
        name: "Проектування API",
        description: "Опис endpoints та структури API",
        priority: "high",
        hours: baseHours * 0.7,
      },
      {
        name: "Вибір технологій",
        description: "Визначення стеку технологій",
        priority: "medium",
        hours: baseHours * 0.3,
      },
    ];
  }

  if (stageLower.includes("дизайн") || stageLower.includes("ui") || stageLower.includes("ux")) {
    return [
      {
        name: "Створення wireframes",
        description: "Розробка макетів та структури інтерфейсу",
        priority: "high",
        hours: baseHours * 0.6,
      },
      {
        name: "UI дизайн",
        description: "Створення візуального дизайну інтерфейсу",
        priority: "high",
        hours: baseHours,
      },
      {
        name: "UX оптимізація",
        description: "Покращення користувацького досвіду",
        priority: "medium",
        hours: baseHours * 0.5,
      },
    ];
  }

  if (stageLower.includes("backend")) {
    return [
      {
        name: "Налаштування серверу",
        description: "Конфігурація серверного середовища",
        priority: "high",
        hours: baseHours * 0.4,
      },
      {
        name: "Розробка API",
        description: "Реалізація REST API endpoints",
        priority: "high",
        hours: baseHours * 1.2,
      },
      {
        name: "Робота з базою даних",
        description: "Створення моделей та міграцій БД",
        priority: "high",
        hours: baseHours * 0.8,
      },
      {
        name: "Автентифікація та авторизація",
        description: "Реалізація системи безпеки",
        priority: "high",
        hours: baseHours * 0.6,
      },
    ];
  }

  if (stageLower.includes("frontend")) {
    return [
      {
        name: "Налаштування проєкту",
        description: "Ініціалізація frontend проєкту та конфігурація",
        priority: "high",
        hours: baseHours * 0.3,
      },
      {
        name: "Розробка компонентів",
        description: "Створення UI компонентів",
        priority: "high",
        hours: baseHours * 1.5,
      },
      {
        name: "Інтеграція з API",
        description: "Підключення frontend до backend API",
        priority: "high",
        hours: baseHours * 0.7,
      },
      {
        name: "Адаптивність",
        description: "Забезпечення responsive дизайну",
        priority: "medium",
        hours: baseHours * 0.5,
      },
    ];
  }

  if (stageLower.includes("інтеграція")) {
    return [
      {
        name: "Інтеграція frontend та backend",
        description: "Об'єднання всіх компонентів системи",
        priority: "high",
        hours: baseHours,
      },
      {
        name: "Налаштування CI/CD",
        description: "Автоматизація деплою",
        priority: "medium",
        hours: baseHours * 0.5,
      },
    ];
  }

  if (stageLower.includes("тестування")) {
    return [
      {
        name: "Unit тести",
        description: "Написання та виконання unit тестів",
        priority: "medium",
        hours: baseHours * 0.8,
      },
      {
        name: "Integration тести",
        description: "Тестування інтеграції компонентів",
        priority: "medium",
        hours: baseHours * 0.6,
      },
      {
        name: "Виправлення помилок",
        description: "Багфікси та оптимізація",
        priority: "high",
        hours: baseHours * 0.7,
      },
    ];
  }

  if (stageLower.includes("деплой")) {
    return [
      {
        name: "Підготовка до деплою",
        description: "Фінальна перевірка та оптимізація",
        priority: "high",
        hours: baseHours * 0.4,
      },
      {
        name: "Деплой на production",
        description: "Розгортання на production сервер",
        priority: "high",
        hours: baseHours * 0.3,
      },
      {
        name: "Моніторинг та підтримка",
        description: "Налаштування моніторингу системи",
        priority: "low",
        hours: baseHours * 0.2,
      },
    ];
  }

  // За замовчуванням
  return [
    {
      name: stage,
      description: `Виконання етапу: ${stage}`,
      priority: "medium",
      hours: baseHours,
    },
  ];
};

