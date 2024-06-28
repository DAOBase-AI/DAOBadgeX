import { getSuccessResult, passHttp, getSuccessResultAsync } from '@/utils/req';

export const login = (addr: string) => passHttp.post('/user/login', { addr });

export const logout = () => passHttp.get('/user/logOut');

export const getNounce = (address: string): Promise<string> =>
  getSuccessResultAsync(passHttp.get(`/daos/sessions/getNonce/${address}`));

interface SignLoginDto {
  address: string;
  nonce: string;
  signature: string;
  walletType?: string;
  inviteCode?: string;
}
interface SignLoginRes {
  addr: string;
  authorization: string;
  avatarUrl: string;
  email: string;
  id: number | string;
  name: string;
}
export const signLogin = async (data: SignLoginDto): Promise<any> =>
  getSuccessResult(await passHttp.post('/user/sign', data));

export const updateUser = async (data: any): Promise<any> =>
  getSuccessResultAsync(passHttp.put('/user/', data));

export const getUserPoints = (userAddress: string): Promise<any> => {
  // return getSuccessResultAsync(passHttp.get('/task/myPoint'));
  return getSuccessResultAsync(passHttp.get(`/task/myPoint?userAddress=${userAddress}`));
};

export const queryDailySignIn = (userAddress: string): Promise<boolean> => {
  // return getSuccessResultAsync(passHttp.get('/task/queryDailySignIn'));
  return getSuccessResultAsync(passHttp.get(`/task/queryDailySignIn?userAddress=${userAddress}`));
};

export const queryLevels = (userAddress: string): Promise<boolean> => {
  // return getSuccessResultAsync(passHttp.get('/task/levelByDiscordAndTelegram'));
  return getSuccessResultAsync(passHttp.get(`/task/levelByDiscordAndTelegram?userAddress=${userAddress}`));
};

export const userCheckIn = async (): Promise<any> => {
  const res = await passHttp.post('/task/checkIn');
  return res;
};

export const startTask = async (taskId: number): Promise<any> => {
  const res = await passHttp.post(`/task/startTask?taskId=${taskId}`);
  return res;
};

export const verifyAccessCode = async (accessCode: number): Promise<any> => {
  const res = await passHttp.post(`task/verifyAccessCode?accessCode=${accessCode}`);
  return res;
};

export const isInvitationCodeBound = async (): Promise<any> => {
  const res = await passHttp.post(`/task/isInvitationCodeBound`);
  return res;
};

export const verifySpecialTask = async (taskId: number): Promise<any> => {
  const res = await passHttp.post(`/task/verifySpecialTask?taskId=${taskId}`);
  return res;
};

export const verifyTask = async (taskId: number): Promise<any> => {
  const res = await passHttp.post(`/task/verifyTask?taskId=${taskId}`);
  return res;
};

export const saveSocialAccount = async (
  platform: string,
  username: string,
  userId: string,
): Promise<any> => {
  const res = await passHttp.post(
    `/user/saveSocialAccount?platform=${platform}&username=${username}&userId=${userId}`,
  );
  return res;
};

export const queryUserTweet = async (userAddress: string): Promise<any> => {
  return getSuccessResultAsync(passHttp.get(`/task/queryUserTweet?userAddress=${userAddress}`));
};

export const queryTask = async (type: number, userAddress: string): Promise<any> => {
  const res = await passHttp.get('/task/queryTask', {
    params: {
      type,
      userAddress,
    },
  });
  // console.log('/task/queryTask::', type, userAddress, res);
  return res.data;
};

export const getRankUpdateTime = async (): Promise<any> => {
  return getSuccessResultAsync(passHttp.get('/task/rankUpdateTime'));
};

export const getTaskRankList = async (
  page: number,
  orderItem: string,
  cancel: boolean,
  address?: string,
) => {
  const res = await passHttp.get(
    '/task/taskRankList',
    {
      params: {
        orderItem: orderItem,
        page: page,
        pageSize: 1000,
        address: address,
      },
    },
    cancel,
  );
  console.log('/task/taskRankList::', res);
  return res.data;
};

export const getInviteUsersList = async (
  userAddress: string,
  page: number,
  orderItem: string,
  orderType: string,
  cancel: boolean,
  address?: string,
) => {
  const res = await passHttp.get(
    `/task/inviteUsersList?userAddress=${userAddress}`,
    {
      params: {
        orderItem: orderItem,
        orderType: orderType,
        page: page,
        pageSize: 15,
        address: address,
      },
    },
    cancel,
  );
  console.log('/task/inviteUsersList::', res);
  return res.data;
};
