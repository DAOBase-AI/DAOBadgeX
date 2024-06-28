<template>
  <div>
    <slot name="label">
      <div v-if="!!label" class="text-black text-sm mb-3 h-6">
        <span class="mr-2" style="color: #831828" v-if="required">*</span>
        <span> {{ label }} </span>
      </div>
    </slot>
    <div class="relative flex w-80">
      <div class="flex items-center mr-4">
        <i class="iconfont icon-shizhong-47"></i>
      </div>

      <DatePicker
        v-model="state.value"
        class="w-full ui-input--wrapper h-10"
        autoApply
        is24
        dark
        hideInputIcon
        :minDate="props.startDate ? new Date(props.startDate) : state.minDate"
        format="MMMM d, yyyy HH:mm"
        position="right"
        :placeholder="props.placeholder"
        @update:modelValue="onScheduleAhead"
        @open="onOpenScheduleAhead"
        @blur="$emits('blur')"
        @focus="$emits('focus')"
      />
      <div class="px-2 text-whitebase flex items-center text-xs">(UTC)</div>
    </div>
  </div>
</template>

<script setup>
import { getUTCTime } from '@/utils';
import { reactive, defineEmits, defineProps, watchEffect, watch } from 'vue';
import DatePicker from '@vuepic/vue-datepicker';

const state = reactive({
  value: '',
  minDate: getUTCTime(),
});

const props = defineProps({
  startDate: Number,
  modelValue: Number,
  label: String,
  placeholder: String,
});

const $emits = defineEmits(['update:modelValue', 'blur', 'focus']);

const onScheduleAhead = (time) => {
  state.value = time;
};
const onOpenScheduleAhead = () => {
  if (!state.value) {
    state.value = getUTCTime();
  }
};

watchEffect(() => {
  state.value = props.modelValue;
});

watch(
  () => state.value,
  (v) => {
    $emits('update:modelValue', v);
  },
);
</script>

<style scoped>
.ui-input--wrapper {
  background: #121416;

  transition: all 0.3s;
  outline: none;
}
</style>
