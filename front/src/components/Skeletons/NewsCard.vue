<template>
  <div class="relative mt-5 space-y-2">
    <Skeletor class="w-full rounded" style="padding-bottom: 56.25%"></Skeletor>

    <Skeletor
      class="text-gray-level text-xs mb-2 rounded-none w-1/3 h-3"
    ></Skeletor>

    <Skeletor class="rounded-none h-5"></Skeletor>
    <Skeletor class="rounded-none h-8"> </Skeletor>

    <div class="flex">
      <Skeletor class="w-10 h-10 rounded-full mr-3"></Skeletor>
      <div class="flex-1 flex flex-col justify-center">
        <Skeletor class="w-1/2 mb-2 rounded-none"> </Skeletor>
        <Skeletor class="rounded-none"></Skeletor>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Skeletor } from 'vue-skeletor';
</script>

<style lang="scss" scoped></style>
