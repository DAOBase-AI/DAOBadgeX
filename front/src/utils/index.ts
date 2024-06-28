import {
  BackNetworkType,
  FIXED_PRICE_OPTIONS_BY_NETWORK,
  NetworkType,
} from '@/constants';

import { NetworkByIdList, NetworkList } from '@/constants/networks';

import { notify } from '@kyvg/vue3-notification';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import numeral from 'numeral';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const claimPath: Record<string, string> = {
  nft_base: 'nft-base',
  token_base: 'token-base',
  fixed_price: 'fixed-price',
  bonding_curve: 'bonding-curve',
};
export const getClaimPath = (passType: string, name: string) => {
  return `/claim/${claimPath[passType]}?dao=${name}`;
};

export const isMobile = () => {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
  const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
  return isIOS || isAndroid;
};

export const isMobilePage = () => {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  );
  return flag;
};

export const isOkxMobile = () => {
  const ua = navigator.userAgent;
  const isOKApp = /OKApp/i.test(ua);
  return isMobile() && !isOKApp;
};

export const getClaimPathX = (passType: string, name: string) =>
  `/claim/${passType}?dao=${name}`;
export function formattedDate(milliseconds: number) {
  const date = new Date(milliseconds);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  const daySuffix = (() => {
    switch (day) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  })();

  return `${month} ${day}${daySuffix} ${hour}:${minute}`;
}
export function formattedDateFull(milliseconds: number) {
  const date = new Date(milliseconds);
  const year = date.getFullYear().toString();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  const daySuffix = (() => {
    switch (day) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  })();

  return `${month} ${day}${daySuffix},${year} ${hour}:${minute}`;
}
export const formatDate = (ms: number, text = 'YYYY-MM-DD') =>
  dayjs(new Date(ms)).format(text);

export const formatDateLong = (ms: number) =>
  dayjs(ms).format('YYYY-MM-DD HH:mm:ss');

export const formatUtcDateLong = (ms: number) =>
  dayjs.utc(ms).format('YYYY-MM-DD HH:mm:ssZ');

export const getOffsetTime = () => new Date().getTimezoneOffset() * 60 * 1000;

export const formatSquadDate = (ms: number) => dayjs(ms).format('MMM HH:mm:ss');

export const formatDateText = (ms: number) => {
  const now = Date.now();
  const prev = ms; /* + new Date().getTimezoneOffset() * 60000 */
  const x = (now - prev) / 1000;
  let y;
  if (x < 45) {
    y = 's';
  } else if (x < 90) {
    y = 'm';
  } else if (x < 45 * 60) {
    y = 'mm';
  } else if (x < 90 * 60) {
    y = 'hours';
  } else if (x < 22 * 60 * 60) {
    y = 'd';
  } else if (x < 36 * 60 * 60) {
    y = 'dd';
  } else if (x < 26 * 24 * 60 * 60) {
    y = 'M';
  } else if (x < 46 * 24 * 60 * 60) {
    y = 'MM';
  } else if (x < 11 * 30 * 24 * 60 * 60) {
    y = 'y';
  } else {
    y = 'yy';
  }
  return (dayjs(prev) as any).fromNow();
};

export const formatCurrentTime = ()  => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date();

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${month} ${day}th, ${year} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  return formattedDate;
}

export function getIpfsUrl(url: string) {
  const gateway = 'cloudflare-ipfs.com';
  return getUrl(url, gateway);
}
export function getUrl(uri: string, gateway: string) {
  const ipfsGateway = `https://${gateway}`;
  if (!uri) return null;
  if (
    !uri.startsWith('ipfs://') &&
    !uri.startsWith('ipns://') &&
    !uri.startsWith('https://') &&
    !uri.startsWith('http://')
  )
    return `${ipfsGateway}/ipfs/${uri}`;
  const uriScheme = uri.split('://')[0];
  if (uriScheme === 'ipfs')
    return uri.replace('ipfs://', `${ipfsGateway}/ipfs/`);
  if (uriScheme === 'ipns')
    return uri.replace('ipns://', `${ipfsGateway}/ipns/`);
  return uri;
}
export const getFixedTokenAddress = (
  tokenName: string,
  network: string,
): string => FIXED_PRICE_OPTIONS_BY_NETWORK(network)[tokenName].address;
export const getBackFixedTokenAddress = (
  tokenName: string,
  network: string,
): string =>
  FIXED_PRICE_OPTIONS_BY_NETWORK(BackNetworkType[network])[tokenName].address;
// roleId = 2 有3个状态 观众、游客、机器人

export const getNetworkText = (network: string) => {
  return NetworkType[network];
};

