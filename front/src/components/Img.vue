<template>
  <img
    alt=""
    v-lazy="{ src: props.src, loading: defaultImg, error: errorImg }"
  />
</template>

<script setup>
import { defineProps } from 'vue';
import defaultImg from '@/assets/bgs/img-loading.avif';
import errorImg from '@/assets/bgs/img-error.avif';

// const defaultImg =  'https://dummyimage.com/300x300/191c1f&text=+';
// const errorImg = 'https://dummyimage.com/300x300/212529&text=+';

const props = defineProps({
  src: String,
});
</script>

<style scoped></style>
