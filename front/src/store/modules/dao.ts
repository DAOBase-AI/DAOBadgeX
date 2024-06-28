import { notify } from '@kyvg/vue3-notification';
import { getSingerAddr } from './../../constants/contract';
import {
  isApproved,
  isApproveNFT,
  getTokenBalance,
  getMaximumCost,
  getDecimals,
  getBondInfo,
  getFpCertainTimePrice,
} from './../../constants/contract/read';
import {
  FIXED_PRICE_OPTIONS_BY_NETWORK,
  BONDING_CURVE_OPTIONS_BY_NETWORK,
  TOKEN_BIT,
} from './../../constants/index';
import {
  getDaoIdByName,
  getDaoIdByPath,
  getSimpleDao,
  getTradeInfo,
  queryDashboardConfig,
  queryFtAssets,
  queryMyPass,
  queryNftAssets,
} from './../../api/dao';
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';
import _ from 'lodash';
import {
  createDAO,
  getDAOTokens,
  getPassDAOClaimed,
  getTokensByOwner,
} from '@/api/eth';
import { queryDAOById, queryDAO, getMyDaos, queryTotalValue } from '@/api/dao';
import { contracts, pass, BackNetworkType } from '@/constants';
import { fromFloat2Integer, fromInteger2Float } from '@/libs';

export interface DAO {
  [x: string]: any;
  name: string;
  intro: string;
  logo?: string;
  website?: string;
  whitepaper?: string;
  twitter?: string;
  network?: string;
  kind?: string;
  factory?: string;
  erc20?: string;
  erc721?: string;
  passport_address?: string;
  owner?: string;
  created?: number;
  updated?: number;
  passport_logo?: string;
  passport_symbol?: string;
  passport_name?: string;
  claimed?: number;
  id?: number;
  rate?: string;
  burn?: boolean;
  termOfValidity?: Date;
  quantity?: string;
  fee?: string;
  receiver?: string;
  amount?: string;
  initial_price?: string;
  members?: any;
  creatorName?: string;
  claim?: number;
  tradeInfo?: any;
  histories?: any[];
  membersUser?: any[];
  loading?: boolean;
}

export interface DAOState {
  [x: string]: any;
  daos: Array<DAO>;
  profileDAO: Array<DAO>;
  profilePASS: Array<DAO>;
  moreDAO: Array<DAO>;
  hotDAO: Array<DAO>;
  recentDAO: Array<DAO>;
  newDAO: DAO;
  passDAO: DAO;
  // TODO: Add interface
  passes: any;
  claimDAO: DAO;
}

const defaultClaimDao = {
  name: '',
  intro: '',
  logo: '',
  website: '',
  whitepaper: '',
  twitter: '',
  network: '',
  kind: '',
  factory: contracts.factory.address,
  erc20: '',
  owner: '',
  passport_address: pass.passport.nft,
  claimed: 0,
  claim: 0,
  created: 0,
  updated: 0,
  members: 0,
  membersUser: [],
  creatorName: '',
  tradeInfo: {},
  histories: [],
  loading: false,
};