export const splitArray = (arr: any[], bit = 4): any[] => {
  const res = [];
  let i = 0;
  for (; i < arr.length; ) {
    res.push(arr.slice(i, Math.min((i += bit), arr.length)));
  }
  return res;
};

export const copyTx = (tx: string) => {
  copy(tx);
  notify({
    text: 'Copy Successfully.',
  });
};

export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

export const getUTCTime = (): Date =>
  new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000);

const ethMap = {
  address: 'address',
  tx: 'tx',
  token: 'token',
};
const flowMap: any = {
  address: 'account',
  tx: 'contract',
  token: 'contract',
};
function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}
export const toExploreAddress = (
  address: string,
  network: string,
  type = 'address',
) => {
  if (!network) {
    return;
  }
  const netwrk = network.toLocaleLowerCase();

  if (netwrk == 'kusama' || netwrk == 'polkadot' || netwrk == 'aptos') {
    window.open(
      `${
        (
          {
            polkadot: 'https://polkadot.subscan.io',
            kusama: 'https://kusama.subscan.io',
            aptos: 'https://apscan.io',
          } as any
        )[netwrk]
      }/${
        type === 'address' ? 'account' : netwrk == 'aptos' ? 'tx' : 'extrinsic'
      }/${address}`,
      '_blank',
    );
  } else if (netwrk !== 'tezos') {
    window.open(
      `${
        (
          {
            arbitrum: 'https://arbiscan.io',
            base: 'https://basescan.org',
            avalanche: 'https://snowtrace.io',
            solana: 'https://explorer.solana.com',
            algorand: 'https://algoexplorer.io',
            optimism: 'https://optimistic.etherscan.io',
            ethereum: 'https://etherscan.io',
            polygon: 'https://polygonscan.com',
            ronin: 'https://explorer.roninchain.com',
            flow: 'https://flowscan.org',
            gnosis: 'https://gnosisscan.io',
            bsc: 'https://bscscan.com/',
          } as any
        )[netwrk]
      }/${(netwrk == 'Flow' ? flowMap : ethMap)[type]}/${address}`,
      '_blank',
    );
  } else {
    console.log(address, isNumeric(address));
    if (isNumeric(address))
      window.open(`https://tzkt.io/transactions/${address}`);
    else
      window.open(
        `https://tzkt.io/${address}/${type == 'address' ? 'operations' : ''}`,
      );
  }
};

export const handleWalletError = (error: any) => {
  const text = error.code == 4001 ? 'Cancel Tx' : error.message;
  notify({
    type: 'error',
    text,
  });
};

export const delayTime = (time = 1000): Promise<any> =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

export const cutZero = (oldstr: string) => {
  let newstr: string = oldstr;
  const len: number = oldstr.length - oldstr.indexOf('.') - 1;
  if (oldstr.indexOf('.') > -1) {
    for (let i = len; i > 0; i--) {
      if (
        newstr.lastIndexOf('0') > -1 &&
        newstr.charAt(newstr.length - 1) == '0'
      ) {
        const k = newstr.lastIndexOf('0');
        if (newstr.charAt(k - 1) == '.') {
          return newstr.substring(0, k - 1);
        } else {
          newstr = newstr.substring(0, k);
        }
      } else {
        return newstr;
      }
    }
  }
  return oldstr;
};

