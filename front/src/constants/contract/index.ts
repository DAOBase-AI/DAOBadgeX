import {
  FACTORY_ADDRESS,
  BONDING_CURVE_FACTORY_ADDRESS,
  BONDING_CURVE_OPTIONS_BY_NETWORK,
  FREEMINT_FACTORY_ADDRESS,
  FP_WHITELIST_FACTORY_ADDRESS,
} from './../index';
import {
  checkWallet,
  getAccounts,
  getChainId,
  getNetworkName,
} from './../../utils/wallet';
import { Contract, ethers, utils } from 'ethers';
import ERC20 from './ERC20.json';
import ERC721 from './ERC721.json';
import BondingFactory from './BondingFactory.json';
import Factory from './Factory.json';
import FreeMintFactory from './FreeMint.json';
import FixedPrice from './FixedPrice.json';
import TokenBase from './TokenBase.json';
import NFTBase from './NFTBase.json';
import MintBadge from './Badge.json';
import BondingCurve from './Curve.json';
import FpWhitelistFactory from './FpWhitelistFactory.json';
import FpWhitelist from './FpWhitelist.json';
import BigNumber from 'bignumber.js';
import { getFpWhiteReceiver, getFreeMintReceiver } from '@/api/dao';

export const stringToBytes32 = (str: string) => {
  return ethers.utils.formatBytes32String(str);
};

export const isZeroAddressX = (address: string) => {
  console.log(address, utils.hexValue(address));
  return utils.hexValue(address) === '0x0';
};

export const isZeroAddress = (address: string): boolean => {
  if (!utils.isAddress(address)) {
    throw new Error('Invalid Address');
  }
  return utils.hexValue(address) === '0x0';
};

export const clearDecimals = (amount: string, decimals: number) =>
  new BigNumber(amount)
    .dividedBy(new BigNumber('10').pow(new BigNumber(decimals)))
    .toString();

export const addDeciamls = (amount: string, decimals: number) =>
  new BigNumber(amount)
    .multipliedBy(new BigNumber('10').pow(new BigNumber(decimals)))
    .toFixed(0);

export const getProvider = () =>
  new ethers.providers.Web3Provider(checkWallet());
export const getSigner = () => getProvider().getSigner();
export const getSingerAddr = () => getSigner().getAddress();

export const erc20Contract = (address: string): Contract => {
  const provider = new ethers.providers.Web3Provider(checkWallet());
  return new ethers.Contract(address, ERC20.abi, provider.getSigner());
};

export const erc721Contract = (address: string): Contract => {
  const provider = new ethers.providers.Web3Provider(checkWallet());
  return new ethers.Contract(address, ERC721.abi, provider.getSigner());
};

export const mintBadgeContract = (address: string): Contract => {
  const provider = new ethers.providers.Web3Provider(checkWallet());
  return new ethers.Contract(address, MintBadge.abi, provider.getSigner());
};

export const delegateDaoContract = (address: string, contractAbi: string): Contract => {
  const provider = new ethers.providers.Web3Provider(checkWallet());
  return new ethers.Contract(address, contractAbi, provider.getSigner());
};

export const factoryContract = (address: string) => {
  // const provider = new ethers.providers.Web3Provider(checkWallet());
  // const accounts = await getAccounts();
  return new ethers.Contract(address, Factory.abi, getSigner());
};
export const factoryBondContract = (address: string): Contract =>
  new ethers.Contract(address, BondingFactory.abi, getSigner());
export const factoryFreeMintContract = (address: string): Contract =>
  new ethers.Contract(address, FreeMintFactory.abi, getSigner());
export const factoryFpWhitelistContract = (address: string): Contract =>
  new ethers.Contract(address, FpWhitelistFactory.abi, getSigner());

export const fixedPriceContract = (address: string): Contract =>
  new ethers.Contract(address, FixedPrice.abi, getSigner());
export const wlFixedPriceContract = (address: string): Contract =>
  new ethers.Contract(address, FpWhitelist.abi, getSigner());
export const tokenBaseContract = (address: string): Contract =>
  new ethers.Contract(address, TokenBase.abi, getSigner());
export const nftBaseContract = (address: string): Contract =>
  new ethers.Contract(address, NFTBase.abi, getSigner());
export const bondingCurveContract = (address: string): Contract =>
  new ethers.Contract(address, BondingCurve.abi, getSigner());

// supportsInterface(0x80ac58cd)
export const getErcType = async (address: string): Promise<string> => {
  try {
    const erc20 = erc20Contract(address);
    const res = (await erc20.decimals()) ? 'ERC20' : 'ERC721';
    return res;
  } catch (error) {
    return 'ERC721';
  }
};

