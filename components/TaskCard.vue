<template>
  <div
    class="w-full p-5 rounded-xl bg-white shadow-sm border border-gray-200 cursor-pointer hover:border-savoy hover:text-savoy transition-colors"
  >
    <span class="font-medium select-none break-all w-full h-full text-gray-800">{{
      props.taskName
    }}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  taskName: string;
}>();
</script>
