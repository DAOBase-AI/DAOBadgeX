<template>
  <Dialog
    :visible="state.visible"
    :showClose="state.showClose"
    @close="state.visible = false"
    @ok="onOk"
    alert
    :okText="state.text"
    :text="`Only supports Polygon-Maninnet, Switch now?`"
  ></Dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import mitt from '@/libs/event';
import Dialog from '../Dialog.vue';
import { switchEthChain } from '@/utils/wallet';
import { chains } from '@/constants';
import { useRouter } from 'vue-router';
import { LOCALSTORAGE_WALLET_CONNECT_CHAIN_TYPE } from '@/constants/walletTypes';

const $router = useRouter();

const state = reactive({
  visible: false,
  text: 'SURE',
  skip: false,
  showClose: false,
  network: '',
});

const onOk = () => {
  if (state.skip) {
    $router.replace('/create/dashboard');
  } else {
    switchEthChain(chains.Polygon);
    window.localStorage.setItem(
      LOCALSTORAGE_WALLET_CONNECT_CHAIN_TYPE,
      chains.Polygon.chainName,
    );
  }
};

onMounted(() => {
  mitt.on('network', ({ visible, skip }) => {
    state.visible = visible;
    state.skip = skip;
    state.text = skip ? 'SKIP' : 'SURE';
    state.showClose = skip ? false : true;
  });
});
</script>

<style lang="scss" scoped></style>
