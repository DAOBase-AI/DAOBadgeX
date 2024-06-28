<template>
  <div>
    <img v-if="src" class="w-6 h-6" :src="src" alt="" />
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="#fff"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>
</template>

<script setup>
import { TOKENLOGO } from '@/constants';
import { computed, defineProps } from 'vue';

const props = defineProps({
  tokenName: String,
});

const src = computed(() => TOKENLOGO[props.tokenName]);
</script>

<style lang="scss" scoped></style>