export const getDecimals = async (address: string) => {
  if (isZeroAddress(address)) {
    return 18;
  }
  try {
    const erc20 = erc20Contract(address);
    return erc20.decimals();
  } catch (error) {
    return 0;
  }
};

export const balanceOfBadge = async (address: string, userAddress: string): Promise<number> => {
  try {
    const mintBadge = mintBadgeContract(address);
    const nftBalance = await mintBadge.balanceOf(userAddress);
    return nftBalance.toNumber();
  } catch (error) {
    console.error("getMintBadge Num error::", error);
    return 0;
  }
};

export const mintBadge = async (address: string) => {
  try {
    const mintBadge = mintBadgeContract(address);
    return mintBadge.safeMint();
  } catch (error) {
    return 0;
  }
};

export const delegateDao = async (address: string,  contractAbi: string) => {
  try {
    const delegateDao = delegateDaoContract(address, contractAbi);
    return delegateDao.delegate();
  } catch (error) {
    return 0;
  }
};

export const getBalance = async (
  address: string,
  who?: string,
): Promise<any> => {
  const erc20 = erc20Contract(address);
  const res = await erc20.balanceOf(who || getSingerAddr());
  return res;
};

export const isApprove = async (address: string, who: string): Promise<any> => {
  const erc20 = erc20Contract(address);
  const allowance = (await erc20.allowance(getSingerAddr(), who)).toString();
  const balance = (await getBalance(address)).toString();
  console.log(address, allowance, balance);
  return new BigNumber(allowance).gte(new BigNumber(balance)) && balance != 0;
};

export const approve = async (
  address: string,
  contract: string,
  onEvent: any,
): Promise<any> => {
  const erc20 = erc20Contract(address);
  const balance = await getBalance(address);
  const tx = await erc20.approve(contract, ethers.constants.MaxUint256);
  tx.wait().then(onEvent);
  return tx;
};

export const isApproveNFT = async (
  erc721Addr: string,
  spender: string,
): Promise<any> => {
  const erc721 = erc721Contract(erc721Addr);
  return erc721.isApprovedForAll(getSingerAddr(), spender);
};

export const approveNFT = async (
  address: string,
  contract: string,
  onEvent: any,
): Promise<any> => {
  const erc721 = erc721Contract(address);
  const tx = await erc721.setApprovalForAll(contract, true);
  tx.wait().then(onEvent);
  return tx;
};

export const buyNftBase = async (
  address: string,
  tokenId: string,
  onEvent: any,
) => {
  const nftBase = nftBaseContract(address);
  const tx = await nftBase.mint(tokenId);
  tx.wait().then(onEvent);
};

export const sellNftBase = async (
  address: string,
  tokenId: string,
  onEvent: any,
) => {
  const nftBase = nftBaseContract(address);
  const tx = await nftBase.burn(tokenId);
  tx.wait().then(onEvent);
};

export const buyTokenBase = async (address: string, onEvent: any) => {
  const tokenBase = tokenBaseContract(address);
  const tx = await tokenBase.mint();
  tx.wait().then(onEvent);
};
export const sellTokenBase = async (
  address: string,
  tokenId: any,
  onEvent: any,
) => {
  const tokenBase = tokenBaseContract(address);
  const tx = await tokenBase.burn(tokenId);
  tx.wait().then(onEvent);
};

export const buyFixedPrice = async (
  address: string,
  tokenName: string,
  num: string,
  onEvent: any,
) => {
  const fixedPrice = fixedPriceContract(address);
  let tx;
  if (['ETH', 'MATIC'].includes(tokenName)) {
    tx = await fixedPrice.mintEth({ value: addDeciamls(num, 18) });
  } else {
    tx = await fixedPrice.mint();
  }
  tx.wait().then(onEvent);
};

export const buyWlFixedPrice = async (
  adddress: string,
  tokenName: string,
  num: string,
  onEvent: any,
) => {
  const contract = wlFixedPriceContract(adddress);
  let tx;
  if (['ETH', 'MATIC'].includes(tokenName)) {
    tx = await contract.mintEth({ value: addDeciamls(num, 18) });
  } else {
    tx = await contract.mint();
  }
  tx.wait().then(onEvent);
};

export const addFpWl = async (
  address: string,
  account: string,
  onEvent: any,
) => {
  const contract = wlFixedPriceContract(address);
  const tx = await contract.addWhite([account]);
  tx.wait().then(onEvent);
};

