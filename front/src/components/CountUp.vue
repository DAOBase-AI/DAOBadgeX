<template>
  <div class="flex">
    <span v-if="isMonetary">
      <span v-if="isEth"
        ><tippy content="ETH" :arrow="false">
          <i
            class="iconfont icon-ETH2-24"
            style="font-size: inherit"
          ></i> </tippy
      ></span>
      <span v-else> $ </span>
    </span>
    <span :style="{ fontSize: props.fontSize }" v-if="isSuffix"
      >{{ value > 0 ? '+' : value == 0 ? '0' : '-' }}
    </span>
    <span :style="{ fontSize: props.fontSize }"
      ><number
        ref="number1"
        :from="0"
        :to="integerValue"
        :format="formatTheValue"
        :duration="integerValue > 1000 ? 2 : 1"
        easing="Power1.easeOut"
      />
    </span>
    <span v-if="isRate">%</span>
    <span v-if="isSuffix && timeSpan">&nbsp;{{ timeSpan }}</span>
  </div>
</template>
<script setup>
import { convertToNumber } from '@/utils/math';
import { computed } from 'vue';

const integerValue = computed(() => {
  if (typeof props.value === 'string') {
    return Math.abs(convertToNumber(props.value));
  } else {
    return Math.abs(props.value ? props.value : 0);
  }
});
const formatTheValue = (val) => {
  const value = Number.isInteger(props.value)
    ? Math.round(val)
    : Math.round((val + Number.EPSILON) * 100) / 100;

  if (props.isLocale) {
    const localedNumber = Number.isInteger(value)
      ? value.toLocaleString()
      : parseFloat(value.toFixed(props.toFixed)).toLocaleString();
    return props.hasBrackets ? '\xA0(' + localedNumber + ')' : localedNumber;
  } else {
    return props.hasBrackets
      ? '\xA0(' + convertToString(value) + ')'
      : convertToString(value);
  }
};
const props = defineProps({
  isEth: Boolean,
  value: String | Number,
  hasBrackets: { type: Boolean, default: false },
  isLocale: { type: Boolean, default: false },
  isMonetary: { type: Boolean, default: false },
  isSuffix: { type: Boolean, default: false },
  isRate: { type: Boolean, default: false },
  toFixed: { type: Number, default: 2 },
  timeSpan: { type: String, default: null },
  fontSize: String,
});

const convertToString = (number) => {
  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(props.toFixed)}B`;
  } else if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(props.toFixed)}M`;
  } else if (number >= 1_000) {
    return `${(number / 1_000).toFixed(props.toFixed)}K`;
  } else if (props.isRate) {
    return number.toFixed(props.toFixed);
  } else if (Number.isInteger(number)) {
    return number;
  } else {
    return number.toFixed(props.toFixed);
  }
};
</script>
<style></style>
