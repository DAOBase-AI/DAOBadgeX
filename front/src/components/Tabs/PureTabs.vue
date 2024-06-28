<template>
  <div>
    <ul class="flex h-16 text-whitebase">
      <li
        v-for="(tab, i) in props.tabs"
        class="flex-1 flex justify-center items-center text-xl font-semibold cursor-pointer tab-bg"
        :class="{
          ' tab-bg-active': i === state.selectedIndex,
          'mr-4': i !== tabs.length - 1,
        }"
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
    <div class="px-16 py-6 box-bg mt-4 rounded">
      <slot :current="state.selectedIndex" hello="hello"></slot>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, onBeforeMount, defineEmits } from 'vue';

const state = reactive({
  tabs: [],
  selectedIndex: 0,
});

const emits = defineEmits(['change']);

const props = defineProps({
  initialIndex: {
    type: Number,
    default: 0,
  },
  tabs: {
    type: Array,
    default: () => [],
  },
});

onBeforeMount(() => {
  selectTab(props.initialIndex);
});

const selectTab = (selectedIndex) => {
  state.selectedIndex = selectedIndex;
  emits('change', selectedIndex);
};
</script>

<style scoped></style>
