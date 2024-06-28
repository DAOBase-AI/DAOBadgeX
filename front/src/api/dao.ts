import { formatVal, getUTCTime } from '@/utils';
import { getSuccessResult, getSuccessResultAsync, passHttp } from '@/utils/req';
import dayjs from 'dayjs';
import { BackNetworkType } from './../constants/index';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import numeral from 'numeral';
import { notify } from '@kyvg/vue3-notification';
import mitt from '@/libs/event';

export const subscribeEmail = async (email: string): Promise<any> =>
  getSuccessResult(await passHttp.post('/daos/dao-subscribe/email', { email }));

/*
  Status
    0 trading
    1 complete
    2 trade failed
    3 cantdeployed
    4 candeployed
 */

export const getMyDaos = async (): Promise<any> =>
  getSuccessResult(await passHttp.get('/daos/relatedDao'));

export const getMyPassDao = async () =>
  getSuccessResultAsync(passHttp.get('/daos/myParticipationDao'));

type Network = ['ethereum', 'matic'];
interface PassBondingCurve {
  network: Network;
  passContractType: string;
  quantity: string;
  collateralTokens: string;
  receivingAddress: string;
  platformCommission: string;
  initialPrice: number;
  creatorFee: number;
  creatorCoinPrice: number;
  creatorCoinsInCirculation: number;
}

interface PassFixedPrice {
  network: Network;
  passContractType: string;
  termOfValidity: string /* 月 */;
  quantity: string;
  payment: string;
  payWIth: string;
}

interface StakingBasedDto {
  network: Network;
  passContractType: string;
  tokenMintTheNftPass: string;
  tokenContractAddress: string;
  nftContractAddress: string;
  tokensNeededToMintANft: string;
}

interface CreateDaoDto {
  name: string;
  intro: string;
  logo: string;
  website: string;
  whitepaper: string;
  twitter: string;
  /* */
  passLogo: string;
  passName: string;
  passSymbol: string;
  chain: string;
  network: string;
  transactionHash: string;
  passType: ['bonding_cre', 'fixed_price', 'staking_based'] | any;
  passBondingCurve: PassBondingCurve | any;
  passFixedPrice: PassFixedPrice | any;
  passStakingBasedDTO: StakingBasedDto | any;
}

export const createDao = async (data: CreateDaoDto): Promise<any> =>
  getSuccessResult(
    await passHttp.post('/daos/add', {
      ...data,
      formjson: JSON.stringify(data),
    }),
  );

