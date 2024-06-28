<template>
  <div class="relative w-full overflow-hidden">
    <div class="carousel" ref="carousel">
      <div
        class="carousel-inner"
        :style="`width: ${width}`"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="[
            'carousel-item',
            activeIndex === index ? 'active' : '',
            activeIndex - 1 === index ? 'prev' : '',
            activeIndex + 1 === index ? 'next' : '',
            activeIndex - 1 > index || activeIndex + 1 < index
              ? 'disabled'
              : '',
          ]"
          :style="{
            transform:
              activeIndex === index
                ? 'translateX(0)'
                : `translateX(${(index - activeIndex) * 100}%)`,
            opacity: activeIndex === index ? 1 : null,
          }"
        >
          <component :is="item.el" v-bind="item.props"></component>
        </div>
      </div>
    </div>
    <div class="mt-1 flex items-center justify-center space-x-2 mb-2">
      <div
        v-for="(item, index) in items"
        :key="index"
        @click="setActive(index)"
        class="w-2 h-1 rounded-full cursor-pointer"
        :style="`background-color: ${
          activeIndex === index ? 'white' : '#808080'
        }`"
        :class="{
          'w-4': activeIndex === index,
        }"
      ></div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';

const props = defineProps({
  contents: {
    type: Array,
    required: true,
  },
  width: { type: String, default: '100%' },
});

const activeIndex = ref(null);
const startX = ref(null);
const startY = ref(null);

const items = reactive(
  props?.contents?.length > 0 &&
    props.contents.map((content, index) => ({
      name: `Content ${index + 1}`,
      el: content?.component,
      props: content?.props || {},
    })),
);

function setActive(index) {
  activeIndex.value = index;
}

function onTouchStart(event) {
  startX.value = event.touches[0].clientX;
  startY.value = event.touches[0].clientY;
}

function onTouchMove(event) {
  if (startX.value !== null) {
    const diffX = event.touches[0].clientX - startX.value;
    const diffY = event.touches[0].clientY - startY.value;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Only switch on horizontal swipe
      if (diffX > 0 && activeIndex.value > 0) {
        activeIndex.value--;
      } else if (diffX < 0 && activeIndex.value < items.length - 1) {
        activeIndex.value++;
      }
    }
    startX.value = null;
    startY.value = null;
  }
}

function onTouchEnd(event) {
  startX.value = null;
  startY.value = null;
}
onMounted(() => {
  activeIndex.value = 0; // Initialize after child components are rendered
});
</script>

<style scoped>
.carousel {
  display: flex;
  justify-content: center;
}
.carousel-inner {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;
  overflow: hidden;
  transform: translateX(0);
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-item.active {
  opacity: 1;
  transform: translateX(0);
}

.carousel-item.prev {
  transform: translateX(-100%);
}

.carousel-item.next {
  transform: translateX(100%);
}

.carousel-item.disabled {
  pointer-events: none;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}
.carousel-item:not(.active) {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
