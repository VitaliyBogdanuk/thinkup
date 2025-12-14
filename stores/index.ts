import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useBoardsApi } from "~/composables/useApi";
import { useBoardsApi } from "~/composables/useApi";

const defaultBoards: Board[] = [
  {
    id: "499ff073-7759-45c4-a62b-020860056830",
    name: "Будь-яка дошка",
    columns: [
      {
        id: "52a3c12c-a755-46e1-9a95-22ab10d61a1d",
        name: "Зробити",
        tasks: [
          {
            id: "52a96e6f-1213-46f6-8ae3-6a8fb00b126e",
            name: "Приклад назви",
            description: "Приклад опису",
          },
        ],
      },
      {
        id: "c46c6c66-9da0-42f2-97fd-1c212e4e8de2",
        name: "В процесі",
        tasks: [],
      },
      {
        id: "3e6f2fa2-1c93-4409-85b7-4660c36a1242",
        name: "Виконано",
        tasks: [],
      },
    ],
  },
];

// Міграція для оновлення старих англійських назв на українські
const migrateData = (boards: Board[] | undefined): Board[] => {
  if (!boards || boards.length === 0) {
    return defaultBoards;
  }

  let needsMigration = false;

  const migratedBoards = boards.map((board) => {
    // Оновлюємо назву дошки
    let boardName = board.name;
    if (board.name === "Any Board") {
      boardName = "Будь-яка дошка";
      needsMigration = true;
    }

    // Оновлюємо назви колонок та завдань
    const migratedColumns = board.columns.map((column) => {
      let columnName = column.name;
      if (column.name === "Todo") {
        columnName = "Зробити";
        needsMigration = true;
      } else if (column.name === "In Progress") {
        columnName = "В процесі";
        needsMigration = true;
      } else if (column.name === "Done") {
        columnName = "Виконано";
        needsMigration = true;
      }

      // Оновлюємо назви та описи завдань
      const migratedTasks = column.tasks.map((task) => {
        let taskName = task.name;
        let taskDescription = task.description;
        
        if (task.name === "Title example") {
          taskName = "Приклад назви";
          needsMigration = true;
        }
        if (task.description === "Description example") {
          taskDescription = "Приклад опису";
          needsMigration = true;
        }
        
        return {
          ...task,
          name: taskName,
          description: taskDescription,
        };
      });

      return {
        ...column,
        name: columnName,
        tasks: migratedTasks,
      };
    });

    return {
      ...board,
      name: boardName,
      columns: migratedColumns,
    };
  });

  // Повертаємо оновлені дані
  return migratedBoards;
};