const mutations: MutationTree<DAOState> = {
  setDAO(state: DAOState, daos: Array<DAO>) {
    state.daos = daos;
  },
  setProfileDAO(state: DAOState, daos: Array<DAO>) {
    state.profileDAO = daos;
  },
  setNewDAO(state: DAOState, dao: DAO) {
    state.newDAO = dao;
  },
  setNewDAOErc20(state: DAOState, erc20: string) {
    state.newDAO.erc20 = erc20;
  },
  setHotDAO(state: DAOState, daos: Array<DAO>) {
    state.hotDAO = daos;
  },
  setRecentDAO(state: DAOState, daos: Array<DAO>) {
    state.recentDAO = daos;
  },
  setPassDAO(state: DAOState, dao: DAO) {
    state.passDAO = dao;
  },
  setPassDAOClaimed(state: DAOState, claimed: number) {
    state.passDAO.claimed = claimed;
  },
  setClaimDAOClaimed(state: DAOState, claimed: number) {
    state.claimDAO.claimed = claimed;
  },
  setMoreDAO(state: DAOState, daos: Array<DAO>) {
    state.moreDAO = daos;
  },
  setClaimDAO(state: DAOState, dao: DAO) {
    state.claimDAO = dao;
  },
  mergePassDAO(state: DAOState, info: any) {
    if (info.selectedTab == 0 || info.selectedTab == 1) {
      info.chartMode = info.selectedTab;
    }

    state.passDAO = { ...state.passDAO, ...info };
  },
  subFixedBalance(state: DAOState) {
    state.claimDAO.tradeInfo.fixed_balance -= state.claimDAO.tradeInfo.payment;
  },
  resetNewDAO(state: DAOState) {
    state.newDAO = {
      name: '',
      intro: '',
      logo: '',
      website: '',
      whitepaper: '',
      network: 'Ethereum',
      kind: '',
      erc20: '',
      passport_address: '',
      passport_logo: '' /* passImages.default */,
    };
  },
  resetPassDAO(state: DAOState) {
    state.passDAO = {
      name: '',
      intro: '',
      logo: '',
      website: '',
      whitepaper: '',
      network: '',
      erc20: '',
      owner: '',
      passport_address: '',
      created: 0,
      updated: 0,
      id: 0,
    };
  },
  resetClaimDAO(state: DAOState) {
    state.claimDAO = JSON.parse(JSON.stringify(defaultClaimDao));
  },
  resetMoreDAO(state: DAOState) {
    state.moreDAO = [];
  },
  setNewDAOERC20(state: DAOState, erc20: string) {
    state.newDAO.erc20 = erc20;
  },
};

const getters: GetterTree<DAOState, any> = {
  isNewDAOReady(state: DAOState): boolean {
    if (state.newDAO.kind !== 'bonding-curve') {
      return !(
        state.newDAO.erc20 === '' ||
        state.newDAO.factory === '' ||
        state.newDAO.intro === '' ||
        state.newDAO.name === ''
      );
    } else {
      return !(
        state.newDAO.factory === '' ||
        state.newDAO.intro === '' ||
        state.newDAO.name === '' ||
        state.newDAO.quantity === '' ||
        state.newDAO.erc20 === '' ||
        state.newDAO.receiver === '' ||
        state.newDAO.initial_price === '' ||
        state.newDAO.amount === ''
      );
    }
  },
  safeGetProfileDAO(state: DAOState): Array<DAO> {
    return state.profileDAO;
  },
  hasProfileDAO(state: DAOState): boolean {
    return state.profileDAO.length > 0;
  },
  hasProfilePASS(state: DAOState): boolean {
    return state.profilePASS.length > 0;
  },
  getShortPasses(state: DAOState) {
    if (state.passes.logs) return state.passes.logs.slice(0, 6);
    else return [];
  },
  getPasses(state: DAOState) {
    if (state.passes.logs) return state.passes.logs;
    else return [];
  },
};

