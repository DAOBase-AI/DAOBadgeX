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
import { dropRight } from 'lodash';

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
  '#4895EFFF',
  '#9317B5FF',
  '#560BADFF',
  '#3A0CA3FF',
  '#3F37C9FF',
  '#4361EEFF',

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
      show: true,
      orient: 'vertical',
      bottom: '40%',

      textStyle: {
        color: 'ffffff',
      },
      right: 0,
    },
    grid: {
      left: 0,
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
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
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
          show: true,
          borderColor: '#FFFFFF66',
          backgroundColor: '#1e1f21bb',
          textStyle: {
            color: '#fff',
          },
          position: 'auto',
          formatter: (params) => {
            const { data } = params;

            return `
                    <div class="flex mb-1">
                      
                      <div class="font-bold" style="width: 160px;word-break: break-word;white-space: normal;">
                      ${data.name}
                      </div>
                    </div>
                  $ ${numeral(data.value)
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
