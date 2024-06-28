<template>
  <div
    class="relative text-whitebase text-2xl font-semibold whitespace-nowrap"
    style="letter-spacing: 1px"
  >
    <div
      class="absolute -bottom-px w-24 h-2/5 bg-gradient-to-r from-main-0 to-main-1"
      style="max-height: 1rem"
      :class="{
        'left-0': props.align === 'start',
        'right-0': props.align === 'end',
        'left-1/2 transform -translate-x-1/2': props.align === 'center',
      }"
    ></div>
    <div class="relative">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  align: {
    type: String,
    default: 'start',
    validator(val) {
      return ['start', 'center', 'end'].indexOf(val) !== -1;
    },
  },
});
</script>

<style scoped></style>
