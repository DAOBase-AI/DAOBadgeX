<template>
  <div :style="{ width: containerW + 'px' }">
    <div :style="containerStyle" class="relative">
      <img ref="pic1" :style="startStyle" src="@/assets/elements/cc-3.avif" />
      <img ref="pic2" :style="centerStyle" src="@/assets/elements/cc-1.avif" />
      <img
        ref="pic3"
        :style="endStyle"
        class="w-22 h-22 inline-block"
        src="@/assets/elements/cc-2.avif"
      />
    </div>
    <div
      class="backdrop-filter backdrop-blur py-2 text-center absolute bottom-0 z-top w-full text-sm leading-5"
      :style="{ height: 0.55 * w + 'px' }"
    >
      <div class="flex items-center justify-center text-base">
        TEST 20 <img class="w-6 ml-2" src="@/assets/elements/cc-hot.avif" />
      </div>
      <div>A hub for NFT thinkers.A</div>
      <div>hub for NFT thinkers.</div>
      <div class="text-xs">Created | 2021-08-26</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import TWEEN from '@tweenjs/tween.js';

const w = 280;
const h = 1.5 * w;
const containerW = w / 0.6;
const offset = (containerW - w) / 2;

const startStyle = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  wdith: w / 2 + 'px',
  height: h / 2 + 'px',
  opacity: 0,
};

const centerStyle = {
  position: 'absolute',
  left: offset + 'px',
  bottom: 0,
  wdith: w + 'px',
  height: h + 'px',
  opacity: 1,
};
const endStyle = {
  position: 'absolute',
  left: offset + w + 'px',
  bottom: 0,
  wdith: w / 2 + 'px',
  height: h / 2 + 'px',
  opacity: 0,
};

const containerStyle = {
  width: w / 0.6 + 'px',
  height: h + 'px',
};

const pic1 = ref(null);
const pic2 = ref(null);
const pic3 = ref(null);

const copy = (json) => JSON.parse(JSON.stringify(json));

const animate = (time = 300) => {
  requestAnimationFrame(animate);
  TWEEN.update(time);
};

const center = { left: offset, w: w, h: h, opacity: 1 };
const end = { left: 0, w: w / 2, h: h / 2, opacity: 0 };
const start = { left: containerW - w / 2, w: w / 2, h: h / 2, opacity: 0.05 };

const start2center = (el) => {
  return new TWEEN.Tween(copy(start))
    .to(center, 4000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(({ left, w: W, h: H, opacity }) => {
      el.style.setProperty('left', `${left}px`);
      el.style.setProperty('bottom', `${h - w - H + W}px`);
      el.style.setProperty('width', `${W}px`);
      el.style.setProperty('height', `${H}px`);
      el.style.setProperty('opacity', opacity);
      el.style.setProperty('z-index', 2);
    });
};

const center2end = (el) => {
  return new TWEEN.Tween(copy(center))
    .to(end, 2000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(({ left, w: W, h: H, opacity }) => {
      el.style.setProperty('left', `${left}px`);
      el.style.setProperty('bottom', `${h - w - H + W}px`);
      el.style.setProperty('width', `${W}px`);
      el.style.setProperty('height', `${H}px`);
      el.style.setProperty('opacity', opacity);
      el.style.setProperty('z-index', 1);
    });
};

const end2start = (el) => {
  return new TWEEN.Tween(copy(end))
    .to(start, 4000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(({ left, w: W, h: H, opacity }) => {
      el.style.setProperty('left', `${left}px`);
      el.style.setProperty('bottom', `${h - w - H + W}px`);
      el.style.setProperty('width', `${W}px`);
      el.style.setProperty('height', `${H}px`);
      el.style.setProperty('opacity', opacity);
      el.style.setProperty('z-index', 1);
    })
    .onComplete(() => {
      el.style.setProperty('opacity', 0.2);
    });
};

const tweens = [];

const startTween = (t1, t2, t3, r) => {
  t1.chain(t2);
  t2.chain(t3);
  if (!r) {
    t3.chain(t1);
  } else {
    t3.chain(r);
    r.chain(t2);
  }

  t1.start();
  tweens.push(t1);
};

onMounted(() => {
  // TODO 启动动画
  requestAnimationFrame(animate);

  startTween(
    end2start(pic1.value),
    start2center(pic1.value),
    center2end(pic1.value),
    end2start(pic1.value).delay(2000),
  );
  startTween(
    center2end(pic2.value),
    end2start(pic2.value).delay(2000),
    start2center(pic2.value),
  );
  startTween(
    start2center(pic3.value),
    center2end(pic3.value),
    end2start(pic3.value).delay(2000),
  );

  //   const t1 = start2center(pic3.value)
  //   const t2 = center2end(pic3.value)
  //   const t3 = end2start(pic3.value)
});

onUnmounted(() => {
  // TODO 注销动画
  tweens.forEach((x) => {
    x.stop();
  });
});
</script>

<style lang="scss" scoped></style>
