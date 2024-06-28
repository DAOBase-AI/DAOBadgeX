<template>
  <div class="text-sm">
    <div
      :class="`${
        !state.more && props.text.length > props.maxLength
          ? 'line-clamp-1 overflow-ellipsis'
          : ' break-words'
      }`"
      :style="`max-width: ${props.maxWidth}px`"
    >
      {{ props.text }}
    </div>
    <div
      v-if="props.text.length > props.maxLength"
      class="cursor-pointer text-whitebase"
      @click="state.more = !state.more"
      style="width: fit-content"
    >
      See {{ state.more ? 'less' : 'more' }}
      <i
        class="iconfont text-sm"
        :class="{
          'icon-shang1': state.more,
          'icon-xia1': !state.more,
        }"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { useDesktop } from '@/hooks';
import { defineProps, reactive } from 'vue';

const props = defineProps({
  maxWidth: {
    type: Number,
    default: 640,
  },
  maxLength: {
    type: Number,
    default: 300,
  },
  text: {
    type: String,
    default: '',
  },
});

const state = reactive({
  more: false,
});
</script>

<style lang="scss" scoped></style>
