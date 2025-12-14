import type { User, Project, Board, PartnerReview, BaseNotification } from '~/types';

// API для користувачів
export const useUsersApi = () => {
  const getAllUsers = async (): Promise<User[]> => {
    return await $fetch<User[]>('/api/users');
  };

  const getUserById = async (id: string): Promise<User> => {
    return await $fetch<User>(`/api/users/${id}`);
  };

  const createUser = async (user: Omit<User, '_id'>): Promise<User> => {
    return await $fetch<User>('/api/users', {
      method: 'POST',
      body: user,
    });
  };

  const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
    return await $fetch<User>(`/api/users/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  };

  const deleteUser = async (id: string): Promise<void> => {
    return await $fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};

// API для проєктів
export const useProjectsApi = () => {
  const getAllProjects = async (filters?: { partnerId?: string; status?: string }): Promise<Project[]> => {
    const query = new URLSearchParams();
    if (filters?.partnerId) query.append('partnerId', filters.partnerId);
    if (filters?.status) query.append('status', filters.status);
    
    const queryString = query.toString();
    return await $fetch<Project[]>(`/api/projects${queryString ? `?${queryString}` : ''}`);
  };

  const getProjectById = async (id: string): Promise<Project> => {
    return await $fetch<Project>(`/api/projects/${id}`);
  };

  const createProject = async (project: Omit<Project, '_id'>): Promise<Project> => {
    return await $fetch<Project>('/api/projects', {
      method: 'POST',
      body: project,
    });
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
    return await $fetch<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      return await $fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      // Передаємо помилку далі з правильним статус кодом
      const statusCode = error?.statusCode || error?.response?.status || 500;
      const message = error?.data?.message || error?.message || 'Failed to delete project';
      const newError: any = new Error(message);
      newError.statusCode = statusCode;
      newError.data = error?.data || { message };
      throw newError;
    }
  };

  return {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
};

// API для дошок
export const useBoardsApi = () => {
  const getAllBoards = async (filters?: { projectId?: string }): Promise<Board[]> => {
    const query = new URLSearchParams();
    if (filters?.projectId) query.append('projectId', filters.projectId);
    
    const queryString = query.toString();
    return await $fetch<Board[]>(`/api/boards${queryString ? `?${queryString}` : ''}`);
  };

  const getBoardById = async (id: string): Promise<Board> => {
    return await $fetch<Board>(`/api/boards/${id}`);
  };

  const createBoard = async (board: Omit<Board, '_id'>): Promise<Board> => {
    return await $fetch<Board>('/api/boards', {
      method: 'POST',
      body: board,
    });
  };

  const updateBoard = async (id: string, updates: Partial<Board>): Promise<Board> => {
    return await $fetch<Board>(`/api/boards/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  };

  const deleteBoard = async (id: string): Promise<void> => {
    try {
      return await $fetch(`/api/boards/${id}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      // Передаємо помилку далі з правильним статус кодом
      const statusCode = error?.statusCode || error?.response?.status || 500;
      const message = error?.data?.message || error?.message || 'Failed to delete board';
      const newError: any = new Error(message);
      newError.statusCode = statusCode;
      newError.data = error?.data || { message };
      throw newError;
    }
  };

  return {
    getAllBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
  };
};

// API для відгуків
export const useReviewsApi = () => {
  const getAllReviews = async (filters?: { studentId?: string; partnerId?: string; projectId?: string }): Promise<PartnerReview[]> => {
    const query = new URLSearchParams();
    if (filters?.studentId) query.append('studentId', filters.studentId);
    if (filters?.partnerId) query.append('partnerId', filters.partnerId);
    if (filters?.projectId) query.append('projectId', filters.projectId);
    
    const queryString = query.toString();
    return await $fetch<PartnerReview[]>(`/api/reviews${queryString ? `?${queryString}` : ''}`);
  };

  const createOrUpdateReview = async (review: Omit<PartnerReview, '_id'>): Promise<PartnerReview> => {
    return await $fetch<PartnerReview>('/api/reviews', {
      method: 'POST',
      body: review,
    });
  };

  return {
    getAllReviews,
    createOrUpdateReview,
  };
};

// API для сповіщень
export const useNotificationsApi = () => {
  const getNotifications = async (userId: string, role: string, read?: boolean): Promise<(BaseNotification & { userId: string; role: string })[]> => {
    const query = new URLSearchParams();
    query.append('userId', userId);
    query.append('role', role);
    if (read !== undefined) {
      query.append('read', read.toString());
    }
    return await $fetch(`/api/notifications?${query.toString()}`);
  };

  const getUnreadCount = async (userId: string, role: string): Promise<number> => {
    const query = new URLSearchParams();
    query.append('userId', userId);
    query.append('role', role);
    const result = await $fetch<{ count: number }>(`/api/notifications/count?${query.toString()}`);
    return result.count;
  };

  const createNotification = async (notification: Omit<BaseNotification, '_id'> & { userId: string; role: string }): Promise<BaseNotification & { userId: string; role: string }> => {
    return await $fetch('/api/notifications', {
      method: 'POST',
      body: notification,
    });
  };

  const updateNotification = async (id: string, updates: Partial<BaseNotification>): Promise<BaseNotification & { userId: string; role: string }> => {
    return await $fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  };

  const markAllAsRead = async (userId: string, role: string): Promise<void> => {
    await $fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      body: { userId, role },
    });
  };

  return {
    getNotifications,
    getUnreadCount,
    createNotification,
    updateNotification,
    markAllAsRead,
  };
};