export const formatNum = (num: number) => {
  if (num < 1000) {
    return num.toFixed(2);
  }
  if (1000 < num && num < 1000000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  if (1000000 < num && num < 1000000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (1000000000 < num && num < 1000000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  return (num / 1000000000000).toFixed(2) + 'T';
};

export const wrapperLink = (link: string): string => {
  if (!link || link == '/' || /^http|https/.test(link)) {
    return link;
  }

  if (link[0] == '/') {
    return `https://${link.substring(1)}`;
  } else {
    return `https://${link}`;
  }
};

export const formatAddress = (address: string, bit = 8) => {
  if (!address) {
    return '';
  }
  if (address.length < 2 + bit + 3 + bit) return address;
  return (
    address.substring(0, bit + 2) + '...' + address.slice(address.length - bit)
  );
};

export const fixedNum = (num: number, bit: number) =>
  new BigNumber(+num.toFixed(bit)).toFixed();

export const convertRgbaUrl = (byteImg: any[]) =>
  new Promise((resolve) => {
    console.log(byteImg);

    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;

    for (let row = 0; row < 100; row++) {
      const srow = 99 - row;
      const imageData = ctx.createImageData(100, 1);

      for (let i = 0; i < 400; i++) {
        imageData.data[i] = byteImg[srow * 400 + i];
      }

      ctx.putImageData(imageData, 0, row);
    }

    canvas.toBlob((x: any) => {
      resolve([URL.createObjectURL(new Blob([x], { type: 'image/jpeg' }))]);
    });
  });

export const localFloatNumber = (xnum: number, bit = 0, zero = true) => {
  const num = Math.abs(xnum);
  const intNum = Math.floor(num);
  const floatNum = num - intNum;
  return (
    (xnum < 0 ? '-' : '') +
    (intNum.toLocaleString() +
      (bit == 0
        ? ''
        : zero
        ? floatNum.toFixed(bit).substring(1)
        : new BigNumber(+floatNum.toFixed(bit)).toFixed().substring(1)))
  );
};

export const floatTokenPrice = (price: number) => {
  const num = Math.abs(price);
  if (num >= 1) {
    return localFloatNumber(price, 2);
  }

  if (num == 0) {
    return '0';
  }

  let weight = 0;
  let value = num;

  while (value < 1) {
    value *= 10;
    weight++;
  }

  return value < 0
    ? '-'
    : '' +
        '0.' +
        Array(Math.max(0, weight - 1))
          .fill(0)
          .join('') +
        (+value.toFixed(3)).toString().replace('.', '');
};

export const localeNumber = (xnum: number, bit = 0, zero = true) => {
  const num = Math.abs(xnum);
  if (xnum >= 1) {
    const intNum = Math.floor(num);
    const floatNum = num - intNum;
    return (
      (xnum < 0 ? '-' : '') +
      (intNum.toLocaleString() +
        (bit == 0
          ? ''
          : zero
          ? floatNum.toFixed(bit).substring(1)
          : new BigNumber(+floatNum.toFixed(bit)).toFixed().substring(1)))
    );
  }

  if (num == 0) {
    return '0';
  }

  let weight = 0;
  let value = num;

  while (value < 1) {
    value *= 10;
    weight++;
  }
  let currentIndex = 0;
  num.toFixed(currentIndex);
  while (Number(num.toFixed(currentIndex)) == 0) {
    currentIndex++;
  }
  currentIndex++;
  return value < 0 ? '-' : '' + num.toFixed(currentIndex);
};

export const suffixNum = (num: number) => {
  return num > 0 ? '+' + num : num;
};

export const formatPrice = (price: string, unit = '$', isNull = true) => {
  if (!+price && isNull) {
    return 'N/A';
  }
  return unit == '$'
    ? '$' + localeNumber(+price || 0, 3)
    : localeNumber(+price || 0, 3) + unit;
};
export const abbrv_num = (num: number, max = 1) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: max,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};
export const numeralNumber = (num: any) => {
  return num < 1000 && num.toString().indexOf('.') == -1
    ? num
    : numeral(num).format('0.0a').toUpperCase();
};

export const evlNumber = (num: number, prefix = '$', suffix = '') => {
  if (!num) {
    return 'N/A';
  }
  return `${prefix} ${numeralNumber(num)}`;
};

export const numeralNum = (num: numeral | string) => {
  const prev = num;

  const cur = +num;

  if (cur <= 1) {
    console.log(prev, cur);
    return num;
  }

  return numeralNumber(cur);
};

export const getRateColor = (rate: numeral | string) => {
  const num = +rate;
  if (num == 0) {
    return '#ffffff';
  }
  return num < 0 ? '#FF2640FF' : '#51D55BFF';
};

export const formatVal = (
  xnum: number,
  { bit = 0, zero = true, omit = false } = {},
) => {
  if (omit && +xnum > 1000) {
    return numeralNum(xnum);
  }

  const num = Math.abs(xnum);

  if (xnum >= 1) {
    const intNum = Math.floor(num);
    const floatNum = num - intNum;
    return (
      intNum.toLocaleString() +
      (bit == 0
        ? ''
        : zero
        ? floatNum.toFixed(bit).substring(1)
        : new BigNumber(+floatNum.toFixed(bit)).toFixed().substring(1))
    );
  }

  if (num == 0) {
    return '0';
  }

  let weight = 0;
  let value = num;

  while (value < 1) {
    value *= 10;
    weight++;
  }

  return (
    '0.' +
    Array(Math.max(0, weight - 1))
      .fill(0)
      .join('') +
    (+value.toFixed(3)).toString().replace('.', '')
  );
};

export const formatNumber = (num) => {
  if (Math.abs(num) >= 1e12) {
      return (num / 1e12).toFixed(1) + 'T';
  }
  if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
  }
  if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
  }
  if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toFixed(1);
}

