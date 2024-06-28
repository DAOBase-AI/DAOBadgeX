<template>
  <Dialog
    :visible="state.show"
    @close="state.show = false"
    :boxStyle="`width:${isDesktop ? '996px' : ''};background:${
      daoPageInfo.isCustom.value
        ? daoPageInfo.vueState.customClass === 'ape'
          ? '#040718FF'
          : '#200349FF'
        : ''
    }`"
  >
    <div class="mt-10"></div>
    <div v-if="state.loading">
      <Skeletor class="rounded-none h-72"></Skeletor>
    </div>

    <div class="rounded md:h-72 flex flex-wrap text-whitebase" v-else>
      <div class="mr-4">
        <div class="mb-4 font-bold">Valuation</div>
        <div class="text-sm space-y-1">
          <div
            class="flex items-center cursor-pointer selected-box h-8"
            :class="{
              ' w-32 rounded flex items-center pl-2 ': i == state.selectedIndex,
              'selected-box__active':
                i == state.selectedIndex && !daoPageInfo.isCustom.value,
              ['bg-' + daoPageInfo.vueState.customClass]:
                daoPageInfo.isCustom.value && i == state.selectedIndex,
            }"
            v-for="(item, i) in selectedImtes"
            :key="item.text"
            @click="state.selectedIndex = i"
          >
            <div
              v-if="item.color"
              class="w-2 h-2 rounded-full mr-2"
              :style="`background: ${item.color}`"
            ></div>
            {{ item.text }}
          </div>
        </div>
      </div>
      <div class="flex-1 min-w-246px">
        <div class="flex justify-end">
          <UiTabs
            class="mb-2"
            v-model="state.timeType"
            :tabs="['7D', '1M', 'ALL']"
          ></UiTabs>
        </div>

        <div class="w-full h-56 px-4">
          <VChart
            class="w-full h-full"
            :option="lineOptions"
            :key="state.selectedIndex"
          ></VChart>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { queryDashbaordChat } from '@/api/dao';
import Dialog from '@/components/Dialog.vue';
import UiTabs from '@/components/UiTabs.vue';
import { DashboardDisplayType } from '@/constants';
import { formatVal, localeNumber } from '@/utils';
import dayjs from 'dayjs';
import {
  computed,
  defineEmits,
  defineProps,
  onMounted,
  reactive,
  watch,
  inject,
} from 'vue';
import { useRoute } from 'vue-router';
import { Skeletor } from 'vue-skeletor';

import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

import { useDesktop } from '@/hooks';
const isDesktop = useDesktop('lg');
const $emit = defineEmits(['update:modelValue']);
const daoPageInfo = inject('daoPageInfo');
const $route = useRoute();

const props = defineProps({
  height: { type: Number, default: 100 },
  isCustom: { type: Boolean, default: false },
  modelValue: Boolean,
  type: String,
  isUsdt: Boolean,
});

const state = reactive({
  show: props.modelValue,
  type: String,
  records: {
    ft: [],
    nft: [],
  },
  loading: false,
  selectedIndex: 0,
  timeType: 0,
});

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  GridComponent,
]);

onMounted(async () => {
  state.loading = true;
  try {
    const x = await queryDashbaordChat($route.params.name);

    state.records = x;
    state.loading = false;
  } catch (error) {
    /*  */
  }
});

watch(
  () => state.show,
  (val) => {
    $emit('update:modelValue', val);
  },
);

watch(
  () => props.modelValue,
  (val) => {
    state.show = val;
  },
);
const ftItem = {
  text: 'FT VAULT',
  color: daoPageInfo.isCustom.value
    ? daoPageInfo.vueState.customClass === 'ape'
      ? 'rgba(6, 35, 203, 1)'
      : 'rgba(250, 52, 242, 1)'
    : 'rgba(247, 37, 133, 1)',
};
const nftItem = {
  text: 'NFT VAULT',
  color: daoPageInfo.isCustom.value
    ? daoPageInfo.vueState.customClass === 'ape'
      ? 'rgba(255, 103, 5, 1)'
      : 'rgba(126, 24, 248, 1)'
    : 'rgba(147, 23, 181, 1)',
};
const selectedImtes = computed(() => {
  const allItem = {
    text: 'ALL',
  };

  if (props.type == DashboardDisplayType.ONLY_FT_COLLECTION) {
    return [ftItem];
  }

  if (props.type == DashboardDisplayType.ONLY_NFT_COLLECTION) {
    return [nftItem];
  }

  if (props.type == DashboardDisplayType.BOTH_AND_NFT_COLLECTION_FIRST) {
    return [allItem, nftItem, ftItem];
  }

  return [allItem, ftItem, nftItem];
});

const lineOptions = computed(() => {
  const num = state.timeType ? 30 : 7;

  /* - labels - */
  let labels = state.records[state.records.nft ? 'nft' : 'ft'].map(
    (x) => (x.timeText = dayjs(x.time).format('MM-DD')),
  );
  labels =
    state.timeType == 2 || num >= labels.length
      ? labels
      : labels.slice(labels.length - num, labels.length);

  /* - data - */
  const series = [];

  let ftList = state.records.ft;
  ftList =
    state.timeType == 2 || !ftList || num >= ftList.length
      ? ftList
      : ftList.slice(ftList.length - num, ftList.length);

  let nftList = state.records.nft;
  nftList =
    state.timeType == 2 || !nftList || num >= nftList.length
      ? nftList
      : nftList.slice(nftList.length - num, nftList.length);

  const color = [];

  if (
    (selectedImtes.value.length == 1 &&
      selectedImtes.value[0].text == 'FT VAULT') ||
    (selectedImtes.value.length == 3 &&
      ['ALL', 'FT VAULT'].includes(
        selectedImtes.value[state.selectedIndex].text,
      ))
  ) {
    color.push(ftItem.color);
    series.push({
      name: 'FT VAULT',
      type: 'line',
      data: ftList.map((x) => +(props.isUsdt ? x.valueUsd : x.value)),
      symbol: 'emptyCircle',
      showSymbol: false,
      smooth: true,
      areaStyle: {
        opacity: 0.2,
      },
      // tooltip: {
      //   valueFormatter: (value) => value.toFixed(4) + ' ETH',
      // },
    });
  }

  if (
    (selectedImtes.value.length == 1 &&
      selectedImtes.value[0].text == 'NFT VAULT') ||
    (selectedImtes.value.length == 3 &&
      ['ALL', 'NFT VAULT'].includes(
        selectedImtes.value[state.selectedIndex].text,
      ))
  ) {
    color.push(nftItem.color);
    series.push({
      name: 'NFT VAULT',
      type: 'line',
      data: nftList.map((x) => +(props.isUsdt ? x.valueUsd : x.value)),
      symbol: 'emptyCircle',
      showSymbol: false,
      smooth: true,
      areaStyle: {
        opacity: 0.2,
      },
      // tooltip: {
      //   valueFormatter: (value) => value.toFixed(4) + ' ETH',
      // },
    });
  }

  if (
    selectedImtes.value.length == 3 &&
    series[0].label !== selectedImtes.value[1].text
  ) {
    series.reverse();
    color.reverse();
  }

  return {
    color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      borderColor: '#FFFFFF66',
      backgroundColor: daoPageInfo.isCustom.value ? 'transparent' : '#1e1f21',
      extraCssText: 'backdrop-filter: blur(16px);',
      textStyle: {
        color: '#fff',
      },
      formatter: (data) => {
        let list;

        const htmls = data.map((data) => {
          const datas = data.seriesName == 'FT VAULT' ? ftList : nftList;
          list = datas;

          return `<div class="text-xs space-y-2  " >
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full mr-2" style="background:${
                data.color
              }"></div> ${data.seriesName}  
              </div>
            Valuation: <span class="font-bold"> ${
              props.isUsdt ? '$' : ''
            }${localeNumber(
            props.isUsdt
              ? datas[data.dataIndex].valueUsd
              : datas[data.dataIndex].value,
            3,
          )}${
            props.isUsdt ? '' : 'ETH'
          }</span><br/>In: <span class="font-bold">${
            datas[data.dataIndex].in
          }</span><br/>Out: <span class="font-bold">${
            datas[data.dataIndex].out
          }</span></div>`;
        });

        const dataIndex = data[0].dataIndex;

        return (
          `<span class="font-bold mt-2 text-xs">Total: ${
            props.isUsdt ? '$' : ''
          }${localeNumber(
            props.isUsdt
              ? +ftList[dataIndex].valueUsd + +nftList[dataIndex].valueUsd
              : +ftList[dataIndex].value + +nftList[dataIndex].value,
            3,
          )}</span>` +
          htmls.join('') +
          `<span class="font-bold mt-2 text-xs">${dayjs(
            list[data[0].dataIndex].time,
          ).format('YYYY-MM-DD')}</span>`
        );
      },
    },
    yAxis: [
      {
        splitLine: {
          show: false,
        },
        type: 'value',
        axisLabel: {
          formatter(val) {
            return formatVal(val, { omit: true });
          },
        },
      },
    ],
    xAxis: [{ type: 'category', data: labels }],
    grid: {
      top: '4%',
      left: '10%',
      right: '4%',
      bottom: '10%',
    },
    series,
  };
});
</script>

<style scoped>
.selected-box {
  border: 1px solid transparent;
  transition: all 0.3s;
}
.selected-box__active {
  border: 1px solid #fff;
}
</style>
