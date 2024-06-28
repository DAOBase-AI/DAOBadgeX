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

<style scoped>
.vue-switcher {
  position: relative;
  display: inline-block;
}
.vue-switcher__label {
  display: block;
  font-size: 10px;
  margin-bottom: 5px;
}
.vue-switcher input {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  cursor: pointer;
}
.vue-switcher div {
  position: relative;
  border-radius: 0.125rem;
  display: -webkit-flex;
  display: -ms-flex;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: linear 0.2s, background-color linear 0.2s;
}

.vue-switcher div {
  height: 20px;
  width: 48px;
  border-radius: 20px;
}
.vue-switcher div:after {
  content: '';
  height: 16px;
  width: 16px;
  border-radius: 100%;
  top: 1px;
  margin-left: -18px;

  display: block;
  transition: linear 0.15s, background-color linear 0.15s;
  position: absolute;
  left: 100%;
  cursor: pointer;
  background: #fff;
}

.vue-switcher.vue-switcher--sm div {
  height: 20px;
  width: 38px;
}
.vue-switcher.vue-switcher--sm div:after {
  content: '';
  height: 16px;
  width: 16px;
  top: 2px;
  transform: translateX(0);

  border-radius: 100px;
  display: block;
  transition: linear 0.15s, background-color linear 0.15s;
  position: absolute;
  cursor: pointer;
  background: linear-gradient(180deg, #bfbfbf 0%, #808080 100%);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.5),
    0px 2px 1px 0px rgba(255, 255, 255, 0.3) inset;
  border-radius: 2px;
}

.vue-switcher--sm.vue-switcher--unchecked div:after {
  left: 20px;
}

.vue-switcher--unchecked div {
  justify-content: flex-end;
}
.vue-switcher--unchecked div:after {
  /* left: 20px; */
  transform: translateX(-26px);
}
.vue-switcher--disabled div {
  opacity: 0.3;
}
.vue-switcher--disabled input {
  cursor: not-allowed;
}
/* .vue-switcher--bold div {
    top: -8px;
    height: 26px;
    width: 51px;
  }
  .vue-switcher--bold div:after {
    margin-left: -24px;
    top: 3px;
  }
  .vue-switcher--bold--unchecked div:after {
    left: 28px;
  }
  .vue-switcher--bold .vue-switcher__label span {
    padding-bottom: 7px;
    display: inline-block;
  } */
.vue-switcher-theme--default.vue-switcher-color--default div {
  background: #ff5585ff;
  border: 1px solid #ff5585ff;
}
.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked
  div {
  background: transparent;
  border: 1px solid #ff5585ff;
}

.vue-switcher-theme--default.vue-switcher-color--default div:after {
  /* background-color: #9d9d9d; */
}

.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked
  div:after {
  /* background-color: #c4c4c4; */
}
</style>
