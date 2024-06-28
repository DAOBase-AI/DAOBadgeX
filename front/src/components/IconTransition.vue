<template>
  <Transition name="icon-switch-transition" :appear="isMounted">
    <slot></slot>
  </Transition>
</template>

<script setup>
import { useMounted } from '@vueuse/core';

const isMounted = useMounted();
</script>

<style lang="scss" scoped>
.icon-switch-transition-enter-from,
.icon-switch-transition-leave-to {
  transform: scale(0.75);
  left: 0;
  top: 0;
  opacity: 0;
}

.icon-switch-transition-enter-to,
.icon-switch-transition-leave-from {
  transform: scale(1);
  left: 0;
  top: 0;
  opacity: 1;
}

.icon-switch-transition-enter-active,
.icon-switch-transition-leave-active {
  transform-origin: center;
  position: absolute;
  left: 0;
  top: 0;
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1) !important;
}
</style>
