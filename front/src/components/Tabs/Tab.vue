<template>
  <div v-show="state.isActive">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, inject, onBeforeMount, reactive, watch } from 'vue';

const $parentState = inject('$parentState');
const $config = inject('$config');

const state = reactive({
  isActive: false,
  loaded: false,
});

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const checkActive = (val) => {
  state.isActive = props.name === $config.tabNames[val];
};

onBeforeMount(() => {
  checkActive($parentState.selectedIndex);
});

// TODO 可以监听父元素的状态来进行操作
watch(() => $parentState.selectedIndex, checkActive);
</script>

<style lang="scss" scoped></style>
