<template>
  <div
    class="flex font-normal rounded bg-white-010 px-2 text-xs text-white-070"
  >
    <span
      class="icon iconfont w-4 h-4 mr-1 text-secondary-7"
      v-if="label.includes('@')"
      >&#xe639;</span
    ><img
      v-if="label.includes('.lens')"
      src="@/assets/logo/lens.avif"
      class="w-4 h-4 overflow-hidden rounded-full mr-1"
      alt="lens logo"
    />
    <img
      v-if="label.includes('.eth')"
      src="@/assets/logo/ens.png"
      class="w-4 h-4 overflow-hidden rounded-full mr-1"
      alt="lens logo"
    />

    <span class="line-clamp-1">{{ label }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
});
</script>
<style></style>
