import store from '@/store';
import {
  mittDownload,
  mittNetwork,
  mittConnect,
  mittSwitchNetWork,
} from './event';
import { isConnected, isDownload, getChainId } from './../utils/wallet';
import { chains, CHAIN_IDS } from '@/constants';

const $store: any = store;

export const canSubmitByEnvParms = (): any => {
  const res: any = {};
  if (isConnected()) {
    res.connected = true;
  }
  if ($store.user.id) {
    res.isSigned = true;
  }
  return res;
};

export const canSubmitByEnv = (): boolean => {
  const res = canSubmitByEnvParms();
  return Object.values(res).every((param) => param);
};

export const checkWalletFlow = async (): Promise<boolean> => {
  if (!isDownload()) {
    mittDownload();
    return false;
  }

  if (!(store as any).state.wallet.token) {
    mittConnect();
    return false;
  }

  return true;
};

export const checkNetwork = async (network?: string): Promise<boolean> => {
  if (await checkWalletFlow()) {
    const chainid = await getChainId();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!chains.Polygon.chainIds.includes(chainid)) {
      mittNetwork();
      return false;
    }
    return true;
  }
  return false;
};

export const checkChain = async (chainId: string): Promise<boolean> => {
  if (await checkWalletFlow()) {
    const currentChainId = await getChainId();

    if (chainId !== currentChainId) {
      mittNetwork();
      return false;
    }
  }
  return true;
};

export const checkSignin = (): boolean => {
  return !!$store.state.wallet.token;
};
