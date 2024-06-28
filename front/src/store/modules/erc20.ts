import detectEthereumProvider from '@metamask/detect-provider';
import { Contract, providers } from 'ethers';
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

import { approveQuantity, contracts } from '@/constants';
import { fromFloat2Integer, fromInteger2Float } from '@/libs';

/**
 * TODO: Refactor Note
 *  The store of the value is a bit mess here.
 *  Theoretically the value should not store directly with float string
 *  But due to the urgent deadline of developing this will be what it is for now
 *  If this project got a chance to refactor, STORE THE VALUE WITH BIGNUMBER STRING
 */

export interface ERC20State {
  name: string;
  info: {
    name: string;
    balance: string;
    symbol: string;
    allowance: string;
    decimals: string;
    totalSupply: string;
    type: string;
  };
}

const provider = async (): Promise<any> => {
  return new providers.Web3Provider((await detectEthereumProvider()) as any);
};

const signer = async (): Promise<any> => {
  return (await provider()).getSigner();
};

const mutations: MutationTree<ERC20State> = {
  resetClaimToken(state: ERC20State) {
    state.info = {
      name: '',
      totalSupply: '',
      balance: '',
      symbol: '',
      allowance: '',
      decimals: '18',
      type: '',
    };
  },
};

const getters: GetterTree<ERC20State, any> = {
  approved(state: ERC20State) {
    if (state.info.allowance && state.info.decimals) {
      return (
        parseInt(
          fromInteger2Float(
            state.info.allowance,
            parseInt(state.info.decimals),
          ),
        ) >= parseInt(approveQuantity)
      );
    } else return false;
  },
};

