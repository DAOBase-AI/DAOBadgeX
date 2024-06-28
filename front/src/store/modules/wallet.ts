import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';
import router from '@/router';

import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

import { ConnectInfo, ProviderRpcError } from './eip-1193';
import { authorize, login, postSessions } from '@/api/eth';

export interface WalletState {
  isMetaMask?: boolean;
  walletType?: string;
  provider?: any;
  isConnected?: boolean;
  chainId: string;
  authorized: boolean;
  accounts: string[];
  balances: string[];
  tokenExp: number;
  token: string;
  taskDoneCount: number,
  isShowSearchBox: boolean,
  urlInviteId: string;
  accessToken: string;
  accessTokenExp: number;
  isSignedIn: boolean;
  network: string;
}

async function retrieveProvider(
  context: ActionContext<WalletState, any>,
): Promise<any> {
  const { state, commit } = context;

  try {
    if (!state.provider) {
      const provider: any = await detectEthereumProvider();
      provider.on('connect', async ({ chainId }: ConnectInfo) => {
        commit('setConnected', true);
        commit('setChainId', chainId);
        // const unlockStatus = await provider._metamask.isUnlocked();
        // commit('setUnlocked', unlockStatus);
        // console.log(`connect: ${state.chainId}`);
      });
      provider.on('disconnect', (error: ProviderRpcError) => {
        commit('setConnected', false);
        commit('setChainId', '');
        commit('setSignedIn', false);
        router.push('/');

        console.log(`disconnect: ${error}`);
      });
      provider.on('accountsChanged', (accounts: Array<string>) => {
        commit('setAccounts', accounts);
        if (accounts.length === 0) {
          commit('setAuthorized', false);
        }
        commit('setSignedIn', false);
        commit('user/getUser', { root: true });
        router.push('/');
        console.log(`accountsChanged: ${state.accounts}`);
      });
      provider.on('chainChanged', (chainId: string) => {
        commit('setConnected', true);
        commit('setChainId', chainId);
      });
      commit('setProvider', provider);
    }
    return state.provider;
  } catch (e) {
    console.log(e);
    return null;
  }
}

const getters: GetterTree<WalletState, any> = {
  isAuthorized: (state: WalletState) => state.authorized,
  isSignedIn: (state: WalletState) => state.isSignedIn,
  isConnected: (state: WalletState) => state.isConnected,
  walletType: (state: WalletState) => state.walletType,
  provider: (state: WalletState) => state.provider,
};

const mutations: MutationTree<WalletState> = {
  setMetaMask(state: WalletState, isMetaMask: boolean) {
    state.isMetaMask = isMetaMask;
  },
  setProvider(state: WalletState, provider: any) {
    state.provider = provider;
  },
  setConnected(state: WalletState, isConnected: boolean) {
    state.isConnected = isConnected;
  },
  setChainId(state: WalletState, chainId: string) {
    state.chainId = chainId;
  },
  setAuthorized(state: WalletState, authorized: boolean) {
    state.authorized = authorized;
  },
  setAccounts(state: WalletState, accounts: string[]) {
    state.accounts = accounts;
  },
  setTokenExp(state, expireAt: number) {
    state.tokenExp = expireAt;
  },
  setToken(state, token: string) {
    state.token = token;
  },
  setUrlInviteId(state, urlInviteId: string) {
    state.urlInviteId = urlInviteId;
  },
  setTaskDoneCount(state) {
    state.taskDoneCount += 1;
  },
  setSearchBox(state, isShowSearchBox: boolean) {
    state.isShowSearchBox = isShowSearchBox;
  },
  setSignedIn(state, isSignedIn: boolean) {
    state.isSignedIn = isSignedIn;
  },
  setNetwork(state, network: string) {
    state.network = network;
  },
  setWalletType(state, walletType: string) {
    state.walletType = walletType;
  },
};

