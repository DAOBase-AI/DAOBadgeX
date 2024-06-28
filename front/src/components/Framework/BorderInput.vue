<template>
  <div class="flex-1">
    <div class="text-bold flex relative">
      <input
        v-if="!props.textarea"
        v-model="state.text"
        :type="props.type"
        :name="props.name"
        :placeholder="props.placeholder"
        autocomplete="off"
        :disabled="props.disabled"
        @blur="checkRule()"
        @keydown.enter="emits('enter')"
        class="flex-1 block w-full h-10 bg-transparent bg-opacity-20 focus:border-main-0 focus:ring-0 min-w-0 sm:text-sm font-medium text-black px-4 border-gradient-main placeholder-strong-gray"
        :class="{
          'border-error': !state.errorMessage,
          'bg-gray-900': disabled,
        }"
      />
      <textarea
        v-if="textarea"
        v-model="text"
        :name="props.name"
        :autocomplete="props.autocomplete"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :rows="props.rows"
        class="w-full border border-transparent bg-primary bg-opacity-20 focus:border focus:border-primary focus:ring-0 min-w-0 sm:text-sm font-medium text-black"
      />
    </div>
    <div class="mt-1 h-1 text-xs pr-3 pointer-events-none">
      <span class="mr-2 text-red-400">{{ state.errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import {
  defineEmits,
  defineProps,
  defineExpose,
  reactive,
  watch,
  onMounted,
} from 'vue';

const state = reactive({
  text: '',
  legal: true,
  errorMessage: '',
});

const emits = defineEmits(['update:modelValue', 'enter']);

const props = defineProps({
  name: {
    type: String,
  },
  required: {
    type: Boolean,
  },
  max: {
    type: Number,
    default: 1000,
  },
  min: {
    type: Number,
    default: 0,
  },
  textarea: {
    type: Boolean,
  },
  modelValue: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
  },
  autocomplete: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: String,
  },
});

const checkRule = (text) => {
  let flag = true;
  const target = text || state.text;
  if (props.required && !target) {
    flag = false;
    state.errorMessage = `${props.name} cant't empty!!!`;
  } else if (target.length > props.max) {
    flag = false;
    state.errorMessage = `${props.name} max ${props.max} !!!`;
  } else if (target.length < props.min) {
    flag = false;
    state.errorMessage = `${props.name} min ${props.min} !!!`;
  }

  props.rules.forEach((rule) => {
    if (!flag) {
      return;
    }
    const { check, msg } = rule;

    if (!check(target)) {
      flag = false;
      state.errorMessage = msg;
    }
  });
  if (flag) state.errorMessage = '';
  return flag;
};

watch(
  () => state.text,
  (val) => {
    emits('update:modelValue', val);
    checkRule(val);
  },
);

watch(
  () => props.modelValue,
  (val) => {
    state.text = val;
  },
);

defineExpose({ checkRule });
</script>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<style scoped>
.border-gradient-main {
  font-size: 1rem;
  border-image-source: linear-gradient(
    90deg,
    rgba(140, 27, 41, 0.2) 0%,
    #8c1b29 100%
  );
  border-image-slice: 1;
  border-image-repeat: stretch;
  border-width: 2px;
}
</style>
