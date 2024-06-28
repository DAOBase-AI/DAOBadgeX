import { ActionContext, ActionTree, createStore, MutationTree } from 'vuex';
import persistd from './persistd';

import { wallet } from './modules/wallet';
import { user } from './modules/user';
import { dao } from './modules/dao';
import { pass } from './modules/pass';
import { erc20 } from './modules/erc20';
import { form } from './modules/form';
import { townhall } from './modules/townhall';
import { daoSettings } from './modules/daoSettings';

export interface RootState {
  wallet: any;
  version: string;
  locale: string;
  isOpenDownload: boolean;
  showContractDialog: boolean;
  statusShow: boolean;
  showBackdrop: boolean;
  showTreasuryCurrency: boolean;
  treasuryCurrency: string;
  nftInfo: any;
}

const mutations: MutationTree<RootState> = {
  setLocale(state: RootState, locale: string) {
    state.locale = locale;
  },
  setNftInfo(state: RootState, id: any) {
    state.nftInfo = id;
  },
  setShowTreasuryCurrency(state: RootState, value: boolean) {
    state.showTreasuryCurrency = value;
  },
  setTreasuryCurrency(state: RootState, value: string) {
    state.treasuryCurrency = value;
  },
  toggleBackdrop(state: RootState, value: boolean) {
    state.showBackdrop = value;
  },
  openWalletDownload(state: RootState) {
    state.isOpenDownload = true;
  },
  closeWalletDownload(state: RootState) {
    state.isOpenDownload = false;
  },
  openContractDialog(state: RootState) {
    state.showContractDialog = true;
  },
  closeContractDialog(state: RootState) {
    state.showContractDialog = false;
  },
  toggleStatus(state: RootState, flag: boolean) {
    state.statusShow = flag;
  },
};

const actions: ActionTree<RootState, RootState> = {
  logOut(context: ActionContext<RootState, any>, needRefresh: boolean) {
    const { commit } = context;

    commit('user/setUser', {
      id: '',
      address: '',
      email: '',
      icon: '',
      nickname: '',
    });
    commit('wallet/setToken', '');
    commit('wallet/setAccounts', []);
    commit('wallet/setAuthorized', false);
    commit('wallet/setTokenExp', Date.now());
    commit('wallet/setSignedIn', false);
    /* Network selected... */
    commit('wallet/setChainId', '');
    commit('wallet/setNetwork', '');
    if (window.location.hash !== '#/creator-dao' && !needRefresh) {
      window.location.reload();
    }
  },

  toggleBackdrop(context: ActionContext<RootState, RootState>) {
    context.commit('toggleBackdrop');
  },
  setNftInfo(context: ActionContext<RootState, RootState>) {
    context.commit('setNftInfo');
  },
  setShowTreasuryCurrency(context: ActionContext<RootState, RootState>) {
    context.commit('setShowTreasuryCurrency');
  },
  setTreasuryCurrency(context: ActionContext<RootState, RootState>) {
    context.commit('setTreasuryCurrency');
  },
};

const defaultState: any = {
  locale: 'en',
  version: '0.1.0',
  isOpenDownload: false,
  showContractDialog: false,
  statusShow: false,
  showBackdrop: false,
  nftInfo: {},
  showTreasuryCurrency: false,
  treasuryCurrency: 'USDT',
};

export default createStore({
  state: defaultState,
  mutations,
  actions,
  modules: {
    wallet,
    user,
    dao,
    pass,
    erc20,
    form,
    townhall,
    daoSettings,
  },
  plugins: [persistd],
});
