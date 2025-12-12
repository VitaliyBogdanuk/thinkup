<template>
  <transition name="fade">
    <div v-if="boardFormState" class="popup-modal">
      <div
        class="w-fit h-fit flex flex-col p-8 bg-white rounded-xl gap-10 relative m-10 shadow-lg border border-gray-200"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-gray-200 hover:bg-gray-300 p-3 transition-colors"
          @click="() => (boardFormState = false)"
        >
          <XMarkIcon class="w-5 h-5 text-gray-800" />
        </button>
        <h2 class="text-gray-800">Створити нову дошку</h2>

        <div class="w-full space-y-8 flex flex-col md:w-96">
          <div class="flex flex-col space-y-2">
            <label for="board_name">Назва дошки</label>
            <input
              autofocus
              v-model.trim="boardName"
              type="text"
              name="board_name"
              placeholder="Наприклад: Веб-розробка сайту"
            />
          </div>
          
          <div class="flex flex-col space-y-2">
            <label for="board_description">Опис</label>
            <textarea
              v-model.trim="boardDescription"
              name="board_description"
              placeholder="Короткий опис проєкту"
              class="h-20"
            />
          </div>
          
          <div class="flex flex-col space-y-2">
            <label for="board_status">Статус</label>
            <select v-model="boardStatus">
              <option value="active">Активний</option>
              <option value="archived">Архівований</option>
              <option value="draft">Чернетка</option>
            </select>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="tz">Прикріпити ТЗ</label>
            <input 
              type="file" 
              @change="handleFileUpload" 
              class="file:bg-savoy file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
            />
            <p v-if="tzFileName" class="text-sm text-gray-300">
              Вибраний файл: {{ tzFileName }}
            </p>
          </div>
        </div>
        
        <BaseButton label="Створити проєкт" @action="useCreateNewBoard" class="bg-savoy"/>
      </div>
    </div>
  </transition>
</template>


<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { XMarkIcon } from "@heroicons/vue/24/outline";

//Props and emits
const boardFormState = isAddBoardFormOpen();

//Refs
const boardName = ref<string>("");
const boardDescription = ref<string>("");
const boardStatus = ref<string>("active");
const tzFile = ref<File | null>(null);
const tzFileName = ref<string>("");

//Store
const store = useKanbanStore();
const { createNewBoard } = store;

//Methods
const handleFileUpload = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    tzFile.value = input.files[0];
    tzFileName.value = input.files[0].name;
  }
};

const resetValues = (): void => {
  boardName.value = "";
  boardDescription.value = "";
  boardStatus.value = "active";
  tzFile.value = null;
  tzFileName.value = "";
};

const useCreateNewBoard = (): void => {
  if (useValidator(boardName.value)) {
    const newBoardData = {
      name: boardName.value,
      description: boardDescription.value,
      status: boardStatus.value,
      tz: tzFile.value,
    };
    
    createNewBoard(newBoardData);
    resetValues();
    boardFormState.value = false;
  }
};
</script>