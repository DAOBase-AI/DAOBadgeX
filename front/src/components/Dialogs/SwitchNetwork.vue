<template>
  <Dialog
    :visible="state.visible"
    :showClose="false"
    @close="state.visible = false"
    @ok="doSwitch"
    alert
    okText="SWIICH"
    :text="`Please switch wallet-network to ${state.network}.`"
  ></Dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import mitt from '@/libs/event';
import Dialog from '../Dialog.vue';
import { switchEthChain } from '@/utils/wallet';
import { chains } from '@/constants';

const state = reactive({
  visible: false,
  network: '',
});

const doSwitch = () => {
  // eslint-disable-next-line no-undef
  switchEthChain(chains[state.network]);
};

onMounted(() => {
  mitt.on('switch-network', (network) => {
    state.visible = true;
    state.network = network;
  });
});
</script>

<style lang="scss" scoped></style>
