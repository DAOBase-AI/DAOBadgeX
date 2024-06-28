<template>
  <Dialog :visible="state.visible" @close="onClose" alert>
    <div class="flex flex-col items-center text-whitebase mt-10 py-16">
      <svg
        class="base-loading__icon ml-2"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 100 100;270 100 100"
            begin="0s"
            dur="1.6s"
            fill="freeze"
            repeatCount="indefinite"
          ></animateTransform>
          <circle
            fill="none"
            stroke="currentColor"
            stroke-width="20"
            stroke-linecap="round"
            cx="100"
            cy="100"
            r="90"
            stroke-dasharray="567"
            stroke-dashoffset="1848"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 100 100;135 100 100;450 100 100"
              begin="0s"
              dur="1.6s"
              fill="freeze"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="stroke-dashoffset"
              values="567;142;567"
              begin="0s"
              dur="1.6s"
              fill="freeze"
              repeatCount="indefinite"
            ></animate>
          </circle>
        </g>
      </svg>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog.vue';
import { onMounted, reactive } from 'vue';
import mitt from '@/libs/event';

const state = reactive({
  marks: [],
  num: 0,
  visible: false,
});

const onClose = () => {
  state.marks = [];
  state.num = 0;
  state.visible = false;
};

onMounted(() => {
  mitt.on('loading', ({ id, visible }) => {
    if (visible) {
      state.marks.push(id);
      state.num++;
    } else {
      const index = state.marks.findIndex((x) => x == id);
      if (index != -1) {
        state.marks.splice(index, 1);
        state.num--;
      }
    }
    state.visible = !!state.num;
  });
});
</script>

<style lang="scss" scoped>
.base-loading__icon {
  width: 6rem;
  height: 6rem;
}
</style>
