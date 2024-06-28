<template>
  <div class="os-host" ref="container">
    <div class="os-resize-observer-host"></div>
    <div class="os-padding">
      <div class="os-viewport">
        <div class="os-content">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="os-scrollbar os-scrollbar-horizontal">
      <div class="os-scrollbar-track">
        <div class="os-scrollbar-handle"></div>
      </div>
    </div>
    <div class="os-scrollbar os-scrollbar-vertical">
      <div class="os-scrollbar-track">
        <div class="os-scrollbar-handle"></div>
      </div>
    </div>
    <div class="os-scrollbar-corner"></div>
  </div>
</template>

<script setup>
import {
  defineProps,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import * as OverlayScrollbars from 'overlayscrollbars';

const container = ref(null);

const osInstance = ref(null);

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  extensions: {
    type: [String, Array, Object],
  },
  onIns: Function,
});

watch(
  () => props.options,
  (newer) => {
    if (OverlayScrollbars.valid(osInstance.value)) {
      osInstance.value.options(newer);
    }
  },
);

onMounted(() => {
  osInstance.value = OverlayScrollbars(
    container.value,
    props.options,
    props.extensions,
  );

  if (props.onIns) {
    props.onIns(osInstance.value);
  }
});

onBeforeUnmount(() => {
  if (OverlayScrollbars.valid(osInstance.value)) {
    osInstance.value.destroy();
  }
});
</script>

<style lang="scss" scoped></style>
