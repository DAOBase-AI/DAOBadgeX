<template>
  <div
    class="flex home-padding"
    style="min-height: calc(100vh - 72px)"
    :class="{ 'pb-28': props.bottomPadding }"
  >
    <div class="w-full relative">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  bottomPadding: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped></style>
