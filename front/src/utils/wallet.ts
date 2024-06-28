import { CHAIN_NAMES, chains } from '@/constants';
import $store from '@/store';
import { ethers } from 'ethers';

import { LOCALSTORAGE_WALLET_CONNECT_CHAIN_TYPE, LOCALSTORAGE_WALLET_TYPE, WalletTypes } from '../constants/walletTypes';
import { mittDownload } from './../libs/event';
import { ProviderMessage, ProviderRpcError } from './../store/modules/eip-1193';

export const getWalletType = () => {
  const walletType: string =
    // @ts-ignore
    $store.state.wallet.walletType ||
    window.localStorage.getItem(LOCALSTORAGE_WALLET_TYPE);
  return walletType;
};

export const toDownload = (): void => {
  const walletType: string = getWalletType();
  switch (walletType) {
    case WalletTypes.metamask:
      window.open('https://metamask.io/download.html', '_target');
      break;
    case WalletTypes.okx:
      window.open(
        'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
        '_target',
      );
      break;
    default:
      break;
  }
};

const checkWalletInstance = () => {
  const walletType: string = getWalletType();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  switch (walletType) {
    case WalletTypes.metamask:
      if (window.ethereum) {
        return window.ethereum;
      } else {
        mittDownload();
        // throw new Error('#Metamask not installed.');
      }
      break;
    case WalletTypes.okx:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof window.okxwallet !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return window.okxwallet;
      } else {
        mittDownload();
        // throw new Error('#Metamask not installed.');
      }
      break;
    case WalletTypes.walletConnect:
      // @ts-ignore
      const walletConnectProvider = window.walletConnectProvider;
      if (walletConnectProvider) {
        return walletConnectProvider;
      }
      break;
    default:
      if (window.ethereum) {
        return window.ethereum;
      }
      break;
  }
};

/* 4001 - The request was rejected by the user */
/* -32602 - The parameters were invalid  */
/* -32603 Internal error */

export const checkWallet = (): any => checkWalletInstance();

export const isMetamask = (): boolean => checkWallet()?.isMetamask;

export const isDownload = (): boolean => {
  try {
    checkWallet();
    return true;
  } catch (e) {
    return false;
  }
};
/** PROPERTYPE **/
export const isConnected = (): boolean => {
  try {
    const eth = checkWallet();
    return eth.isConnected();
  } catch (error) {
    return false;
  }
};

/* ChainID */
export const getChainId = (): string => {
  try {
    const eth = checkWallet();
    return eth.request({ method: 'eth_chainId' });
  } catch (error) {
    return '';
  }
};

export const onChainChanged = (handle: (_chainId: string) => any): void => {
  try {
    const eth = checkWallet();
    eth.on('chainChanged', handle);
  } catch (error) {
    /*  */
  }
};

/* Accounts */
export const getAccounts = async (): Promise<any> => {
  try {
    const eth = checkWallet();
    return eth.request({ method: 'eth_accounts' });
  } catch (error) {
    return Promise.resolve([]);
  }
};

export const onAccountsChanged = (
  handle: (accounts: Array<string>) => void,
): any => {
  try {
    const eth = checkWallet();
    eth.on('accountsChanged', handle);
  } catch (error) {
    /*  */
  }
};

/* connect */
export const connectWallet = (): Promise<any> => {
  try {
    const eth = checkWallet();
    return eth.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    return Promise.resolve([]);
  }
};

// export const isUnlocked = (): Promise<boolean> => {
//   const eth = checkWallet();
//   return eth._metamask.isLunlocked();
// };

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainIds?: any[];
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export const addEthChain = (chainInfo: AddEthereumChainParameter): any => {
  try {
    const eth = checkWallet();
    return eth.request({
      method: 'wallet_addEthereumChain',
      params: [chainInfo],
    });
  } catch (error) {
    console.error(error);
    return false;
    /*  */
  }
};

export const switchEthChain = async (
  chain: AddEthereumChainParameter,
): Promise<any> => {
  const eth = checkWallet();
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.chainId }],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as ProviderRpcError).code === 4902) {
      try {
        await addEthChain(chain as AddEthereumChainParameter);
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chain.chainId }],
        });
        return true;
      } catch (addError) {
        console.error(addError);
        return false;
      }
    } else {
      return false;
    }
  }
};

export const signMessage = (msg: string, address: string): Promise<string> => {
  try {
    const provider = new ethers.providers.Web3Provider(checkWallet());
    const signer = provider.getSigner(address);
    return signer.signMessage(msg);
  } catch (error) {
    console.log("could not sign wallet message::", error);
    return Promise.resolve('');
  }
};

export const getNetworkName = async () => {
  const chainId = await getChainId();
  if (CHAIN_NAMES.ethereum.ids.includes(chainId)) {
    return CHAIN_NAMES.ethereum.name;
  }
  if (CHAIN_NAMES.polygon.ids.includes(chainId)) {
    return CHAIN_NAMES.polygon.name;
  }
  if (CHAIN_NAMES.op.ids.includes(chainId)) {
    return CHAIN_NAMES.op.name;
  }
};

/* events */

export const onConnect = (handle: (error: Error) => void): void => {
  try {
    const eth = checkWallet();
    eth.on('connect', handle);
  } catch (error) {
    /*  */
  }
};

export const onDisconnect = (handle: (error: Error) => void): void => {
  try {
    const eth = checkWallet();
    eth.on('disconnect', handle);
  } catch (error) {
    /*  */
  }
};

export const onMessage = (handler: (message: ProviderMessage) => void) => {
  try {
    const eth = checkWallet();
    eth.on('message', handler);
  } catch (error) {
    /*  */
  }
};

export const disconnectWallet = (
  // handler: (message: ProviderMessage) => void,
) => {
  try {
    const eth = checkWallet();
    eth.disconnect();
  } catch (error) {
    /*  */
  }
};