const actions: ActionTree<ERC20State, any> = {
  // Fetch ERC20 Info
  async getType(context: ActionContext<ERC20State, any>, address: string) {
    const { state } = context;
    try {
      const ct = new Contract(address, contracts.erc20.abi, await signer());
      state.info.type = (await ct.decimals()) ? 'ERC20' : 'ERC721';
    } catch (error) {
      if (error) {
        state.info.type = 'ERC721';
      }
    }
  },
  async getSymbol(context: ActionContext<ERC20State, any>, address: string) {
    console.log('getSymbol');
    const { state } = context;

    try {
      const ct =
        state.info.type === 'ERC20'
          ? new Contract(address, contracts.erc20.abi, await provider())
          : new Contract(address, contracts.erc721.abi, await provider());
      state.info.symbol = await ct.symbol();
    } catch (error) {
      state.info.symbol = '--';
    }
  },
  async getBalance(context: ActionContext<ERC20State, any>, address: string) {
    console.log('getBalance');
    const { state, rootState } = context;
    const ct =
      state.info.type === 'ERC20'
        ? new Contract(address, contracts.erc20.abi, await provider())
        : new Contract(address, contracts.erc721.abi, await provider());
    if (state.info.type === 'ERC20') {
      state.info.balance = fromInteger2Float(
        (await ct.balanceOf(rootState.wallet.accounts[0])).toString(),
        parseInt(state.info.decimals),
      );
    } else {
      state.info.balance = await ct.balanceOf(rootState.wallet.accounts[0]);
    }

    if (state.info.type === 'ERC20') {
      // TODO: Add case to support integer
      state.info.balance = parseFloat(state.info.balance).toFixed(4) + '...';
    }
    console.log('ERC-SYMBOL', state.info.balance);
  },
  async getDecimals(context: ActionContext<ERC20State, any>, address: string) {
    const { state } = context;
    const ct = new Contract(address, contracts.erc20.abi, await provider());
    state.info.decimals = (await ct.decimals()).toString();
    console.log(state.info.decimals);
    return state.info.decimals;
  },
  async approve(
    context: ActionContext<ERC20State, any>,
    {
      token,
      spender,
      tokenId,
    }: {
      token: string;
      spender: string;
      tokenId?: string;
    },
  ) {
    console.log('approve', token, spender, tokenId);
    const { state } = context;
    const ct =
      state.info.type === 'ERC20'
        ? new Contract(token, contracts.erc20.abi, await signer())
        : new Contract(token, contracts.erc721.abi, await signer());
    if (state.info.type === 'ERC20') {
      return await ct.approve(
        spender,
        fromFloat2Integer(approveQuantity, parseInt(state.info.decimals)),
      );
    } else if (state.info.type === 'ERC721' && tokenId) {
      return await ct.approve(spender, tokenId);
    }
  },
  async getAllowance(
    context: ActionContext<ERC20State, any>,
    {
      token,
      spender,
    }: {
      token: string;
      spender: string;
    },
  ) {
    console.log('getAllowance');
    const { state, rootState } = context;
    const ct = new Contract(token, contracts.erc20.abi, await signer());
    state.info.allowance = fromInteger2Float(
      (await ct.allowance(rootState.wallet.accounts[0], spender)).toString(),
      parseInt(state.info.decimals),
    );
    console.log('ERC-ALLOWANCE', state.info.allowance);
  },
  async getName(context: ActionContext<ERC20State, any>, address: string) {
    const { state } = context;
    try {
      const ct =
        state.info.type === 'ERC20'
          ? new Contract(address, contracts.erc20.abi, await provider())
          : new Contract(address, contracts.erc721.abi, await provider());
      state.info.name = await ct.name();
      console.log('ERC-NAME', state.info.name);
    } catch (error) {
      state.info.name = '--';
    }
  },
  async getTotalSupply(
    context: ActionContext<ERC20State, any>,
    address: string,
  ) {
    const { state } = context;
    const ct =
      state.info.type === 'ERC20'
        ? new Contract(address, contracts.erc20.abi, await provider())
        : new Contract(address, contracts.erc721.abi, await provider());
    try {
      if (state.info.type === 'ERC20') {
        state.info.totalSupply = fromInteger2Float(
          (await ct.totalSupply()).toString(),
          parseInt(state.info.decimals),
        );
      } else {
        state.info.totalSupply = await ct.totalSupply();
      }
    } catch (e) {
      state.info.totalSupply = '∞';
    }
    console.log('ERC-TOTALSUPPLY', state.info.totalSupply);
  },
  async getApproved(
    context: ActionContext<ERC20State, any>,
    {
      tokenId,
      address,
    }: {
      tokenId: number;
      address: string;
    },
  ) {
    const { state } = context;
    const ct = new Contract(address, contracts.erc721.abi, await provider());
    try {
      if (state.info.type === 'ERC20') throw new Error('Wrong contract type');
      return await ct.getApproved(tokenId);
    } catch (e) {
      console.error(e);
    }
  },
  async ownerOf(
    context: ActionContext<ERC20State, any>,
    {
      tokenId,
      address,
    }: {
      tokenId: number;
      address: string;
    },
  ) {
    const { state } = context;
    const ct = new Contract(address, contracts.erc721.abi, await provider());
    try {
      if (state.info.type === 'ERC20') throw new Error('Wrong contract type');
      return await ct.ownerOf(tokenId);
    } catch (e) {
      console.error(e);
    }
  },
  async fetchTokenInfo(
    context: ActionContext<ERC20State, any>,
    {
      token,
      spender,
    }: {
      token: string;
      spender?: string;
    },
  ) {
    console.log('fetchTokenInfo');
    const { dispatch, state } = context;

    await dispatch('getType', token).then(
      () => console.log('Get Type'),
      console.error,
    );
    if (spender && state.info.type === 'ERC20') {
      dispatch('getAllowance', {
        token,
        spender,
      }).then(console.log, console.error);
      dispatch('getDecimals', token).then(
        () => console.log('Get Decimals'),
        console.error,
      );
    }

    await dispatch('getBalance', token).then(
      () => console.log('Get Balance'),
      console.error,
    );
    dispatch('getSymbol', token).then(
      () => console.log('Get Symbol'),
      console.error,
    );
    dispatch('getName', token).then(
      () => console.log('Get Name'),
      console.error,
    );
    dispatch('getTotalSupply', token).then(
      () => console.log('Get Total Supply'),
      console.error,
    );
  },
};

export const erc20: Module<ERC20State, any> = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state: {
    info: {
      name: '--',
      totalSupply: '∞',
      balance: '0',
      symbol: '--',
      allowance: '',
      decimals: '18',
      type: '',
    },
  } as ERC20State,
};
