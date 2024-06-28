<template>
  <div
    class="px-5 flex items-center justify-center"
    :class="{
      ' text-main-4 error-bg error-shadow': props.error,
      ' text-secondary-7  primary-bg primary-shadow primary-text-shadow':
        !props.error,
      'font-bold': props.bold,
      italic: props.italic,
      'h-10 text-xl': isLg,
      'h-8': isBase,
      'h-7 text-sm': isSm,
      'opacity-30 pointer-events-none': props.disabled,
      'cursor-pointer undisabled': !props.disabled,
    }"
    :style="`color:${props.color}`"
  >
    <img
      v-if="props.icon"
      :src="props.icon"
      class="mr-1"
      :class="{
        'w-4 h-4': isBase,
        'w-3 h-3': isSm,
      }"
      alt=""
    />
    <slot></slot>

    <svg
      v-if="props.loading"
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
</template>

<script setup>
import { computed, defineProps } from 'vue';

/* 
    primary
    error
    warning
 */

const props = defineProps({
  error: {
    type: Boolean,
    default: false,
  },
  color: String,
  icon: String,
  bold: { type: Boolean, default: true },
  italic: Boolean,
  size: {
    type: String,
    default: 'base',
  },
  disabled: Boolean,
  loading: { type: Boolean, default: false },
});

const isBase = computed(() => props.size === 'base');
const isSm = computed(() => props.size === 'sm');
const isMd = computed(() => props.size === 'md');
const isLg = computed(() => props.size === 'lg');

// TODO 操作...处理...
</script>

<style scoped>
.primary-bg {
  background-image: url('../assets/images/bt_bg_primary.avif');
  text-shadow: 0px 0px 7px #00000066;
}
.error-bg {
  background-image: url('../assets/images/bt_bg_error.avif');
  text-shadow: 0px 0px 7px #00000066;
}
.primary-bg,
.error-bg {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.primary-shadow {
  box-shadow: 0 3px 10px #4589cb66, 0 -1px 2px #67b5de inset,
    0 1px 2px #7ef5f657 inset;
}

.error-shadow {
  box-shadow: 0px 3px 10px 0px rgba(200, 37, 37, 0.4),
    0px 1px 2px 0px rgba(255, 148, 148, 0.2) inset,
    0px -1px 2px 0px #ff3333 inset;
}

.primary-bg.undisabled:hover {
  background-image: url('../assets/images/bt_bg_primaryx.avif');
}
.error-bg.undisabled:hover {
  background-image: url('../assets/images/bt_bg_errorx.avif');
}

.primary-shadow.undisabled:hover {
  box-shadow: 0px 3px 10px 0px rgba(69, 137, 203, 0.75),
    0 -1px 2px #67b5de inset, 0 1px 2px #7ef5f657 inset;
}
.error-shadow.undisabled:hover {
  box-shadow: 0px 3px 10px rgba(200, 37, 37, 0.75), 0px -1px 2px #ff3333 inset,
    0px 1px 2px rgba(255, 148, 148, 0.2) inset;
}

.primary-text-shadow {
  text-shadow: 0px 2px 5px rgba(11, 70, 111, 0.7);
}
.base-loading__icon {
  width: 1em;
  height: 1em;
}
</style>
