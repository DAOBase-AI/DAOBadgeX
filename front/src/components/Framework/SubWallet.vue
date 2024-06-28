<template>
  <span class="hidden"></span>
</template>

<script setup>
import {
  useSignin,
  useSignOut,
  useSetNetwork,
  getChainInfo,
  useUserInfo,
} from '@/hooks';
import { checkNetwork } from '@/libs/check';
import { mittNetwork } from '@/libs/event';
import { onAccountsChanged, onChainChanged } from '@/utils/wallet';
import { onMounted } from 'vue';

const setNetwork = useSetNetwork();
const signOut = useSignOut();
const signIn = useSignin();
const userInfo = useUserInfo();

const changeNetwork = async (chainId) => {
  const { chain } = getChainInfo(chainId);
  setNetwork(chain ? chainId : '');
  if (!chain) {
    checkNetwork();
  } else {
    mittNetwork(false);
  }
};

onMounted(() => {
  if (window.ethereum || window.okxwallet) {
    /*** Account-Change ***/
    let signCount = 0;
    onAccountsChanged(async (accounts) => {
      if(accounts.length === 0) {
        await signOut(true);
        signCount = 0;
      } else {
        if (signCount > 0) signIn(accounts);
        signCount += 1;
      }
    });

    /*** Chain-Change ***/
    onChainChanged((handler) => {
      console.log('userInfo.value');
      console.log(userInfo.value);
      if (!userInfo.value.isTezos) {
        // changeNetwork(handler);
      }
    });
  }
});
</script>

<style lang="scss" scoped></style>
