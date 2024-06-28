<template>
  <div class="relative w-full">
    <div
      class="w-0 h-0"
      :style="{
        paddingLeft: '100%',
        paddingBottom,
      }"
    ></div>
    <div
      class="absolute w-full h-full top-0"
      :style="props.viewStyle"
      :class="props.viewClass"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  viewStyle: [String, Object],
  viewClass: [String, Object],
  ratio: {
    type: String,
    default: '100%',
    validator(val) {
      return (
        /^\d+(\.\d+)?%?$/.test(val) || /^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(val)
      );
    },
  },
});

const paddingBottom = computed(() => {
  if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(props.ratio)) {
    const [a, b] = props.ratio.split('/');
    return (a / b).toFixed(2) * 100 + '%';
  }

  const index = props.ratio.indexOf('%');
  if (index == -1) {
    return (+props.ratio).toFixed(2) * 100 + '%';
  }

  return props.ratio;
});
</script>

<style lang="scss" scoped></style>
