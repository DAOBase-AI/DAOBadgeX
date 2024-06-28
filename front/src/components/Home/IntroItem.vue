<template>
  <div
    class="home-intro-box home-pb-32 relative cursor-pointer"
    ref="container"
    @mouseenter="onMouseOver"
    @mousemove="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <div class="pointer-events-none">
      <div>
        <transition-group
          :css="false"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
          <div v-for="(li, i) in list" :key="i" :data-index="i + 1">
            <div
              class="home-mb-16"
              style="max-width: 46.67vw"
              v-if="li.type == 'label'"
            >
              {{ li.text }}
            </div>

            <p v-else>
              {{ li.text }}
            </p>
          </div>
        </transition-group>

        <div
          class="absolute bottom-2 right-0 transition-all duration-700"
          :class="{
            'hover-intro-box bottom-1/2 transform translate-y-1/2 -right-20':
              state.hover,
          }"
        >
          <div
            class="absolute text-right right-0 top-0 transform -translate-y-full delay-150"
          >
            (0{{ props.info.index }})
          </div>
          <div class="home-size-36 font-bold">{{ props.info.name }}</div>
        </div>
      </div>
      <div
        class="w-full absolute bottom-0"
        style="height: 1px; background: rgba(255, 255, 255, 0.1)"
      ></div>
      <div
        class="w-full absolute bottom-0 right-0 transition-all duration-500"
        :style="`height: 1px; background: #fff;width:${
          state.hover ? state.boxWidth : 0
        }px`"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, defineProps, computed } from 'vue';
import gsap from 'gsap';
/* 360 240 */
/* 25vw 16.7vw */

const container = ref(null);

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});

const list = computed(() => (state.hover ? props.info.texts : []));

const state = reactive({
  hover: false,
  boxWidth: 0,
});

const calcSth = () => {
  if (container.value) {
    const { width } = container.value.getBoundingClientRect();
    state.boxWidth = width;
  }
};

onMounted(() => {
  window.addEventListener('resize', calcSth);
  calcSth();
});

const onBeforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateX(-6vw)';
};
const onEnter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    transform: 'translateX(0)',
    delay: el.dataset.index * 0.1,
    duration: 0.4,
    onComplete: done,
  });
};

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    transform: 'translateX(-6vw)',
    delay: (props.info.texts.length + 1 - el.dataset.index) * 0.1,
    duration: 0.4,
    onComplete: done,
  });
};

const onMouseOver = (e) => {
  state.hover = true;
};

const onMouseLeave = (e) => {
  state.hover = false;
};
</script>

<style scoped>
.home-logo {
  width: 36.1vw;
  height: 10.7vw;
}
.home-size {
  font-size: 1vw;
}
.home-size-20 {
  font-size: 1.38vw;
}
.home-size-36 {
  font-size: 2.5vw;
}
.home-size-72 {
  font-size: 5vw;
}
.home-btn {
  width: 12.7vw;
  height: 2.7vw;
  white-space: nowrap;
}

.home-mb-16 {
  margin-bottom: 1.11vw;
}
.home-mt-24 {
  margin-top: 1.67vw;
}
.home-mt-40 {
  margin-top: 2.78vw;
}
.home-mb-40 {
  margin-bottom: 2.78vw;
}
.home-mb-64 {
  margin-bottom: 4.4vw;
}
.home-mt-200 {
  margin-top: 13.89vw;
}
.home-mt-352 {
  margin-top: 24.4vw;
}
.home-mb-32 {
  margin-bottom: 2.2vw;
}
.home-my-56 {
  margin: 3.89vw 0;
}
.home-mr-100 {
  margin-right: 6.94vw;
}
.home-pb-32 {
  padding-top: 2.2vw;
}
.home-padding {
  padding: 0 8.3vw;
}
.home-intro-box {
  height: 16.67vw;
}
.home-email {
  width: 11.1vw;
  height: 11.1vw;
  background: #fff;
}
.home-email:hover .home-email-bg {
  height: 11.1vw;
}
.home-email:hover i {
  color: white;
}
.home-email-bg {
  height: 0;
  transition: all 0.6s;
}
</style>
