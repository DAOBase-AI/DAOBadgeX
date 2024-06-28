import { Contract, providers } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { ActionContext, ActionTree, Module } from 'vuex';

import { contracts } from '@/constants';
import detectEthereumProvider from '@metamask/detect-provider';
import { fromFloat2Integer } from '@/libs';

export interface PassState {
  alphaClaimable: boolean;
  betaClaimable: boolean;
  gammaClaimable: boolean;
  deltaCirculation: number;
  deltaBalance: number;
}

const provider = async (): Promise<any> => {
  return new providers.Web3Provider((await detectEthereumProvider()) as any);
};

const signer = async (): Promise<any> => {
  return (await provider()).getSigner();
};

const actions: ActionTree<PassState, any> = {
  async alphaDeploy(
    _context: ActionContext<PassState, any>,
    {
      id,
      name,
      symbol,
      erc20,
      rate,
    }: {
      id: number;
      name: string;
      symbol: string;
      erc20: string;
      rate: number; // Staking amount
    },
  ): Promise<TransactionResponse> {
    // TODO: add symbol to view
    console.log('alphaDeploy', id, name, symbol, erc20, rate);
    const contract = new Contract(
      contracts.factory.address,
      contracts.factory.abi,
      await signer(),
    );
    return await contract.alphaDeploy(id, name, symbol, erc20, rate);
  },
  async betaDeploy(
    _context: ActionContext<PassState, any>,
    {
      id,
      name,
      symbol,
      erc721,
    }: {
      id: number;
      name: string;
      symbol: string;
      erc721: string;
    },
  ): Promise<TransactionResponse> {
    const contract = new Contract(
      contracts.factory.address,
      contracts.factory.abi,
      await signer(),
    );
    return await contract.betaDeploy(id, name, symbol, erc721);
  },
  async gammaDeploy(
    _context: ActionContext<PassState, any>,
    {
      id,
      name,
      symbol,
      erc20,
      rate,
    }: {
      id: number;
      name: string;
      symbol: string;
      erc20: string;
      rate: string;
    },
  ) {
    const contract = new Contract(
      contracts.factory.address,
      contracts.factory.abi,
      await signer(),
    );
    return await contract.gamaDeploy(id, name, symbol, erc20, rate);
  },
  // Alpha Functions
  async stakeAlpha(_context: ActionContext<PassState, any>, passport: string) {
    console.log('stakeAlpha', passport);
    const contract = new Contract(
      passport,
      contracts.alpha.abi,
      await signer(),
    );
    return await contract.mint();
  },
  async redeemAlpha(
    _context: ActionContext<PassState, any>,
    {
      passport,
      id,
    }: {
      passport: string;
      id: number;
    },
  ) {
    const contract = new Contract(
      passport,
      contracts.alpha.abi,
      await signer(),
    );
    return await contract.burn(id);
  },
  async claimableAlpha(
    context: ActionContext<PassState, any>,
    address: string,
  ) {
    const { state, rootState } = context;
    try {
      const contract = new Contract(
        address,
        contracts.alpha.abi,
        await provider(),
      );
      state.alphaClaimable = (
        await contract.balanceOf(rootState.wallet.accounts[0])
      ).eq(0);
    } catch (e) {
      console.error(e);
    }
  },
  // Beta Functions
  async stakeBeta(
    _context: ActionContext<PassState, any>,
    {
      passport,
      id,
    }: {
      passport: string;
      id: number;
    },
  ) {
    const contract = new Contract(passport, contracts.beta.abi, await signer());
    return await contract.mint(id);
  },
  async redeemBeta(
    _context: ActionContext<PassState, any>,
    {
      passport,
      id,
    }: {
      passport: string;
      id: number;
    },
  ) {
    const contract = new Contract(passport, contracts.beta.abi, await signer());
    return await contract.burn(id);
  },
  async claimableBeta(context: ActionContext<PassState, any>, address: string) {
    const { state, rootState } = context;
    try {
      const contract = new Contract(
        address,
        contracts.beta.abi,
        await signer(),
      );
      state.betaClaimable = (
        await contract.balanceOf(rootState.wallet.accounts[0])
      ).eq(0);
    } catch (e) {
      console.error(e);
    }
  },
  // Gamma Functions
  async stakeGamma(_context: ActionContext<PassState, any>, passport: string) {
    const contract = new Contract(
      passport,
      contracts.gamma.abi,
      await signer(),
    );
    return await contract.mint();
  },
  async redeemGamma(_content: ActionContext<PassState, any>, passport: string) {
    const contract = new Contract(
      passport,
      contracts.gamma.abi,
      await signer(),
    );
    return await contract.withdraw();
  },
  async claimableGamma(
    context: ActionContext<PassState, any>,
    address: string,
  ) {
    const { state, rootState } = context;
    try {
      const contract = new Contract(
        address,
        contracts.gamma.abi,
        await signer(),
      );
      state.gammaClaimable = (
        await contract.balanceOf(rootState.wallet.accounts[0])
      ).eq(0);
    } catch (e) {
      console.error(e);
    }
  },
  // Delta Functions
  async deltaDeploy(
    _context: ActionContext<PassState, any>,
    {
      id,
      name,
      symbol,
      erc20, // ERC20 address
      ownerRate, // Permillage fee charges to user
      startPrice, // Start price of the token
      quantity, // Total supply of the token
      incentiveAddr, // Address of the incentive EOA
      max, // Max amount holdings per user
    }: {
      id: number;
      name: string;
      symbol: string;
      erc20: string;
      ownerRate: string;
      startPrice: string;
      quantity: string;
      incentiveAddr: string;
      max: string;
    },
  ) {
    const contract = new Contract(
      contracts.factory.address,
      contracts.factory.abi,
      await signer(),
    );
    return await contract.deltaDeploy(
      id,
      name,
      symbol,
      erc20,
      ownerRate,
      fromFloat2Integer(startPrice, 18),
      quantity,
      incentiveAddr,
      max,
    );
  },
  async buyDelta(_context: ActionContext<PassState, any>, passport: string) {
    const contract = new Contract(
      passport,
      contracts.delta.abi,
      await signer(),
    );
    return await contract.mint();
  },
  async sellDelta(
    _context: ActionContext<PassState, any>,
    {
      passport,
      id,
    }: {
      passport: string;
      id: number;
    },
  ) {
    const contract = new Contract(
      passport,
      contracts.delta.abi,
      await signer(),
    );

    return await contract.withdraw(id);
  },
  async deltaCirculation(
    context: ActionContext<PassState, any>,
    passport: string,
  ) {
    const { state } = context;
    const contract = new Contract(
      passport,
      contracts.delta.abi,
      await signer(),
    );
    state.deltaCirculation = await contract.circulation();
  },
  async deltaBalance(context: ActionContext<PassState, any>, passport: string) {
    const { state, rootState } = context;
    const contract = new Contract(
      passport,
      contracts.delta.abi,
      await signer(),
    );
    state.deltaBalance = await contract.balanceOf(rootState.wallet.accounts[0]);
  },
};

export const pass: Module<PassState, any> = {
  namespaced: true,
  actions,
  state: {
    alphaClaimable: true,
    betaClaimable: true,
    gammaClaimable: true,
    deltaCirculation: 0,
    deltaBalance: 0,
  },
};