export const delFpWl = async (
  address: string,
  account: string,
  onEvent: any,
) => {
  const contract = wlFixedPriceContract(address);
  const tx = await contract.delWhite([account]);
  tx.wait().then(onEvent);
};

export const buyBondingCurve = async (
  address: string,
  tokenAddress: string,
  passAmount: string,
  canReceiveCost: string,
  firstPrice: string,
  onEvent: any,
): Promise<any> => {
  const bondingCurve = bondingCurveContract(address);

  let tx;

  if (isZeroAddress(tokenAddress)) {
    tx = await bondingCurve['mintEth(uint256,uint256)'](
      passAmount,
      addDeciamls(firstPrice, 18),
      {
        value: addDeciamls(canReceiveCost, 18),
      },
    );
  } else {
    const decimals = await getDecimals(tokenAddress);

    tx = await bondingCurve['mint(uint256,uint256,uint256)'](
      passAmount,
      addDeciamls(canReceiveCost, decimals),
      addDeciamls(firstPrice, decimals),
      // {
      //   gasLimit: '300000',
      // },
    );
  }

  tx.wait().then(onEvent);
};

export const sellBondingCurve = async (
  address: string,
  tokenAddress: string,
  tokenIds: string[],
  balances: string[],
  onEvent: any,
): Promise<any> => {
  const bondingCurve = bondingCurveContract(address);

  const singerAddr = await getSingerAddr();

  const tx =
    tokenIds.length > 1
      ? await bondingCurve[
          isZeroAddress(tokenAddress)
            ? 'burnBatchETH(address,uint256[],uint256[])'
            : 'burnBatch(address,uint256[],uint256[])'
        ](singerAddr, tokenIds, balances)
      : await bondingCurve[
          isZeroAddress(tokenAddress)
            ? 'burnEth(address,uint256,uint256)'
            : 'burn(address,uint256,uint256)'
        ](singerAddr, tokenIds[0], balances[0]);

  tx.wait().then(onEvent);
};

export const getCreatorProfit = async (address: string, token: string) => {
  console.log(address, token);
  const bondingCurve = bondingCurveContract(address);
  return clearDecimals(
    await bondingCurve.totalCreatorProfit({ gasLimit: 30000000 }),
    await getDecimals(token),
  );
};

export const withdrawFixedPrice = async (address: string, onEvent: any) => {
  const fixedPrice = fixedPriceContract(address);
  const tx = await fixedPrice.withdraw();
  tx.wait().then(onEvent);
  return tx;
};

export const withdrawBondingCurve = async (address: string, onEvent: any) => {
  const bondingCurve = bondingCurveContract(address);
  const tx = await bondingCurve.withdraw();
  tx.wait().then(onEvent);
  return tx;
};

export const getBondInfo = async (
  address: string,
  tokenName: string,
  // network: string,
): Promise<any> => {
  const network = await getNetworkName();
  const bondingCurve = bondingCurveContract(address);
  const tokenAddress =
    BONDING_CURVE_OPTIONS_BY_NETWORK(network)[tokenName].address;
  const decimals = isZeroAddress(tokenAddress)
    ? 18
    : await getDecimals(tokenAddress);
  const res = await Promise.all([
    bondingCurve.getCurrentCostToMint(1),
    bondingCurve.reserve(),
    bondingCurve.getCurrentSupply(),
  ]);

  return res.map((val, i) => {
    if (i == 2) {
      return val.toString();
    }
    return new BigNumber(val.toString())
      .dividedBy(new BigNumber('10').pow(decimals))
      .toString();
  });
};

export const getMaximumCost = async (
  address: string,
  amount: string,
  decimals: number,
): Promise<string> => {
  // TODO 操作...
  const bondingCurve = bondingCurveContract(address);
  const cost = await bondingCurve.getCurrentCostToMint(amount);
  return new BigNumber(cost.toString())
    .dividedBy(new BigNumber('10').pow(decimals))
    .toString();
};

export const getTokenBalance = async (
  address: string,
  who?: string,
): Promise<string> => {
  console.log(address, who);
  if (isZeroAddress(address)) {
    return clearDecimals((await getSigner().getBalance()).toString(), 18);
  }
  return clearDecimals(
    (await getBalance(address, who)).toString(),
    await getDecimals(address),
  );
};

// TODO batch burn
// export const sellBondingCurve = async (address: string) => {
//   const bondingCurve = bondingCurveContract(address);
// };

// export const getBcAddress = (): string => {
//   const network = getNetworkName();
//   return BONDING_CURVE_FACTORY_ADDRESS[network];
// };

