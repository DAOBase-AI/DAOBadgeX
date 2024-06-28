import { MutationTree } from 'vuex';

const actions = {};

const mutations: MutationTree<any> = {
  resetInfo(state, info) {
    state.info = info;
  },
  setupInfo(state, info) {
    state.info = { ...state.info, ...info };
  },
  clearInfo(state) {
    state.info = null;
  },
};

const getters = {};

export const townhall = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state: {
    info: null,
  },
};
