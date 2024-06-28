<template>
  <div class="w-4 md:w-9 h-4 md:h-9 mbtn flex items-center justify-center">
    <i v-if="props.icon" :class="`iconfont ${props.icon}`"></i>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  icon: String,
});
</script>

<style scoped>
.mbtn {
  background: transparent;
  transition: all 0.3s;
  border-radius: 50%;
}

.mbtn:active {
  background: #ffffff1a;
}
</style>
