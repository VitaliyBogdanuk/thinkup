interface Base {
  id: string;
  name: string;
}

interface Task extends Base {
  description: string;
  assignedTo?: string; // ID студента
  priority?: "low" | "medium" | "high";
  estimatedHours?: number;
  storyPoints?: number;
  dueDate?: string;
  tags?: string[];
  attachments?: string[];
  checklist?: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Column extends Base {
  tasks: Task[];
}

interface Board extends Base {
  columns: Column[];
  projectId?: string; // ID проєкту, якщо це проєктна дошка
}

interface TaskToEdit extends Task {
  columnParentId: string;
}

// Ролі користувачів
type UserRole = "partner" | "student" | "teacher" | "admin";

// Користувач
interface User extends Base {
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Партнерська компанія
interface Partner extends User {
  role: "partner";
  companyName: string;
  companyDescription?: string;
  contactPhone?: string;
}

// Навички студента
interface Skill {
  id: string;
  name: string;
  category: "backend" | "frontend" | "design" | "analytics" | "mobile" | "devops" | "other";
  level: "junior" | "middle" | "senior";
  verified: boolean; // Перевірена через тести/проєкти
}

// Профіль студента
interface Student extends User {
  role: "student";
  fullName: string;
  course: number; // Курс навчання
  specialty: string; // Спеціальність
  skills: Skill[];
  rating: number; // Рейтинг студента
  completedCourses: string[]; // ID пройдених курсів
  portfolio?: {
    github?: string;
    behance?: string;
    website?: string;
    projects?: string[]; // ID проєктів
  };
  availability: number; // Годин на тиждень
  status: "available" | "busy" | "unavailable";
}

// Викладач/Ментор
interface Teacher extends User {
  role: "teacher";
  fullName: string;
  department?: string;
  specialization?: string[];
}

// Категорії проєктів
type ProjectCategory = "IT" | "Маркетинг" | "Дизайн" | "Аналітика" | "Інше";

// Рівні складності
type ComplexityLevel = "low" | "medium" | "high";

// Роль у проєкті
interface ProjectRole {
  id: string;
  name: string; // "Frontend Developer", "Backend Developer", "Designer", etc.
  required: number; // Кількість потрібних студентів
  assigned: string[]; // ID призначених студентів
}

// Рекомендація AI для студента
interface StudentRecommendation {
  studentId: string;
  student: Student;
  matchPercentage: number; // Відсоток відповідності
  reasons: string[]; // Причини рекомендації
  role: string; // Рекомендована роль
}

// Проєкт
interface Project extends Base {
  description: string;
  technicalSpecification: string; // ТЗ
  category: ProjectCategory;
  complexity: ComplexityLevel;
  deadline?: string;
  partnerId: string; // ID партнера
  partner?: Partner;
  status: "draft" | "pending_ai" | "pending_approval" | "active" | "completed" | "cancelled";
  roles: ProjectRole[]; // Потрібні ролі
  team: string[]; // ID затверджених студентів
  boardId?: string; // ID канбан-дошки
  board?: Board;
  aiAnalysis?: {
    goals: string[];
    stages: string[];
    technicalRequirements: string[];
    estimatedDuration?: number;
    riskFactors?: string[];
  };
  recommendations?: StudentRecommendation[]; // AI рекомендації
  approvedBy?: string; // ID викладача, який затвердив
  approvedAt?: string;
  attachments?: string[]; // URL файлів
  createdAt: string;
  updatedAt: string;
}

// Команда проєкту
interface ProjectTeam {
  projectId: string;
  students: {
    studentId: string;
    student: Student;
    role: string;
    assignedAt: string;
  }[];
  teacherId?: string;
  teacher?: Teacher;
  approvedAt?: string;
}

// Базовий інтерфейс сповіщення
interface BaseNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  projectId?: string;
}

// Сповіщення для партнера
interface PartnerNotification extends BaseNotification {
  type: "project_status_update" | "new_student_application" | "project_approval" | "project_deadline" | "project_completed";
  studentId?: string;
}

// Сповіщення для студента
interface StudentNotification extends BaseNotification {
  type: "project_invitation" | "project_update" | "new_project" | "system";
}

// Сповіщення для викладача
interface TeacherNotification extends BaseNotification {
  type: "project_submission" | "student_application" | "project_approval" | "project_update" | "deadline_approaching";
  studentId?: string;
}

// Сповіщення для адміна
interface AdminNotification extends BaseNotification {
  type: "new_user_registration" | "project_created" | "system_alert" | "user_report" | "system_update";
  userId?: string;
}