export const queryDAOById = async (daoId: any): Promise<any> => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/daos/detail/${daoId}`),
  );
  res.tokenName = res.tokenName || res.erc20TokenSymbol || '';
  res.isActivityTemp = new RegExp('the opendao', 'i').test(res.name);

  if (res.schedulingAhead) {
    const origin = dayjs(
      res.schedulingAhead - new Date().getTimezoneOffset() * 60000,
    );

    const now = getUTCTime();

    res.isScheduling = origin.isAfter(now);
    res.schedulingText = origin.format('YYYY-MM-DD HH:mm:ss');
    res.schedulingDay = origin.diff(now, 'day');
  }

  if (res.daoDashboardConfig) {
    const address: any = {};

    res.daoDashboardConfig.forEach((config: any) => {
      if (!address[config.trackedAddress]) {
        address[config.trackedAddress] = {};
      }
      address[config.trackedAddress][BackNetworkType[config.network]] = true;
    });

    const newers = Object.entries(address).map(([key, value]: any) => {
      return {
        trackedAddress: key,
        ...value,
      };
    });
    res.daoDashboardConfig = newers;
  }

  return res;
};

export const queryDAO = async (
  current = 1,
  size = 10,
  type = 'all',
  queryName = '',
): Promise<any> => {
  const res = getSuccessResult(
    await passHttp.post('/pass/page', { current, size, type, queryName }),
  ).records;

  return res.map((x: any) => ({
    ...x,
    name: x.daoName,
    logo: x.daoLogo,
    id: x.daoId,
    isActivityTemp: new RegExp('the opendao', 'i').test(x.daoName),
  }));
};

export const queryDAOPage = async (
  current = 1,
  size = 10,
  type = 'all',
  queryName = '',
  isTwitterOauth = 0,
  cancel = false,
): Promise<any> => {
  const res = getSuccessResult(
    await passHttp.post(
      '/pass/page',
      {
        current,
        size,
        type,
        queryName,
        isTwitterOauth,
      },
      undefined,
      cancel,
    ),
  );

  return {
    ...res,
    records: res.records.map((x: any) => ({
      ...x,
      name: x.daoName,
      logo: x.daoLogo,
      id: x.daoId,
      isActivityTemp: new RegExp('the opendao', 'i').test(x.daoName),
    })),
  };
};

export const updateDao = async (data: any): Promise<any> =>
  getSuccessResult(await passHttp.put('/daos/update', data));

export const getSimpleDao = async (daoId: any): Promise<any> =>
  getSuccessResult(await passHttp.get(`/daos/daoBrief/${daoId}`));

const passTypeMap: any = {
  nft_base: 'nftBase',
  token_base: 'tokenBase',
  fixed_price: 'fixedPrice',
  bonding_curve: 'bondingCurve',
};
export const getTradeInfo = async (passType: string, daoId: any) => {
  const path = `/${passTypeMap[passType]}/approveDetail/${daoId}`;
  const res = await getSuccessResultAsync(passHttp.get(path));
  res.membersUser = res.membersUser || [];
  if (res.membersUser[0] == null) {
    res.membersUser = [];
  }
  return res;
};

export const sendTradeInfo = (
  passType: string,
  daoId: any,
  transaction: string,
  event: string,
): Promise<any> => {
  const path = `/${passTypeMap[passType]}/approve`;
  return getSuccessResultAsync(
    passHttp.post(path, { daoId, transaction, event }),
  );
};

export const queryMyPass = (): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/pass/myPass'));

export const sendDaoTxHash = (transactionHash: string, id: string) =>
  getSuccessResultAsync(
    passHttp.put('/daos/transactionHash', { transactionHash, id }),
  );

export const getUserDaoInfo = () =>
  getSuccessResultAsync(passHttp.get('/user/userDaoInfo'));

export const isOwnPass = async (name: string): Promise<any> => {
  const id = await getDaoIdByName(name);
  return getSuccessResultAsync(passHttp.get(`/daos/checkMyPass/${id}`));
};

interface DaoProfitsInfo {
  daoName: string;
  daoIntro: string;
  passLogo: string;
  passName: string;
  passType: string;
  netWork: string;
  network: string;
  platformCommission: string;
  receivingAddress: string;
  undrawProfit: string;
  passContractType: string;
  contractAddress: string;
  termOfValidity?: number;
  totalSupply?: string;
  payMent?: string;
  payWith?: string;
  payPassWith?: string;
  creatorFee?: string;
}

interface DaoProfitsHistory {
  passLogo: string;
  passSymbol: string;
  transactionHash: string;
  quantity: string;
  type: string;
  createDate: number;
}

export const getBcProfitsInfo = (daoId: string): Promise<DaoProfitsInfo> =>
  getSuccessResultAsync(passHttp.get(`/bondingCurve/myProfits/${daoId}`));

export const getBcProfitsHistory = (
  daoId: string,
  type = 'ALL',
): Promise<DaoProfitsHistory[]> =>
  getSuccessResultAsync(
    passHttp.get(`/bondingCurve/myProfitsHistory/${daoId}`, {
      params: { type },
    }),
  );

export const getFpProfitsInfo = (daoId: string): Promise<DaoProfitsInfo> =>
  getSuccessResultAsync(passHttp.get(`/fixedPrice/myProfits/${daoId}`));

export const getFpProfitsHistory = (
  daoId: string,
  type = 'ALL',
): Promise<DaoProfitsHistory[]> =>
  getSuccessResultAsync(
    passHttp.get(`/fixedPrice/myProfitsHistory/${daoId}`, { params: { type } }),
  );

export const getProfitsInfo = async (
  passType: string,
  daoId: string,
): Promise<DaoProfitsInfo> => {
  const reqMethod =
    passType === 'fixed_price' ? getFpProfitsInfo : getBcProfitsInfo;
  const res = await reqMethod(daoId);
  if (res.payPassWith) {
    res.payWith = res.payPassWith;
  }
  res.network = BackNetworkType[res.netWork] || 'Ethereum';
  return res;
};

export const getProfitsHistory = async (
  passType: string,
  daoId: string,
  type?: string,
): Promise<DaoProfitsHistory[]> => {
  const reqMethod =
    passType == 'fixed_price' ? getFpProfitsHistory : getBcProfitsHistory;
  const res = await reqMethod(daoId, type);
  return res;
};

export const verifyLinkPass = (
  daoName: string,
  source: string,
  userId: string,
  passName: string,
  guildId: string,
) =>
  getSuccessResultAsync(
    passHttp.post('/daos/checkByName', {
      userId,
      source,
      daoName,
      passName,
      guildId,
    }),
  );

export const checkDaoExsit = (daoName: string): Promise<boolean> =>
  getSuccessResultAsync(passHttp.get(`/daos/verifyDaoName/${daoName}`));

export const checkPassExist = (passName: string): Promise<boolean> =>
  getSuccessResultAsync(passHttp.get(`/daos/verifyPassName/${passName}`));

interface TotalValue {
  totalValue: string;
  trackedAddressInfo: Array<{
    network: string;
    trackedAddress: string;
  }>;
}
export const queryTotalValue = (daoId: string): Promise<TotalValue> =>
  getSuccessResultAsync(passHttp.get(`/dashboard/getTotalAndAddress/${daoId}`));

interface NftAssets {
  nftTable: Array<{
    tokenLogo: string;
    tokenSymbol: string;
    tokenName: string;
    assets: number;
    cost: string;
    value: string;
    network: string;
    trackedAddress: string;
  }>;
  nftCard: Array<{
    tokenLogo: string;
    tokenSymbol: string;
    tokenName: string;
    tokenId: string;
    imageUrl: string;
    ownerAddress: string;
  }>;
  nftTotalValue: number;
}
export const queryNftAssets = async (daoId: string): Promise<NftAssets> => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/nft/${daoId}`),
  );

  res.nftCard.forEach((project: any) => {
    project.forEach((nft: any) => {
      if (nft.logoType == 1) {
        nft.imageUrl = URL.createObjectURL(
          new Blob([nft.imageUrl], {
            type: 'image/svg+xml',
          }),
        );
      }
      if (nft.logoType == 2) {
        // console.log(nft.imageUrl);
      }
    });
  });

  res.nftTable.forEach((table: any) => {
    table.vaultStatus = table.isRubbish ? -1 : table.value > 0 ? 1 : 0;
  });

  const xproportions: any = [];
  const xmap: any = {};
  res.nftProportions.forEach((x: any) => {
    if (!xmap[x.symbol]) {
      xproportions.push(x);
      xmap[x.symbol] = x;
    } else {
      xmap[x.symbol].value += x.value;
      xmap[x.symbol].valueUsd += x.valueUsd;
    }
  });
  res.nftProportions = xproportions;

  return res;
};