export const useKanbanStore = defineStore("kanban", {
  state: () => {
    // Використовуємо звичайний масив замість useStorage
    // Дані будуть завантажуватися з MongoDB через loadBoards()
    return {
      boards: [] as Board[],
      isInitialized: false,
    };
  },
  getters: {
    getBoardColumns:
      (state) =>
      (boardId: string): Column[] | undefined => {
        const findBoard = state.boards?.find((board) => board.id === boardId);
        return findBoard?.columns;
      },
    getColumnTasks() {
      return (boardId: string, columnId: string): Task[] | undefined => {
        const column = this.getBoardColumns(boardId)?.find(
          (column) => column.id === columnId
        );
        return column?.tasks;
      };
    },
  },
  actions: {
    addTaskToColumn(
      boardId: string,
      columnId: string,
      taskInfos: Omit<Task, "id">
    ) {
      if (!this.boards || this.boards.length === 0) {
        console.error('Boards not initialized');
        return;
      }

      const board = this.boards.find((board) => board.id === boardId);
      if (!board || !board.columns) {
        console.error(`Board with id ${boardId} not found or has no columns`);
        return;
      }

      const column = board.columns.find((column) => column.id === columnId);
      if (!column) {
        console.error(`Column with id ${columnId} not found`);
        return;
      }

      const newTask = { id: uuidv4(), ...taskInfos };
      column.tasks.push(newTask);
      
      // Синхронізуємо з MongoDB
      this.syncBoardToMongo(boardId);
    },
    removeTaskFromColumn(boardId: string, columnId: string, editedTask: Task) {
      if (!this.boards || this.boards.length === 0) {
        console.error('Boards not initialized');
        return;
      }

      const board = this.boards.find((board) => board.id === boardId);
      if (!board || !board.columns) {
        console.error(`Board with id ${boardId} not found or has no columns`);
        return;
      }

      const column = board.columns.find((column) => column.id === columnId);
      if (!column) {
        console.error(`Column with id ${columnId} not found`);
        return;
      }

      const boardTasks = this.getColumnTasks(boardId, columnId);
      const filteredTasks = (boardTasks || []).filter(
        (task) => task.id !== editedTask.id
      );
      //Removing task from original column
      column.tasks = filteredTasks;
    },
    async createNewBoard(boardName: string) {
      const boardTemplate: Board = {
        id: uuidv4(),
        name: boardName,
        columns: [
          { id: uuidv4(), name: "Зробити", tasks: [] },
          { id: uuidv4(), name: "В процесі", tasks: [] },
          { id: uuidv4(), name: "Виконано", tasks: [] },
        ],
      };
      //Modifing state
      this.boards?.push(boardTemplate);
      
      // Синхронізуємо з MongoDB
      try {
        const boardsApi = useBoardsApi();
        await boardsApi.createBoard(boardTemplate);
      } catch (error) {
        console.error('Failed to create board in MongoDB:', error);
      }
    },
    editTask(
      boardId: string,
      columnId: string,
      newColumnId: string,
      editedTask: Task
    ) {
      const boardTasks = this.getColumnTasks(boardId, columnId);

      //If it has a new status, remove from original column and add to new column
      if (newColumnId !== columnId) {
        this.removeTaskFromColumn(boardId, columnId, editedTask);
        this.addTaskToColumn(boardId, newColumnId, editedTask);
      } else {
        const modifiedTasks = boardTasks!.map((task) =>
          task.id === editedTask.id ? editedTask : task
        );

        //Modifing state
        if (!this.boards || this.boards.length === 0) {
          console.error('Boards not initialized');
          return;
        }

        const board = this.boards.find((board) => board.id === boardId);
        if (!board || !board.columns) {
          console.error(`Board with id ${boardId} not found or has no columns`);
          return;
        }

        const column = board.columns.find((column) => column.id === columnId);
        if (!column) {
          console.error(`Column with id ${columnId} not found`);
          return;
        }

        column.tasks = modifiedTasks;
        
        // Синхронізуємо з MongoDB
        this.syncBoardToMongo(boardId);
      }
    },
    createNewColumn(boardId: string, columnName: string) {
      if (!this.boards || this.boards.length === 0) {
        console.error('Boards not initialized');
        return;
      }

      const board = this.boards.find((board) => board.id === boardId);
      if (!board) {
        console.error(`Board with id ${boardId} not found`);
        return;
      }

      if (!board.columns) {
        board.columns = [];
      }

      board.columns.push({
        id: uuidv4(),
        name: columnName,
        tasks: [],
      });
      
      // Синхронізуємо з MongoDB
      this.syncBoardToMongo(boardId);
    },
    editColumnName(boardId: string, columnId: string, columnName: string) {
      this.boards!.find((board) => board.id === boardId)!.columns.find(
        (column) => column.id === columnId
      )!.name = columnName;
      // Синхронізуємо з MongoDB
      this.syncBoardToMongo(boardId);
    },
    editBoard(boardId: string, newBoardName: string, newColumnsName: Column[]) {
      if (!this.boards || this.boards.length === 0) {
        console.error('Boards not initialized');
        return;
      }

      const findBoard = this.boards.find((board) => board.id === boardId);
      if (!findBoard) {
        console.error(`Board with id ${boardId} not found`);
        return;
      }

      findBoard.name = newBoardName;
      findBoard.columns = newColumnsName;
      // Синхронізуємо з MongoDB
      this.syncBoardToMongo(boardId);
    },
    deleteBoard(boardId: string) {
      this.boards!.splice(
        this.boards!.findIndex((board) => board.id === boardId),
        1
      );
    },
    updateBoard(updatedBoard: Board) {
      const index = this.boards!.findIndex((board) => board.id === updatedBoard.id);
      if (index !== -1) {
        this.boards![index] = updatedBoard;
        // Синхронізуємо з MongoDB
        this.syncBoardToMongo(updatedBoard.id);
      }
    },
    getBoardById(boardId: string): Board | undefined {
      return this.boards?.find((board) => board.id === boardId);
    },
    // Синхронізація дошки з MongoDB
    async syncBoardToMongo(boardId: string) {
      const board = this.getBoardById(boardId);
      if (!board) return;
      
      try {
        const boardsApi = useBoardsApi();
        // Перевіряємо, чи дошка вже існує в MongoDB
        try {
          await boardsApi.getBoardById(boardId);
          // Якщо існує, оновлюємо
          await boardsApi.updateBoard(boardId, board);
        } catch (error) {
          // Якщо не існує, створюємо
          await boardsApi.createBoard(board);
        }
      } catch (error) {
        console.error(`Failed to sync board ${boardId} to MongoDB:`, error);
      }
    },
    // Завантаження дошок з MongoDB
    async loadBoards() {
      if (this.isInitialized) {
        return; // Вже завантажено
      }

      try {
        const boardsApi = useBoardsApi();
        const boards = await boardsApi.getAllBoards();
        if (boards && boards.length > 0) {
          // Застосовуємо міграцію даних та видаляємо дублікати за id
          const migratedBoards = migrateData(boards);
          this.boards = migratedBoards.reduce((acc, board) => {
            if (!acc.find(b => b.id === board.id)) {
              acc.push(board);
            }
            return acc;
          }, [] as Board[]);
        } else {
          // Якщо немає дошок в MongoDB, використовуємо дефолтні
          this.boards = defaultBoards;
        }
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to load boards from MongoDB:', error);
        // Fallback на дефолтні дошки
        this.boards = defaultBoards;
        this.isInitialized = true;
      }
    },
  },
});