const actions: ActionTree<DAOState, any> = {
  async getProfileDAO(context: ActionContext<DAOState, any>, state?: string) {
    const { commit, rootState } = context;

    try {
      const data = await getMyDaos();
      // JSON.stringify({
      //   owner: rootState.wallet.accounts[0],
      //   state: state || 'deployed',
      // }),
      // 5,

      commit('setProfileDAO', data);
    } catch (error) {
      console.error(error);
    }
  },
  async getProfilePASS(context: ActionContext<DAOState, any>) {
    const { commit, rootState } = context;

    try {
      const data = await queryDAO();
      // JSON.stringify({
      //   owner: rootState.wallet.accounts[0],
      // }),
      // 5,

      commit('setPassDAO', data);
    } catch (error) {
      console.error(error);
    }
  },
  async getMoreDAO(
    context: ActionContext<DAOState, any>,
    {
      limit,
      type,
      queryName,
    }: {
      limit?: number;
      type?: string;
      queryName?: string;
    },
  ) {
    const { commit } = context;

    try {
      const data = await queryDAO(1, limit || 50, type, queryName);

      commit('setMoreDAO', data);
    } catch (error) {
      console.error(error);
    }
  },
  async createDAO(context: ActionContext<DAOState, any>, decimal?: number) {
    const { state, rootState, getters } = context;

    try {
      state.newDAO.owner = rootState.wallet.accounts[0];
      if (getters.isNewDAOReady) {
        if (decimal) {
          const dao = _.clone(state.newDAO);
          console.warn(state.newDAO.rate, decimal);
          dao.rate = fromFloat2Integer(state.newDAO.rate as string, decimal);
          console.warn(dao);
          const result = await createDAO(dao, rootState.wallet.token);
          state.newDAO.id = result.id;
          if (!result) {
            return false;
          }
          return result;
        } else {
          console.log('Creating NFT Token...');
          const result = await createDAO(state.newDAO, rootState.wallet.token);
          state.newDAO.id = result.id;
          if (!result) {
            return false;
          }
          return result;
        }
      }
    } catch (error) {
      console.error(error);
      if (error) throw new Error('Create Failed');
    }
  },
  async getPassDAO(context: ActionContext<DAOState, any>, id: number) {
    const { commit } = context;

    try {
      const data = await queryDAOById(id);

      // let dashboard = {};
      // if (data.dashboardIsOpen) {
      //   dashboard = await queryDashboardConfig(id);
      // }

      const network = BackNetworkType[data.chain];
      if (data.passType === 'bonding_curve') {
        try {
          data.amountOfToken = await getMaximumCost(
            data.contractAddress,
            '1',
            BONDING_CURVE_OPTIONS_BY_NETWORK(network)[data.tokenName].decimals,
            network,
          );
        } catch (error) {
          data.amountOfToken = 0;
        }
      }

      // TODO The total amount of original capital shall be cancelled later

      // if (data.passType === 'fixed_price') {
      // const quantity = data.erc20TokenSymbol
      //   ? await getTokenBalance(
      //       FIXED_PRICE_OPTIONS_BY_NETWORK(network)[
      //         data.erc20TokenSymbol.toUpperCase()
      //       ].address,
      //       data.contractAddress,
      //       network,
      //     )
      //   : 0;
      // if (data.daoInitialFundraising.length == 0) {
      //   data.daoInitialFundraising.push({
      //     symbol: data.erc20TokenSymbol,
      //     quantity,
      //     daoId: data.id,
      //   });
      // }
      // }

      const daoInfo = {
        ...data,
        selectedTab: 0,
        chartMode: 0,
      };

      console.log(daoInfo);

      commit('setPassDAO', daoInfo);
    } catch (error) {
      console.error(error);
    }
  },

  async getPassDaoByName(context: ActionContext<DAOState, any>, name: string) {
    const { dispatch } = context;

    try {
      // const id = await getDaoIdByPath(name);
      const id = await getDaoIdByPath(name);
      await dispatch('getPassDAO', id);
    } catch (error) {
      notify({
        type: 'error',
        text: 'Load Dao Info Failed.',
      });
    }
  },

  async getDashboardTotalValue(_context: any, id: any) {
    const { commit } = _context;
    const res = await queryTotalValue(id);
    commit('mergePassDAO', { totalAssets: res });
  },
  async getDashboardFtAssets(_context: any, id: any) {
    const { commit } = _context;
    commit('mergePassDAO', { ftAssetsLoading: true });
    try {
      const res = await queryFtAssets(id);
      const totalAssets = await queryTotalValue(id);
      commit('mergePassDAO', {
        ftAssets: res,
        ftAssetsLoading: false,
        totalAssets,
      });
    } catch (error) {
      commit('mergePassDAO', { ftAssetsLoading: false });
    }
  },
  async getDashboardNftAssets(_context: any, id: any) {
    const { commit } = _context;
    commit('mergePassDAO', { nftAssetsLoading: true });
    try {
      const res = await queryNftAssets(id);
      const totalAssets = await queryTotalValue(id);

      res.nftTable.sort((a: any, b: any) => {
        return +b.valueUsd - +a.valueUsd;
      });

      commit('mergePassDAO', {
        nftAssets: res,
        totalAssets,
        nftAssetsLoading: false,
      });
    } catch (error) {
      commit('mergePassDAO', { nftAssetsLoading: false });
    }
  },

  async getDAOById(_context: ActionContext<DAOState, any>, id: number) {
    try {
      return await queryDAOById(id);
    } catch (e) {
      console.error(e);
    }
  },
  /*** Set Claim DAO ***/
  async setClaimDAO(
    context: ActionContext<DAOState, any>,
    { name, needLoading = false }: { name: string; needLoading: boolean },
  ) {
    const { state, rootState } = context;
    state.claimDAO.name = name;
    if (needLoading) {
      state.claimDAO.loading = true;
    }

    try {
      /* DAO base info */
      const id = await getDaoIdByName(name);

      const res = await queryDAOById(id);
      res.network = BackNetworkType[res.chain];
      /* DAO Trade info */
      const resx = await getTradeInfo(res.passType, id);

      if (
        ['fixed_price', 'token_base', 'bonding_curve'].includes(res.passType)
      ) {
        let fixed_balance = '0';
        let needApprove = true;
        try {
          const tokenAddress =
            res.passType == 'fixed_price'
              ? FIXED_PRICE_OPTIONS_BY_NETWORK(res.network)[res.tokenName]
                  .address
              : res.passType == 'token_base'
              ? resx.miaAddress
              : BONDING_CURVE_OPTIONS_BY_NETWORK(res.network)[res.tokenName]
                  .address;

          fixed_balance = await getTokenBalance(
            tokenAddress,
            await getSingerAddr(),
            res.network,
          );

          needApprove = !(await isApproved(
            tokenAddress,
            await getSingerAddr(),
            res.contractAddress,
            res.network,
          ));
        } catch (error) {
          /*  */
        }

        resx.fixed_balance = fixed_balance;
        resx.needApprove = needApprove;
      }

      if (res.passType === 'fixed_price') {
        if (resx.isFreeMint) {
          resx.needApprove = false;
        }

        resx.paymentText = res.certainTime
          ? await getFpCertainTimePrice(
              res.contractAddress,
              res.network,
              TOKEN_BIT[resx.payWith],
            )
          : resx.payment;
      }

      if (res.passType === 'nft_base') {
        try {
          resx.needApprove = !(await isApproveNFT(
            resx.nftAddress,
            await getSingerAddr(),
            res.contractAddress,
            res.network,
          ));
        } catch (error) {
          /*  */
        }
      }

      if (res.passType === 'bonding_curve') {
        try {
          const network = res.network;
          const rep = await Promise.all([
            getBondInfo(resx.passAddress, res.tokenName, network),
            getTokenBalance(
              BONDING_CURVE_OPTIONS_BY_NETWORK(network)[res.tokenName].address,
              rootState.wallet.accounts[0],
              network,
            ),
          ]);
          const [[currentPrice, reserve, issuance], tokenBalance] = rep;
          resx.bcCurrentPrice = currentPrice;
          resx.bcReserve = reserve;
          resx.bcIssuance = issuance;
          resx.tokenBalance = tokenBalance;
        } catch (error) {
          resx.bcCurrentPrice = 0;
          resx.bcReserve = 0;
          resx.bcIssuance = 0;
          resx.tokenBalance = 0;
        }
      }

      /* bongdingCurve 其实还需要5个参数 CurrentPrice Reserve CurveIssuance Balance PassBalance */

      if (state.claimDAO.name === name && needLoading) {
        state.claimDAO.loading = false;
      }

      state.claimDAO = {
        ...state.claimDAO,
        ...res,
        creatorName: resx.creatorName,
        members: resx.members,
        membersUser: resx.membersUser,
        tradeInfo: resx,
        histories: resx.histories,
        isNetworkRight: BackNetworkType[res.chain] == rootState.wallet.network,
        isFreeMint: resx.isFreeMint,
        freeMintStatus: resx.mintStatus,
      };

      if (state.claimDAO.rate || state.claimDAO.rate !== '') {
        state.claimDAO.rate = fromInteger2Float(
          state.claimDAO.rate || '1000000000000000000',
          18,
        );
      }
    } catch (e) {
      console.log(e);
      notify({
        type: 'error',
        text: 'Load ClaimInfo Failed',
      });
    }
  },
  async refreshBcData({ state }) {
    /*  */

    const { chain, passAddress } = state.claimDAO.tradeInfo;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { tokenName, passType, id } = state.claimDAO;

    const network = BackNetworkType[chain];

    const rep = await Promise.all([
      getBondInfo(passAddress, tokenName, network),
      getTokenBalance(
        BONDING_CURVE_OPTIONS_BY_NETWORK(network)[tokenName].address,
        await getSingerAddr(),
        network,
      ),
      getTradeInfo(passType, id),
    ]);
    const [[currentPrice, reserve, issuance], tokenBalance, item] = rep;
    state.claimDAO.tradeInfo.bcCurrentPrice = currentPrice;
    state.claimDAO.tradeInfo.bcReserve = reserve;
    state.claimDAO.tradeInfo.bcIssuance = issuance;
    state.claimDAO.tradeInfo.tokenBalance = tokenBalance;
    state.claimDAO.tradeInfo.passCount = item.passCount;
  },
  async getPassDAOClaimed(context: ActionContext<DAOState, any>) {
    const { state, commit } = context;

    try {
      const data = await getPassDAOClaimed(state.passDAO.id as number);

      commit('setPassDAOClaimed', data);
    } catch (error) {
      console.error(error);
    }
  },
  async getClaimDAOClaimed(context: ActionContext<DAOState, any>) {
    const { state, commit } = context;

    try {
      const data = await getPassDAOClaimed(state.claimDAO.id as number);

      commit('setClaimDAOClaimed', data);
    } catch (error) {
      console.error(error);
    }
  },
  async getPasses(
    context: ActionContext<DAOState, any>,
    {
      id,
      limit,
      offset,
    }: {
      id: number;
      limit?: number;
      offset?: number;
    },
  ) {
    const { state } = context;
    try {
      state.passes = await getDAOTokens(id, limit, offset);
    } catch (error) {
      console.error(error);
    }
  },
  async getPassesByOwner(context: ActionContext<DAOState, any>) {
    const { state, rootState } = context;

    try {
      state.profilePASS = await queryMyPass();
    } catch (error) {
      console.error(error);
    }
  },
  async getSimpleDao(content: any, daoId: any) {
    const { state } = content;
    try {
      const res = await getSimpleDao(daoId);
      state.claimDAO.members = res.members;
      state.claimDAO.creatorName = res.creatorName;
    } catch (error) {
      console.log(error);
    }
  },
};

