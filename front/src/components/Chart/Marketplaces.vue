<template>
  <div class="w-full h-full flex flex-col pb-8">
    <div class="flex-1 min-h-0 flex flex-col">
      <div class="flex-1 min-h-0" ref="container">
        <VChart
          v-if="!loading"
          ref="chart"
          class="w-full h-full"
          :option="option"
        ></VChart>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="w-4/5">
        <div class="flex justify-between items-center">
          <div
            v-for="(label, i) in labels"
            :key="i"
            class="h-3 flex items-center cursor-pointer"
            @click="i != state.current && run(i)"
          >
            <div
              v-if="i != state.current"
              class="w-2 h-2 rounded-full md:rounded-none md:w-3 md:h-0.5"
              :class="{
                ' bg-whitebase': state.current > i,
                ' bg-pass-border': state.current < i,
              }"
            ></div>
            <div
              v-else
              class="w-3 h-3 flex items-center justify-center bg-whitebase rounded-sm cursor-pointer"
              @click="toggle"
            >
              <div class="step-paused" v-if="!state.paused"></div>
              <div class="step-triangle" v-else></div>
            </div>
          </div>
        </div>

        <div class="flex justify-between text-xs w-full mt-3 px-2">
          <div class="" v-for="(label, i) in showLabels" :key="i">
            {{ label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDesktop } from '@/hooks';
import { formatVal } from '@/utils';
import { useElementSize } from '@vueuse/core';
import { BarChart } from 'echarts/charts';
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, defineProps, onMounted, reactive, ref } from 'vue';
import VChart from 'vue-echarts';

const chart = ref(null);

const timer = ref(null);
const container = ref(null);

const { width, height } = useElementSize(container);

const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const state = reactive({
  data: [],
  current: 0,
  paused: false,
});

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent,
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

const labels = computed(() => {
  /* adfasdf */
  return props.data.map((x) => x[0].createDate);
});

const isLargeScreen = useDesktop();

const showLabels = computed(() => {
  const len = isLargeScreen.value ? 6 : 3;

  return Array(len)
    .fill(0)
    .map((_, i) => labels.value[Math.floor(labels.value.length / len) * i]);
});

const option = computed(() => {
  const list = props.data[state.current];
  const label = list.map((x) => x.name);
  const data = list.map((x) => +x.totalValueUsd.toFixed(0));

  return {
    xAxis: {
      max: 'dataMax',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#FFFFFF26',
        },
      },
      splitNumber: isLargeScreen.value ? undefined : 2,
      axisLabel: {
        formatter: (val) => formatVal(val, { omit: true }),
      },
    },
    yAxis: {
      type: 'category',
      data: label,
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      axisLabel: {
        color: '#fff',
        fontSize: 10,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#FFFFFF26',
        },
      },
    },
    graphic: [
      {
        type: 'group',
        bounding: 'raw',
        left: 'center',
        bottom: 'center',
        z: -1,
        children: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            z: -1,
            style: {
              fill: '#ffffff26',
              text: list[0].createDate,
              font: 'bold 56px sans-serif',
            },
          },
        ],
      },
    ],
    grid: {
      top: 20,
      bottom: 40,
      left: isLargeScreen.value ? 140 : 100,
      right: isLargeScreen.value ? 100 : 50,
    },

    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: 'column',
        type: 'bar',
        data: data,
        color: colors,
        itemStyle: {
          color(params) {
            return colors[params.dataIndex];
          },
        },
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
          textBorderColor: 'transparent',
          // fontWeight: 'bold',
          fontSize: 12,
          color: '#fff',
          formatter: ({ value }) => {
            return `$${formatVal(value, { omit: true })}`;
          },
        },
      },
    ],
    legend: {
      show: false,
    },
    animationDuration: 0,
    animationDurationUpdate: 2000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
  };
});

const pause = () => {
  clearTimeout(timer.value);
  state.paused = true;
};

const run = (cur) => {
  if (cur != undefined) {
    state.current = cur;
    if (timer.value) {
      clearTimeout(timer.value);
    }
  } else if (++state.current == props.data.length) {
    state.current = 0;
  }

  timer.value = setTimeout(() => {
    run();
  }, 2000);
};

const toggle = () => {
  if (state.paused) {
    run();
    state.paused = false;
  } else {
    pause();
  }
};

onMounted(async () => {
  run();
});
</script>

<style scoped>
.step-triangle {
  width: 0;
  height: 0;
  border-top: 3.4px solid transparent;
  border-bottom: 3.4px solid transparent;
  border-left: 6.4px solid black;
}
.step-paused {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.step-paused::after {
  content: '';
  width: 3px;
  height: 8px;
  margin-left: 2px;
  background: #000;
}

.step-paused::before {
  content: '';
  width: 3px;
  height: 8px;
  background: #000;
}
</style>
