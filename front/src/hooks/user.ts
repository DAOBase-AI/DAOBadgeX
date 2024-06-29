import { getAccounts, getChainId, connectWallet, signMessage, isMetamask, disconnectWallet } from '@/utils/wallet';
import { withDownload } from './../utils/with';
import { chains } from './../constants/index';
import { useStore } from 'vuex';
import { mittWalletConnectSignOut } from '@/libs/event';
import { getNounce, signLogin } from '@/api/user';
import { computed } from 'vue';
import { notify } from '@kyvg/vue3-notification';
import {
  clearTezosUser,
  disconnectTezos,
  isTezosConnect,
  signedTezosMsg,
} from '@/utils/tezosWallet';
import { LOCALSTORAGE_WALLET_TYPE } from '@/constants/walletTypes';

const doNetwork = (store: any, chainId?: string) => {
  if (!chainId) {
    store.commit('wallet/setChainId', '');
    store.commit('wallet/setNetwork', '');
    return;
  }

  let chainName = '';
  const keys = Object.keys(chains);
  keys.forEach((key) => {
    if (chains[key].chainId === chainId) {
      chainName = key;
    }
  });

  store.commit('wallet/setChainId', chainName ? chainId : '');
  store.commit('wallet/setNetwork', chainName ? chainName : '');
};

export const doSignin = async (
  store: any,
  accounts: string[],
  isTezos = false,
  isWalletConnect?: boolean,
  urlInviteId?: string,
) => {
  const address = accounts[0];
  console.log("get address::", accounts, address);
  if(!address) {
    console.log("can not get address!");
    return;
  }
  try {
    const nonce = await getNounce(address);
    let signature = '';
    if (!isTezos) {
      signature = await signMessage(nonce as string, address);
    } else {
      signature = await signedTezosMsg(nonce);
    }
    console.log("nonce::", nonce);
    console.log("signature::", signature);
    doLogin(store, accounts, nonce, signature, isTezos, isWalletConnect, false, urlInviteId);
  } catch (error) {
    if (isTezos) clearTezosUser();
    console.log("Signin Error ----", error);
    notify({
      type: 'error',
      text: 'Signin Failed',
    });
  }
};

export const doLogin = async (
  store: any,
  accounts: string[],
  nonce: string,
  signature: string,
  isTezos = false,
  isWalletConnect?: boolean,
  isCoinbase?: boolean,
  urlInviteId?: string,
) => {
  try {
    const address = accounts[0];
    localStorage.setItem('urlInviteId', urlInviteId);
    const res = await signLogin({
      address,
      nonce,
      signature,
      walletType: isTezos ? 'Beacon' : (isCoinbase ? 'Coinbase' : undefined),
      inviteCode: '',
    });
    console.log('signLogin::', res);
    const { authorization, avatarUrl, email, id, name, inviteCode } = res;
    store.commit('user/setUser', {
      id,
      address,
      email,
      icon: avatarUrl,
      nickname: name,
      visitorToken: inviteCode,
      wallet: isTezos ? 'beacon' : 'metamask',
    });
    store.commit('wallet/setToken', authorization);
    // store.commit('wallet/setMetaMask', isMetamask());
    store.commit('wallet/setAccounts', accounts);
    store.commit('wallet/setAuthorized', true);
    store.commit('wallet/setTokenExp', Date.now() + 300000000);
    store.commit('wallet/setSignedIn', true);
    if (isTezos) store.commit('wallet/setNetwork', 'tezos');
    if (!isTezos && !isWalletConnect) doNetwork(store, await getChainId());
  } catch (error) {
    if (isTezos) clearTezosUser();
    console.log("Signin Error ----", error);
    notify({
      type: 'error',
      text: 'Signin Failed',
    });
  };
};

export const useSigninCheck = () => {
  const store = useStore<any>();
  return withDownload(async () => {
    try {
      console.log('urlInviteId::', store.state.wallet.urlInviteId);
      const accounts = await getAccounts();
      if (accounts.length > 0) {
        await doSignin(store, accounts, false, false, store.state.wallet.urlInviteId);
      } else {
        const res = await connectWallet();
        await doSignin(store, res, false, false, store.state.wallet.urlInviteId);
      }
    } catch (e) {
      notify({
        type: 'error',
        text: 'Cancel Connect',
      });
    }
  });
};

export const useSignin = () => {
  const store = useStore<any>();

  return async (accounts: Array<string>) => {
    doSignin(store, accounts, false, false, store.state.wallet.urlInviteId);
  };
};

export const useSignOut = () => {
  const store = useStore();

  return async (needRefresh: boolean) => {
    if (store.getters['user/userInfo'].isTezos && isTezosConnect()) {
      disconnectTezos();
      await clearTezosUser();
    }
    // disconnectWallet();
    mittWalletConnectSignOut();
    store.commit('user/setUser', {
      id: '',
      address: '',
      email: '',
      icon: '',
      nickname: '',
      wallet: '',
    });
    store.commit('wallet/setToken', '');
    store.commit('wallet/setAccounts', []);
    store.commit('wallet/setAuthorized', false);
    store.commit('wallet/setTokenExp', Date.now());
    store.commit('wallet/setSignedIn', false);
    /* Network selected... */
    store.commit('wallet/setChainId', '');
    store.commit('wallet/setNetwork', '');
  };
};

export const useUserInfo = (): any => {
  const store = useStore();
  return computed(() => store.getters['user/userInfo']);
};

export const useIsSigned = (): any => {
  const store = useStore();
  return computed(() => {
    return store.state.wallet.isSignedIn;
  });
};

export const useAccounts = (): any => {
  const store = useStore();

  return computed(() => {
    return store.state.wallet.accounts;
  });
};

export const useSetNetwork = (): any => {
  const store = useStore();
  return (chainId?: string) => {
    doNetwork(store, chainId);
  };
};

export const useNetwork = () => {
  const $store = useStore();
  return computed(() => $store.state.wallet.network);
};

export const useSureNetwork = () => {
  const network = useNetwork();
  return computed(() => {
    // console.log(network.value);
    return !!chains[network.value];
  });
};

export const getChainInfo = (chainId: string) => {
  const keys = Object.keys(chains);
  let res;
  let x;
  keys.forEach((key) => {
    if (chains[key].chainId === chainId) {
      res = chains[key];
      x = key;
    }
  });
  return { key: x, chain: res };
};

export const useShowContractDialog = () => {
  const $store = useStore();
  return computed(() => $store.state.showContractDialog);
};

export const useDoContractDialog = () => {
  const $store = useStore();
  return (flag = false) => {
    $store.commit(flag ? 'openContractDialog' : 'closeContractDialog');
  };
  return computed(() => $store.state.showContractDialog);
};
