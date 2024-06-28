<template>
  <div>
    <div v-if="title" class="text-sm text-white-040 whitespace-nowrap flex">
      {{ title }}&nbsp;
      <div v-if="titleStat" class="flex">(<CountUp :value="titleStat" />%)</div>
    </div>
    <div :class="containerStyle">
      <CountUp
        :isEth="isPrimaryEth"
        :isLocale="isPrimaryLocale"
        :value="primaryStat"
        :toFixed="primaryToFixed"
        :isMonetary="isPrimaryMonetary"
        :class="primaryStyle"
        :fontSize="props.bigFontSize"
      />
      <CountUp
        v-if="secondaryStateCondition && secondaryStat"
        :class="secondaryStyle"
        :style="`color:${getRateColor(isSecondaryColor ? secondaryStat : 0)}`"
        :value="secondaryStat"
        :isSuffix="isSecondarySuffix"
        :isRate="isSecondaryRate"
        :isLocale="isSecondaryLocale"
        :timeSpan="timeSpan"
        :hasBrackets="isSecondaryBracket"
        :fontSize="props.smallFontSize"
      />
    </div>
  </div>
</template>
<script setup>
import CountUp from '@/components/CountUp.vue';
import { getRateColor } from '@/utils';
const props = defineProps({
  isPrimaryEth: Boolean,
  containerStyle: { type: String, default: 'flex items-end' },
  title: String,
  timeSpan: String,
  titleStat: String | Number,
  titleStyle: { type: String, default: 'text-sm font-bold' },
  isTitleMonetary: { type: Boolean, default: false },
  isTitleLocale: { type: Boolean, default: false },
  titleToFixed: { type: Number, default: 2 },
  primaryStat: String | Number,
  primaryStyle: { type: String, default: 'text-sm font-bold' },
  isPrimaryMonetary: { type: Boolean, default: false },
  isPrimaryLocale: { type: Boolean, default: false },
  primaryToFixed: { type: Number, default: 2 },
  secondaryStyle: { type: String, default: 'text-sm font-bold' },
  isSecondaryLocale: { type: Boolean, default: false },
  isSecondarySuffix: { type: Boolean, default: false },
  isSecondaryColor: { type: Boolean, default: true },
  isSecondaryBracket: { type: Boolean, default: false },
  isSecondaryRate: { type: Boolean, default: false },
  secondaryStat: String | Number,
  secondaryStateCondition: { type: Boolean, default: true },
  bigFontSize: String,
  smallFontSize: String,
});
</script>
<style></style>
