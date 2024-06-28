<template>
  <div @click="doSort" class="cursor-pointer flex items-center" :class="custom">
    <div class="mr-0.5 lg:mr-2">
      <slot></slot>
    </div>
    <img
      v-if="state.value[props.index] == -1"
      class="w-3 h-3"
      src="@/assets/icons/sort-default.avif"
      alt=""
    />
    <img
      v-if="state.value[props.index] == 0"
      class="w-3 h-3"
      src="@/assets/icons/sort-down.avif"
      alt=""
    />
    <img
      v-if="state.value[props.index] == 1"
      class="w-3 h-3 transform rotate-180"
      src="@/assets/icons/sort-down.avif"
      alt=""
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue';

const emits = defineEmits(['change']);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  index: String | Number,
  noDefault: {
    type: Boolean,
    default: false,
  },
  custom: String,
});

const state = reactive({
  value: props.modelValue,
});

watch(
  () => state.value,
  (val) => {
    emits('change', val, props.name);
  },
);

watch(
  () => props.modelValue,
  (val) => {
    state.value = state.value.map((x, i) => (i == props.index ? val : -1));
  },
);

const doSort = () => {
  state.value.forEach((x, i) => {
    if (props.noDefault) {
      if (++state.value[i] == 2) {
        state.value[i] = -1;
      }

      return;
    }

    if (i == props.index) {
      if (++state.value[i] == 2) {
        state.value[i] = state.value[i] == 0 ? 1 : -1;
      }
    } else {
      state.value[i] = -1;
    }
  });
};
</script>

<style lang="scss" scoped></style>
