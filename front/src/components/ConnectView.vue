<template>
  <div class="flex flex-col justify-center items-center" style="height: 70vh">
    <div class="font-bold text-white-030 italic text-xl mb-4">
      Not logged in
    </div>
    <UiButton class="rounded" type="outline" @click="mittWalletSelect"
      >Connect</UiButton
    >
  </div>
</template>

<script setup>
import UiButton from '@/components/UiButton.vue';
import { mittWalletSelect } from '@/libs/event';
</script>

<style lang="scss" scoped></style>