interface FtAssets {
  totalValue: number;
  ftList: Array<{
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenLogo: string;
    quantity: string;
    chain: string;
    tokenAddress: string;
    price: string;
    trackedAddress: string;
    decimals: string;
    imageUrl: string;
    tokenId: string;
  }>;
  ftSymbolProportions: Array<{
    symbol: string;
    value: number;
    proportion: number;
  }>;
}
export const queryFtAssets = async (daoId: string): Promise<FtAssets> => {
  const x = await getSuccessResultAsync(passHttp.get(`/dashboard/ft/${daoId}`));
  const symbolmap: any = {};
  const symbolxs: any = [];
  x.ftSymbolProportions.forEach((item: any) => {
    if (!symbolmap[item.symbol]) {
      symbolmap[item.symbol] = item;
      symbolxs.push(item);
    } else {
      symbolmap[item.symbol] += item.proportionUsd;
    }
  });
  x.ftSymbolProportions = symbolxs;
  return x;
};

// TODO 只创建 DAO
export const onlyCreateDao = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.post('/daos/createDaoNoPass', params));
export const updateProfile = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.post('/user/update', params));
export const getProfile = (userAddress?: string): Promise<any> => {
  if (userAddress !== '') {
    return getSuccessResultAsync(passHttp.get(`user/userInfo?userAddress=${userAddress}`));
  } else {
    return getSuccessResultAsync(passHttp.get('user/userInfo'));
  }
}
export const getNotifList = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/notify/getFollowList'));
export const sendEmail = (
  notificationEmail: string,
  params: any,
): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get(`/email/send?notificationEmail=${notificationEmail}`),
  );
export const daoSearch = (key: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get(`/notify/dao/search?key=${key}`));
export const memberSearch = (key: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get(`/notify/member/search?key=${key}`));
export const notifFollow = (type: any, following: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get(`/notify/follow?type=${type}&following=${following}`),
  );
export const eventsUpdate = (notifyId: any, event: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get(`/notify/event/update?notifyId=${notifyId}&event=${event}`),
  );

// TODO
export const extendCreatePass = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.post('/pass/createPass', params));

export const getDaoIdByName = (name: string): Promise<number> =>
  getSuccessResultAsync(
    passHttp.get(
      `/daos/getDaoIdByName/${
        name == 'GoodLuckPandaO' ? 'Good Luck PandaO' : name
      }`,
    ),
  );

export const freeMint = (daoId: string): Promise<any> =>
  getSuccessResultAsync(passHttp.get(`/fixedPrice/freeMint/${daoId}`));

export const getFreeMintReceiver = () =>
  getSuccessResultAsync(passHttp.post('/wallet/create'));

export const getFpWhiteReceiver = () =>
  getSuccessResultAsync(passHttp.get('/whitelist/getTimelockAddress'));

interface DashboardConfig {
  daoType: string;
  displayType: string;
  daoId: string;
  nfts: Array<any>;
  fts: Array<any>;
}

export const updateDashboardConfig = (params: DashboardConfig): any =>
  getSuccessResultAsync(passHttp.post('/dashboard/save', params));

export const queryDashboardHistory = async (
  daoId: string,
  page = 1,
  type = '',
  options = {},
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/transfers/${daoId}`, {
      params: {
        type,
        pageSize: 30,
        page,
        ...options,
      },
    }),
  );

  // res.records.forEach((x: any) => {
  //   x.status = x.status == 'Sell' ? 'out' : 'in';
  // });

  return res;
};

export const createDaoPass = (daoId: string, config: any) => {
  return getSuccessResultAsync(
    passHttp.post(`/daos/add/pass/${daoId}`, {
      ...config,
      jsonStr: JSON.stringify(config),
    }),
  );
};

export const queryDashboardConfig = async (daoId: string | number) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/info/${daoId}`),
  );
  return res.daoType ? res : null;
};

// Operations
export const queryDashbaordChat = async (
  daoName: string,
  includeOwnAssets = true,
) => {
  const res: any = await getSuccessResultAsync(
    passHttp.get(`/dashboard/chart/${await getDaoIdByPath(daoName)}`, {
      params: {
        pageSize: 100,
        includeOwnAssets,
      },
    }),
  );

  res.ft && res.ft.reverse();
  res.nft && res.nft.reverse();

  return res;
};

