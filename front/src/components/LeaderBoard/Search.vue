<template>
  <div
    ref="target"
    class="relative px-4 text-whitebase text-xs flex items-center rounded-lg"
    :style="`height:${props.height};background:${props.bgColor};border:1px solid ${borderColor}`"
  >
    <input
      v-model="state.word"
      class="w-full h-full text-md md:text-xs py-1 bg-transparent border-0 px-0"
      type="text"
      :placeholder="props.placeholder"
    />
    <div
      v-if="state.word != ''"
      class="absolute w-4 h-4 rounded-full flex items-center justify-center cursor-pointer right-10"
      @click="state.word = ''"
      style="background: #ffffff1a"
    >
      <i class="iconfont icon-guanbi text-xs"></i>
    </div>
    <i class="iconfont icon-sousuo1"></i>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, watchEffect } from 'vue';

const state = reactive({
  word: '',
});

const emits = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: 'Search name',
  },
  height: { type: String, default: '32px' },
  bgColor: { type: String, default: '#2a2e33ff' },
  borderColor: { type: String, default: 'transparent' },
});

watchEffect((onInvalidate) => {
  state.word = props.modelValue;
  onInvalidate(() => {
    // cleanup code if needed
  });
});

watchEffect(() => {
  emits('update:modelValue', state.word);
});
</script>

<style lang="scss" scoped></style>
