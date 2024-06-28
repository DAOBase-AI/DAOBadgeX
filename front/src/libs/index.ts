import { BigNumber } from 'ethers';
import dayjs from 'dayjs';
import CryptoJs from 'crypto-js';

export function fromFloat2Integer(data: string, decimals: number): string {
  const strs: string[] = data.split('.');
  const integer = BigNumber.from(10).pow(decimals).mul(strs[0]);
  const decimal = !strs[1]
    ? 0
    : strs[1].length > decimals
    ? strs[1].slice(0, decimals)
    : strs[1].concat('0'.repeat(decimals - strs[1].length));
  return integer.add(decimal).toString();
}

export function fromInteger2Float(data: string, decimals: number): string {
  const len = data.length;
  const integer = len > decimals ? data.slice(0, len - decimals) : 0;
  const decimal =
    len > decimals
      ? data.slice(len - decimals, len)
      : '0'.repeat(decimals - len).concat(data);
  return `${integer}${!decimal.match(/^0+$/) ? `.${decimal}` : ''}`;
}

export function computeFees(
  principal: string,
  rate: number,
  compound: number,
): string {
  let fee: string;
  const principalBN = BigNumber.from(principal);

  switch (compound) {
    case 2:
      fee = principalBN.sub(principalBN.mul(1000 - rate).div(1000)).toString();
      break;
    case 3:
      fee = principalBN
        .sub(
          principalBN
            .mul(1000 - rate)
            .div(1000)
            .mul(1000 - rate)
            .div(1000),
        )
        .toString();
      break;
    case 4:
      fee = principalBN
        .sub(
          principalBN
            .mul(1000 - rate)
            .div(1000)
            .mul(1000 - rate)
            .div(1000)
            .mul(1000 - rate)
            .div(1000),
        )
        .toString();
      break;
    default:
      throw new Error(
        'computeFees: compound must be less than 5 and more than 1',
      );
  }
  return fee;
}

export function add(x: string, y: string): string {
  return BigNumber.from(x).add(BigNumber.from(y)).toString();
}

export function compare(x: string, y: string): number {
  if (BigNumber.from(x).gt(BigNumber.from(y))) {
    return 1;
  } else if (BigNumber.from(x).eq(BigNumber.from(y))) {
    return 0;
  } else if (BigNumber.from(x).lt(BigNumber.from(y))) {
    return -1;
  } else {
    return -100;
  }
}

export function fixTo8(input: string): string {
  const float = parseFloat(input);
  return float.toFixed(8).toString();
}

export function fixTo2(input: string): string {
  const float = parseFloat(input);
  return float.toFixed(2).toString();
}

export function random10(input: string): string {
  const float = parseFloat(input);
  const random: number = Math.random();
  if (random > 0.5) {
    return (float + float * random * 0.1).toString();
  } else {
    return (float - float * random * 0.1).toString();
  }
}

export function date2String(timestamp: number): string {
  return dayjs(new Date(timestamp * 1000)).format('YYYY-MM-DD');
}

// the amount is the total amount minted, current supply is the current total supply of
export function bondingCurve(
  amount: number,
  currentSupply: number,
  startPrice: number,
): number {
  const divider = currentSupply.toString().length;
  function pfq(x: number) {
    return Math.pow(x / currentSupply, 31) * x + x;
  }

  // 1= 7, 10 = 8, 100 = 9, 1000 = 10, 10000 = 11
  return (
    (pfq(currentSupply + amount) - pfq(currentSupply)) /
      Math.pow(10, divider + 6) +
    startPrice
  );
}

export const decryptoAes = (hexStr: string) => {
  const key = CryptoJs.enc.Latin1.parse('beeperdaobotmana');
  const iv = key;

  return CryptoJs.AES.decrypt(hexStr, key, {
    iv,
    padding: CryptoJs.pad.ZeroPadding,
  }).toString(CryptoJs.enc.Utf8);
};