// export const getFpAddress = (): string => {
//   const network = getNetworkName();
//   return FACTORY_ADDRESS[network];
// };

export const getFactoryContract = async (passType: string) => {
  const network = await getNetworkName();

  if (passType === 'bonding_curve') {
    return factoryBondContract(BONDING_CURVE_FACTORY_ADDRESS[network]);
  }
  // if (isFreeMint) {
  //   return factoryFreeMintContract(FREEMINT_FACTORY_ADDRESS[network]);
  // }

  // if (isFpWhitelist) {
  //   return factoryFpWhitelistContract(FP_WHITELIST_FACTORY_ADDRESS[network]);
  // }

  return factoryContract(FACTORY_ADDRESS[network]);
};

const getUri = (name: string, daoName: string) =>
  `${process.env.VUE_APP_BASEURI}/${name.replace(/ /g, '-')}/`;

/*
  新增控制参数
    - repeatMintNum
        默认大于0
    - mintDeadlineTime
        自定义 mint 截止时间，参数等于0代表不开启截止时间，大于0代表开启截止时间 以秒为单位
    - isNotWhitelist
        是否开启白名单机制 false/true
 */

export const getFactoryMethods = async (
  type: string,
  tokenType: string,
): Promise<any> => {
  const network = await getNetworkName();
  const contract = await getFactoryContract(type);
  if (type === 'staking_based') {
    if (tokenType === 'ERC721') {
      return async ({
        name,
        symbol,
        daoName = 'test',
        address = '0xc2d6b32e533e7a8da404abb13790a5a2f606ad75',
        repeatMintNum,
        mintDeadlineTime,
        isNotWhitelist,
      }: any) => {
        // @ts-ignore
        return contract.newNftBaseDeploy(
          address,
          ethers.constants.AddressZero,
          new utils.AbiCoder().encode(
            [
              'uint256',
              'uint256',
              'bool',
              'address',
              'string',
              'string',
              'string',
            ],
            [
              repeatMintNum ? repeatMintNum : ethers.constants.MaxUint256,
              mintDeadlineTime
                ? Math.round(
                    (mintDeadlineTime -
                      new Date().getTimezoneOffset() * 60000) /
                      1000,
                  )
                : 0,
              isNotWhitelist,
              await getFpWhiteReceiver(),
              name,
              symbol,
              getUri(name, daoName),
            ],
          ),
        );
      };
    }

    if (tokenType === 'ERC20') {
      return async ({
        name,
        symbol,
        daoName,
        address,
        num,
        repeatMintNum,
        mintDeadlineTime,
        isNotWhitelist,
      }: any) => {
        const decimals = await getDecimals(address);

        // @ts-ignore
        return contract.newTokenBaseDeploy(
          address,
          (num * Math.pow(10, decimals)).toString(),
          ethers.constants.AddressZero,
          new utils.AbiCoder().encode(
            [
              'uint256',
              'uint256',
              'bool',
              'address',
              'string',
              'string',
              'string',
            ],
            [
              repeatMintNum ? repeatMintNum : ethers.constants.MaxUint256,
              mintDeadlineTime
                ? Math.round(
                    (mintDeadlineTime -
                      new Date().getTimezoneOffset() * 60000) /
                      1000,
                  )
                : 0,
              isNotWhitelist,
              await getFpWhiteReceiver(),
              name,
              symbol,
              getUri(name, daoName),
            ],
          ),
        );
      };
    }
  }

  if (type === 'fixed_price')
    return async ({
      name,
      symbol,
      daoName = 'test',
      receiveAddress,
      receivingAddress,
      quantity,
      payment,
      validityType,
      certainTime,
      repeatMintNum,
      mintDeadlineTime,
      isNotWhitelist,
    }: any) => {
      const decimals = await getDecimals(receiveAddress);
      const paymentx = new BigNumber(payment)
        .multipliedBy(new BigNumber('10').pow(new BigNumber(decimals)))
        .toString();

      const receriverAddress = receivingAddress || (await getSingerAddr());

      /* certain_time can't empty! */
      if (validityType == 'certain_time' && certainTime) {
        // @ts-ignore
        return contract.newFixedPeriodDeploy(
          receiveAddress,
          receriverAddress,
          paymentx,
          (Date.now() / 1000).toFixed(),
          (certainTime / 1000).toFixed(),
          quantity || ethers.constants.MaxUint256,
          ethers.constants.AddressZero,
          new utils.AbiCoder().encode(
            [
              'uint256',
              'uint256',
              'bool',
              'address',
              'string',
              'string',
              'string',
            ],
            [
              repeatMintNum ? repeatMintNum : ethers.constants.MaxUint256,
              mintDeadlineTime
                ? Math.round(
                    (mintDeadlineTime -
                      new Date().getTimezoneOffset() * 60000) /
                      1000,
                  )
                : 0,
              isNotWhitelist,
              await getFpWhiteReceiver(),
              name,
              symbol,
              getUri(name, daoName),
            ],
          ),
        );
      } else {
        // @ts-ignore
        return contract.newFixedPriceDeploy(
          receiveAddress,
          receriverAddress,
          paymentx,
          quantity || ethers.constants.MaxUint256,
          ethers.constants.AddressZero,
          new utils.AbiCoder().encode(
            [
              'uint256',
              'uint256',
              'bool',
              'address',
              'string',
              'string',
              'string',
            ],
            [
              repeatMintNum ? repeatMintNum : ethers.constants.MaxUint256,
              mintDeadlineTime
                ? Math.round(
                    (mintDeadlineTime -
                      new Date().getTimezoneOffset() * 60000) /
                      1000,
                  )
                : 0,
              isNotWhitelist,
              await getFpWhiteReceiver(),
              name,
              symbol,
              getUri(name, daoName),
            ],
          ),
        );
      }
    };

  return async ({
    bond_receiver_addr,
    bond_rate,
    bond_init_price,
    bond_token,
    bond_m = '0.000001',
    bond_n = '2',
    bond_d = '1',
    name,
    symbol,
    daoName = 'test',
  }: any) => {
    const address =
      BONDING_CURVE_OPTIONS_BY_NETWORK(network)[bond_token].address;
    const decimals = await getDecimals(address);
    const base = new BigNumber('10').pow(new BigNumber(decimals));
    // const rate = new BigNumber(bond_rate).multipliedBy(base).toString();
    const m = new BigNumber(bond_m).multipliedBy(base).toString();
    /* n 只能是整数 */
    // const n = new BigNumber(bond_n).multipliedBy(base).toString();
    const price = new BigNumber(bond_init_price).multipliedBy(base).toString();

    let d = 1;
    let n = bond_n * d;

    // n = bond_n * d

    while (Math.floor(d * bond_n) != n) {
      d *= 10;
      n = bond_n * d;
    }

    console.log(
      name,
      symbol,
      bond_receiver_addr,
      bond_rate,
      price,
      BONDING_CURVE_OPTIONS_BY_NETWORK(network)[bond_token].address,
      m,
      n,
      d,
      getUri(name, daoName),
      ethers.constants.AddressZero,
    );

    // @ts-ignore
    return contract.createCurve(
      name,
      symbol,
      bond_receiver_addr,
      bond_rate,
      price,
      BONDING_CURVE_OPTIONS_BY_NETWORK(network)[bond_token].address,
      m,
      n + '',
      d + '',
      getUri(name, daoName),
      ethers.constants.AddressZero,
    );
  };
};

