<template></template>
<script setup>
import { onMounted, watch } from 'vue';
import mitt, { mittWalletSelectHide, mittSmartWalletSignOut } from '@/libs/event';
// import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/vue';
// import { smartWalletConfig, projectId } from '@/config/smartWallet';
import { useConnect, useDisconnect, useAccountEffect, useSignMessage, useReadContract } from '@wagmi/vue';
import { getNounce } from '@/api/user';
import { doLogin } from '@/hooks';
import { useStore } from 'vuex';

// Create modal
// createWeb3Modal({
//   wagmiConfig: smartWalletConfig,
//   projectId,
//   enableAnalytics: true, // Optional - defaults to your Cloud configuration
//   enableOnramp: true // Optional - false as default
// })

// // Use modal composable
// const modal = useWeb3Modal();
const store = useStore();
const { connectors, connect } = useConnect();
const { disconnect } = useDisconnect();
const { signMessageAsync } = useSignMessage();

const signMsg = async (accounts) => {
    try {
      // signing.value = true;
      const address = accounts[0];
      const nonce = await getNounce(address);
      const signature = await signMessageAsync({ account: address, message: nonce });
      doLogin(store, accounts, nonce, signature, false, false, true, store.state.wallet.urlInviteId);
    } catch (error) {
      disconnect();
      console.error('Smart wallet error::', error.message);
      // ElMessage.error(error.shortMessage || error.message || 'Something Error');
    } finally {
      console.log('finished');
      // signing.value = false;
    }
};

const connectWallet = async () => {
  const coinbaseWalletConnector = connectors.find(
    (connector) => connector.id === 'coinbaseWalletSDK'
  );
  if (coinbaseWalletConnector) {
    connect(
      { connector: coinbaseWalletConnector },
      { 
        onError: (error) => {
          console.error('Smart wallet connect error::', error);
          mittSmartWalletSignOut();
        },
        onSuccess: (data) => console.info('Smart wallet connect success::', data),
      }
    );
  } else {
    console.log('Can not find coinbaseWalletSDK.');
  }
  // await modal.open();
  mittWalletSelectHide();
};

useAccountEffect({
  onConnect(data) {
    console.log('Connected!', data);
    signMsg(data.addresses);
  },
  onDisconnect() {
    console.log('Disconnected!')
  },
})

onMounted(() => {
  // mitt.on('wallet-connect', () => {
  //   console.log('mitt.on wallet-connect');
  //   connectWallet();
  // });
  mitt.on('smartwallet-sign', () => {
    console.log('mitt.on smartwallet-sign');
    connectWallet();
  });
  mitt.on('smartwallet-signout', () => {
    console.log('mitt.on smartwallet-signout');
    disconnect();
  });
});
</script>
<style scoped></style>