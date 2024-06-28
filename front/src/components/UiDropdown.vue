<template>
  <div>
    <div v-if="!!label" class="text-black mb-3 h-6 flex">
      <div class="flex items-start" style="color: #ff5585ff" v-if="required">
        <div class="h-1 w-1 rounded-full bg-inputActive"></div>
      </div>
      <span> {{ label }} </span>
    </div>
    <div v-click-away="onClose" class="text-sm relative" :class="widthClass">
      <div
        class="ui-dropdown--box pl-2 md:pl-4 pr-2 flex items-center text-whitebase cursor-pointer font-bold outline-none"
        :class="{
          'ui-dropdown--box__border': !props.noBorder,
          [props.boxStyle]: true,
          ' text-xs h-8': props.size == 'sm',
          'h-10 text-base': props.size == 'base',
          'justify-between': props.isBetween,
          'justify-center': !props.isBetween,
        }"
        @click="state.open = !state.open"
        tabIndex="1"
        @keyup="onKeyup"
      >
        <div
          :class="{
            'flex-1': props.isBetween,
            'mr-2': !props.isBetween,
            uppercase: props.textCapital,
          }"
          v-if="props.modelValue.label"
        >
          {{ props.modelValue.label }}
        </div>
        <div v-else style="color: #ffffff66">{{ props.placeholder }}</div>

        <i
          class="iconfont icon-right transition-all"
          :class="{
            'transform rotate-90': state.open,
          }"
        ></i>
      </div>
      <transition name="fade">
        <div
          v-if="state.open"
          class="absolute w-full ui-dropdown--options mt-2 z-40 bg-white"
          role="listbox"
        >
          <div
            v-for="(item, i) in options"
            :key="item"
            class="ui-dropdown--option justify-start text-left"
            :class="{
              'ui-dropdown--option--active': state.selectIndex == i,
              ' text-xs p-2': props.size == 'sm',
              'p-3': props.size == 'base',
              // 'justify-center': !props.isBetween,
              uppercase: props.textCapital,
            }"
            role="option"
            tabindex="-1"
            @click="change(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch, watchEffect } from 'vue';
import TWEEN from '@tweenjs/tween.js';

const $emits = defineEmits(['update:modelValue']);

const props = defineProps({
  widthClass: String,
  placeholder: String,
  options: Array,
  modelValue: Object,
  label: String,
  required: {
    type: Boolean,
    default: false,
  },
  boxStyle: String,
  size: { type: String, default: 'base' },
  isBetween: {
    type: Boolean,
    default: true,
  },
  textCapital: {
    type: Boolean,
    default: false,
  },
  noBorder: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  open: false,
  selectIndex: 0,
});

watchEffect(() => {
  const index = props.options.findIndex(
    (x) => x.label == props.modelValue?.label,
  );
  state.selectIndex = index == -1 ? 0 : index;
});

const onClose = () => {
  state.open = false;
};

const onKeyup = (e) => {
  if (e.keyCode == '38') {
    state.selectIndex = Math.max(0, state.selectIndex - 1);
  }
  if (e.keyCode == '40') {
    state.selectIndex = Math.min(
      props.options.length - 1,
      state.selectIndex + 1,
    );
  }
  // do->select
  if (e.keyCode == '13') {
    const obj = props.options[state.selectIndex];
    $emits('update:modelValue', obj);
    state.open = false;
  }
};

const change = (item) => {
  $emits('update:modelValue', item);
  state.open = false;
};
</script>

<style scoped>
.ui-dropdown--box {
  border-radius: 8px;
}

.ui-dropdown--box__border {
  border: 1px solid #2a2e33;
}

@media (max-width: 768px) {
  .ui-dropdown--options {
    border: none !important;
    background: #2a2e34;
  }
  .ui-dropdown--option:not(:last-child) {
    border-bottom: 1px solid #ffffff1a;
  }
}

.ui-dropdown--options {
  border-radius: 4px;
  border: 1px solid #831828;
}
.ui-dropdown--option {
  display: flex;
  align-items: center;
  /* height: 30px; */
  padding-left: 16px;
  cursor: pointer;
  color: #fff;
}
.ui-dropdown--option:hover,
.ui-dropdown--option--active {
  background: rgba(255, 255, 255, 0.1);
}
</style>