// 查询 dashboard 基础信息
export const queryDashboardInfo = async (
  daoId: string | number,
  includeOwnAssets = true,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/statistics/${daoId}`, {
      params: { includeOwnAssets },
    }),
  );

  const nftRes = await getSuccessResultAsync(
    passHttp.get(`/dashboard/nftstatistics/${daoId}/1`),
  );
  const { nftProportions: nftFloorProportions, nftQuantity: nftFloorQuantity } =
    nftRes;

  [res.nftProportions, res.ftProportions, nftFloorProportions].forEach(
    (proportions) => {
      if (proportions) {
        const sum = proportions.reduce(
          (prev: number, cur: any) => (prev += cur.value),
          0,
        );

        proportions.forEach((x: any) => {
          x.rate = ((x.value / sum) * 100).toFixed(2);
        });
      }
    },
  );

  res.nftFloorProportions = nftFloorProportions;
  res.nftFloorQuantity = nftFloorQuantity;

  return res;
};

export const queryDashboardFtList = async (
  daoId: string | number,
  page = 1,
  options: any,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/ft/${daoId}`, {
      params: {
        page,
        pageSize: 30,
        ...options,
      },
    }),
  );

  return res;
};

export const queryDashboardNftList = async (
  daoId: string | number,
  page = 1,
  options = {},
  cancel = false,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(
      `/dashboard/nft/${daoId}`,
      {
        params: {
          page,
          pageSize: 30,
          ...options,
        },
      },
      cancel,
    ),
  );

  res.records.forEach((table: any) => {
    table.vaultStatus = table.status == 1 ? -1 : table.status == 0 ? 1 : 0;
  });

  return res;
};

export const queryDashboardNftDetailList = async (
  daoId: string | number,
  page = 1,
  options = {},
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/nftCard/${daoId}`, {
      params: {
        page,
        pageSize: 28,
        ...options,
      },
    }),
  );

  res.records.forEach((nft: any) => {
    if (nft.logoType == 1) {
      nft.imageUrl = URL.createObjectURL(
        new Blob([nft.imageUrl], {
          type: 'image/svg+xml',
        }),
      );
    }
    if (nft.logoType == 2) {
      // console.log(nft.imageUrl);
    }

    nft.vaultStatus = nft.status == 1 ? -1 : nft.status == 0 ? 1 : 0;
  });

  return res;
};

export const queryDashboardNftRate = async (
  chain: string,
  contractAddress: string,
  tokenId: string,
  cancel = false,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(
      '/dashboard/nftRate',
      {
        params: {
          chain,
          contractAddress,
          tokenId,
        },
      },
      cancel,
    ),
  );

  return res;
};

export const queryDashbaordByContractAddress = async (
  daoId: string | number,
  contractAdd: string,
  cancel: boolean,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(
      `/dashboard/checkContractAdd/${daoId}`,
      {
        params: {
          contractAdd,
        },
      },
      cancel,
    ),
  );

  return res || [];
};

export const searchTrackedAddress = async (
  daoId: string,
  type: string,
  address: string,
  projectName: string,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/trackedAddress/${daoId}`, {
      params: {
        type: type == undefined ? '' : type ? 'FT' : 'NFT',
        address,
        tokenName: projectName,
      },
    }),
  );

  return res;
};

export const searchProject = async (daoId: string, nameOrSymbol: string) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/projectName/${daoId}`, {
      params: {
        nameOrSymbol,
      },
    }),
  );

  return res;
};

export const queryDelegate = async (daoId: string) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/governance/proposalStats/${daoId}`),
  );

  return res;
};

