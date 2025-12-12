import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useStorage } from "@vueuse/core";

export const useKanbanStore = defineStore("kanban", {
  state: () => ({
    boards: useStorage("board", [
      {
        id: "1",
        name: "Веб-розробка",
        description: "Проєкт розробки корпоративного сайту",
        status: "active",
        tz: createMockFile(
          "ТЗ_корпоративний_сайт.pdf",
          2450000,
          "application/pdf"
        ),
        columns: [
          {
            id: "col1",
            name: "Планування",
            tasks: [
              {
                id: "task1",
                name: "Аналіз вимог клієнта",
                description: "Зібрати всі вимоги та скласти ТЗ",
              },
              {
                id: "task2",
                name: "Створити дизайн макет",
                description: "Розробити UI/UX дизайн для головної сторінки",
              },
              {
                id: "task3",
                name: "Підготувати контент",
                description: "Підготувати тексти та зображення для сайту",
              },
            ],
          },
          {
            id: "col2",
            name: "В роботі",
            tasks: [
              {
                id: "task4",
                name: "Розробити головну сторінку",
                description: "Верстка та функціонал головної сторінки",
              },
              {
                id: "task5",
                name: "Інтегрувати API",
                description: "Підключити бекенд API для форми зворотного зв'язку",
              },
            ],
          },
          {
            id: "col3",
            name: "Тестування",
            tasks: [
              {
                id: "task6",
                name: "Тестування адаптивності",
                description: "Перевірити коректне відображення на мобільних пристроях",
              },
            ],
          },
          {
            id: "col4",
            name: "Завершено",
            tasks: [
              {
                id: "task7",
                name: "Налаштування сервера",
                description: "Налаштування хостингу та домену",
              },
              {
                id: "task8",
                name: "Документація",
                description: "Скласти технічну документацію по проєкту",
              },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Маркетинг",
        description: "Розробка маркетингової кампанії",
        status: "active",
        tz: createMockFile(
          "Маркетингова_кампанія_ТЗ.docx",
          1850000,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ),
        columns: [
          {
            id: "col5",
            name: "Ідеї",
            tasks: [
              {
                id: "task9",
                name: "Мозковий штурм",
                description: "Згенерувати ідеї для кампанії",
              },
              {
                id: "task10",
                name: "Аналіз конкурентів",
                description: "Дослідити дії конкурентів на ринку",
              },
            ],
          },
          {
            id: "col6",
            name: "В роботі",
            tasks: [
              {
                id: "task11",
                name: "Створення контенту",
                description: "Підготувати пости для соціальних мереж",
              },
            ],
          },
          {
            id: "col7",
            name: "Завершено",
            tasks: [
              {
                id: "task12",
                name: "Налаштування реклами",
                description: "Налаштування Google Ads кампанії",
              },
            ],
          },
        ],
      },
      {
        id: "3",
        name: "Мобільний додаток",
        description: "Розробка iOS/Android додатку",
        status: "draft",
        tz: createMockFile(
          "ТЗ_мобільний_додаток.pdf",
          3120000,
          "application/pdf"
        ),
        columns: [
          {
            id: "col8",
            name: "Черга",
            tasks: [
              {
                id: "task13",
                name: "Дослідження ринку",
                description: "Аналіз аналогічних додатків",
              },
              {
                id: "task14",
                name: "Вибір технологій",
                description: "Визначити стек технологій для розробки",
              },
            ],
          },
          {
            id: "col9",
            name: "До виконання",
            tasks: [
              {
                id: "task15",
                name: "Дизайн інтерфейсу",
                description: "Створити прототипи екранів",
              },
            ],
          },
          {
            id: "col10",
            name: "В процесі",
            tasks: [],
          },
          {
            id: "col11",
            name: "Виконано",
            tasks: [],
          },
        ],
      },
      {
        id: "4",
        name: "Дизайн бренду",
        description: "Розробка фірмового стилю компанії",
        status: "active",
        tz: createMockFile(
          "Брендбук_компанія_XYZ.zip",
          5210000,
          "application/zip"
        ),
        columns: [
          {
            id: "col12",
            name: "Аналіз",
            tasks: [
              {
                id: "task16",
                name: "Аналіз цільової аудиторії",
                description: "Дослідити потреби та вподобання цільової аудиторії",
              },
              {
                id: "task17",
                name: "Аналіз конкурентів",
                description: "Вивчити брендинг конкурентів",
              },
            ],
          },
          {
            id: "col13",
            name: "Розробка",
            tasks: [
              {
                id: "task18",
                name: "Створити логотип",
                description: "Розробити варіанти логотипу",
              },
            ],
          },
          {
            id: "col14",
            name: "Затвердження",
            tasks: [
              {
                id: "task19",
                name: "Затвердити кольорову палітру",
                description: "Презентувати кольорову схему клієнту",
              },
            ],
          },
        ],
      },
    ] as Board[]),
  }),
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
      const newTask = { id: uuidv4(), ...taskInfos };
      this.boards
        ?.find((board) => board.id === boardId)!
        .columns.find((column) => column.id === columnId)!
        .tasks.push(newTask);
    },
    removeTaskFromColumn(boardId: string, columnId: string, editedTask: Task) {
      const boardTasks = this.getColumnTasks(boardId, columnId);
      const filteredTasks = boardTasks!.filter(
        (task) => task.id !== editedTask.id
      );
      this.boards!.find((board) => board.id === boardId)!.columns.find(
        (column) => column.id === columnId
      )!.tasks = filteredTasks;
    },
    createNewBoard(newBoard: Omit<Board, "id" | "columns">) {
      const boardTemplate: Board = {
        id: uuidv4(),
        name: newBoard.name,
        description: newBoard.description,
        status: newBoard.status,
        tz: newBoard.tz,
        columns: [
          { id: uuidv4(), name: "До виконання", tasks: [] },
          { id: uuidv4(), name: "В процесі", tasks: [] },
          { id: uuidv4(), name: "Завершено", tasks: [] },
        ],
      };

      this.boards?.push(boardTemplate);
    },
    editTask(
      boardId: string,
      columnId: string,
      newColumnId: string,
      editedTask: Task
    ) {
      const boardTasks = this.getColumnTasks(boardId, columnId);

      if (newColumnId !== columnId) {
        this.removeTaskFromColumn(boardId, columnId, editedTask);
        this.addTaskToColumn(boardId, newColumnId, editedTask);
      } else {
        const modifiedTasks = boardTasks!.map((task) =>
          task.id === editedTask.id ? editedTask : task
        );

        this.boards!.find((board) => board.id === boardId)!.columns.find(
          (column) => column.id === columnId
        )!.tasks = modifiedTasks;
      }
    },
    createNewColumn(boardId: string, columnName: string) {
      this.boards!.find((board) => board.id === boardId)!.columns.push({
        id: uuidv4(),
        name: columnName,
        tasks: [],
      });
    },
    editColumnName(boardId: string, columnId: string, columnName: string) {
      this.boards!.find((board) => board.id === boardId)!.columns.find(
        (column) => column.id === columnId
      )!.name = columnName;
    },
    editBoard(boardId: string, newBoardName: string, newColumnsName: Column[]) {
      const findBoard = this.boards!.find((board) => board.id === boardId)!;
      findBoard.name = newBoardName;
      findBoard.columns = newColumnsName;
    },
    deleteBoard(boardId: string) {
      this.boards!.splice(
        this.boards!.findIndex((board) => board.id === boardId),
        1
      );
    },
  },
});


function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob([''], { type });
  const file = new File([blob], name, { 
    type,
    lastModified: Date.now()
  });
  

  Object.defineProperty(file, 'size', {
    value: size,
    writable: false
  });
  
  return file;
}