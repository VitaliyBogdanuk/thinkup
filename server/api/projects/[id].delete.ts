import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import { isProtectedProject, isProtectedBoard, isDemoId } from '~/server/utils/protectedData';
import type { Project, Board } from '~/types';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project ID is required',
      });
    }

    const collection = await getCollection<Project>(COLLECTIONS.PROJECTS);
    
    // Знаходимо проєкт
    let project = await collection.findOne({ id });
    if (!project && ObjectId.isValid(id) && id.length === 24) {
      try {
        project = await collection.findOne({ _id: new ObjectId(id) });
      } catch (error) {
        console.warn('Failed to search by ObjectId:', error);
      }
    }
    
    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
      });
    }
    
    // Перевіряємо, чи це захищені демо-дані
    const projectIdToCheck = project.id || id;
    if (isProtectedProject(projectIdToCheck) || isDemoId(projectIdToCheck)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete demo data. This project is protected.',
      });
    }
    
    // Видаляємо пов'язану дошку, якщо вона є
    if (project.boardId) {
      console.log(`Attempting to delete board ${project.boardId} for project ${project.id || id}`);
      try {
        const boardsCollection = await getCollection<Board>(COLLECTIONS.BOARDS);
        
        // Знаходимо дошку
        let board = await boardsCollection.findOne({ id: project.boardId });
        if (!board && ObjectId.isValid(project.boardId) && project.boardId.length === 24) {
          try {
            board = await boardsCollection.findOne({ _id: new ObjectId(project.boardId) });
          } catch (error) {
            console.warn('Failed to search board by ObjectId:', error);
          }
        }
        
        if (!board) {
          console.warn(`Board ${project.boardId} not found in database`);
        } else {
          // Видаляємо дошку, якщо вона не захищена
          const boardIdToCheck = board.id || project.boardId;
          
          if (!isProtectedBoard(boardIdToCheck) && !isDemoId(boardIdToCheck)) {
            let boardDeleteResult;
            if (ObjectId.isValid(project.boardId) && project.boardId.length === 24) {
              try {
                boardDeleteResult = await boardsCollection.deleteOne({
                  $or: [{ id: project.boardId }, { _id: new ObjectId(project.boardId) }]
                });
              } catch (error) {
                console.warn('Failed to delete board by ObjectId, trying by id only:', error);
                boardDeleteResult = await boardsCollection.deleteOne({ id: project.boardId });
              }
            } else {
              boardDeleteResult = await boardsCollection.deleteOne({ id: project.boardId });
            }
            
            if (boardDeleteResult.deletedCount > 0) {
              console.log(`✓ Board ${project.boardId} deleted successfully`);
            } else {
              console.warn(`Board ${project.boardId} deletion returned 0 deletedCount`);
            }
          } else {
            console.log(`Board ${project.boardId} is protected, skipping deletion`);
          }
        }
      } catch (error) {
        // Логуємо помилку, але продовжуємо видалення проєкту
        console.error('Failed to delete associated board, continuing with project deletion:', error);
      }
    } else {
      console.log(`Project ${project.id || id} has no boardId, skipping board deletion`);
    }
    
    // Видаляємо проєкт
    let deleteResult;
    if (ObjectId.isValid(id) && id.length === 24) {
      try {
        deleteResult = await collection.deleteOne({
          $or: [{ id }, { _id: new ObjectId(id) }]
        });
      } catch (error) {
        console.warn('Failed to delete by ObjectId, trying by id only:', error);
        deleteResult = await collection.deleteOne({ id });
      }
    } else {
      deleteResult = await collection.deleteOne({ id });
    }
    
    if (deleteResult.deletedCount === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete project',
      });
    }
    
    return {
      success: true,
      message: 'Project deleted successfully',
    };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete project',
    });
  }
});

