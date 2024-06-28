<template>
  <div class="flag_bg rounded-1 flex items-center">
    <div
      class="flag_bg text-main-5 italic w-full m-px-2 font-bold self-stretch text-center px-2"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.flag_bg {
  background: linear-gradient(
    90deg,
    rgba(140, 27, 41, 0.5) 0%,
    rgba(140, 27, 41, 0.1) 100%
  );
}
</style>
