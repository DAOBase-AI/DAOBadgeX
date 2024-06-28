<template>
  <div class="flex-1">
    <div v-if="!!props.label" class="text-whitebase">{{ props.label }}:</div>
    <div>
      <div class="text-bold flex relative mt-1">
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
          class="flex-1 block w-full h-8 bg-transparent bg-opacity-20 border-px-2 border-strong-gray min-w-0 sm:text-sm font-medium text-black px-6 focus:border-strong-gray focus:outline-none"
          :class="{
            'border-error': !state.errorMessage,
            'bg-gray-900': disabled,
          }"
        />
        <textarea
          v-if="textarea"
          v-model="state.text"
          :name="props.name"
          :autocomplete="props.autocomplete"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :rows="props.rows"
          class="w-full bg-transparent bg-opacity-20 border-px-2 border-strong-gray focus:border focus:ring-0 min-w-0 sm:text-sm font-medium text-black focus:border-strong-gray focus:outline-none pl-6"
        />
      </div>
      <div class="mt-1 h-1 text-xs pr-3 pointer-events-none">
        <span class="mr-2 text-red-400">{{ state.errorMessage }}</span>
      </div>
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
    default: '',
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
  label: {
    type: String,
  },
});

const checkRule = (text) => {
  let flag = true;
  const target = text || state.text || '';
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

onMounted(() => {
  state.text = props.modelValue;
});

watch(
  () => state.text,
  (val) => {
    emits('update:modelValue', val);
    checkRule(val);
  },
);

watch(
  () => props.modalValue,
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
.input-solid {
  font-size: 1rem;
  border: none;
  border-bottom: 2px solid #8c1b2940;
}
input::-webkit-input-placeholder {
  color: #737373;
  font-style: italic;
  font-weight: normal;
}
</style>
