import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useProjectsApi, useUsersApi, useReviewsApi, useBoardsApi } from "~/composables/useApi";
import { useKanbanStore } from "./index";
import { useNotificationsStore } from "./notifications";
import { getSubtasksForStage } from "~~/utils/aiHelpers";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [] as Project[],
    students: [] as Student[],
    teachers: [] as Teacher[],
    partners: [] as Partner[],
    partnerReviews: [] as PartnerReview[],
    isLoading: false,
    isInitialized: false,
  }),
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
    // Завантаження всіх даних з API
    async loadAll() {
      if (this.isInitialized && !this.isLoading) {
        return; // Вже завантажено
      }

      this.isLoading = true;
      try {
        const projectsApi = useProjectsApi();
        const usersApi = useUsersApi();
        const reviewsApi = useReviewsApi();

        // Завантажуємо всі дані паралельно
        const [allUsers, allProjects, allReviews] = await Promise.all([
          usersApi.getAllUsers(),
          projectsApi.getAllProjects(),
          reviewsApi.getAllReviews(),
        ]);

        // Розділяємо користувачів за ролями та видаляємо дублікати за id
        const uniqueUsers = allUsers.reduce((acc, user) => {
          if (!acc.find(u => u.id === user.id)) {
            acc.push(user);
          }
          return acc;
        }, [] as User[]);
        
        this.students = uniqueUsers.filter((u) => u.role === "student") as Student[];
        this.partners = uniqueUsers.filter((u) => u.role === "partner") as Partner[];
        this.teachers = uniqueUsers.filter((u) => u.role === "teacher") as Teacher[];

        // Видаляємо дублікати проєктів за id
        this.projects = allProjects.reduce((acc, project) => {
          if (!acc.find(p => p.id === project.id)) {
            acc.push(project);
          }
          return acc;
        }, [] as Project[]);
        
        // Видаляємо дублікати відгуків за id
        this.partnerReviews = allReviews.reduce((acc, review) => {
          if (!acc.find(r => r.id === review.id)) {
            acc.push(review);
          }
          return acc;
        }, [] as PartnerReview[]);
        this.isInitialized = true;
      } catch (error) {
        console.error("Failed to load data from MongoDB:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Створення проєкту партнером
    async createProject(projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "status" | "boardId">): Promise<Project> {
      const newProject: Project = {
        ...projectData,
        id: uuidv4(),
        status: "pending_ai",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const projectsApi = useProjectsApi();
        const savedProject = await projectsApi.createProject(newProject);
        this.projects.push(savedProject);
        
        // Створюємо сповіщення про створення проєкту
        try {
          const notificationsStore = useNotificationsStore();
          await notificationsStore.notifyProjectCreated(
            savedProject.id,
            savedProject.name,
            savedProject.partnerId,
            this.teachers
          );
        } catch (notifError) {
          console.error("Failed to create notifications:", notifError);
        }
        
        return savedProject;
      } catch (error) {
        console.error("Failed to create project in MongoDB:", error);
        // Додаємо локально навіть якщо API не працює
        this.projects.push(newProject);
        return newProject;
      }
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

        // Оновлюємо дошку в MongoDB
        const boardsApi = useBoardsApi();
        await boardsApi.updateBoard(board.id, board).catch(console.error);

        project.boardId = board.id;
        project.board = board;
      }

      project.aiAnalysis = aiAnalysis;
      project.status = "pending_approval";
      project.updatedAt = new Date().toISOString();
      
      // Оновлюємо проєкт в MongoDB
      await this.updateProject(project.id, {
        aiAnalysis: aiAnalysis,
        status: "pending_approval",
        boardId: project.boardId,
        updatedAt: project.updatedAt,
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

      // Оновлюємо проєкт в MongoDB
      await this.updateProject(project.id, {
        recommendations: recommendations,
        updatedAt: project.updatedAt,
      });

      return recommendations;
    },

    // Затвердження команди викладачем
    async approveTeam(projectId: string, studentIds: string[], teacherId: string): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;

      project.team = studentIds;
      project.approvedBy = teacherId;
      project.approvedAt = new Date().toISOString();
      project.status = "active";
      project.updatedAt = new Date().toISOString();

      await this.updateProject(projectId, {
        team: studentIds,
        approvedBy: teacherId,
        approvedAt: project.approvedAt,
        status: "active",
        updatedAt: project.updatedAt,
      });
      
      // Створюємо сповіщення для призначених студентів
      try {
        const notificationsStore = useNotificationsStore();
        for (const studentId of studentIds) {
          await notificationsStore.createNotification({
            userId: studentId,
            role: "student",
            type: "project_invitation",
            title: "Вас призначено на проєкт",
            message: `Вас призначено на проєкт "${project.name}"`,
            projectId: project.id,
          });
        }
      } catch (notifError) {
        console.error("Failed to create notifications:", notifError);
      }
    },

    // Оновлення проєкту
    async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;

      Object.assign(project, updates);
      project.updatedAt = new Date().toISOString();

      try {
        const projectsApi = useProjectsApi();
        await projectsApi.updateProject(projectId, project);
      } catch (error) {
        console.error("Failed to update project in MongoDB:", error);
        // Дані вже оновлені локально
      }
    },

    // Видалення проєкту (тільки для адмінів)
    async deleteProject(projectId: string): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;

      try {
        const projectsApi = useProjectsApi();
        const boardsApi = useBoardsApi();
        const kanbanStore = useKanbanStore();
        
        // Видаляємо пов'язану дошку, якщо вона є
        if (project.boardId) {
          console.log(`Attempting to delete board ${project.boardId} for project ${projectId}`);
          try {
            await boardsApi.deleteBoard(project.boardId);
            console.log(`✓ Board ${project.boardId} deleted successfully`);
            // Видаляємо дошку з локального стану
            if (kanbanStore.boards) {
              const boardIndex = kanbanStore.boards.findIndex(b => b.id === project.boardId);
              if (boardIndex !== -1) {
                kanbanStore.boards.splice(boardIndex, 1);
                console.log(`✓ Board ${project.boardId} removed from local state`);
              }
            }
          } catch (error: any) {
            // Якщо дошка вже видалена на сервері (404) або захищена (403), це нормально
            if (error?.statusCode === 404 || error?.statusCode === 403) {
              console.log(`Board ${project.boardId} already deleted or protected, continuing`);
            } else {
              console.warn("Failed to delete board, continuing with project deletion:", error);
            }
          }
        } else {
          console.log(`Project ${projectId} has no boardId, skipping board deletion`);
        }
        
        // Видаляємо проєкт
        await projectsApi.deleteProject(projectId);
        
        // Видаляємо проєкт з локального стану
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
          this.projects.splice(index, 1);
        }
      } catch (error: any) {
        console.error("Failed to delete project in MongoDB:", error);
        // Якщо це помилка про захищені дані, передаємо її далі
        if (error?.statusCode === 403 || error?.data?.statusCode === 403) {
          throw error;
        }
        throw error;
      }
    },

    // Додавання студента
    async addStudent(student: Omit<Student, "id" | "createdAt">): Promise<Student> {
      const newStudent: Student = {
        ...student,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      try {
        const usersApi = useUsersApi();
        const savedStudent = await usersApi.createUser(newStudent);
        this.students.push(savedStudent as Student);
        return savedStudent as Student;
      } catch (error) {
        console.error("Failed to create student in MongoDB:", error);
        this.students.push(newStudent);
        return newStudent;
      }
    },

    // Оновлення профілю студента
    async updateStudent(studentId: string, updates: Partial<Student>): Promise<void> {
      const student = this.getStudentById(studentId);
      if (!student) return;

      Object.assign(student, updates);

      try {
        const usersApi = useUsersApi();
        await usersApi.updateUser(studentId, student);
      } catch (error) {
        console.error("Failed to update student in MongoDB:", error);
      }
    },

    // Призначення задачі студенту
    async assignTaskToStudent(projectId: string, taskId: string, studentId: string): Promise<void> {
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

      // Оновлюємо дошку в MongoDB
      const board = kanbanStore.boards?.find(b => b.id === project.boardId);
      if (board) {
        const boardsApi = useBoardsApi();
        await boardsApi.updateBoard(board.id, board).catch(console.error);
      }
    },

    // Прийняття запрошення на проєкт студентом
    async acceptProjectInvitation(projectId: string, studentId: string): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;

      if (!project.team.includes(studentId)) {
        project.team.push(studentId);
        
        if (project.applications) {
          const applicationIndex = project.applications.indexOf(studentId);
          if (applicationIndex > -1) {
            project.applications.splice(applicationIndex, 1);
          }
        }
        
        const availableRole = project.roles.find(
          (role) => role.assigned.length < role.required
        );
        if (availableRole) {
          availableRole.assigned.push(studentId);
        }
        
        project.updatedAt = new Date().toISOString();
        await this.updateProject(projectId, project);
      }
    },

    // Подача заявки студентом на проєкт
    async applyToProject(projectId: string, studentId: string): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;

      if (!project.applications) {
        project.applications = [];
      }

      if (!project.applications.includes(studentId) && !project.team.includes(studentId)) {
        project.applications.push(studentId);
        project.updatedAt = new Date().toISOString();
        await this.updateProject(projectId, project);
        
        // Створюємо сповіщення для викладачів та партнера
        try {
          const notificationsStore = useNotificationsStore();
          const student = this.getStudentById(studentId);
          
          // Сповіщення для викладачів
          for (const teacher of this.teachers) {
            await notificationsStore.createNotification({
              userId: teacher.id,
              role: "teacher",
              type: "student_application",
              title: "Нова заявка від студента",
              message: `${student?.fullName || 'Студент'} подав заявку на проєкт "${project.name}"`,
              projectId: project.id,
              studentId: studentId,
            });
          }
          
          // Сповіщення для партнера
          if (project.partnerId) {
            await notificationsStore.createNotification({
              userId: project.partnerId,
              role: "partner",
              type: "new_student_application",
              title: "Нова заявка від студента",
              message: `${student?.fullName || 'Студент'} подав заявку на ваш проєкт "${project.name}"`,
              projectId: project.id,
              studentId: studentId,
            });
          }
        } catch (notifError) {
          console.error("Failed to create notifications:", notifError);
        }
      }
    },

    // Прийняття заявки студента викладачем
    async acceptStudentApplication(projectId: string, studentId: string, teacherId: string): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;
      
      await this.acceptProjectInvitation(projectId, studentId);
      
      // Створюємо сповіщення для студента
      try {
        const notificationsStore = useNotificationsStore();
        await notificationsStore.createNotification({
          userId: studentId,
          role: "student",
          type: "project_invitation",
          title: "Вашу заявку прийнято",
          message: `Вашу заявку на проєкт "${project.name}" прийнято викладачем`,
          projectId: project.id,
        });
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
      }
    },

    // Затвердження проєкту викладачем
    async approveProjectByTeacher(projectId: string, teacherId: string): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project) return;
      
      await this.updateProject(projectId, {
        status: "active",
        approvedBy: teacherId,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Створюємо сповіщення про затвердження проєкту
      try {
        const notificationsStore = useNotificationsStore();
        
        // Сповіщення для партнера
        if (project.partnerId) {
          await notificationsStore.createNotification({
            userId: project.partnerId,
            role: "partner",
            type: "project_approval",
            title: "Проєкт затверджено",
            message: `Ваш проєкт "${project.name}" затверджено викладачем`,
            projectId: project.id,
          });
        }
        
        // Сповіщення для студентів, які призначені на проєкт
        if (project.team && project.team.length > 0) {
          for (const teamMember of project.team) {
            await notificationsStore.createNotification({
              userId: teamMember.studentId,
              role: "student",
              type: "project_update",
              title: "Проєкт затверджено",
              message: `Проєкт "${project.name}", на якому ви працюєте, затверджено викладачем`,
              projectId: project.id,
            });
          }
        }
      } catch (notifError) {
        console.error("Failed to create notifications:", notifError);
      }
    },

    // Продовження терміну проєкту
    async extendProjectDeadline(projectId: string, days: number = 7): Promise<void> {
      const project = this.getProjectById(projectId);
      if (!project || !project.deadline) return;

      const currentDeadline = new Date(project.deadline);
      const newDeadline = new Date(currentDeadline);
      newDeadline.setDate(newDeadline.getDate() + days);
      
      await this.updateProject(projectId, {
        deadline: newDeadline.toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),
      });
    },

    // Додавання відгуку партнера про студента
    async addPartnerReview(reviewData: Omit<PartnerReview, "id" | "date" | "createdAt">): Promise<PartnerReview> {
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

      try {
        const reviewsApi = useReviewsApi();
        const savedReview = await reviewsApi.createOrUpdateReview(review);
        
        if (existingReview) {
          const index = this.partnerReviews.indexOf(existingReview);
          this.partnerReviews[index] = savedReview;
        } else {
          this.partnerReviews.push(savedReview);
        }

        // Оновлюємо рейтинг студента
        await this.updateStudentRating(reviewData.studentId);
        return savedReview;
      } catch (error) {
        console.error("Failed to save review in MongoDB:", error);
        if (existingReview) {
          const index = this.partnerReviews.indexOf(existingReview);
          this.partnerReviews[index] = review;
        } else {
          this.partnerReviews.push(review);
        }
        await this.updateStudentRating(reviewData.studentId);
        return review;
      }
    },

    // Оновлення рейтингу студента на основі відгуків
    async updateStudentRating(studentId: string): Promise<void> {
      const student = this.getStudentById(studentId);
      if (!student) return;

      const reviews = this.getReviewsByStudent(studentId);
      if (reviews.length === 0) return;

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      student.rating = parseFloat(averageRating.toFixed(1));
      
      await this.updateStudent(studentId, { rating: student.rating });
    },
  },
});
