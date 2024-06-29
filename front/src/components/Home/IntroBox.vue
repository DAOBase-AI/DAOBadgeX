<template>
  <div
    ref="container"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    class="relative"
    @click="onClick"
    style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 2.2vw"
  >
    <div
      ref="floatbox"
      class="absolute pointer-events-none"
      style="width: 25vw; height: 16.7vw"
      :style="`top:${state.point.y}px;left:${state.point.x}px;`"
    >
      <transition-group
        :css="false"
        @before-enter="onBeforeEnterBox"
        @enter="onEnterBox"
        @leave="onLeaveBox"
      >
        <div
          v-if="state.hover && state.selectIndex == 0"
          class="w-full h-full"
          @click="state.imgVisible = true"
        >
          <UiImg class="w-full h-full" :src="dao"></UiImg>
        </div>
        <div v-if="state.hover && state.selectIndex == 1" class="w-full h-full">
          <UiImg class="w-full h-full" :src="nftpass"></UiImg>
        </div>
        <div v-if="state.hover && state.selectIndex == 2" class="w-full h-full">
          <UiImg class="w-full h-full" :src="dashboard"></UiImg>
        </div>
        <div v-if="state.hover && state.selectIndex == 3" class="w-full h-full">
          <UiImg class="w-full h-full" :src="voting"></UiImg>
        </div>
      </transition-group>
    </div>
    <div ref="items">
      <slot></slot>
    </div>
  </div>

  <Dialog
    boxStyle="width: 58%; transform: translate(-50%, -50%)"
    class="w-96"
    :visible="state.imgVisible"
    @close="state.imgVisible = false"
  >
    <img :src="[dao, nftpass, dashboard, voting][state.selectIndex]" alt="" />
  </Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import gsap from 'gsap';
import UiImg from '@/components/UiImg.vue';
import nftpass from '@/assets/images/home/NFTPASS.avif';
import dashboard from '@/assets/images/home/DashBoard.avif';
import dao from '@/assets/images/home/DAO.avif';
import voting from '@/assets/images/home/Voting.avif';
import Dialog from '@/components/Dialog.vue';

const container = ref(null);
const floatbox = ref(null);
const items = ref(null);

const state = reactive({
  hover: false,
  point: {},
  calcBox: false,
  selectIndex: 0,
  splitYs: [],
  imgVisible: false,
});

const onBeforeEnterBox = (el) => {
  el.style.height = 0;
};

const onEnterBox = (el, done) => {
  gsap.to(el, {
    height: '16.7vw',
    duration: 0.6,
    onComplete: done,
  });
};

const onLeaveBox = (el, done) => {
  gsap.to(el, {
    height: 0,
    onComplete: done,
    duration: 0.6,
  });
};

const calcSplit = () => {
  let config = [];
  items.value.children.forEach((child) => {
    config.push(child.getBoundingClientRect().y);
  });

  let res = [];

  config.forEach((x, i) => {
    if (i == 0) {
      res[i] = 0;
    } else {
      res[i] = config[i] - config[0];
    }
  });

  state.splitYs = res;
};

const onMouseMove = (e) => {
  if (!state.hover) {
    state.hover = true;
  }

  if (floatbox.value) {
    const {
      x,
      y,
      width: xW,
      height: xH,
    } = container.value.getBoundingClientRect();
    const { width, height } = floatbox.value.getBoundingClientRect();
    const { clientX, clientY } = e;

    const xx = clientX - x - width / 2;
    const yy = clientY - y - height / 2;

    // console.log(clientX, xx, width, clientY, yy, height);

    if (!state.calcBox) {
      state.calcBox = true;
      state.point = { x: xx, y: yy };

      calcSplit();

      return;
    }

    if (
      yy <= -height / 2 ||
      xx <= -width / 2 ||
      xx >= xW - width / 2 ||
      yy >= xH - height / 2
    ) {
      state.calcBox = false;
      return;
    }

    let flag = false;
    Array.from(state.splitYs)
      .reverse()
      .forEach((l, i) => {
        if (flag) {
          return;
        }

        if (yy > l - height / 2) {
          state.selectIndex = state.splitYs.length - 1 - i;
          flag = true;
        }
      });

    gsap.to(floatbox.value, {
      top: yy,
      left: xx,
      duration: 0.4,
    });

    // setTimeout(() => {
    //   state.point = { x: xx, y: yy };
    // }, 64);
  }
};

const onClick = (e) => {
  if (!state.imgVisible) {
    state.imgVisible = true;
  }
};

const onMouseLeave = () => {
  state.calcBox = false;
  state.hover = false;
};
</script>

<style lang="scss" scoped></style>