export const sureCreateDao = async (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/daos/confirmCreation/${daoId}`));

export const queryHomeLoop = () =>
  getSuccessResultAsync(passHttp.get('/dashboard/today/all'));

export const queryLeaderBoardRank = async (
  chain: string,
  filterOtherChains: boolean,
  type: string,
  cancel: boolean,
) => {
  let chainValue = chain === 'bnb' ? 'bsc' : chain;
  const res = await getSuccessResultAsync(
    passHttp.get(
      '/dashboard/leaderboard/total',
      {
        params: {
          chain: chainValue,
          filterOtherChains,
          type,
        },
      },
      cancel,
    ),
  );

  res.top3Daos.forEach((dao: any) => {
    dao.totalUsd = numeral(dao.totalUsd).format('0.00a').toUpperCase();
  });

  const x = res.top3Daos[0];
  res.top3Daos[0] = res.top3Daos[1] || {};
  res.top3Daos[1] = x;

  res.ftValue = numeral(res.ftValue).format('0.00a').toUpperCase();
  res.ftValueRate = (res.ftValueRate * 100).toFixed(2);
  res.nftValueRate = (res.nftValueRate * 100).toFixed(2);
  res.nftValue = numeral(res.nftValue).format('0.00a').toUpperCase();
  res.totalRate = (res.totalRate * 100).toFixed(2);
  res.totalValue = numeral(res.totalValue).format('0.00a').toUpperCase();
  res.ftAssetInfo.forEach((x: any) => (x.value = x.valueUsd));
  res.nftAssetInfo.forEach((x: any) => (x.value = x.valueUsd));
  return res;
};

export const queryLeaderBoardList = ({
  page = 1,
  options,
  cancel = false,
  ecoCode,
}: {
  page: number;
  options: any;
  cancel: boolean;
  ecoCode: string;
}) => {
  let chainValue = options?.chain === 'bnb' ? 'bsc' : options?.chain;
  return getSuccessResultAsync(
    passHttp.get(
      '/dashboard/leaderboard/list',
      {
        params: {
          page,
          pageSize: 30,
          orderType: 'desc',
          /* treasury/nftVault/ftVault/followers */
          orderItem: 'treasury',

          /* 0：已验证  1：未验证 ，空：查询所有 */
          ...options,
          chain: chainValue,
        },
      },
      cancel,
    ),
  );
};

// TODO Do it.

export const twProfileVerify = async (callbackUrl: string) =>
  getSuccessResultAsync(
    passHttp.get('/twitter/requestToken', {
      params: {
        callbackUrl,
      },
    }),
  );

export const fcProfileVerify = async (callbackUrl: string) =>
  getSuccessResultAsync(
    passHttp.get('/farcaster/requestToken', {
      params: {
        callbackUrl,
      },
    }),
  );

export const dcProfileVerify = async (callbackUrl: string) =>
  getSuccessResultAsync(
    passHttp.get('/discord/requestToken', {
      params: {
        callbackUrl,
      },
    }),
  );

export const tgProfileVerify = async (callbackUrl: string) =>
  getSuccessResultAsync(
    passHttp.get('/telegram/requestToken', {
      params: {
        callbackUrl,
      },
    }),
  );

export const twVerify = async (daoName: string, callbackUrl: string) =>
  getSuccessResultAsync(
    passHttp.get('/twitter/requestToken', {
      params: {
        daoId: await getDaoIdByName(daoName),
        callbackUrl,
      },
    }),
  );

export const twVerifyByPath = async (daoPath: string, callbackUrl: string) => {
  const res = await passHttp.get('/twitter/requestToken', {
    params: {
      daoId: await getDaoIdByPath(daoPath),
      callbackUrl,
    },
  });
  // console.log(res);
  if (res.code == '600') {
    notify({
      type: 'error',
      text: 'Login authentication failed, please Login again.',
    });
    mitt.emit('wallet-select');
    return null;
  } else if (res) return res.data;
  return null;
};
export const getDaoIdByPath = (path: string) =>
  getSuccessResultAsync(passHttp.get(`/daos/getDaoIdByPath/${path}`));

export const dashboardSearchNft = async (
  daoId: string,
  nameOrSymbol: string,
  cancel = false,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(
      `/dashboard/projectSearch/${daoId}`,
      {
        params: {
          nameOrSymbol,
        },
      },
      cancel,
    ),
  );

  return res;
};

export const getDaoInfo = async (path: string, includeOwnAssets: boolean) => {
  const id = await getDaoIdByPath(path);
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/title/data/${id}`, {
      params: {
        includeOwnAssets,
      },
    }),
  );
  return { ...res, id };
};

export const getDaoExtInfo = async (
  path: string,
  includeOwnAssets: boolean,
  cancel = false,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(
      `/dashboard/statisticsV2/${await getDaoIdByPath(path)}`,
      {
        params: {
          includeOwnAssets,
        },
      },
      cancel,
    ),
  );
  return res;
};

export const getTrackedAddr = async (path: string) =>
  getSuccessResultAsync(
    passHttp.get(`/dashboard/trackedAddress/${await getDaoIdByPath(path)}`),
  );

export const getNftValueWithVolume = async (
  path: string,
  includeOwnAssets: boolean,
  cancel = false,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(
      `/dashboard/nftSortedValue/${await getDaoIdByPath(path)}`,
      {
        params: {
          includeOwnAssets,
        },
      },
      cancel,
    ),
  );

  [res.nftProportionsByHistory, res.nftProportionsByFloor].forEach(
    (proportions) => {
      if (proportions) {
        const sum = proportions.reduce(
          (prev: number, cur: any) => (prev += cur.value),
          0,
        );

        proportions.forEach((x: any) => {
          x.rate = ((x.value / sum) * 100).toFixed(2);
        });
      }
    },
  );

  return res;
};

export const getFtValueWithVolume = async (
  path: string,
  includeOwnAssets: boolean,
  cancel = false,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(
      `/dashboard/ftSortedValue/${await getDaoIdByPath(path)}`,
      {
        params: {
          includeOwnAssets,
        },
      },
      cancel,
    ),
  );

  [res.ftProportions].forEach((proportions) => {
    if (proportions) {
      const sum = proportions.reduce(
        (prev: number, cur: any) => (prev += cur.value),
        0,
      );

      proportions.forEach((x: any) => {
        x.rate = ((x.value / sum) * 100).toFixed(2);
      });
    }
  });

  return res;
};

export const getNftScatter = async (path: string, includeOwnAssets: boolean) =>
  getSuccessResultAsync(
    passHttp.get(`/dashboard/nftTx/${await getDaoIdByPath(path)}`, {
      params: {
        includeOwnAssets,
      },
    }),
  );

