<template>
  <div class="relativ">
    <div
      class="mt-4 px-4 pt-2 pb-4 bg-white-005 rounded-lg"
      :style="{
        height: isDesktop ? '308px' : '240px',
      }"
    >
      <div class="relative flex justify-between mb-2 md:mb-6">
        <div class="">
          <Skeletor class="w-14 h-14 md:w-20 md:h-20"></Skeletor>
          <Skeletor
            class="w-6 h-6 absolute right-0 bottom-0"
            style="top: 0"
          ></Skeletor>
        </div>
        <div class="h-8"></div>

        <!-- <Skeletor class="w-8 h-8 rounded-none"></Skeletor> -->
      </div>

      <Skeletor class="h-3 md:h-6 rounded-none w-3/5 mb-1 md:mb-2"></Skeletor>
      <Skeletor class="h-2 md:h-4 mb-1 md:mb-2 rounded-none"></Skeletor>

      <Skeletor class="mb-2 md:mb-4 h-2 md:h-5 rounded-none"></Skeletor>
      <div class="flex items-center mb-3 md:mb-6">
        <Skeletor
          class="w-14 rounded-none mr-4"
          style="height: 15px"
        ></Skeletor>

        <Skeletor class="w-8 h-8 md:w-10 md:h-10 rounded-full"></Skeletor>
      </div>

      <div class="h-4 flex">
        <Skeletor class="w-1/6 rounded-none mr-2"></Skeletor>
        <Skeletor class="w-2/3 rounded-none"></Skeletor>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDesktop } from '@/hooks';
import { Skeletor } from 'vue-skeletor';

const isDesktop = useDesktop();
</script>

<style scoped></style>
