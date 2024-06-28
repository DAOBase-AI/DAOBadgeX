import { Contract, ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import {
  BONDING_CURVE_FACTORY_ADDRESS,
  BONDING_CURVE_OPTIONS_BY_NETWORK,
  chains,
  FACTORY_ADDRESS,
} from '../index';

import ERC20 from './ERC20.json';
import ERC721 from './ERC721.json';
import BondingFactory from './BondingFactory.json';
import Factory from './Factory.json';
import FixedPrice from './FixedPrice.json';
import FixedPriceWhitelist from './FpWhitelist.json';
import TokenBase from './TokenBase.json';
import NFTBase from './NFTBase.json';
import BondingCurve from './Curve.json';

import { isZeroAddress, clearDecimals } from './utils';
import { getFactoryContract, getSingerAddr } from '.';

const getRpcUrl = (network: string) => {
  return chains[network].rpcUrls[0];
};

const providerMap: any = {};
Object.keys(chains).forEach((chain) => {
  providerMap[chain] = new ethers.providers.StaticJsonRpcProvider(
    getRpcUrl(chain),
    ethers.providers.StaticJsonRpcProvider.getNetwork(+chains[chain].chainId),
  );
});

const getProvider = (network: string) => providerMap[network];

export const erc20Contract = (address: string, network: string): Contract =>
  new ethers.Contract(address, ERC20.abi, getProvider(network));

export const erc721Contract = (address: string, network: string): Contract => {
  return new ethers.Contract(address, ERC721.abi, getProvider(network));
};

export const factoryContract = (address: string, network: string): Contract =>
  new ethers.Contract(address, Factory.abi, getProvider(network));

export const factoryBondContract = (
  address: string,
  network: string,
): Contract =>
  new ethers.Contract(address, BondingFactory.abi, getProvider(network));

export const fixedPriceContract = (
  address: string,
  network: string,
): Contract =>
  new ethers.Contract(address, FixedPrice.abi, getProvider(network));

export const fpWlContract = (address: string, network: string): Contract =>
  new ethers.Contract(address, FixedPriceWhitelist.abi, getProvider(network));

export const tokenBaseContract = (address: string, network: string): Contract =>
  new ethers.Contract(address, TokenBase.abi, getProvider(network));

export const nftBaseContract = (address: string, network: string): Contract =>
  new ethers.Contract(address, NFTBase.abi, getProvider(network));

export const bondingCurveContract = (
  address: string,
  network: string,
): Contract =>
  new ethers.Contract(address, BondingCurve.abi, getProvider(network));

/* 
    Get Token Type
   */
export const getErcType = async (
  address: string,
  network: string,
): Promise<string> => {
  try {
    const erc20 = erc20Contract(address, network);
    const res = (await erc20.decimals()) ? 'ERC20' : 'ERC721';
    return res;
  } catch (error) {
    return 'ERC721';
  }
};

/* 
    Get Token Decimals
 */
export const getDecimals = async (
  address: string,
  network: string,
): Promise<number> => {
  if (isZeroAddress(address)) {
    return 18;
  }
  try {
    const erc20 = erc20Contract(address, network);
    const x = await erc20.decimals();
    return x;
  } catch (error) {
    return 0;
  }
};

/* 
    Get Token Balance
 */
export const getBalance = async (
  address: string,
  who: string,
  network: string,
): Promise<string> => {
  try {
    let res;
    if (isZeroAddress(address)) {
      res = await getProvider(network).getBalance(who);
    } else {
      const erc20 = erc20Contract(address, network);
      res = await erc20.balanceOf(who);
    }
    return res.toString();
  } catch (error) {
    return '0';
  }
};

export const getBalanceClear = async (
  address: string,
  owner: string,
  network: string,
): Promise<string> =>
  clearDecimals(
    await getBalance(address, owner, network),
    await getDecimals(address, network),
  );

/* Approved */
export const isApproved = async (
  address: string,
  owner: string,
  spender: string,
  network: string,
): Promise<boolean> => {
  if (isZeroAddress(address)) {
    return true;
  }

  const erc20 = erc20Contract(address, network);
  const allowance = (await erc20.allowance(owner, spender)).toString();
  const balance = await getBalance(address, owner, network);
  return new BigNumber(allowance).gte(new BigNumber(balance));
};

/* NFT-Approved */
export const isApproveNFT = async (
  erc721Addr: string,
  owner: string,
  spender: string,
  network: string,
): Promise<any> => {
  const erc721 = erc721Contract(erc721Addr, network);
  return erc721.isApprovedForAll(owner, spender);
};

/* 
    Get Creator Profit
 */
export const getCreatorProfit = async (
  address: string,
  token: string,
  network: string,
): Promise<string> => {
  const bondingCurve = bondingCurveContract(address, network);
  return clearDecimals(
    await bondingCurve.totalCreatorProfit(),
    await getDecimals(token, network),
  );
};

export const getTokeninfo = async (
  tokenAddress: string,
  tokenType: string,
  network: string,
): Promise<any> => {
  const is721 = tokenType == 'ERC721';
  const token = is721
    ? erc721Contract(tokenAddress, network)
    : erc20Contract(tokenAddress, network);

  const decimalsx = await getDecimals(tokenAddress, network);

  console.log(is721 && !decimalsx);
  console.log(!is721 && decimalsx);

  if ((is721 && decimalsx) || (!is721 && !decimalsx)) {
    throw new Error('Invalid address');
  }

  const symbol = await token.symbol();
  const name = await token.name();
  const decimals = is721 ? '-' : decimalsx;
  const totalSupply = is721
    ? '∞'
    : clearDecimals((await token.totalSupply()).toString(), decimals);

  return {
    address: tokenAddress,
    tokenType,
    name,
    symbol,
    decimals,
    totalSupply,
  };
};

export const getBondInfo = async (
  address: string,
  tokenName: string,
  network: string,
): Promise<any> => {
  const bondingCurve = bondingCurveContract(address, network);
  const tokenAddress =
    BONDING_CURVE_OPTIONS_BY_NETWORK(network)[tokenName].address;
  const decimals = await getDecimals(tokenAddress, network);

  const res = await Promise.all([
    bondingCurve.getCurrentCostToMint(1),
    bondingCurve.reserve(),
    bondingCurve.getCurrentSupply(),
  ]);

  return res.map((val, i) => {
    if (i == 2) {
      return val;
    }
    return new BigNumber(val.toString())
      .dividedBy(new BigNumber('10').pow(decimals))
      .toString();
  });
};

export const getBcReserve = async (
  address: string,
  network: string,
): Promise<string> => {
  const bondingCurve = bondingCurveContract(address, network);
  const res = (await bondingCurve.reserve()).toString();
  return res;
};

export const getMaximumCost = async (
  address: string,
  amount: string,
  decimals: number,
  network: string,
): Promise<string> => {
  const bondingCurve = bondingCurveContract(address, network);
  const cost = await bondingCurve.getCurrentCostToMint(amount);
  return new BigNumber(cost.toString())
    .dividedBy(new BigNumber('10').pow(decimals))
    .toString();
};

export const getBurnCost = async (
  address: string,
  amount: string,
  decimals: number,
  network: string,
): Promise<string> => {
  const bondingCurve = bondingCurveContract(address, network);
  const cost = await bondingCurve.getCurrentReturnToBurn(amount);
  return new BigNumber(cost.toString())
    .dividedBy(new BigNumber('10').pow(decimals))
    .toString();
};

export const getTokenBalance = async (
  address: string,
  owner: string,
  network: string,
): Promise<string> => {
  return clearDecimals(
    await getBalance(address, owner, network),
    await getDecimals(address, network),
  );
};

export const getFpPlatformFee = async (network: string): Promise<string> => {
  const contract = factoryContract(FACTORY_ADDRESS[network], network);
  return (await contract.platformRate()).toString();
};

export const getBcPlatformFee = async (network: string): Promise<string> => {
  const contract = factoryBondContract(
    BONDING_CURVE_FACTORY_ADDRESS[network],
    network,
  );
  return (await contract.platformRate()).toString();
};

export const getMaticBcValue = (address: string) => {
  const contract = bondingCurveContract(address, 'Polygon');
  return contract.getCreatorProfits();
};

export const getMaticBcAaveValue = (address: string) => {
  const contract = bondingCurveContract(address, 'Polygon');
  return contract.getRewardsBalance();
};

export const isFpWhitelist = (address: string, network: string) => {
  const contract = fpWlContract(address, network);
  return contract.isWhite(getSingerAddr());
};

export const fpWhitelistMintedNum = (address: string, network: string) => {
  const contract = fpWlContract(address, network);
  return contract.mintNumber(getSingerAddr());
};

export const getFpCertainTimePrice = async (
  address: string,
  network: string,
  bit: number,
) => {
  const contract = fixedPriceContract(address, network);
  let x;
  try {
    x = await contract.getCurrentCostToMint();
  } catch (error) {
    x = 0;
  }

  return new BigNumber(x.toString())
    .dividedBy(new BigNumber(1 + Array(bit).fill(0).join('')))
    .toString();
};
