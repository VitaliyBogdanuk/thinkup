<template>
  <section class="w-full overflow-hidden">
    <FormTasks />
    <HeaderComponent />
    <FormEditBoard />
    <div v-if="boards && boards.length > 0">
      <Columns />
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <p class="text-xl">No boards found. Create your first board!</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";

const store = useKanbanStore();
const { boards } = storeToRefs(store);
</script>