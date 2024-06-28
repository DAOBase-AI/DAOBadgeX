<template>
  <div class="space-y-6">
    <Skeletor class="rounded-none h-9"> </Skeletor>
    <div>
      <Skeletor v-for="(_, i) in [1, 1, 1]" :key="i" class="rounded-none h-4">
      </Skeletor>
    </div>
    <div class="flex w-1/4">
      <Skeletor class="w-16 h-16 rounded-full mr-4"></Skeletor>
      <div class="flex flex-col justify-end flex-1 space-y-2">
        <Skeletor class="rounded-none"></Skeletor>
        <Skeletor class="rounded-none"> </Skeletor>
      </div>
    </div>
    <div>
      <Skeletor
        v-for="(_, i) in Array(20).fill(0)"
        :key="i"
        class="h-4"
      ></Skeletor>
    </div>

    <div class="text-gray-level text-xl text-center">
      <div
        class="my-16 pb-4"
        style="border-bottom: 1px solid rgba(255, 255, 255, 0.1)"
      >
        <Skeletor class="w-20 h-5 rounded-none"></Skeletor>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Skeletor } from 'vue-skeletor';
</script>

<style lang="scss" scoped></style>
