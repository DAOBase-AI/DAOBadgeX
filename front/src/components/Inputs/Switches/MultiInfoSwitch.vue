<template lang="">
  <div
    v-for="(item, i) in options"
    :key="i"
    class="px-2 lg:px-6 py-2 rounded-lg bg-white-005 cursor-pointer transition-all"
    :style="
      selectedIndex == i
        ? 'border:1px solid #fff'
        : 'border:1px solid transparent'
    "
    @click="$emit('change', i)"
  >
    <div class="mb-2 flex text-body">
      <div>{{ item.name }}</div>
      <div v-if="item.timeSpan" class="ml-2 text-white-040">
        ({{ item.timeSpan }})
      </div>
    </div>
    <div v-if="item.subtitle" class="text-white-070 text-xs">
      {{ item.subtitle }}
    </div>
    <div class="flex items-center">
      <div v-if="item.value.constructor.name === 'Array'">
        <div
          class="flex items-center text-xs lg:text-sm"
          v-for="(valueItem, i) in item.value"
          :key="i"
        >
          <div :class="valueItem.iconClass"></div>
          <div class="ml-2">{{ valueItem.name }}</div>
          <SecondaryTitle
            primaryStyle="font-bold ml-2 mr-2"
            :isPrimaryMonetary="valueItem.valueSymbol ? true : false"
            :primaryStat="valueItem.value"
            :primaryToFixed="1"
            :secondaryStat="valueItem.rate"
            :isSecondarySuffix="true"
            :isSecondaryLocale="true"
          />
        </div>
      </div>
      <SecondaryTitle
        v-else
        containerStyle="flex items-center"
        :isPrimaryMonetary="item.valueSymbol ? true : false"
        primaryStyle="font-bold mr-2 font-bold text-sm lg:text-xl"
        secondaryStyle="text-xs lg:text-base"
        :primaryStat="item.value"
        :primaryToFixed="1"
        :secondaryStat="item.rate"
        :isSecondarySuffix="true"
        :isSecondaryRate="item.rateSymbol && item.rateSymbol !== undefined"
      />
    </div>
  </div>
</template>
<script setup>
import { getRateColor, suffixNum } from '@/utils';
import CountUp from '@/components/CountUp.vue';
import SecondaryTitle from '@/components/LeaderBoard/SecondaryTitle.vue';
const props = defineProps({
  options: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 },
});

defineEmits(['change']);
</script>
<style lang=""></style>
