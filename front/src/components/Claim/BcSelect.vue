<template>
  <div
    class="w-full h-full overflow-y-scroll flex flex-wrap p-2 pb-8"
    v-if="state.passList.length > 0"
  >
    <div
      class="box-width flex-shrink-0 relative cursor-pointer"
      style="height: fit-content"
      v-for="(item, i) in state.passList"
      :key="item.tokenId || i"
      :class="{
        'mr-4': i % 2 == 0,
        'mb-4': !(
          state.passList.length - 1 == i ||
          (i % 2 == 0 && state.passList.length - 2 == i)
        ),
        'box-width__active': item.actived,
      }"
      @click="doChoose(item)"
    >
      <div class="absolute top-0 left-0 w-full h-full flex flex-col">
        <div class="relative" style="flex: 2; overflow: hidden">
          <img class="w-full h-full object-cover" :src="item.image" alt="" />
          <div
            v-if="item.actived"
            class="absolute bottom-0 w-full flex justify-between p-2 backdrop-filter backdrop-blur text-sm text-whitebase bg-masked"
          >
            <div>Balance</div>
            <div>
              {{ item.bcBurnAmount }} / {{ item.balance }}
              <!-- <input
                type="number"
                :value="item.bcBurnAmount"
                @blur="onInput(e, item)"
              /> -->
            </div>
          </div>
        </div>
        <div style="flex: 0 0 1; color: #737373">
          <div
            class="bg-pass-bg text-sm flex flex-col justify-between px-2 py-1"
          >
            <div class="text-whitebase">{{ item.symbol }}</div>
            <div>#{{ item.tokenId }}</div>
            <div class="text-xs">{{ item.balance }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-3/4 mx-auto h-full flex justify-center items-center">
    <img src="@/assets/images/list_empty.avif" alt="" />
  </div>
</template>

<script setup>
import {
  computed,
  defineProps,
  defineEmits,
  onMounted,
  reactive,
  watch,
} from 'vue';

const state = reactive({
  passList: [0, 0],
});

const emits = defineEmits(['onChange', 'reset']);

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  selected: { type: Object, default: () => ({}) },
  mul: {
    type: Boolean,
    default: false,
  },
});

const updateList = (list, selected) => {
  const xList = JSON.parse(JSON.stringify(list));

  const x = {};
  xList.forEach((pass) => {
    x[pass.tokenId] = pass;
  });

  Object.keys(selected).forEach((key) => {
    if (x[key] !== undefined) {
      x[key].actived = true;
      x[key].bcBurnAmount = selected[key];
    }
  });
  state.passList = xList;
};

const onInput = (e, item) => {
  const val = e.target.value;
  emits('onChange', { flag: true, tokenId: item.tokenId, bcBurnAmount: val });
};

const doChoose = (item) => {
  emits('onChange', {
    flag: props.selected[item.tokenId] == undefined,
    data: { tokenId: item.tokenId, bcBurnAmount: item.bcBurnAmount },
  });
};

onMounted(() => {
  updateList(props.list, props.selected);
});

watch(
  () => props.list,
  (val) => {
    state.passList = val || [];
  },
);

watch(
  () => [props.list, props.selected],
  (val) => {
    updateList(...val);
  },
);

watch(
  () => props.mul,
  (flag) => {
    if (!flag && Object.keys(props.selected).length != 0) {
      const item = props.selected[Object.keys(props.sel)[0]];
      emits('reset', {
        tokenId: item.tokenId,
        bcBurnAmount: item.bcBurnAmount,
      });
    }
  },
);
</script>

<style scoped>
.box-width {
  width: calc((100% - 1rem - 8px) / 2);
  padding-bottom: calc((100% - 1rem - 8px) / 2 * 1.2);
  box-shadow: -8px 8px 16px 0px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

/* .box-width:hover, */
.box-width__active {
  border-image: linear-gradient(
      270deg,
      rgba(131, 24, 40, 0.2),
      rgba(131, 24, 40, 1)
    )
    2 2;
}
</style>