export const getFtScatter = async (path: string, includeOwnAssets: boolean) =>
  getSuccessResultAsync(
    passHttp.get(`/dashboard/ftTx/${await getDaoIdByPath(path)}`, {
      params: {
        includeOwnAssets,
      },
    }),
  );

export const getNftRelation = async (
  path: string,
  includeOwnAssets: boolean,
) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/projectAndArtist/${await getDaoIdByPath(path)}`, {
      params: {
        includeOwnAssets,
      },
    }),
  );

  const { project, artist } = res;

  artist.forEach((x: any) => {
    x.elType = 1;
    x.range =
      x.minArtworkValue == x.maxArtworkValue
        ? [formatVal(x.minArtworkValue, { bit: 2 })]
        : [
            formatVal(x.minArtworkValue, { bit: 2 }),
            formatVal(x.maxArtworkValue, { bit: 2 }),
          ];
  });

  return { project, artist };
};

export const getFtRelation = async (path: string, includeOwnAssets: boolean) =>
  getSuccessResultAsync(
    passHttp.get(`/dashboard/ftProject/${await getDaoIdByPath(path)}`, {
      params: {
        includeOwnAssets,
      },
    }),
  );

export const queryNftInfo = async (
  chain: string,
  contractAddress: string,
  tokenId: string,
) => {
  const res = await passHttp.get('/dashboard/valuationDetail', {
    params: {
      chain,
      contractAddress,
      tokenId,
    },
  });

  if (res.data) return res.data;
  return null;
};

export const queryOvDaoRelation = (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/dashboard/relationship/${daoId}`));

export const queryOvMirror = (daoId: string, page: number, cancel = false) =>
  getSuccessResultAsync(
    passHttp.get(
      `/dashboard/mirrorList/${daoId}`,
      {
        params: {
          page,
          pageSize: 20,
        },
      },
      cancel,
    ),
  );

export const queryOvDaoInterData = async (daoId: string) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/dashboard/interactivePlatList/${daoId}`),
  );

  res.forEach((x: any) => {
    const sum = x.info.reduce((a: number, b: any) => a + b.count, 0);
    x.totalSum = sum;
  });

  return res;
};

export const queryOvVoteData = (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/dashboard/governance/token/${daoId}`));

export const queryOvMulDiGraph = (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/dashboard/comprehensiveData/${daoId}`));

export const queryOvDaoPass = (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/dashboard/nftBadge/${daoId}`));

export const queryProposalDetailsInfo = (id: string | number) =>
  getSuccessResultAsync(passHttp.get(`/governance/view/proposal/${id}`));
export const queryGovIntro = (id: string | number) =>
  getSuccessResultAsync(passHttp.get(`/governance/view/info/${id}`));

export const queryProposalDetailsList = async (id: string | number, address: string) => {
  const res = await passHttp.get(`/governance/view/voteDetail/${id}?address=${address}`);
  console.log("/governance/view/voteDetail::", res);
  return res.data;
}

export const queryOvDaoProposal = (
  daoId: string,
  page: number,
  state: string,
  conf: any,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      `/dashboard/proposalList/${daoId}`,
      {
        params: {
          page,
          pageSize: 10,
          state,
          ...conf,
        },
      },
      cancel,
    ),
  );

