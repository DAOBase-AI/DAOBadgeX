<template>
  <div v-if="props.data.length > 0" class="flex mt-2 flex-wrap">
    <div
      v-for="(item, i) in props.data"
      :key="i"
      @click="doSelect(i)"
      class="flex-item"
      :style="{
        width: `calc(${99 / props.count}% - ${20 * (props.count - 1)}px / ${
          props.count
        })`,
        marginRight: (i + 1) % 4 == 0 ? 0 : '20px',
      }"
    >
      <slot :selected="i === state.active" :info="props.data[i]"></slot>
    </div>
  </div>
  <div v-else class="flex justify-center my-10">
    <img class="w-80" src="@/assets/images/list_empty.avif" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, onMounted } from 'vue';

const props = defineProps({
  initialIndex: Number,
  modelValue: { type: Number, value: '-1' },
  data: { type: Array, default: () => [] },
  count: {
    type: Number,
    default: 4,
  },
});

const state = reactive({
  active: props.modelValue,
});

const emits = defineEmits(['infoChange', 'update:modelValue']);

watch(
  () => props.modelValue,
  (val) => {
    state.active = val;
  },
);

watch(
  () => state.active,
  (val) => {
    emits('update:modelValue', val);
    emits('infoChange', props.data[val]);
  },
);

const doSelect = (i) => {
  state.active = i;
};

onMounted(() => {
  if (props.initialIndex) {
    state.active = props.initialIndex;
  }
});
</script>

<style scoped>
.flex-item:not(:nth-child(4n)) {
}
</style>
