<template>
  <div class="flex flex-col lg:flex-row items-center">
    <!-- <tippy :arrow="false" :content="`Some dao is running on multiple chains, except ${curChain} other chain data is filtered out.`" > <div class="mr-4 cursor-pointer">Selected Chain Only</div> </tippy> -->
    <div v-if="hasToolTip">
      <tippy :arrow="false" :content="toolTip">
        <div
          class="mb-2 lg:mb-0 mr-0 lg:mr-1 cursor-pointer"
          :class="labelStyle"
        >
          {{ props.label }}
        </div>
      </tippy>
    </div>
    <div v-else class="mb-1 lg:mb-0 mr-0 lg:mr-1" :class="labelStyle">
      {{ props.label }}
    </div>
    <label class="switch my-1.5" :style="{ width: props.width }">
      <input
        type="checkbox"
        :disabled="disabled"
        @change="handleChange"
        :checked="state.value"
      />
      <span class="slider round" :class="bgColor"></span>
    </label>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue';
const props = defineProps({
  bgColor: { type: String, default: 'bg-background' },
  label: { type: String, default: '' },
  width: { type: String, default: '48px' },
  labelStyle: { type: String, default: 'text-white-070 text-xs' },
  isChecked: Boolean,
  disabled: Boolean,
  hasToolTip: { type: Boolean, default: false },
  toolTip: String,
  theme: { type: String, default: 'default' },
  size: {
    type: String,
    default: 'md',
    validator(val) {
      return ['sm', 'md', 'lg'].indexOf(val) !== -1;
    },
  },
});
const state = reactive({ value: props.isChecked });
const emits = defineEmits(['change']);
const handleChange = (e) => {
  emits('change', e.target.checked);
};
watch(
  () => props.isChecked,
  (val) => {
    state.value = val;
  },
);
</script>
<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 20px;
} /* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
} /* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  -webkit-transition: 0.4s;
  transition: 0.4s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  border: 0px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(315deg, #ff5585 0%, #268cff 100%);
}
input:focus + .slider {
  box-shadow: 0 0 1px linear-gradient(315deg, #ff5585 0%, #268cff 100%);
}
input:checked + .slider:before {
  -webkit-transform: translateX(28px);
  -ms-transform: translateX(28px);
  transform: translateX(28px);
  left: 2px;
  bottom: 2px;
} /* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