export const CopyJson = (json: any) => JSON.parse(JSON.stringify(json));

export const getNftValuePath = (path: string) => {
  console.log(path);
  return `${process.env.VUE_APP_VAULT_PATH}#/${path}`;
};

export const getTwitterVerifyUrl = (
  name: string,
  twitter: string,
  path: string,
  taskId: string,
) => `/comeon/${name}/${twitter}?path=${path}?taskId=${taskId}`;

export const jumpTokenId = (
  tokenId: string,
  chain: string,
  address: string,
) => {
  window.open(
    chain == 'tezos'
      ? `https://objkt.com/asset/${address}/${tokenId}`
      : `https://opensea.io/assets/${chain.toLowerCase()}/${address}/${tokenId}`,
    '_blank',
  );
};

export const jumpSnapshot = (address: string) => {
  window.open(`https://snapshot.org/#/profile/${address}`, '_blank');
};
export const jumpSnapshotNetwork = (address: string, network: string) => {
  const networkObj = NetworkList.get(network) || NetworkByIdList.get(network);
  const link = networkObj?.url;
  if (link) {
    window.open(`${link}/block/${address}`, '_blank');
  } else {
    window.open(`https://polygonscan.com/block/${address}`, '_blank');
  }
  // if (network === '1') {
  //   window.open(`https://etherscan.io/block/${address}`, '_blank');
  // } else if (network === '10') {
  //   window.open(`https://optimistic.etherscan.io/block/${address}`, '_blank');
  // } else if (network === '56') {
  //   window.open(`https://www.bscscan.com/block/${address}`, '_blank');
  // } else if (network === '10') {
  //   window.open(`https://optimistic.etherscan.io/block/${address}`, '_blank');
  // } else if (network === '42161' || network === 'arbitrum') {
  //   window.open(`https://arbiscan.io/block/${address}`, '_blank');
  // } else {
  //   window.open(`https://polygonscan.com/block/${address}`, '_blank');
  // }
};
export const jumpBlockNo = (network: string, address: string) => {
  // console.log(network, address);
  const networkObj = NetworkList.get(network) || NetworkByIdList.get(network);
  const link = networkObj.url;
  window.open(`${link}/block/${address}`, '_blank');

  // if (network === 'ethereum') {
  //   window.open(`${link}/block/${address}`, '_blank');
  // } else if (network === 'matic') {
  //   window.open(`https://polygonscan.com/block/${address}`, '_blank');
  // } else if (network === 'gnosis') {
  //   window.open(`https://gnosisscan.io/block/${address}`, '_blank');
  // } else if (network === 'optimism') {
  //   window.open(`https://optimistic.etherscan.io/block/${address}`, '_blank');
  // } else if (network === 'arbitrum') {
  //   window.open(`https://arbiscan.io/block/${address}`, '_blank');
  // }
  // else {
  //   window.open(` https://tzkt.io/${address}/operations`, '_blank');
  // }
};
export const jumpTx = (network: string, address: string) => {
  // console.log(network, address);

  const networkObj = NetworkList.get(network) || NetworkByIdList.get(network);
  const link = networkObj.url;
  window.open(`${link}/tx/${address}`, '_blank');

  // if (network === 'ethereum') {
  //   window.open(`https://etherscan.io/tx/${address}`, '_blank');
  // } else if (network === 'matic') {
  //   window.open(`https://polygonscan.com/tx/${address}`, '_blank');
  // } else if (network === 'gnosis') {
  //   window.open(`https://gnosisscan.io/tx/${address}`, '_blank');
  // } else if (network === 'optimism') {
  //   window.open(`https://optimistic.etherscan.io/tx/${address}`, '_blank');
  // } else if (network === 'arbitrum') {
  //   window.open(`https://arbiscan.io/tx/${address}`, '_blank');
  // }

  // else {
  //   window.open(`https://tzkt.io/${address}`, '_blank');
  // }
};

export const fmoney = (s: number, n: number) => {
  // const nn = n <= 20 ? n : 2;
  var ss: any = parseFloat((s + '').replace(/[^\d\.-]/g, '')); //转换成字符串，过滤非数字、.号和负号
  ss = n > 0 ? ss.toFixed(n) + '' : ss + '';
  var num = ss.indexOf('.') > -1 ? ss.split('.')[0] : ss;
  var l = num.split('').reverse(),
    r = ss.indexOf('.') > -1 ? ss.split('.')[1] : '';
  var t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  var res = t.split('').reverse().join('');
  return r ? res + '.' + r : res;
};

export const formatPercentage = (num: number) => {
  return Number.isInteger(num) ? num : num.toFixed(2);
};
