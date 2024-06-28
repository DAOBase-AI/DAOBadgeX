import { BackNetworkType, chains } from './../constants/index';
import $store from '@/store';
import { checkNetwork, checkChain, checkWalletFlow } from './../libs/check';
import { mittDownload, mittLoading, mittWalletSelect } from './../libs/event';
import { isOwnPass } from './../api/dao';
import mitt from '@/libs/event';
import { isDownload } from './wallet';

export const withOwnPass = (): any => {
  return async function (daoName: string, passType: string) {
    console.log(daoName, passType);
    if (!(await checkWalletFlow())) {
      return;
    }

    try {
      const res = await isOwnPass(daoName);
      if (res.result) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      } else {
        mitt.emit('ownPass', { id: daoName, passType });
      }
    } catch (error) {
      console.log(error);
      //   TODO 执行错误的提示
    }
  };
};

// TODO 未登录就是游客
export const withVisitor = (behavior: any) => {
  return function (): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if ($store.state.wallet.isSignedIn) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      behavior(this);
    } else {
      mitt.emit('tip', {
        okText: 'Connect Wallet',
        text: 'Pls connect your wallet first',
      });
    }
  };
};

export const withThrottling = (fn: any) => {
  let flag = false;
  return async function (this: any, ...args: any[]) {
    if (flag) {
      return;
    }
    flag = true;
    try {
      const res = await fn.bind(this)(...args);
      flag = false;
      return res;
    } catch (e) {
      flag = false;
      throw e;
    }
  };
};

export const withLoading = (fn: any) => {
  return async function (this: any, ...args: any[]) {
    const lid: string = Date.now() + '';
    mittLoading(lid);

    try {
      const res = await fn.bind(this)(...args);
      mittLoading(lid, false);
      return res;
    } catch (e) {
      mittLoading(lid, false);
      throw e;
    }
  };
};

export const withDownload = (fn: any) => {
  return function (...args: any[]): any {
    if (!isDownload()) {
      mittDownload(...args);
      return null;
    }
    return fn(...args);
  };
};

export const withWalletFlow = function (
  behavior: any,
  getNetwork = (ins?: any) => undefined,
) {
  return async function (this: any, ...args: any[]): Promise<any> {
    if (await checkNetwork(getNetwork(this))) {
      return behavior.bind(this)(...args);
    }
  };
};

export const withCheckChain = function (behavior: any) {
  return async function (chainName: string, ...args: any[]): Promise<any> {
    if (await checkChain(chains[BackNetworkType[chainName]].chainId)) {
      behavior(...args);
    }
  };
};

export const withConnectWallet = function (behavior: any) {
  return async function (...args: any[]): Promise<any> {
    if (await checkWalletFlow()) {
      behavior(...args);
    }
  };
};

export const withWalletLogin = function (behavior: any) {
  return function (...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if ($store.state.wallet.isSignedIn) {
      behavior(...args);
    } else {
      mittWalletSelect();
    }
  };
};
