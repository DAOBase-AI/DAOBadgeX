import { MutationTree } from 'vuex';

const actions = {};

const defaultStakingBase = {
  passContractType: 'ERC721',
  tokenMintTheNftPass: 'ERC20',
  tokenAddress: '',
  tokenContractAddress: '',
  nftContractAddress: '',
  tokensNeededToMintANft: '',
  nftNeeded: '1',
};

const defaultFixedPrice = {
  passContractType: 'ERC721',
  termOfValidity: '',
  supply: '',
  payment: '',
  payWith: 'DAI',
  platformCommission: '2',
  receivingAddress: '',
  validityType: 'certain_period',
  certainTime: '',
  schedulingAhead: '',
};

const defaultBondingCurve = {
  passContractType: 'ERC1155',
  collateralTokens: 'DAI',
  creatorFee: '',
  receivingAddress: '',
  platformCommission: '2',
  initialPrice: '',
  m: '0.000001',
  n: '2',
  d: '1',
};

const mutations: MutationTree<any> = {
  setStakingBase(state: any, info: any) {
    console.log(info);
    state.stakingBase = { ...state.stakingBase, ...info };
  },
  setFixedPrice(state, info) {
    state.fixedPrice = { ...state.fixedPrice, ...info };
  },
  setBondingCurve(state, info) {
    state.bondingCurve = { ...state.bondingCurve, ...info };
  },
  clearAllForm(state: any) {
    state.stakingBase = {
      ...defaultStakingBase,
    };
    state.fixedPrice = {
      ...defaultFixedPrice,
    };
    state.bondingCurve = {
      ...defaultBondingCurve,
    };
  },
};

const getters = {};

/* 

passBondingCurve: {
      passContractType: 'ERC1155',
      receivingAddress: '',
      creatorFee: '',
      initialPrice: '',
      collateralTokens: '',
      m: '',
      n: '',
      d: '1',
    },
    passFixedPrice: {
      passContractType: 'ERC721',
      termOfValidity: 0,
      quantity: 0,
      payment: 0,
      payWith: 0,
    },
    passStakingBasedDTO: {
      passContractType: 'ERC721',
      tokenAddress: ''

 */

export const form = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state: {
    /* network */
    stakingBase: {
      ...defaultStakingBase,
    },
    fixedPrice: {
      ...defaultFixedPrice,
    },
    bondingCurve: {
      ...defaultBondingCurve,
    },
  },
};
