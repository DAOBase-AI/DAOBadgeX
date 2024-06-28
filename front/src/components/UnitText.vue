<template>
  <div class="flex items-center">
    <span v-if="showUnit">
      <i
        v-if="unit == 'ETH'"
        class="iconfont icon-ETH2-24"
        :class="iconClass"
      ></i>

      <span v-if="unit == 'USDT'">$</span>
    </span>

    <div>
      <slot></slot>
    </div>

    <span v-if="unit == 'XTZ' && showUnit">&nbsp;ꜩ</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  showUnit: {
    type: Boolean,
    default: true,
  },
  unit: {
    type: String,
    default: 'USDT',
  },
  iconClass: String,
});
</script>

<style lang="scss" scoped></style>
