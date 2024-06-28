<template>
  <Vue3ChartJs
    type="line"
    :height="props.height"
    :data="data"
    :options="options"
    :key="`${props.price}${props.m}${props.n}`"
  ></Vue3ChartJs>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import { BigNumber } from 'bignumber.js';
import { range } from 'lodash';

const labels = range(250, 5000, 250);
labels.unshift(1);
labels.push(5000);
const props = defineProps({
  m: String,
  n: String,
  price: String,
  height: { type: Number, default: 200 },
});

const datapoints = computed(() => {
  // if (!props.m || !props.n) {
  //   return []
  // }

  const m = +props.m;
  const n = +props.n;

  const c = +new BigNumber(props.price || '0')
    .minus(new BigNumber(props.m))
    .toString();
  const fx = (x) => {
    return m * x ** n + c;
  };
  return labels.map((x) => fx(x).toFixed(5));
});

const data = computed(() => {
  return {
    labels,
    datasets: [
      {
        label: 'Cubic interpolation (monotone)',
        data: datapoints.value,
        borderColor: '#FF5585FF',
        backgroundColor: 'rgba(255, 85, 133, 0.1)',
        fill: true,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
      },
    ],
  };
});

const options = computed(() => {
  return {
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: 'Supply',
        },
        min: 1,
      },
      y: {
        // stacked: true,
        title: {
          display: true,
          text: 'Price',
        },
        min: +props.price,
        // suggestedMin: datapoints.value[0],
        // suggestedMax: datapoints.value[datapoints.length - 1]
      },
    },
    plugins: {
      // title: {
      //   display: true,
      //   text: 'Custom Chart Title'
      // },

      filler: {
        propagate: true,
      },

      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2A2E33',
        callbacks: {
          label: function (context) {
            return `Supply: ${context.label}`;
          },
          title: function (context) {
            return `Price: ${context[0].parsed.y}`;
          },
        },
      },
    },
  };
});
</script>

<style lang="scss" scoped></style>
