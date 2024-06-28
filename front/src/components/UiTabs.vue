<template>
  <div
    class="relative inline-table bg-pass-topbg rounded"
    :class="{ 'bg-white-010': daoPageInfo.isCustom.value }"
  >
    <div
      class=""
      :class="{
        'ui-tabs--float': !daoPageInfo.isCustom.value,
        ['ui-tabs--float-' + daoPageInfo.vueState.customClass]:
          daoPageInfo.isCustom.value,
        'ui-tabs--float__animation': state.inited,
      }"
      :style="{
        width: state.width + 'px',
        left: state.offsetLeft + state.selected * (state.width + 8) + 'px',
        top: state.offsetTop + 'px',
        height: state.height + 'px',
      }"
    ></div>
    <div
      ref="wrapper"
      class="flex p-1 font-bold text-xs relative"
      :class="{
        'opacity-0': state.width == 0,
        'text-xs h-8': size == 'md',
        'text-base h-10': size == 'lg',
      }"
    >
      <div
        class="ui-tabs--item"
        v-for="(tab, i) in tabs"
        :class="{
          'text-whitebase': daoPageInfo.isCustom.value,
          'text-gray-level': !daoPageInfo.isCustom.value,
          'ui-tabs--item__active': state.selected == i,
          [props.tabClass]: true,
        }"
        :key="i"
        :style="{
          width: state.width ? state.width + 'px' : 'auto',
        }"
        @click="state.selected = i"
      >
        {{ tab }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  onMounted,
  reactive,
  ref,
  watchEffect,
  watch,
  inject,
} from 'vue';

const state = reactive({
  selected: 0,
  offsetLeft: 0,
  offsetTop: 0,
  width: 0,
  height: 0,
  inited: false,
});
const daoPageInfo = inject('daoPageInfo');
const props = defineProps({
  modelValue: Number,
  tabs: Array,
  size: {
    type: String,
    default: 'md',
    validator(value) {
      return ['sm', 'md', 'lg'].includes(value);
    },
  },
  tabClass: String,
});

const $emits = defineEmits(['update:modelValue']);

const wrapper = ref(null);

onMounted(() => {
  wrapper.value.children.forEach((child, i) => {
    if (i == 0) {
      state.offsetLeft = child.offsetLeft;
      state.height = child.offsetHeight;
      state.offsetTop = child.offsetTop;
    }
    const { width } = child.getBoundingClientRect();

    if (state.width < width) state.width = width;

    if (!state.inited) {
      setTimeout(() => {
        state.inited = true;
      });
    }
  });
});

watchEffect(() => {
  state.selected = props.modelValue;
});

watch(
  () => state.selected,
  (x) => {
    $emits('update:modelValue', x);
  },
);
</script>

<style scoped>
.ui-tabs {
  background: #2a2e33;
}
.ui-tabs--item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  transition: all 0.3s;
  cursor: pointer;
}
.ui-tabs--item:not(:last-child) {
  margin-right: 8px;
}
.ui-tabs--item:hover {
  color: #fff;
}
.ui-tabs--item.ui-tabs--item__active {
  color: #fff;
}

.ui-tabs--float {
  position: absolute;
  border-radius: 2px;
  border: 1px solid #ffffff;
}
.ui-tabs--float-aavegotchi {
  position: absolute;
  border-radius: 2px;
  background: linear-gradient(225deg, #6d17f8 0%, #7e18f8 100%);
}
.ui-tabs--float-ape {
  position: absolute;
  border-radius: 2px;
  background: #0623cbff;
}

.ui-tabs--float__animation {
  transition: all 0.3s;
}
</style>
