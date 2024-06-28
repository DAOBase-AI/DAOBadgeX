<template>
  <div style="width: fit-content" class="mb-2">
    <UiButton type="outline" leftIcon="icon-fanhui" size="sm" @click="goBack()"
      >BACK</UiButton
    >
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from './UiButton.vue';

const props = defineProps({
  onClick: Function,
});

const $router = useRouter();

const goBack = () => {
  if (props.onClick) {
    props.onClick();
    return;
  }

  $router.back();
};
</script>

<style lang="scss" scoped></style>
