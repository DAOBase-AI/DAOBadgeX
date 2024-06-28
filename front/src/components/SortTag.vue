<template>
  <div
    class="w-6 h-6 rounded-full flex items-center justify-center font-bold italic"
    :style="`background:${getColor(sortValue)}`"
  >
    {{ sortValue }}
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const getColor = (i) => {
  if (i == 1) {
    return '#F23089FF';
  }
  if (i == 2) {
    return '#4997F2FF';
  }
  if (i == 3) {
    return '#CE49F2FF';
  }
  return '#2A2E33FF';
};

const props = defineProps({
  sortValue: Number,
});
</script>

<style lang="scss" scoped></style>