export const dao: Module<DAOState, any> = {
  namespaced: true,
  getters,
  mutations,
  actions,
  state: {
    daos: [],
    profileDAO: [],
    profilePASS: [],
    moreDAO: [],
    hotDAO: [],
    recentDAO: [],
    passes: [],
    newDAO: {
      name: '',
      intro: '',
      logo: '',
      website: '',
      whitepaper: '',
      twitter: '',
      network: pass.network.eth,
      kind: '',
      factory: contracts.factory.address,
      erc20: '',
      owner: '',
      passport_address: '',
      passport_logo: '' /* passImages.default */,
      rate: '',
      burn: false,
      termOfValidity: new Date(),
      quantity: '',
      fee: '',
      receiver: '',
      amount: '',
      initial_price: '',
    },
    passDAO: {
      id: 0,
      name: '',
      intro: '',
      logo: '',
      website: '',
      whitepaper: '',
      twitter: '',
      network: pass.network.eth,
      kind: '',
      factory: contracts.factory.address,
      erc20: '',
      owner: '',
      passport_address: pass.passport.nft,
      claimed: 2333,
      created: 0,
      updated: 0,
      quantity: '',
      fee: '',
      receiver: '',
      amount: '',
      initial_price: '',
    },
    claimDAO: JSON.parse(JSON.stringify(defaultClaimDao)),
  },
};
