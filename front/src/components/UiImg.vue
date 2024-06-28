<template>
  <div ref="target">
    <Skeletor
      class="w-full h-full rounded-none"
      v-if="state.status == STATUS.LOADING"
    ></Skeletor>
    <img
      v-if="state.status == STATUS.SUCCESS"
      :src="state.img"
      class="w-full h-full object-cover"
      style="border-radius: inherit"
      alt=""
    />
    <img
      v-if="state.status == STATUS.ERROR"
      :src="require('@/assets/icons/nftnologo.avif')"
      class="w-full h-full object-cover"
      style="border-radius: inherit"
      alt=""
    />
  </div>
</template>

<script setup>
import { convertRgbaUrl } from '@/utils';
import { useIntersectionObserver } from '@vueuse/core';
import axios from 'axios';
import { defineProps, reactive, ref, watch } from 'vue';
import { Skeletor } from 'vue-skeletor';

const target = ref(null);
const targetIsVisible = ref(false);

const STATUS = {
  IDEL: -1,
  LOADING: 0,
  SUCCESS: 1,
  ERROR: 2,
};

const props = defineProps({
  src: String,
});

const state = reactive({
  status: STATUS.IDEL,
  loaded: false,
  img: '',
});

const loadImg = async () => {
  state.status = STATUS.IDEL;
  const img = document.createElement('img');
  if (!props.src) {
    state.status = STATUS.ERROR;
    return;
  }
  if (/api\.gotchiverse.io\/realm\/map\/load/.test(props.src)) {
    const x = await axios.get(props.src);
    img.src = await convertRgbaUrl(x.data);
  } else {
    img.src = props.src;
  }
  state.status = STATUS.LOADING;

  let prev = props.src;
  img.onload = () => {
    if (prev == props.src) {
      state.status = STATUS.SUCCESS;
      state.img = img.src;
    }
  };
  img.onerror = () => {
    state.status = STATUS.ERROR;
  };
};

watch(
  () => props.src,
  () => {
    state.loaded = false;
    state.status = STATUS.LOADING;
    state.img = '';
    loadImg();
  },
);

useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
  if (isIntersecting && !state.loaded) {
    state.loaded = true;
    loadImg();
  }
});
</script>

<style lang="scss" scoped></style>
