<template></template>
<script setup>
import { onMounted, watch } from 'vue';
import mitt, { mittWalletSelectHide } from '@/libs/event';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/vue';
const $store = useStore();
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  useDisconnect,
  useWeb3ModalState,
} from '@web3modal/ethers5/vue';
import { useStore } from 'vuex';
import { doSignin, useUserInfo } from '@/hooks';
import { projectId, metadata } from '@/config/smartWallet';
// import { base } from '@wagmi/core/chains';

const userInfo = useUserInfo();

const base = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org/',
  rpcUrl: 'https://base.llamarpc.com',
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [base],
  projectId,
  featuredWalletIds: [
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    'e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b',
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef',
  ],
  excludeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
  ],
  themeMode: 'dark',
  cacheProvider: true,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
});
// 4. Use modal composable
const modal = useWeb3Modal();
const provider = useWeb3ModalProvider();

const { address, chainId, isConnected } = useWeb3ModalAccount();
const { disconnect } = useDisconnect();
const { open, selectedNetworkId } = useWeb3ModalState();
const connectWallet = async () => {
  await modal.open();
  mittWalletSelectHide();
};

onMounted(() => {
  mitt.on('wallet-connect', () => {
    connectWallet();
  });
  mitt.on('wallet-connect-disconnect', async () => {
    if (isConnected.value) {
      await disconnect();
    }
  });
});

const getProviderAndSignIn = async () => {
  window.walletConnectProvider = provider.walletProvider.value;
  // window.localStorage.setItem(
  //   LOCALSTORAGE_WALLET_PROVIDER,
  //   JSON.stringify(provider.walletProvider.value),
  // );
  doSignin($store, [address.value], false, true, $store.state.wallet.urlInviteId);
};

watch(
  () => [isConnected.value, address.value, userInfo.value.isSignedIn],
  async () => {
    const res = isConnected.value;
    const addr = address.value;
    if (res && addr) {
      if (!userInfo.value.isSignedIn) {
        getProviderAndSignIn();
      }
    }
  },
);

watch(
  () => isConnected.value,
  () => {
    window.walletConnectProvider = provider.walletProvider.value;
  },
);
</script>
<style scoped></style>
