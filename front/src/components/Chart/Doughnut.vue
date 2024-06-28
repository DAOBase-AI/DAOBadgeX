<template>
  <VChart class="chart" :option="option"></VChart>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import numeral from 'numeral';

const props = defineProps({
  data: Array,
});

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const colors = [
  '#F72585FF',
  '#B5179EFF',
  '#9317B5FF',
  '#560BADFF',
  '#3A0CA3FF',
  '#3F37C9FF',
  '#4361EEFF',
  '#4895EFFF',
  '#4CC9F0FF',
  '#3DFFE6FF',
  '#F6FF3DFF',
];
// name - value
const option = computed(() => {
  const legendData = props.data.map((x) => x.name);

  const sum = props.data.reduce((a, b) => a + b.value, 0);

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : ${c} ({d}%)',
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: 'pie',
        color: colors,
        // top: -60,
        // bottom: 0,
        // left: 0,
        // right: 0,
        data: props.data,
        radius: ['54%', '84%'],
        emphasis: {
          label: {
            show: false,
            fontSize: '20',
            fontWeight: 'bold',
            borderWidth: 0,
            color: '#fff',
          },
        },
        labelLine: {
          show: false,
        },
        label: {
          show: false,
          //   position: 'center',
          //   formatter: (params) => {
          //     const { data } = params;
          //     return data.rate + '%';
          //   },
        },
        tooltip: {
          borderColor: '#FFFFFF66',
          backgroundColor: '#1e1f21bb',
          textStyle: {
            color: '#fff',
          },
          position: 'right',
          formatter: (params) => {
            const { data } = params;

            return `
                  <div class="flex mb-1">
                    <img class="w-5 h-5 rounded-full mr-2" src="${
                      data.logo || require('@/assets/icons/nftnologo.avif')
                    }" />
                    <div class="font-bold" style="width: 160px;word-break: break-word;white-space: normal;">
                    ${(data.isFt ? data.symbol : data.name) || 'Others'}
                    </div>
                  </div>
                $ ${numeral(data.valueUsd)
                  .format('0.00a')
                  .toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${(
              (data.value / sum) *
              100
            ).toFixed(2)}%`;
          },
        },
      },
    ],
  };
});
</script>

<style lang="scss" scoped></style>
