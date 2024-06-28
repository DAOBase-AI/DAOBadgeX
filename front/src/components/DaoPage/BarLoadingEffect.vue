<template>
  <div
    class="absolute left-0 z-20 top-0 h-full rounded"
    :class="fillColor"
    :style="`width:${valueRef}%;max-width:100%`"
  ></div>
</template>
<script setup>
import { computed, onMounted, provide, reactive, ref, watch } from 'vue';

const props = defineProps({
  value: String | Number,
  total: Number,
  fillColor: { type: String, default: 'bg-secondary-7' },
});
const valueRef = ref(0);

watch(
  () => props.value,
  () => {
    let newCount = 0;
    if ((props.value / props.total) * 100 >= 100) {
      newCount = 100;
    } else {
      newCount = (props.value / props.total) * 100;
    }
    const interval = setInterval(() => {
      const diff = newCount - valueRef.value;

      let increment;
      if (diff > 100) {
        increment = Math.ceil(diff / 10);
      } else if (diff > 10) {
        increment = 5;
      } else if (diff >= 1) {
        increment = 1;
      } else if (diff >= 0.1) {
        increment = 0.1;
      } else if (diff >= 0.01) {
        increment = 0.01;
      } else {
        increment = 0.0001;
      }
      if (valueRef.value < newCount) {
        valueRef.value += increment;
      } else {
        clearInterval(interval);
      }
    }, 20); //
  },
);
onMounted(() => {
  let newCount = 0;
  if ((props.value / props.total) * 100 >= 100) {
    newCount = 100;
  } else {
    newCount = (props.value / props.total) * 100;
  }

  const interval = setInterval(() => {
    const diff = newCount - valueRef.value;
    let increment;
    if (diff >= 100) {
      increment = Math.ceil(diff / 10);
    } else if (diff >= 10) {
      increment = 1;
    } else if (diff >= 1) {
      increment = 0.1;
    } else if (diff >= 0.1) {
      increment = 0.01;
    } else if (diff >= 0.01) {
      increment = 0.001;
    } else {
      increment = 0.00001;
    }
    if (valueRef.value < newCount) {
      valueRef.value += increment;
    } else {
      clearInterval(interval);
    }
  }, 20); //
});
</script>
<style></style>
