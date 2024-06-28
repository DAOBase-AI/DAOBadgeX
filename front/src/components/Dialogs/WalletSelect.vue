<template>
  <Dialog :visible="state.show" @close="doClose" alert>
    <div class="text-whitebase mt-6">
      <div class="font-bold text-xl text-center mb-4">Connect Wallet</div>
      <div class="text-xs">
        Choose how you want to connect.There are several wallet providers.
      </div>
    </div>

    <div class="mt-4 space-y-4 text-whitebase">
      <div class="rounded h-12 outline-btn" @click="doMetamask">
        <img class="w-8 h-8 mr-4" src="@/assets/icons/metamask.avif" alt="" />
        Metamask
      </div>

      <div class="rounded h-12 outline-btn" @click="doCoinbaseWallet">
        <img
          class="w-8 h-8 mr-4"
          src="@/assets/icons/coinbase.png"
          alt=""
        />
        Coinbase Wallet
      </div>

      <div class="rounded h-12 outline-btn" @click="doOkxWallet">
        <img
          class="w-8 h-8 mr-4"
          src="@/assets/icons/okx_wallet_icon_256.png"
          alt=""
        />
        OKX Wallet
      </div>

      <div class="rounded h-12 outline-btn" @click="walletConnect">
        <img
          class="w-8 h-8 mr-4 object-contain"
          src="@/assets/icons/WalletConnect-Icon-Blueberry.png"
          alt=""
        />
        WalletConnect
      </div>
      <div class="rounded h-12 outline-btn justify-between" @click="doTezos">
        <div class="flex">
          <img class="w-8 h-8 mr-4" src="@/assets/icons/beacon.avif" alt="" />
          Beacon
        </div>
        <div class="text-xs bg-white-030 rounded px-2 text-white-070 mr-4">
          tezos
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog.vue';
import { doSignin, useSigninCheck } from '@/hooks';
import mitt, { mittSmartWalletSign, mittWalletConnect } from '@/libs/event';
import { isOkxMobile } from '@/utils/index';
import { connectTezos, disconnectTezos } from '@/utils/tezosWallet';
import { withThrottling } from '@/utils/with';
import { onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { WalletTypes, LOCALSTORAGE_WALLET_TYPE } from '@/constants/walletTypes';
// import { disconnectWallet } from '@/utils/wallet';
import { useRouter, useRoute } from 'vue-router';

const $store = useStore();
const $router = useRouter();
const $route = useRoute();

const state = reactive({
  show: false,
  metamaskLoading: false,
  okxLoading: false,
  coinbaseLoading: false,
});

const mSignin = useSigninCheck();

const doClose = async () => {
  state.show = false;
  if (
    location.pathname.includes('/mintdaobadge') ||
    location.pathname.includes('point')
  ) {
    await $router.push('/');
  }
};

const doMetamask = withThrottling(async () => {
  try {
    $store.commit('wallet/setWalletType', WalletTypes.metamask);
    window.localStorage.setItem(LOCALSTORAGE_WALLET_TYPE, WalletTypes.metamask);
    state.metamaskLoading = true;
    console.log('login $route.query::', $route.query, $route.query.inviteId); 
    $store.commit('wallet/setUrlInviteId', $route.query.inviteId || '');
    await mSignin();
    state.show = false;
    state.metamaskLoading = false;
  } catch (error) {
    console.log("MetaMask mSignin error::", error);
  }
});

const doOkxWallet = withThrottling(async () => {
  const isOkApp = isOkxMobile();
  if (isOkApp) {
    const encodedUrl =
      'https://www.okx.com/download?deeplink=' +
      encodeURIComponent(
        'okx://wallet/dapp/url?dappUrl=' +
          encodeURIComponent(window.location.href),
      );
    window.open(encodedUrl, '_blank');
    return false;
  }
  try {
    $store.commit('wallet/setWalletType', WalletTypes.okx);
    window.localStorage.setItem(LOCALSTORAGE_WALLET_TYPE, WalletTypes.okx);
    state.okxLoading = true;
    console.log('login $route.query::', $route.query, $route.query.inviteId);
    $store.commit('wallet/setUrlInviteId', $route.query.inviteId || '');
    await mSignin();
    state.show = false;
    state.metamaskLoading = false;
    state.okxLoading = false;
  } catch (error) {
    console.log("OKX mSignin error::", error);
  }
});

const doCoinbaseWallet = withThrottling(async () => {
  try {
    $store.commit('wallet/setWalletType', WalletTypes.coinbase);
    window.localStorage.setItem(LOCALSTORAGE_WALLET_TYPE, WalletTypes.coinbase);
    state.coinbaseLoading = true;
    console.log('login $route.query::', $route.query, $route.query.inviteId); 
    $store.commit('wallet/setUrlInviteId', $route.query.inviteId || '');
    mittSmartWalletSign();
    state.show = false;
    state.coinbaseLoading = false;
  } catch (error) {
    console.log("Coinbase mSignin error::", error);
  }
});

const walletConnect = () => {
  window.localStorage.setItem(
    LOCALSTORAGE_WALLET_TYPE,
    WalletTypes.walletConnect,
  );
  console.log('login $route.query::', $route.query, $route.query.inviteId);
  $store.commit('wallet/setUrlInviteId', $route.query.inviteId || '');
  mittWalletConnect();
};

const doTezos = async () => {
  if (state.metamaskLoading) {
    return;
  }
  state.show = false;
  try {
    const address = await connectTezos();
    window.localStorage.setItem(LOCALSTORAGE_WALLET_TYPE, WalletTypes.tezos);
    console.log('login $route.query::', $route.query, $route.query.inviteId);
    $store.commit('wallet/setUrlInviteId', $route.query.inviteId || '');
    doSignin($store, [address], true, false, $store.state.wallet.urlInviteId);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  mitt.on('wallet-select', () => {
    state.show = true;
    state.okxLoading = false;
    state.metamaskLoading = false;
    state.tezosLoading = false;
  });

  mitt.on('wallet-select-hide', () => {
    state.show = false;
  });
});

// watch(
//   () => state.show,
//   (val) => {
//     if (!val) {
//       disconnectTezos();
//       disconnectWallet();
//     }
//   },
// );
</script>

<style scoped>
.outline-btn {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 1px solid #ffffff;
  color: #fff;
  cursor: pointer;
}

.outline-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.outline-btn:active {
  background: rgba(255, 255, 255, 0.2);
}
</style>
