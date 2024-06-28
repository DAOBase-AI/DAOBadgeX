<template>
  <div>
    <ul class="flex h-16 text-whitebase">
      <li
        v-for="(tab, i) in tabs"
        class="relative flex-1 flex justify-center items-center text-xl font-semibold cursor-pointer"
        @click="selectTab(i)"
        :key="tab.name"
      >
        <div
          class="tab-bg w-full"
          :class="{
            'tab-bg-active text-whitebase': i === state.selectedIndex,
          }"
        >
          <div class="tab-left"></div>
          <div class="tab-right"></div>
        </div>
        <div
          class="absolute top-0 left-0 w-full h-full flex justify-center items-center pb-2"
          :class="{
            'text-whitebase': i === state.selectedIndex,
            'text-pass-topbg': i !== state.selectedIndex,
          }"
        >
          {{ tab }}
        </div>
      </li>
    </ul>
    <div class="w-full h-px"></div>
    <div class="px-16 py-6" :class="props.wrapperClass">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  useSlots,
  defineProps,
  defineEmits,
  ref,
  provide,
  onBeforeMount,
  watch,
} from 'vue';

const emits = defineEmits(['change']);

const $slots = useSlots();

const tabs = ref($slots.default().map((c) => c.props.name));

const state = reactive({
  tabs: [],
  selectedIndex: 0,
});

const props = defineProps({
  initialIndex: {
    type: Number,
    default: 0,
  },
  lazy: {
    type: Boolean,
    defalut: true,
  },
  wrapperClass: String,
});

onBeforeMount(() => {
  selectTab(props.initialIndex);
});

const selectTab = (selectedIndex) => {
  state.selectedIndex = selectedIndex;
};

provide('$parentState', state);
provide('$config', {
  lazy: props.lazy,
  tabNames: tabs.value,
});

watch(
  () => state.selectedIndex,
  (val) => {
    emits('change', val);
  },
);

watch(
  () => props.initialIndex,
  (val) => {
    state.selectedIndex = val;
  },
);
</script>

<style>
.tab-bg {
  color: #2a2e33;
  background-image: url('~@/assets/bgs/tab-center.avif');
  /* padding-bottom: 16%; */
  height: 80px;
}
.tab-left {
  left: 0;
  background-image: url('~@/assets/bgs/tab-left.avif');
}
.tab-right {
  right: 0;
  background-image: url('~@/assets/bgs/tab-right.avif');
}
.tab-bg-active .tab-left {
  left: 0;
  background-image: url('~@/assets/bgs/tab-left-active.avif');
}
.tab-bg-active .tab-right {
  right: 0;
  background-image: url('~@/assets/bgs/tab-right-active.avif');
}
.tab-left,
.tab-right {
  position: absolute;
  width: 64px;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.tab-bg-active {
  color: #fff;
  background-image: url('~@/assets/bgs/tab-center-active.avif');
}
.tab-bg,
.tab-bg-active {
  position: relative;
  background-size: calc(100% - 128px) 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
