import { defineNuxtPlugin } from "#app";
import { useProjectsStore } from "~~/stores/projects";
import { useKanbanStore } from "~~/stores";
import { getSubtasksForStage } from "~~/utils/aiHelpers";

export default defineNuxtPlugin(async () => {
  const projectsStore = useProjectsStore();
  const kanbanStore = useKanbanStore();

  // Ініціалізуємо проєкти з канбан-дошками та рекомендаціями
  for (const project of projectsStore.projects) {
    if (!project.boardId && project.status !== "draft") {
      // Створюємо канбан-дошку
      kanbanStore.createNewBoard(project.name);
      const board = kanbanStore.boards?.[kanbanStore.boards.length - 1];

      if (board) {
        // Генеруємо задачі на основі ТЗ
        const tz = project.technicalSpecification.toLowerCase();
        
        // Визначаємо етапи на основі складності
        let stages: string[] = [];
        if (project.complexity === "low") {
          stages = [
            "Аналіз вимог та планування",
            "Проектування архітектури",
            "Розробка UI/UX дизайну",
            "Frontend розробка",
            "Тестування та деплой",
          ];
        } else if (project.complexity === "medium") {
          stages = [
            "Аналіз вимог та планування",
            "Проектування архітектури",
            "Розробка UI/UX дизайну",
            "Backend розробка",
            "Frontend розробка",
            "Інтеграція компонентів",
            "Тестування та деплой",
          ];
        } else {
          stages = [
            "Аналіз вимог та планування",
            "Проектування архітектури",
            "Розробка UI/UX дизайну",
            "Backend розробка",
            "Frontend розробка",
            "Інтеграція компонентів",
            "Тестування та виправлення помилок",
            "Деплой та налаштування",
          ];
        }

        // Генеруємо задачі
        stages.forEach((stage) => {
          const subtasks = getSubtasksForStage(stage, project.complexity);
          subtasks.forEach((subtask) => {
            const columnId = board.columns[0].id; // To Do колонка
            kanbanStore.addTaskToColumn(board.id, columnId, {
              name: subtask.name,
              description: subtask.description,
              priority: subtask.priority,
              estimatedHours: subtask.hours,
              tags: [stage],
            });
          });
        });

        // Оновлюємо проєкт
        project.boardId = board.id;
        project.board = board;

        // Генеруємо рекомендації студентів
        await projectsStore.generateStudentRecommendations(project.id);
      }
    }
  }
});

