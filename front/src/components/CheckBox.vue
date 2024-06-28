<template>
  <div
    class="checkbox-vars checkbox"
    :class="{
      'cursor-not-allowed checkbox-disabled': props.disabled,
      'cursor-pointer ': !props.disabled,
      'checkbox-checked': state.check,
      'checkbox-vars-default': true,
    }"
    :tabindex="props.disabled ? undefined : 0"
    role="cehckbox"
    :aria-checked="state.check"
    @click="handleClick"
    @keyup="handleKeyUp"
    @keydown="handleKeyDown"
  >
    <div class="checkbox-box">
      <IconTransition>
        <div class="checkbox-icon" v-if="state.check">
          <svg viewBox="0 0 64 64" class="check-icon">
            <path
              d="M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z"
            />
          </svg>
        </div>
      </IconTransition>

      <div class="checkbox-box__border"></div>
    </div>
    <span class="checkbox-label font-bold"><slot></slot></span>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  reactive,
  watchEffect,
  nextTick,
  inject,
  computed,
} from 'vue';
import IconTransition from '@/components/IconTransition.vue';

const props = defineProps({
  disabled: Boolean,
  modelValue: Boolean,
});

const state = reactive({
  check: props.modelValue,
});

const emits = defineEmits(['update:modelValue']);

watchEffect(() => {
  state.check = props.modelValue;
});

const toggle = (e) => {
  state.check = !state.check;
  emits('update:modelValue', state.check);
  nextTick(() => {
    state.check = props.modelValue;
  });
};

const handleClick = (e) => {
  if (props.disabled) return;
  toggle(e);
};

const handleKeyUp = (e) => {
  if (props.disabled) return;
  switch (e.code) {
    case 'Space':
    case 'Enter':
    case 'NumpadEnter':
      toggle(e);
  }
};

const handleKeyDown = (e) => {
  switch (e.code) {
    case 'Space':
      e.preventDefault();
  }
};
</script>

<style scoped>
.checkbox-vars {
  --n-size: 14px;
  --n-font-size: 14px;
  --n-color-table: rgb(24, 24, 28);
  --n-border-radius: 4px;
  --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
  --n-color: #0000;
  --n-check-mark-color: #fff;
  --n-text-color: rgba(255, 255, 255, 1);
  --n-label-padding: 0 8px;

  --n-border: 1px solid #fff;

  --n-box-shadow-focus: 0 0 0 2px #ff55854d;

  --n-text-color-disabled: rgba(255, 255, 255, 0.38);
  --n-color-disabled: rgba(255, 255, 255, 0.06);
  --n-border-disabled: 1px solid rgba(255, 255, 255, 0.24);
}
.checkbox-vars-default {
  --n-border-checked: 1px solid #ff5585;
  --n-color-checked: #ff5585;
  --n-border-checked: 1px solid #ff5585;
  --n-border-focus: 1px solid #ff5585ff;
}
.checkbox-vars-aavegotchi {
  --n-border-checked: 1px solid #fa34f2ff;
  --n-color-checked: #fa34f2ff;
  --n-border-checked: 1px solid #fa34f2ff;
  --n-border-focus: 1px solid #fa34f2ff;
}
.checkbox-vars-ape {
  --n-border-checked: 1px solid #0623cbff;
  --n-color-checked: #0623cbff;
  --n-border-checked: 1px solid #0623cbff;
  --n-border-focus: 1px solid #0623cbff;
}

.checkbox {
  line-height: 1;
  font-size: var(--n-font-size);
  outline: none;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  vertical-align: middle;
  --n-merged-color-table: var(--n-color-table);
  width: fit-content;
}

.checkbox .checkbox-box {
  height: var(--n-size);
  width: var(--n-size);
  display: inline-block;
  box-sizing: border-box;
  border-radius: var(--n-border-radius);
  background-color: var(--n-color);
  position: relative;
  transition: background-color 0.3s var(--n-bezier);
}

.checkbox .checkbox-box .checkbox-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 1px;
  right: 1px;
  top: 1px;
  bottom: 1px;
}

.checkbox .checkbox-box .checkbox-icon .check-icon {
  width: 100%;
  fill: var(--n-check-mark-color);
  opacity: 0;
  transform: scale(0.5);
  transform-origin: center;
  transition: fill 0.3s var(--n-bezier), transform 0.3s var(--n-bezier),
    opacity 0.3s var(--n-bezier), border-color 0.3s var(--n-bezier);
}

.checkbox-box__border {
  transition: border-color 0.3s var(--n-bezier), box-shadow 0.3s var(--n-bezier);
  border-radius: inherit;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: var(--n-border);
}

.checkbox .checkbox-label {
  color: var(--n-text-color);
  transition: color 0.3s var(--n-bezier);
  user-select: none;
  padding: var(--n-label-padding);
}

.checkbox.checkbox-checked .checkbox-box .checkbox-box__border {
  border: var(--n-border-checked);
}

.checkbox.checkbox-checked .checkbox-box .checkbox-icon .check-icon {
  opacity: 1;
  transform: scale(1);
}

.checkbox.checkbox-checked .checkbox-box {
  background-color: var(--n-color-checked);
  border-left: 0;
  border-top: 0;
}

.checkbox:hover .checkbox-box .checkbox-box__border {
  border: var(--n-border-checked);
}

.checkbox:focus:not(:active) .checkbox-box .checkbox-box__border {
  border: var(--n-border-focus);
  box-shadow: var(--n-box-shadow-focus);
}

.checkbox.checkbox-checked:focus:not(:active)
  .heckbox-box
  .checkbox-box__border {
  border: var(--n-border-checked);
  box-shadow: var(--n-box-shadow-focus);
}

.checkbox.checkbox-disabled .checkbox-box .checkbox-box__border {
  border: var(--n-border-disabled);
}

.checkbox.checkbox-disabled .checkbox-label {
  color: var(--n-text-color-disabled);
}

.checkbox.checkbox-disabled .checkbox-box {
  background-color: var(--n-color-disabled);
}
</style>
