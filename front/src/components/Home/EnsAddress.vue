<template>
  <tippy :content="state.isFormat ? state.text : props.address" :arrow="false">
    <span
      class="flex"
      v-if="!loading || state.text !== ''"
      :class="orientation"
    >
      <a
        @click.stop="() => jumpDetails(address)"
        class="cursor-pointer hover:underline"
        :class="{
          'font-bold underline py-0.5': isDetails,
          'line-clamp-1 overflow-ellipsis ': state.isFormat,
        }"
        :style="`max-width: ${maxWidth}`"
      >
        {{ state.text }}</a
      >
      <span
        v-if="props.isCore"
        class="flex items-center justify-center text-xs ml-0 h-5 whitespace-nowrap"
        :class="{ 'ml-1': orientation === 'flex-row items-center' }"
        style="
          width: 43px;
          background: rgba(255, 85, 133, 0.1);
          border-radius: 8px;
          border: 1px solid #ff5585;
          color: #ff5585;
        "
        >Core</span
      >
    </span>
    <span v-else>
      <Spin></Spin>
    </span>
  </tippy>
</template>

<script setup>
import Spin from '@/components/Spin.vue';
import { useReqByBool } from '@/hooks';
import { formatAddress } from '@/utils';
import { isAddress } from '@ethersproject/address';
import { useMediaQuery } from '@vueuse/core';
import { ethers } from 'ethers';
import { defineProps, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
const $router = useRouter();
const isLargeScreen = useMediaQuery('(min-width: 1024px)');
const state = reactive({
  text: '',
  isFormat: false,
});

const props = defineProps({
  address: String,
  originalAddress: String,
  daoId: String,
  chain: String,
  isDetails: { type: Boolean, default: false },
  size: Number,
  isCore: { type: Boolean, default: false },
  orientation: { type: String, default: 'flex-row items-center' },
  maxWidth: { type: String, default: '108px' },
});

const getEnsName = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(`${process.env.VUE_APP_ALCHEMY_RPC}`);
    // NNSENSReverseResolver Contract Details
    const NNSENSReverseResolverAddress =
      '0x849f92178950f6254db5d16d1ba265e70521ac1b';
    const NNSENSReverseResolverABI = [
      'function resolve(address) view returns (string)',
    ];
    const resolverContract = new ethers.Contract(
      NNSENSReverseResolverAddress,
      NNSENSReverseResolverABI,
      provider,
    );

    // Attempt to resolve using NNSENSReverseResolver

    const nnsName = await resolverContract.resolve(props.address);
    if (nnsName) {
      state.isFormat = true;
      state.text = nnsName;
      return;
    }

    // Fallback to ENS if NNS fails
    let ensName = await provider.lookupAddress(props.address);
    if (ensName) {
      state.isFormat = true;
      state.text = ensName;
    } else {
      throw new Error('Invalid Ens Name');
    }
  } catch (error) {
    state.text = formatAddress(props.address, props.size);
  }
};

const jumpDetails = (address) => {
  if (props.originalAddress) {
    window.open(location.origin + `/address/details/${props.originalAddress}`);
  } else {
    window.open(location.origin + `/address/details/${address}`);
  }
};

const { loadData, loading } = useReqByBool(getEnsName);
watch(
  () => props.address,
  () => {
    state.text = '';
    if (isAddress(props.address)) {
      const timeout = setTimeout(() => {
        state.text = formatAddress(props.address, props.size);
      }, 10000); // 5 seconds timeout

      loadData()
        .then(() => {
          clearTimeout(timeout);
        })
        .catch(() => {
          clearTimeout(timeout);
          state.text = formatAddress(props.address, props.size);
        });
    } else {
      state.text = formatAddress(props.address, props.size);
    }
  },
);
onMounted(() => {
  if (isAddress(props.address)) {
    const timeout = setTimeout(() => {
      state.text = formatAddress(props.address, props.size);
    }, 10000); // 5 seconds timeout

    loadData()
      .then(() => {
        clearTimeout(timeout);
      })
      .catch(() => {
        clearTimeout(timeout);
        state.text = formatAddress(props.address, props.size);
      });
  } else {
    state.text = formatAddress(props.address, props.size);
  }
});
</script>

<style lang="scss" scoped></style>
