<template>
  <div
    class="btn-base rounded"
    :class="{
      'style-main': type == 'main',
      'style-main--weak': type == 'main-weak',
      'style-main--red': type == 'main-red',

      'style-warning': type == 'warning',
      'style-outline': type == 'outline',
      'style-outline--error': type == 'outline-error',
      'style-text': type == 'text',
      'style-link': type == 'link',
      'style-main--white': type == 'main-white',
      [`size-${size}`]: true,
      'cursor-not-allowed': disabled,
      'cursor-pointer btn-undisabled': !disabled,
      'btn-disabled':
        disabled && !['style-main', 'style-main--weak'].includes(type),
      'btn-disabled--main':
        disabled && ['style-main', 'style-main--weak'].includes(type),
    }"
    @click.stop="doClick"
  >
    <div
      class="flex items-center h-full justify-center"
      :class="{
        'style-warning--inner w-full flex items-center justify-center':
          type == 'warning',
      }"
    >
      <slot name="left-icon">
        <i :class="`iconfont ${leftIcon} mr-1`" v-if="leftIcon"></i>
      </slot>

      <slot></slot>

      <slot name="rignt-icon">
        <i :class="`iconfont ${rightIcon} ml-1`" v-if="rightIcon"></i>
      </slot>
      <slot name="spin">
        <svg
          v-if="loading"
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
      </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  /* link text outline outlin-error warning main main-weak  */
  type: {
    type: String,
    default: 'main',
    validator(value) {
      return [
        'main',
        'main-weak',
        'main-white',
        'main-red',

        'warning',
        'outline',
        'outlin-error',
        'text',
        'link',
      ].includes(value);
    },
  },
  size: {
    type: String,
    default: 'md',
    validator(value) {
      return ['xs', 'sm', 'md', 'lg'].includes(value);
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  leftIcon: String,
  rightIcon: String,
});

const emits = defineEmits(['click']);

const doClick = (e) => {
  e.preventDefault();

  if (!props.disabled) {
    emits('click', e);
  }
};
</script>

<style scoped>
.btn-base {
  font-weight: bold;
  transition: all 0.3s;
  background-repeat: no-repeat;
  background-size: cover;
}

.size-xs {
  font-size: 12px;
  height: 32px;
  padding: 0 8px;
}
.size-sm {
  font-size: 12px;
  height: 32px;
  padding: 0 18px;
}
.size-md {
  font-size: 16px;
  height: 40px;
  padding: 0 22px;
}
.size-lg {
  font-size: 20px;
  height: 56px;
  padding: 0 30px;
}

.base-loading__icon {
  width: 1em;
  height: 1em;
}

.style-main {
  background: linear-gradient(315deg, #ff5585 0%, #268cff 100%);
  border-radius: 8px;
}
.style-main:hover {
  opacity: 0.85;
}
/* .style-main.btn-undisabled:hover {
  box-shadow: 0px 3px 10px 0px rgba(200, 37, 37, 0.75),
    inset 0px 1px 2px 0px rgba(255, 148, 148, 0.2),
    inset 0px -1px 2px 0px #ff3333;
  background-image: url('../assets/images/btn/main-hover.avif');
} */
.style-main.btn-undisabled:active {
  box-shadow: 0px 2px 8px 0px rgba(255, 37, 37, 0.7),
    inset 0px 1px 2px 0px #ff8787, inset 0px -1px 2px 0px #ff8b8b;
  background-image: url('../assets/images/btn/main-active.avif');
}

.style-main--weak {
  box-shadow: 0px 2px 8px 0px rgba(42, 46, 51, 0.4),
    inset 0px 1px 2px 0px #5e6873, inset 0px -1px 2px 0px #96a0ab;
  text-shadow: 0px 2px 5px rgba(60, 54, 54, 0.5);
  color: #ffffff;
  background-image: url('../assets/images/btn/main-weak.avif');
}
.style-main--weak.btn-undisabled:hover {
  box-shadow: 0px 2px 8px 0px rgba(94, 104, 115, 0.7),
    inset 0px 1px 2px 0px #5e6873, inset 0px -1px 2px 0px #96a0ab;
  background-image: url('../assets/images/btn/main-weak-hover.avif');
}
.style-main--weak.btn-undisabled:active {
  box-shadow: 0px 2px 8px 0px #5e6873, inset 0px 1px 2px 0px #bdbdbd,
    inset 0px -1px 2px 0px #cfcfcf;
  background-image: url('../assets/images/btn/main-weak-active.avif');
}

.style-main--white {
  color: #121416;
  background: white;
}
.style-main--white.btn-undisabled:hover {
  background: rgba(255, 255, 255, 0.9);
}
.style-main--white.btn-undisabled:active {
  background: rgba(255, 255, 255, 0.8);
}

.style-main--red {
  background: #ff5585;
}
.style-new--style {
  background: linear-gradient(315deg, #ff5585 0%, #268cff 100%);
  border-radius: 8px;
}
.style-main--red:hover {
  background: #ff2640;
}
.style-main--red:active {
  background: #d91129;
}

.style-warning {
  border: 1px solid #ff5585;
  padding: 4px;
}
.style-warning--inner {
  background: #ff5585;
  color: #fff;
  transition: all 0.3s;
}

.style-warning.btn-undisabled:hover {
  border: 1px solid #ff2640;
}
.style-warning.btn-undisabled:hover .style-warning--inner {
  background: #ff2640;
}

.style-warning.btn-undisabled:active {
  border: 1px solid #d91129;
}
.style-warning.btn-undisabled:active .style-warning--inner {
  background: #d91129;
}

.style-outline {
  border: 1px solid #ffffff;
  color: #fff;
}

.style-outline.btn-undisabled:hover {
  background: rgba(255, 255, 255, 0.1);
}

.style-outline.btn-undisabled:active {
  background: rgba(255, 255, 255, 0.2);
}

.style-outline--error {
  border: 1px solid #ff5585;
  color: #ff5585;
}
.style-outline--error:hover {
  color: #ff2640;
}

.style-outline--error.btn-undisabled:active {
  color: #d91129;
}

.style-text {
  color: #ffffff;
}
.style-text:hover {
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.85);
}
.style-text.btn-undisabled:active {
  text-shadow: 0px 0px 16px rgba(255, 255, 255, 0.85);
}

.style-link {
  color: #268cff;
}
.style-link.btn-undisabled:hover {
  color: #5bbfff;
  text-decoration: underline;
}

.btn-disabled {
  opacity: 0.4;
}
.btn-disabled--main {
  opacity: 0.6;
}
.iconfont {
  font-weight: normal;
}
</style>