export const queryNftPass = (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/pass/passList/${daoId}`));

export const queryGovernanceStatus = async (daoId: string) => {
  const res = await passHttp.get(
    `/dashboard/governance/proposalStats/${daoId}`,
  );
  if (res) {
    // console.log(res);
    return res.data;
  } else {
    return null;
  }
};

export const queryMaxControversy = async (daoId: string) => {
  const res = await passHttp.get(`/governance/view/maxControversy/${daoId}`);
  if (res) return res.data;
  else return null;
};

export const searchDao = (name: string, cancel = false) =>
  getSuccessResultAsync(
    passHttp.get(
      '/daos/search',
      {
        params: {
          name,
        },
      },
      cancel,
    ),
  );

export const confTreasury = (daoId: string, list: any) =>
  getSuccessResultAsync(
    passHttp.post('/dashboard/saveV2', {
      daoId,
      list,
    }),
  );
export const confEvents = (daoId: string, email: any) =>
  getSuccessResultAsync(
    passHttp.post('/daos/email/save', {
      daoId,
      email,
    }),
  );

export const confGovernance = (
  description: string,
  imageUrl: string,
  daoId: string,
  governanceTokenList: any,
  links: any,
  roles: any,
) =>
  getSuccessResultAsync(
    passHttp.post('/governance/edit', {
      description,
      imageUrl,
      daoId,
      governanceTokenList,
      links,
      roles,
    }),
  );

export const confCollections = async (
  daoId: string,
  poap: any,
  oat: any,
  collection: any,
) =>
  getSuccessResultAsync(
    passHttp.post('/pass/editExtraPass', {
      daoId,
      poap,
      oat,
      collection,
    }),
  );

export const editDao = async (config: any) =>
  getSuccessResultAsync(passHttp.put('/daos/update', config));

export const queryLastTransfer = (
  contractAddress: string,
  ownerAddress: string,
  chain: string,
  tokenId: string,
) =>
  getSuccessResultAsync(
    passHttp.get('/dashboard/nftCard/lastTransfer', {
      params: {
        contractAddress,
        ownerAddress,
        chain,
        tokenId,
      },
    }),
  );

export const queryHomeInfo = (
  type: string,
  chain: string,
  filterOtherChains: string,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/dao/stats',
      {
        params: {
          type,
          chain,
          filterOtherChains,
        },
      },
      true,
    ),
  );

export const queryHomeGovernance = (
  page: number,
  type: string,
  chain: string,
  state: string,

  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/proposalList',
      {
        params: {
          page,
          pageSize: 20,
          chain,
          state,
          type,
        },
      },
      cancel,
    ),
  );
export const queryProposalGovernance = (
  page: number,
  type: string,
  chain: string,
  state: string,
  platform = 'all',
  key: string,
  category = 'all',
  orderType = 'desc',
  orderItem = 'created',
  cancel = false,
  pageSize = 20,
  filterSpam = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/proposalList',
      {
        params: {
          page,
          pageSize,
          chain,
          state,
          type,
          platform,
          key,
          category,
          orderType,
          orderItem,
          filterSpam,
        },
      },
      cancel,
    ),
  );
export const queryDaoChart = (
  type: string,
  chain: string,
  filterOtherChains: string,
) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoDistributionChart', {
      params: {
        type,
        chain,
        filterOtherChains,
      },
    }),
  );
export const queryDaoChartEco = (ecoCode: string) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoDistributionChart', {
      params: {
        ecoCode,
      },
    }),
  );

export const queryTreasuryChart = (
  type: string,
  chain: string,
  filterOtherChains: string,
  hasNativeToken: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoTreasuryChart', {
      params: {
        type,
        chain,
        filterOtherChains,
        hasNativeToken,
      },
    }),
  );
export const queryTreasuryChartEco = (ecoCode: string) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoTreasuryChart', {
      params: {
        ecoCode,
      },
    }),
  );

export const queryFtRank = (chain: string, filterOtherChains: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/topFtAssets', {
      params: {
        chain,
        filterOtherChains,
      },
    }),
  );

export const queryWeeklyFtRank = (chain: string, filterOtherChains: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/weeklyFtTransferStats', {
      params: {
        chain,
        filterOtherChains,
      },
    }),
  );

export const queryProposalChart = (type: string, chain: string) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoProposalChart', {
      params: {
        chain,
        type,
      },
    }),
  );
export const queryProposalChartEco = (ecoCode: string) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoProposalChart', {
      params: {
        ecoCode,
      },
    }),
  );

export const queryMemberChart = (
  type: string,
  chain: string,
  filterOtherChains: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoGovernanceTokenChart', {
      params: {
        type,
        chain,
        filterOtherChains,
      },
    }),
  );
export const queryMemberChartEco = (ecoCode: string) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/daoGovernanceTokenChart', {
      params: {
        ecoCode,
      },
    }),
  );

export const queryEditDaoInfo = (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/daos/detail/${daoId}`));

export const queryEditTreasury = (daoId: string) =>
  getSuccessResultAsync(passHttp.get(`/dashboard/infoV2/${daoId}`));

