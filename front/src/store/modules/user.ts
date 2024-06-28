import { updateUser } from './../../api/user';
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';
import { getUserDaoInfo } from '@/api/dao';

export interface UserState {
  id: number;
  address: string;
  nickname: string;
  icon: string;
  email: string;
  daoCreated: number;
  daoJoined: number;
  visitorToken: string;
  wallet: string;
}

const mutations: MutationTree<UserState> = {
  setUser(state: UserState, user: UserState) {
    state.id = user.id;
    state.address = user.address;
    state.nickname = user.nickname;
    state.icon = user.icon;
    state.email = user.email;
    state.visitorToken = user.visitorToken;
    state.wallet = user.wallet;
  },
  setAddress(state: UserState, address: string) {
    state.address = address;
  },
  setNickname(state: UserState, nickname: string) {
    state.nickname = nickname;
  },
  setIcon(state: UserState, icon: string) {
    state.icon = icon;
  },
  setEmail(state: UserState, email: string) {
    state.email = email;
  },
  setVisitorToken(state: UserState, token: string) {
    state.visitorToken = token;
  },
};

const getters: GetterTree<UserState, any> = {
  shortAddress(state: UserState) {
    return state.address
      ? `${state.address.slice(0, 8)}...${state.address.slice(-8)}`
      : '';
  },
  getAddress(state: UserState) {
    return state.address;
  },
  userInfo(state: UserState) {
    const { id, icon, address, email, nickname, wallet } = state;

    return {
      id,
      icon,
      address,
      email,
      nickname,
      shortAddr: address ? `${address.slice(0, 8)}...${address.slice(-8)}` : '',
      isSignedIn: !!address,
      wallet,
      isTezos: wallet == 'beacon',
      isMetamask: wallet == 'metamask',
      isOkx: wallet == 'okx',
    };
  },
};

const actions: ActionTree<UserState, any> = {
  async getUserInfo(context: ActionContext<UserState, any>) {
    const { state } = context;
    const res = await getUserDaoInfo();
    state.icon = res.avatarUrl;
    state.nickname = res.name;
    state.address = res.addr;
    state.daoJoined = res.daoJoinCount;
    state.daoCreated = res.createDaoCount;
  },
  async updateUser(context: ActionContext<UserState, any>, data: any) {
    const { commit } = context;
    try {
      await updateUser(data);
      commit('setIcon', data['avatarUrl']);
    } catch (error) {
      throw new Error('Update failed');
    }
  },
  async setNickname(context: ActionContext<UserState, any>, nickname: string) {
    const { state } = context;
    try {
      await updateUser({
        id: state.id,
        name: nickname,
      });
      state.nickname = nickname;
    } catch (error) {
      throw new Error('Set nickname error');
    }
  },
};

export const user: Module<UserState, any> = {
  namespaced: true,
  state: {
    id: 0,
    address: '',
    nickname: '',
    icon: '',
    email: '',
    daoCreated: 0,
    daoJoined: 0,
    visitorToken: '',
    wallet: '',
  },
  getters,
  mutations,
  actions,
};
