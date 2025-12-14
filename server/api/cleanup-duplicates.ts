import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { User, Project, Board } from '~/types';

/**
 * Скрипт для очищення дублікатів з MongoDB
 * Використовується через API endpoint для видалення дублікатів
 */
export default defineEventHandler(async (event) => {
  try {
    const usersCollection = await getCollection<User>(COLLECTIONS.USERS);
    const projectsCollection = await getCollection<Project>(COLLECTIONS.PROJECTS);
    const boardsCollection = await getCollection<Board>(COLLECTIONS.BOARDS);

    const results = {
      users: { removed: 0, kept: 0 },
      projects: { removed: 0, kept: 0 },
      boards: { removed: 0, kept: 0 },
    };

    // Очищення дублікатів користувачів
    const allUsers = await usersCollection.find({}).toArray();
    const userMap = new Map<string, User>();
    
    for (const user of allUsers) {
      if (user.id) {
        if (!userMap.has(user.id)) {
          // Зберігаємо перший запис
          userMap.set(user.id, user);
          results.users.kept++;
        } else {
          // Видаляємо дублікат (залишаємо найстаріший)
          const existing = userMap.get(user.id)!;
          if (new Date(user.createdAt || 0) < new Date(existing.createdAt || 0)) {
            // Якщо поточний старіший, замінюємо
            await usersCollection.deleteOne({ _id: existing._id });
            userMap.set(user.id, user);
            results.users.removed++;
            results.users.kept--;
          } else {
            // Видаляємо поточний дублікат
            await usersCollection.deleteOne({ _id: user._id });
            results.users.removed++;
          }
        }
      } else if (user.email) {
        // Якщо немає id, перевіряємо за email
        const existingByEmail = Array.from(userMap.values()).find(u => u.email === user.email);
        if (!existingByEmail) {
          userMap.set(user.email, user);
          results.users.kept++;
        } else {
          await usersCollection.deleteOne({ _id: user._id });
          results.users.removed++;
        }
      }
    }

    // Очищення дублікатів проєктів
    const allProjects = await projectsCollection.find({}).toArray();
    const projectMap = new Map<string, Project>();
    
    for (const project of allProjects) {
      if (project.id) {
        if (!projectMap.has(project.id)) {
          projectMap.set(project.id, project);
          results.projects.kept++;
        } else {
          const existing = projectMap.get(project.id)!;
          if (new Date(project.createdAt || 0) < new Date(existing.createdAt || 0)) {
            await projectsCollection.deleteOne({ _id: existing._id });
            projectMap.set(project.id, project);
            results.projects.removed++;
            results.projects.kept--;
          } else {
            await projectsCollection.deleteOne({ _id: project._id });
            results.projects.removed++;
          }
        }
      }
    }

    // Очищення дублікатів дошок
    const allBoards = await boardsCollection.find({}).toArray();
    const boardMap = new Map<string, Board>();
    
    for (const board of allBoards) {
      if (board.id) {
        if (!boardMap.has(board.id)) {
          boardMap.set(board.id, board);
          results.boards.kept++;
        } else {
          const existing = boardMap.get(board.id)!;
          // Для дошок просто видаляємо дублікати (залишаємо перший)
          await boardsCollection.deleteOne({ _id: board._id });
          results.boards.removed++;
        }
      }
    }

    return {
      success: true,
      message: 'Duplicates cleaned successfully',
      results,
    };
  } catch (error: any) {
    console.error('Failed to clean duplicates:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clean duplicates',
    });
  }
});

