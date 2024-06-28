<template>
  <svg
    class="ml-2"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      width: props.size,
      height: props.size,
    }"
  >
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 100 100;270 100 100"
        begin="0s"
        dur="1.6s"
        fill="freeze"
        repeatCount="indefinite"
      ></animateTransform>
      <circle
        fill="none"
        stroke="currentColor"
        stroke-width="20"
        stroke-linecap="round"
        cx="100"
        cy="100"
        r="90"
        stroke-dasharray="567"
        stroke-dashoffset="1848"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 100 100;135 100 100;450 100 100"
          begin="0s"
          dur="1.6s"
          fill="freeze"
          repeatCount="indefinite"
        ></animateTransform>
        <animate
          attributeName="stroke-dashoffset"
          values="567;142;567"
          begin="0s"
          dur="1.6s"
          fill="freeze"
          repeatCount="indefinite"
        ></animate>
      </circle>
    </g>
  </svg>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: '1em',
  },
});
</script>

<style scoped></style>