export const queryEditGovernance = async (daoId: string) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/governance/detail/${daoId}`),
  );
  // res.governanceTokenList.forEach((x: any) => (x.contract = x.address));
  // res.roles.forEach((x: any) => (x.contract = x.address));
  return res;
};
export const queryEditEvents = async (daoId: string) => {
  const res = await getSuccessResultAsync(passHttp.get(`/daos/email/${daoId}`));
  return res;
};

export const queryEditPass = async (daoId: string) => {
  const res = await getSuccessResultAsync(
    passHttp.get(`/pass/extraPassDetail/${daoId}`),
  );
  res.other.forEach((x: any) => (x.contract = x.address));
  return res;
};

export const getHomeStatInfo = () =>
  getSuccessResultAsync(passHttp.get('/daos/totalCount'));
export const getPartnershipInfo = (chain: string) =>
  getSuccessResultAsync(passHttp.get(`sp/query/${chain}`));

// TODO Do it.

export const getOvProposalMonthly = (daoId: string) =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/proposalChart', {
      params: {
        daoId,
      },
    }),
  );

type ConfDTO = {
  page: number;
  pageSize?: number;
  orderItem: string /* proposals/votes/proposalsCreated */;
  orderType: string /* desc/asc */;
};
export const getAddressFt = (address: string) =>
  getSuccessResultAsync(passHttp.get(`/profile/walletTokenAssets/${address}`));
export const getEvents = async (daoName: string, start: string, end: string) =>
  getSuccessResultAsync(
    passHttp.get(
      `/calendar/events/${await getDaoIdByPath(
        daoName,
      )}?start=${start}&end=${end}`,
    ),
  );

export const getAddressNft = (address: string) =>
  getSuccessResultAsync(passHttp.get(`/profile/walletNftAssets/${address}`));

export const getRelatedDaos = (address: string) =>
  getSuccessResultAsync(passHttp.get('/user/relatedDao'));

export const getAddressDetails = (address: string) =>
  getSuccessResultAsync(passHttp.get(`/profile/daoProposalsStats/${address}`));

export const getDaoDetails = (
  address: string,
  daoId: number,
  platform: string,
) =>
  getSuccessResultAsync(
    passHttp.get(
      `/profile/userProposalsInfoByDaoId/${address}/${daoId}?platform=${platform}`,
    ),
  );
export const getDaoVoted = (address: string, daoId: number, platform: string) =>
  getSuccessResultAsync(
    passHttp.get(
      `/profile/proposalsVotedList/${address}/${daoId}?platform=${platform}`,
    ),
  );
export const getDaoProposed = (
  address: string,
  daoId: number,
  platform: string,
) =>
  getSuccessResultAsync(
    passHttp.get(
      `/profile/proposalsCreatedList/${address}/${daoId}?platform=${platform}`,
    ),
  );
export const getDaoDelegation = (
  address: string,
  daoId: number,
  platform: string,
) =>
  getSuccessResultAsync(
    passHttp.get(
      `/profile/delegationsReceived/${address}/${daoId}?platform=${platform}`,
    ),
  );
  export const getDelegateeList = (
    address: string,
    daoId: number,
    platform: string,
  ) =>
    getSuccessResultAsync(
      passHttp.get(
        `/profile/delegateeList/${address}/${daoId}?platform=${platform}`,
      ),
    );
export const getMemberGraph = (daoId: number) =>
  getSuccessResultAsync(passHttp.get(`governance/view/multisigInfo/${daoId}`));
export const hasMember = (daoId: number) =>
  getSuccessResultAsync(passHttp.get(`governance/view/hasMemberTab/${daoId}`));

export const getOvVoteRank = (daoId: string, conf: ConfDTO, cancel = false) =>
  getSuccessResultAsync(
    passHttp.get(
      '/governance/view/topVoters',
      {
        params: {
          daoId,
          pageSize: 20,
          ...conf,
        },
      },
      cancel,
    ),
  );
export const getGovPlatform = (daoId: string) =>
  getSuccessResultAsync(
    passHttp.get(`/governance/view/daoGovPlatforms/${daoId}`),
  );

export const getMemberList = (daoId: string, conf: ConfDTO, cancel = false) =>
  getSuccessResultAsync(
    passHttp.get(
      '/governance/view/memberList',
      {
        params: {
          daoId,
          pageSize: 12,
          ...conf,
        },
      },
      cancel,
    ),
  );

export const getGovMemberOverview = (
  type: string,
  chain: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/overview',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getDAOSearchRecommend = (
  type: string,
  chain: string,
  name?: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/daos/search/recommend',
      {
        params: {
          type,
          chain,
          name,
        },
      },
      cancel,
    ),
  );

export const getGovMemberList = (
  type: string,
  chain: string,
  conf: ConfDTO,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/list',
      {
        params: {
          type,
          chain,
          pageSize: 16,
          ...conf,
        },
      },
      cancel,
    ),
  );

export const getStatsByMonth = (type: string, chain: string, cancel = false) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/statsByMonth',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getNewMemberRatioBy30d = (
  type: string,
  chain: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/newMemberRatioBy30d',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getGovMemberDistribution = (
  type: string,
  chain: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/memberDistribution',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getVotingCountDistribution = (
  type: string,
  chain: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/votingCountDistribution',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getProposerCountDistribution = (
  type: string,
  chain: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/proposerCountDistribution',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getDaoRelatedCountDistribution = (
  type: string,
  chain: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/daoRelatedCountDistribution',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getDaoGovernanceDistribution = (
  type: string,
  chain: string,
  category: string,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/daoGovernanceDistribution',
      {
        params: {
          type,
          chain,
          category,
        },
      },
      cancel,
    ),
  );

export const getDecisiveVoterRank = (
  type: string,
  chain: string,
  page: numeral,
  conf: any,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get('/govMember/decisiveVoterRank', {
      params: {
        type,
        chain,
        page,
        pageSize: 20,
        ...conf,
      },
    }),
  );

export const getAuthorRank = (
  type: string,
  chain: string,
  page: numeral,
  conf: any,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get('/govMember/authorRank', {
      params: {
        type,
        chain,
        page,
        pageSize: 20,
        ...conf,
      },
    }),
  );

export const getDelegatorRank = (
  type: string,
  chain: string,
  page: numeral,
  conf: any,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get('/govMember/delegatorRank', {
      params: {
        type,
        chain,
        page,
        pageSize: 20,
        ...conf,
      },
    }),
  );

export const getComparison = (type: string, chain: string, cancel = false) =>
  getSuccessResultAsync(
    passHttp.get(
      '/govMember/comparison',
      {
        params: {
          type,
          chain,
        },
      },
      cancel,
    ),
  );

export const getDynamicNftData = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/user/info/' + params.address));

export const getRankScoreData = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/user/userRankScore/' + params.address));

export const getActivityData = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/profile/activity/' + params.address));

export const getProfileSearchData = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get(`profile/searchDao/${params.address}?name=` + params.name));

export const getMintedPersonalData = (): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/task/mint/status'));

export const getMintedTokenId = (params: any): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/user/getTokenId/' + params.address));

export const getMintedPlatformData = (): Promise<any> =>
  getSuccessResultAsync(passHttp.get('/task/leaderboard'));
