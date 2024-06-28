<template>
  <label :class="classObject" style="width: fit-content">
    <input
      type="checkbox"
      :disabled="disabled"
      @change="onChange"
      :checked="state.value"
    />

    <div></div>
  </label>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  onMounted,
  reactive,
  computed,
  watch,
} from 'vue';

const props = defineProps({
  modelValue: Boolean,
  disabled: Boolean,
  theme: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'md',
    validator(val) {
      return ['sm', 'md', 'lg'].indexOf(val) !== -1;
    },
  },
});

const state = reactive({
  value: props.modelValue,
});

const emits = defineEmits(['update:modelValue']);

const classObject = computed(() => {
  const { modelValue, theme, disabled, size } = props;
  return {
    'vue-switcher vue-switcher-color--default': true,
    [`vue-switcher--${size}`]: true,
    ['vue-switcher--unchecked']: !modelValue,
    ['vue-switcher--disabled']: disabled,
    [`vue-switcher-theme--${theme}`]: true,
  };
});

onMounted(() => {
  // console.log(props.modelValue);
  // emits('update:modelValue');
});

const onChange = (e) => {
  emits('update:modelValue', e.target.checked);
};

watch(
  () => props.modelValue,
  (val) => {
    state.value = val;
  },
);
</script>

<style scoped></style>