const actions: ActionTree<WalletState, any> = {
  async connect(context: ActionContext<WalletState, any>) {
    const { state, commit } = context;
    try {
      const provider = await retrieveProvider(context);

      const isConnected = await provider.isConnected();
      commit('setConnected', isConnected);
      console.log(`isConnected: ${state.isConnected}`);

      const chainId = await provider.request({
        method: 'eth_chainId',
      });
      commit('setChainId', chainId);
      console.log(`connect: chainId - ${state.chainId}`);
    } catch (e) {
      console.log(e);
    }
  },
  async connectWallet(context: ActionContext<WalletState, any>) {
    const { state, commit, dispatch } = context;
    try {
      const provider = await retrieveProvider(context);
      commit('setMetaMask', provider.isMetaMask);
      console.log(`connectWallet: isMetaMask - ${state.isMetaMask}`);

      await dispatch('connect');
      console.log(`connectWallet: isConnected - ${state.isConnected}`);
      console.log(`connectWallet: chainId - ${state.chainId}`);

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      commit('setAccounts', accounts);
      commit('setAuthorized', true);
      console.log(`connectWallet: eth_requestAccounts - ${state.accounts}`);
    } catch (e) {
      console.log(e);
    }
  },
  async addEthereumChainParameter(context: ActionContext<WalletState, any>) {
    const provider = await retrieveProvider(context);
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              // {
              //   chainId: '0x80',
              //   chainName: 'Heco',
              //   rpcUrls: ['https://http-mainnet.hecochain.com'],
              //   iconUrls: ['https://hecoinfo.com/images/ht_small.png?v=1.4'],
              //   blockExplorerUrls: ['https://hecoinfo.com/'],
              //   nativeCurrency: {
              //     name: 'Heco Token',
              //     symbol: 'HT',
              //     decimals: 18,
              //   },
              // },
              {
                chainId: '0x61',
                chainName: 'Binance Smart Chain Testnet',
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                blockExplorerUrls: ['https://testnet.bscscan.com'],
                nativeCurrency: {
                  name: 'Test BNB',
                  symbol: 'tBNB',
                  decimals: 18,
                },
              },
              // {
              //   chainId: '0x5',
              //   chainName: 'Goerli',
              //   rpcUrls: [
              //     'https://goerli.infura.io/v3/c8791f831f8747e2a949e17a6a99be93',
              //   ],
              //   blockExplorerUrls: ['https://goerli.etherscan.io/'],
              //   nativeCurrency: {
              //     name: 'Goerli ETH',
              //     symbol: 'gETH',
              //     decimals: 18,
              //   },
              // },
            ],
          });
        } catch (e) {
          console.error('wallet_addEthereumChain Error', e);
        }
      }
    }
  },
  async signIn(context: ActionContext<WalletState, any>) {
    // const { state, commit, dispatch } = context;
    // try {
    //   const provider = await retrieveProvider(context);
    //   await dispatch('connect');
    //   console.log(`connectWallet: isConnected - ${state.isConnected}`);
    //   console.log(`connectWallet: chainId - ${state.chainId}`);
    //   const accounts = await provider.request({
    //     method: 'eth_requestAccounts',
    //   });
    //   // Fetch nonce and exp from server
    //   const response = await postSessions();
    //   const sign = await dispatch('signMessage', response.nonce);
    //   // Sign and send fetch JWT
    //   const token = await login({
    //     nonce: response.nonce,
    //     exp: response.exp,
    //     sign,
    //   });
    //   if (!token.token || token.token === '') throw new Error('Invalid token');
    //   commit('setMetaMask', provider.isMetaMask);
    //   commit('setAccounts', accounts);
    //   commit('setAuthorized', true);
    //   commit('setToken', token.token);
    //   commit('setTokenExp', Date.now() + token.exp);
    //   commit('setSignedIn', true);
    //   console.log(`connectWallet: isMetaMask - ${state.isMetaMask}`);
    //   console.log(`connectWallet: eth_requestAccounts - ${state.accounts}`);
    //   // dispatch('user/getUser', state.accounts[0], { root: true });
    // } catch (e) {
    //   throw new Error(e);
    // }
  },
  async getAuthorizeToken(context: ActionContext<WalletState, any>) {
    const { state } = context;
    const result = await authorize(state.token);
    state.accessToken = result.nonce;
    state.accessTokenExp = result.exp;
  },
  async sendTransaction(
    context: ActionContext<WalletState, any>,
    params?: unknown[],
  ) {
    try {
      const provider = await retrieveProvider(context);
      provider
        .request({
          method: 'eth_sendTransaction',
          params,
        })
        .then(
          (result: any) => {
            console.log(JSON.stringify(result));
          },
          (error: ProviderRpcError) => {
            console.log(JSON.stringify(error));
          },
        );
    } catch (e) {
      console.log(e);
    }
  },
  async signMessage(context: ActionContext<WalletState, any>, nonce: string) {
    try {
      const provider = await retrieveProvider(context);
      const signer = new ethers.providers.Web3Provider(provider).getSigner();

      return await signer.signMessage(nonce);
    } catch (e) {
      console.log(e);
    }
  },
  async isLoginOutdated(context: ActionContext<WalletState, any>) {
    const { state } = context;
    if (state.tokenExp && state.tokenExp > Date.now()) {
      return false;
    } else {
      if (state.tokenExp === 0) throw new Error('Token not fetched yet.');
      return true;
    }
  },
  async getSession() {
    try {
      return await postSessions();
    } catch (error) {
      console.error(error);
    }
  },
  async signOut(context: ActionContext<WalletState, any>) {
    const { commit } = context;
    commit('setSignedIn', false);
    commit('setToken', '');
    commit('setTokenExp', 0);
    commit('setAuthorized', false);
  },
};

export const wallet: Module<WalletState, any> = {
  namespaced: true,
  state: {
    accounts: [],
    balances: [],
    chainId: '',
    network: '',
    authorized: false,
    tokenExp: 0,
    walletType: '',
    token: '',
    taskDoneCount: 0,
    isShowSearchBox: false,
    urlInviteId: '',
    accessToken: '',
    accessTokenExp: 0,
    isSignedIn: false,
  },
  mutations,
  actions,
  getters,
};
