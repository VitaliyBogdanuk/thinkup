<template>
  <section class="w-full h-full overflow-hidden flex-1 flex flex-col">
    <FormTasks />
    <HeaderComponent />
    <FormEditBoard />
    <Columns v-if="boards!.length > 0" />
  </section>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";
const store = useKanbanStore();

const { boards } = storeToRefs(store);
</script>
