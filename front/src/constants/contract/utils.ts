import { utils } from 'ethers';
import BigNumber from 'bignumber.js';

export const isZeroAddress = (address: string): boolean => {
  if (!utils.isAddress(address)) {
    throw new Error('Invalid Address');
  }
  return utils.hexValue(address) === '0x0';
};

export const clearDecimals = (
  amount: string,
  decimals: number | string,
): string =>
  new BigNumber(amount)
    .dividedBy(new BigNumber('10').pow(new BigNumber(decimals)))
    .toString();

export const addDeciamls = (amount: string, decimals: number): string =>
  new BigNumber(amount)
    .multipliedBy(new BigNumber('10').pow(new BigNumber(decimals)))
    .toString();