// getFactoryMethods('bonding_curve', 'Ethereum', '', '').then((fn) =>
//   fn({
//     bond_receiver_addr: '0x565AbEF1C79216663C982C2AEFd0ba94F22ffD7e',
//     bond_rate: 2,
//     bond_init_price: '0.01',
//     bond_token: 'USDC',
//     bond_m: '0.000001',
//     bond_n: '2',
//     bond_d: '1',
//     name: 'xx',
//     symbol: 'xx',
//     daoName: 'test',
//   }),
// );

export const getTokeninfo = async (
  tokenAddress: string,
  tokenType: string,
): Promise<any> => {
  const is721 = tokenType == 'ERC721';
  const token = is721
    ? erc721Contract(tokenAddress)
    : erc20Contract(tokenAddress);

  if (is721 && (await getDecimals(tokenAddress))) {
    throw new Error('Invalid address');
  }

  const symbol = await token.symbol();
  const name = await token.name();
  const decimals = is721 ? '-' : await getDecimals(tokenAddress);
  const totalSupply = is721
    ? '∞'
    : clearDecimals((await token.totalSupply()).toString(), decimals as number);

  return {
    address: tokenAddress,
    name,
    symbol,
    decimals,
    tokenType,
    totalSupply,
  };
};

console.log(
  new ethers.utils.AbiCoder().decode(
    ['uint256', 'uint256', 'bool', 'address', 'string', 'string', 'string'],
    '0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a12aa229165a1ace6b19649dcde8fe102358132400000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000044d4f4e410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044d4f4e4100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002168747470733a2f2f746865706173732e746f2f6d657461646174612f4d4f4e412f00000000000000000000000000000000000000000000000000000000000000',
  ),
);
