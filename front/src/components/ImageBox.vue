<template>
  <div>
    <div v-if="props.imgs.length < 3" class="flex space-x-2">
      <Img
        class="w-56 h-56 rounded cursor-pointer opacity-100 transition-opacity hover:opacity-70"
        :src="img"
        alt=""
        v-for="(img, i) in props.imgs"
        :key="i"
        @click="viewImg(i)"
      />
    </div>
    <div v-if="props.imgs.length == 3" class="flex space-x-2">
      <Img
        class="w-32 h-32 rounded cursor-pointer opacity-100 transition-opacity hover:opacity-70"
        :src="img"
        alt=""
        v-for="(img, i) in props.imgs"
        :key="i"
        @click="viewImg(i)"
      />
    </div>
    <div
      v-if="props.imgs.length == 4"
      class="grid grid-cols-2 gap-2"
      style="width: fit-content"
    >
      <Img
        class="w-32 h-32 rounded cursor-pointer opacity-100 transition-opacity hover:opacity-70"
        :src="img"
        alt=""
        v-for="(img, i) in props.imgs"
        :key="i"
        @click="viewImg(i)"
      />
    </div>
    <div
      v-if="props.imgs.length > 4"
      class="grid grid-cols-3 gap-2"
      style="width: fit-content"
    >
      <Img
        class="w-32 h-32 rounded cursor-pointer opacity-100 transition-opacity hover:opacity-70"
        :src="img"
        alt=""
        v-for="(img, i) in props.imgs.slice(0, 8)"
        :key="i"
        @click="viewImg(i)"
      />
      <div class="relative top-0 left-0" v-if="props.imgs.length > 9">
        <Img class="w-32 h-32 rounded" :src="props.imgs[9]" alt="" />
        <div
          class="cursor-pointer absolute inset-0 bg-masked flex justify-center items-center font-bold text-4xl hover:opacity-80 transition-opacity"
          style="color: #a5a5a5"
          @click="viewImg(8)"
        >
          +{{ props.imgs.length - 9 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Img from '@/components/Img.vue';
import view from 'view-images';

const props = defineProps({
  imgs: {
    type: Array,
    default() {
      return [
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazon.com/d67ff135-4275-49a6-bc57-6b1e0b0479cd',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/1d43fe25-9c72-4d85-900c-465050d745e3',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/d67ff135-4275-49a6-bc57-6b1e0b0479cd',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/1d43fe25-9c72-4d85-900c-465050d745e3',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/1d43fe25-9c72-4d85-900c-465050d745e3',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/1d43fe25-9c72-4d85-900c-465050d745e3',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/d67ff135-4275-49a6-bc57-6b1e0b0479cd',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/d67ff135-4275-49a6-bc57-6b1e0b0479cd',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/d67ff135-4275-49a6-bc57-6b1e0b0479cd',
        'https://beeper-dao-red-images.s3.ap-southeast-1.amazonaws.com/d67ff135-4275-49a6-bc57-6b1e0b0479cd',
      ];
    },
  },
});

const viewImg = (i) => {
  view({
    images: props.imgs,
    current: i,
  });
};
</script>

<style scoped></style>
