<template>
  <div class="form-input-border relative flex h-10 items-center pl-4">
    <div
      class="w-full pr-8 text-whitebase focus:ring-0 form-input-border cursor-not-allowed"
    >
      {{ state.value }}
    </div>
    <span class="absolute right-2 my-1 text-black text-lg">%</span>
  </div>
</template>

<script setup>
import { getBcPlatformFee, getFpPlatformFee } from '@/constants/contract/read';
import { useNetwork } from '@/hooks';
import { defineProps, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';

const $store = useStore();

const state = reactive({
  value: '',
});

const props = defineProps({
  type: {
    type: String,
    default: 'fp',
  },
});

const network = useNetwork();

const fetchValue = async () => {
  let res;
  if (props.type == 'fp') {
    res = await getFpPlatformFee(network.value);
  } else {
    res = await getBcPlatformFee(network.value);
  }
  $store.commit('form/setFixedPrice', { platformCommission: res });

  state.value = res;
};

onMounted(() => {
  fetchValue();
});
</script>

<style lang="scss" scoped></style>
