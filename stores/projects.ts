import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useStorage } from "@vueuse/core";
import { useKanbanStore } from "./index";
import { initializeMockData } from "~~/utils/mockData";
import { getSubtasksForStage } from "~~/utils/aiHelpers";

export const useProjectsStore = defineStore("projects", {
  state: () => {
    const students = useStorage<Student[]>("students", []);
    const partners = useStorage<Partner[]>("partners", []);
    const teachers = useStorage<Teacher[]>("teachers", []);
    const projects = useStorage<Project[]>("projects", []);
    const partnerReviews = useStorage<PartnerReview[]>("partnerReviews", []);
    
    // Ініціалізуємо моковані дані при першому завантаженні
    if (typeof window !== "undefined") {
      initializeMockData(students.value, partners.value, teachers.value, projects.value);
    }
    
    return {
      projects,
      students,
      teachers,
      partners,
      partnerReviews,
    };
  },
  getters: {
    getProjectById: (state) => (projectId: string): Project | undefined => {
      return state.projects.find((p) => p.id === projectId);
    },
    getProjectsByPartner: (state) => (partnerId: string): Project[] => {
      return state.projects.filter((p) => p.partnerId === partnerId);
    },
    getStudentById: (state) => (studentId: string): Student | undefined => {
      return state.students.find((s) => s.id === studentId);
    },
    getAvailableStudents: (state): Student[] => {
      return state.students.filter((s) => s.status === "available");
    },
    getProjectsPendingApproval: (state): Project[] => {
      return state.projects.filter((p) => p.status === "pending_approval");
    },
    getReviewsByStudent: (state) => (studentId: string): PartnerReview[] => {
      return state.partnerReviews.filter((r) => r.studentId === studentId);
    },
    getReviewByPartnerAndStudent: (state) => (partnerId: string, studentId: string, projectId: string): PartnerReview | undefined => {
      return state.partnerReviews.find(
        (r) => r.partnerId === partnerId && r.studentId === studentId && r.projectId === projectId
      );
    },
  },
  actions: {
    // Створення проєкту партнером
    createProject(projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "status" | "boardId">): Project {
      const newProject: Project = {
        ...projectData,
        id: uuidv4(),
        status: "pending_ai",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.projects.push(newProject);
      return newProject;
    },

    // AI-аналіз ТЗ та генерація структури (симуляція)
    async analyzeProjectWithAI(projectId: string): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;

      // Симуляція AI-аналізу на основі ТЗ
      const tz = project.technicalSpecification.toLowerCase();
      
      // Визначаємо технології з ТЗ
      const technologies: string[] = [];
      if (tz.includes("vue") || tz.includes("nuxt")) technologies.push("Vue.js/Nuxt.js");
      if (tz.includes("react")) technologies.push("React");
      if (tz.includes("node") || tz.includes("backend")) technologies.push("Node.js");
      if (tz.includes("postgres") || tz.includes("database")) technologies.push("PostgreSQL");
      if (tz.includes("api") || tz.includes("rest")) technologies.push("REST API");
      if (tz.includes("design") || tz.includes("ui")) technologies.push("UI/UX Design");

      // Генеруємо цілі на основі опису
      const goals = [
        "Реалізувати основний функціонал проєкту",
        "Забезпечити безпеку та надійність системи",
        "Створити інтуїтивний та зручний інтерфейс",
      ];

      if (tz.includes("mobile") || tz.includes("responsive")) {
        goals.push("Забезпечити адаптивність для мобільних пристроїв");
      }

      // Генеруємо етапи на основі складності
      const baseStages = [
        "Аналіз вимог та планування",
        "Проектування архітектури",
        "Розробка UI/UX дизайну",
        "Backend розробка",
        "Frontend розробка",
        "Інтеграція компонентів",
        "Тестування та виправлення помилок",
        "Деплой та налаштування",
      ];

      const stages = project.complexity === "low" 
        ? baseStages.slice(0, 5)
        : project.complexity === "medium"
        ? baseStages.slice(0, 7)
        : baseStages;

      // Оцінка тривалості
      const hoursPerStage = project.complexity === "low" ? 15 : project.complexity === "medium" ? 25 : 40;
      const estimatedDuration = stages.length * hoursPerStage;

      const aiAnalysis = {
        goals,
        stages,
        technicalRequirements: technologies.length > 0 
          ? technologies 
          : ["Сучасний веб-стек", "База даних", "API"],
        estimatedDuration,
        riskFactors: [
          project.team.length === 0 ? "Не сформована команда" : "",
          project.complexity === "high" ? "Висока складність проєкту" : "",
          !project.deadline ? "Відсутній дедлайн" : "",
        ].filter(Boolean),
      };

      // Створюємо канбан-дошку для проєкту
      const kanbanStore = useKanbanStore();
      kanbanStore.createNewBoard(project.name);
      const board = kanbanStore.boards?.[kanbanStore.boards.length - 1];

      if (board) {
        // Генеруємо детальні задачі на основі етапів
        stages.forEach((stage, index) => {
          const columnId = board.columns[0].id; // To Do колонка
          
          // Деталізуємо етапи на підзадачі
          const subtasks = getSubtasksForStage(stage, project.complexity);
          
          subtasks.forEach((subtask, subIndex) => {
            kanbanStore.addTaskToColumn(board.id, columnId, {
              name: subtask.name,
              description: subtask.description,
              priority: subtask.priority,
              estimatedHours: subtask.hours,
              tags: [stage],
            });
          });
        });

        project.boardId = board.id;
        project.board = board;
        
        // Оновлюємо проєкт з boardId
        this.updateProject(project.id, {
          boardId: board.id,
          board: board,
        });
      }

      project.aiAnalysis = aiAnalysis;
      project.status = "pending_approval";
      project.updatedAt = new Date().toISOString();
      
      // Оновлюємо проєкт з AI аналізом та статусом
      this.updateProject(project.id, {
        aiAnalysis: aiAnalysis,
        status: "pending_approval",
        updatedAt: new Date().toISOString(),
      });
    },

    // Генерація рекомендацій студентів (симуляція AI)
    async generateStudentRecommendations(projectId: string): Promise<StudentRecommendation[]> {
      const project = this.getProjectById(projectId);
      if (!project) return [];

      const recommendations: StudentRecommendation[] = [];

      // Симуляція підбору студентів для кожної ролі
      project.roles.forEach((role) => {
        const roleLower = role.name.toLowerCase();
        
        // Визначаємо категорію навичок для ролі
        let skillCategory: Skill["category"] | null = null;
        if (roleLower.includes("frontend") || roleLower.includes("react") || roleLower.includes("vue")) {
          skillCategory = "frontend";
        } else if (roleLower.includes("backend") || roleLower.includes("node") || roleLower.includes("api")) {
          skillCategory = "backend";
        } else if (roleLower.includes("design") || roleLower.includes("ui") || roleLower.includes("ux")) {
          skillCategory = "design";
        } else if (roleLower.includes("analytics") || roleLower.includes("data")) {
          skillCategory = "analytics";
        }

        // Фільтруємо студентів за навичками
        const availableStudents = this.getAvailableStudents
          .filter((s) => {
            if (!skillCategory) return true;
            return s.skills.some((skill) => skill.category === skillCategory);
          })
          .map((student) => {
            // Розраховуємо відсоток відповідності
            const matchingSkills = student.skills.filter((skill) => {
              if (skillCategory && skill.category !== skillCategory) return false;
              return roleLower.includes(skill.name.toLowerCase()) || 
                     roleLower.includes(skill.category);
            });

            const baseMatch = matchingSkills.length * 15; // Базовий відсоток за навички
            const ratingBonus = student.rating * 10; // Бонус за рейтинг
            const experienceBonus = student.completedCourses.length * 2; // Бонус за досвід
            const availabilityBonus = student.availability > 15 ? 5 : 0; // Бонус за доступність

            const matchPercentage = Math.min(
              95,
              Math.max(65, baseMatch + ratingBonus + experienceBonus + availabilityBonus)
            );

            return {
              student,
              matchPercentage: Math.round(matchPercentage),
              matchingSkills,
            };
          })
          .sort((a, b) => b.matchPercentage - a.matchPercentage)
          .slice(0, role.required * 3); // Беремо топ кандидатів

        availableStudents.forEach(({ student, matchPercentage, matchingSkills }) => {
          const reasons: string[] = [];
          
          if (matchingSkills.length > 0) {
            reasons.push(`Відповідні навички: ${matchingSkills.map((s) => s.name).join(", ")}`);
          }
          reasons.push(`Рейтинг: ${student.rating}/5.0`);
          reasons.push(`Досвід: ${student.completedCourses.length} завершених курсів`);
          if (student.availability >= 20) {
            reasons.push(`Висока доступність: ${student.availability} год/тиждень`);
          }

          recommendations.push({
            studentId: student.id,
            student,
            matchPercentage,
            reasons,
            role: role.name,
          });
        });
      });

      // Сортуємо за відсотком відповідності
      recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

      project.recommendations = recommendations;
      project.updatedAt = new Date().toISOString();

      return recommendations;
    },

    // Затвердження команди викладачем
    approveTeam(projectId: string, studentIds: string[], teacherId: string): void {
      const project = this.getProjectById(projectId);
      if (!project) return;

      project.team = studentIds;
      project.approvedBy = teacherId;
      project.approvedAt = new Date().toISOString();
      project.status = "active";
      project.updatedAt = new Date().toISOString();
    },

    // Оновлення проєкту
    updateProject(projectId: string, updates: Partial<Project>): void {
      const project = this.getProjectById(projectId);
      if (!project) return;

      Object.assign(project, updates);
      project.updatedAt = new Date().toISOString();
    },

    // Додавання студента
    addStudent(student: Omit<Student, "id" | "createdAt">): Student {
      const newStudent: Student = {
        ...student,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      this.students.push(newStudent);
      return newStudent;
    },

    // Оновлення профілю студента
    updateStudent(studentId: string, updates: Partial<Student>): void {
      const student = this.getStudentById(studentId);
      if (!student) return;

      Object.assign(student, updates);
    },

    // Призначення задачі студенту
    assignTaskToStudent(projectId: string, taskId: string, studentId: string): void {
      const project = this.getProjectById(projectId);
      if (!project || !project.boardId) return;

      const kanbanStore = useKanbanStore();
      const columns = kanbanStore.getBoardColumns(project.boardId);
      
      if (!columns) return;

      columns.forEach((column) => {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) {
          task.assignedTo = studentId;
        }
      });
    },

    // Прийняття запрошення на проєкт студентом
    acceptProjectInvitation(projectId: string, studentId: string): void {
      const project = this.getProjectById(projectId);
      if (!project) return;

      // Додаємо студента до команди, якщо його там ще немає
      if (!project.team.includes(studentId)) {
        project.team.push(studentId);
        
        // Видаляємо заявку з масиву applications, якщо вона є
        if (project.applications) {
          const applicationIndex = project.applications.indexOf(studentId);
          if (applicationIndex > -1) {
            project.applications.splice(applicationIndex, 1);
          }
        }
        
        // Знаходимо відповідну роль і додаємо студента
        const availableRole = project.roles.find(
          (role) => role.assigned.length < role.required
        );
        if (availableRole) {
          availableRole.assigned.push(studentId);
        }
        
        project.updatedAt = new Date().toISOString();
      }
    },

    // Подача заявки студентом на проєкт
    applyToProject(projectId: string, studentId: string): void {
      const project = this.getProjectById(projectId);
      if (!project) return;

      // Ініціалізуємо масив заявок, якщо його немає
      if (!project.applications) {
        project.applications = [];
      }

      // Додаємо заявку, якщо студент ще не подав заявку і не в команді
      if (!project.applications.includes(studentId) && !project.team.includes(studentId)) {
        project.applications.push(studentId);
        project.updatedAt = new Date().toISOString();
      }
    },

    // Прийняття заявки студента викладачем
    acceptStudentApplication(projectId: string, studentId: string, teacherId: string): void {
      const project = this.getProjectById(projectId);
      if (!project) return;

      // Додаємо студента до команди, якщо його там ще немає
      if (!project.team.includes(studentId)) {
        project.team.push(studentId);
        
        // Видаляємо заявку з масиву applications
        if (project.applications) {
          const applicationIndex = project.applications.indexOf(studentId);
          if (applicationIndex > -1) {
            project.applications.splice(applicationIndex, 1);
          }
        }
        
        // Знаходимо відповідну роль і додаємо студента
        const availableRole = project.roles.find(
          (role) => role.assigned.length < role.required
        );
        if (availableRole) {
          availableRole.assigned.push(studentId);
        }
        
        project.updatedAt = new Date().toISOString();
      }
    },

    // Затвердження проєкту викладачем
    approveProjectByTeacher(projectId: string, teacherId: string): void {
      const project = this.getProjectById(projectId);
      if (!project) return;

      project.status = "active";
      project.approvedBy = teacherId;
      project.approvedAt = new Date().toISOString();
      project.updatedAt = new Date().toISOString();
    },

    // Продовження терміну проєкту
    extendProjectDeadline(projectId: string, days: number = 7): void {
      const project = this.getProjectById(projectId);
      if (!project || !project.deadline) return;

      const currentDeadline = new Date(project.deadline);
      const newDeadline = new Date(currentDeadline);
      newDeadline.setDate(newDeadline.getDate() + days);
      
      project.deadline = newDeadline.toISOString().split("T")[0];
      project.updatedAt = new Date().toISOString();
    },

    // Додавання відгуку партнера про студента
    addPartnerReview(reviewData: Omit<PartnerReview, "id" | "date" | "createdAt">): PartnerReview {
      // Перевіряємо, чи вже є відгук від цього партнера про цього студента в цьому проєкті
      const existingReview = this.partnerReviews.find(
        (r) => r.partnerId === reviewData.partnerId && 
               r.studentId === reviewData.studentId && 
               r.projectId === reviewData.projectId
      );

      const now = new Date();
      const review: PartnerReview = {
        ...reviewData,
        id: existingReview?.id || uuidv4(),
        date: now.toISOString().split("T")[0],
        createdAt: now.toISOString(),
      };

      if (existingReview) {
        // Оновлюємо існуючий відгук
        const index = this.partnerReviews.indexOf(existingReview);
        this.partnerReviews[index] = review;
      } else {
        // Додаємо новий відгук
        this.partnerReviews.push(review);
      }

      // Оновлюємо рейтинг студента на основі всіх відгуків
      this.updateStudentRating(reviewData.studentId);

      return review;
    },

    // Оновлення рейтингу студента на основі відгуків
    updateStudentRating(studentId: string): void {
      const student = this.getStudentById(studentId);
      if (!student) return;

      const reviews = this.getReviewsByStudent(studentId);
      if (reviews.length === 0) return;

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      student.rating = parseFloat(averageRating.toFixed(1));
    },
  },
});

