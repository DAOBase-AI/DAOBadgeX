import { getSuccessResultAsync, passHttp } from '@/utils/req';
import { result } from 'lodash';

export const getLogoUrl = () =>
  getSuccessResultAsync(passHttp.get('/pass/passFile'));

interface User {
  id: string;
  name: string;
  avatarUrl: string;
}
export const getAllUsers = (name = ''): Promise<User[]> =>
  getSuccessResultAsync(
    passHttp.get('/user/queryByName', {
      params: {
        name,
      },
    }),
  );

export const uploadWhiteExcel = (file: any, onProgress?: any) => {
  const formData = new FormData();
  formData.append('file', file);
  return getSuccessResultAsync(
    passHttp.post('/excel/import/whiteList', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    }),
  );
};

export const addWhiteExcel = (file: any, chain: string, address: string) => {
  const formData = new FormData();
  formData.append('file', file);
  return getSuccessResultAsync(
    passHttp.post(`/whitelist/addByExcel/${chain}/${address}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};

export const delWhiteExcel = (file: any, chain: string, address: string) => {
  const formData = new FormData();
  formData.append('file', file);
  return getSuccessResultAsync(
    passHttp.post(`/whitelist/delByExcel/${chain}/${address}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};

export const addWlBatch = (
  list: any[],
  chain: string,
  contractAddress: string,
) =>
  getSuccessResultAsync(
    passHttp.post('/whitelist/addBatch', {
      list,
      chain,
      contractAddress,
    }),
  );

export const delWlBatch = (
  list: any[],
  chain: string,
  contractAddress: string,
) =>
  getSuccessResultAsync(
    passHttp.post('/whitelist/delBatch', {
      data: {
        list,
        chain,
        contractAddress,
      },
    }),
  );

export const uploadFile = (url: string, file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  return getSuccessResultAsync(
    passHttp.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};

const baseURL = process.env.VUE_APP_BMSURL;

export const getBlogTypes = (type: string, page: number, size = 30) =>
  passHttp.get('/blog/blogType').then((res: any) => res.data);

export const queryBlogs = (type: string, page: number, size = 30) =>
  passHttp
    .get('/blog/blogList/', {
      params: {
        type,
        page,
        pageSize: size,
      },
    })
    .then((res: any) => res.data);

export const queryBlogDetail = (id: string) =>
  passHttp.get('/blog/getDetailByBlogId', {
    params: {
      blog_id: id,
    },
    baseURL,
  });

export const queryBlogDetailByTitle = (title: string) =>
  passHttp.get(`/blog/blogDetail/${title}`);

export const queryDirectory = (
  daoType: string,
  name: string,
  page: number,
  size = 30,
) =>
  passHttp
    .get('/dao/getDaosByPageWithType/', {
      params: {
        currentPage: page,
        size,
        type: 0,
        condition: {
          type: daoType,
          name,
        },
      },
      baseURL,
    })
    .then((res: any) => ({
      result: res[0],
      ...res[1],
    }));

export const queryDirectoryInfo = (name: string) =>
  passHttp.get('/dao/getDaoDetailByName', {
    params: {
      name,
    },
    baseURL,
  });

export const queryTwitter = (dao_id: string, callbackURL: string) =>
  passHttp.get('/twitter_oauth/request_token', {
    params: {
      dao_id,
      callbackURL,
    },
    baseURL,
  });

// TODO Home
export const queryHomeDaoRank = async (
  chain: string,
  filterOtherChains: boolean,
  cancel = false,
) => {
  const res = await passHttp.get(
    '/homePage/dao/statistics',
    {
      params: {
        chain,
        filterOtherChains,
      },
    },
    cancel,
  );
  if (res.code != 200) {
    throw new Error(res.msg);
  }
  const {
    // artistCount,
    // collections,
    // daoCount,
    // nftCount,
    // totalValueUsd,
    /* array */
    daoHistoryRank,
    // daoRank,
    assetDistribution,
  } = res.data;

  // TODO 对 daoHistoryRank 的操作处理

  const x = assetDistribution.map((x: any) => ({
    assetType: x.assetType,
    totalValueUsd: +(+x.totalValueUsd).toFixed(2),
  }));

  return {
    ...res.data,
    // dsoHistoryRank: [],
    assetDistribution: x,
  };
};

export const queryHomeBlogs = async (
  page = 1,
  type = '',
  orderType = 'desc',
  cancel: boolean,
) =>
  passHttp.get(
    '/homePage/blogList',
    {
      params: {
        page,
        pageSize: 5,
        type,
        orderType,
      },
    },
    cancel,
  );

// Monthly Addition of DAOs
export const queryHomeDaoCountMonthly = (
  type: string,
  chain: string,
  category: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/daoCountMonthly',
      {
        params: {
          type,
          chain,
          category,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// Monthly DAO Treasury Fluctuation
export const queryHomeTreasuryMonthly = (
  type: string,
  chain: string,
  category: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/treasuryMonthly',
      {
        params: {
          type,
          chain,
          category,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// DAO Total Members Change
export const queryHomeHolderCountMonthly = (
  type: string,
  chain: string,
  category: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/tokenHolderCountMonthly',
      {
        params: {
          type,
          chain,
          category,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// DAO Distribution
export const queryHomeDaoDistribution = (
  type: string,
  chain: string,
  category: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/daoDistribution',
      {
        params: {
          type,
          chain,
          category,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// DAO Treasury Distribution
export const queryHomeTreasuryDistribution = (
  type: string,
  chain: string,
  category: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/daoTreasuryDistribution',
      {
        params: {
          type,
          chain,
          category,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// DAO Native Token Ratio
export const queryHomeNtrDistribution = (
  type: string,
  chain: string,
  category: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/ntrDistribution',
      {
        params: {
          type,
          chain,
          category,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// Weekly DAO Asset Flow by Valuation
export const queryInOutChart = (chain: string, filterOtherChains: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/homePage/weeklyFtTransferStats', {
      params: {
        chain,
        filterOtherChains,
      },
    }),
  );

// Active DAOs Ratio
export const queryHomeActiveDaoRatio = async (
  type: string,
  chain: string,
  top: number,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/activeDaoRatio',
      {
        params: {
          type,
          chain,
          top,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// Number of active DAOs
export const queryHomeActiveDaoList = (
  type: string,
  chain: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/activeDaoList',
      {
        params: {
          type,
          chain,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// Favorite Governance Tools (Proposals/Voters)
export const queryHomeTopGovernancePlatform = async (
  type: string,
  chain: string,
  category: string,
  days: number,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/topGovernancePlatform',
      {
        params: {
          type,
          chain,
          category,
          days,
          filterOtherChains,
        },
      },
      cancel,
    ),
  );

// Top DAOs Based on Governance
export const getHomeGovernanceDaoRank = (
  type: string,
  chain: string,
  days: number,
  page: number,
  conf: any,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/topDaoProposals',
      {
        params: {
          type,
          chain,
          days,
          page,
          pageSize: 20,
          ...conf,
        },
      },
      cancel,
    ),
  );

// Top Voters
export const getHomeVoterRank = (
  type: string,
  chain: string,
  days: number,
  page: number,
  conf: any,
  cancel = false,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/topVoters',
      {
        params: {
          type,
          chain,
          days,
          page,
          pageSize: 20,
          ...conf,
        },
      },
      cancel,
    ),
  );

export const queryHomeCollectedRank = (
  chain: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  passHttp.get(
    '/homePage/topCollectedAssets',
    {
      params: {
        page: 1,
        pageSize: 20,
        chain,
        filterOtherChains,
      },
    },
    cancel,
  );

export const queryHomeTransferRecord = (
  page = 1,
  type: string,
  chain: string,
  cancel: boolean,
) =>
  passHttp.get(
    '/homePage/tokenTransferRecord',
    {
      params: {
        page,
        pageSize: 10,
        chain,
        type,
      },
    },
    cancel,
  );

export const queryHomePriceLimitAlert = (
  type: string,
  chain: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  passHttp.get(
    '/homePage/dao/eventAlert',
    {
      params: {
        type,
        page: 1,
        pageSize: 20,
        chain,
        filterOtherChains,
      },
    },
    cancel,
  );

export const queryDaoFinancing = (month = '', cancel: boolean) =>
  passHttp.get(
    '/homePage/dao/fundraisingChart',
    {
      params: {
        month,
      },
    },
    cancel,
  );

export const queryArtistRank = async (
  chain: string,
  filterOtherChains: boolean,
  cancel: boolean,
) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });

  const res = await passHttp.get(
    '/homePage/findTopArtist',
    {
      params: {
        chain,
        filterOtherChains,
      },
    },
    cancel,
  );

  return res;
};

export const queryNftHolderTime = (
  type: string,
  chain: string,
  filterOtherChains: boolean,
  cancel: boolean,
) =>
  passHttp.get(
    '/homePage/dao/nftHoldingDays',
    {
      params: {
        page: 1,
        pageSize: 1000,
        chain,
        type,
        filterOtherChains,
      },
    },
    cancel,
  );

export const queryArtistDetail = (id: string) =>
  passHttp.get(`/homePage/daoDetail/${id}`);

export const queryDaoRankRace = (
  type: string,
  chain: string,
  filterOtherChains: boolean,
  hasNativeToken: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/dao/historyChange',
      {
        params: {
          type,
          chain,
          filterOtherChains,
          hasNativeToken,
        },
      },
      cancel,
    ),
  );

export const queryDaoRank = (
  type: string,
  chain: string,
  filterOtherChains: boolean,
  hasNativeToken: boolean,
  cancel: boolean,
) =>
  getSuccessResultAsync(
    passHttp.get(
      '/homePage/dao/rank',
      {
        params: {
          type,
          chain,
          filterOtherChains,
          hasNativeToken,
        },
      },
      cancel,
    ),
  );
