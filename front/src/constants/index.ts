import { utils } from 'ethers';

const factoryAbi = require('./Factory.json');
import { abi as alphaAbi } from './Alpha.json';
import { abi as betaAbi } from './Beta.json';
import { abi as gammaAbi } from './Gamma.json';
import { abi as deltaAbi } from './Delta.json';
import { abi as erc20Abi } from './ERC20.json';
import { abi as erc721Abi } from './ERC721.json';
import { abi as mintBadgeAbi } from './contract/Badge.json';
import { memoize } from 'lodash';

export const chains: any = {
  Ethereum: {
    chainName: 'Ethereum',
    chainId: '0x1',
    // chainIds: ['0x1', 1, '1'],
    rpcUrls: ['https://eth.llamarpc.com'],
    iconUrls: [''],
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  Polygon: {
    chainName: 'Polygon',
    chainId: '0x89',
    chainIds: ['0x89', 137, '137'],
    rpcUrls: ['https://polygon.llamarpc.com'],
    iconUrls: [''],
    blockExplorerUrls: ['https://polygonscan.com'],
    nativeCurrency: {
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  Optimism: {
    chainName: 'Optimism',
    chainId: '0xa',
    // chainIds: ['0xa', '10', 10],
    rpcUrls: ['https://optimism.llamarpc.com'],
    iconUrls: [''],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  Arbitrum: {
    chainName: 'Arbitrum',
    chainId: '0xa4b1',
    // chainIds: ['0xa4b1', '42161', 42161],
    rpcUrls: ['https://arbitrum.llamarpc.com'],
    iconUrls: [''],
    blockExplorerUrls: ['https://arbiscan.io'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  BNB: {
    chainName: 'BNB',
    chainId: '0x38',
    chainIds: ['0x38', 56, '56'],
    rpcUrls: ['https://binance.llamarpc.com'],
    iconUrls: [''],
    blockExplorerUrls: ['https://bscscan.com'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  Base: {
    chainName: 'Base',
    chainId: '0x2105',
    // chainIds: ['0x2105', 8453, '8453'],
    rpcUrls: ['https://base.llamarpc.com'],
    iconUrls: [''],
    blockExplorerUrls: ['https://basescan.org/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export const CHAIN_NAMES = {
  polygon: { ids: ['0x89', 137, '137'], name: 'Polygon' },
  ethereum: { ids: ['0x1', 1, '1'], name: 'Ethereum' },
  op: { ids: ['0xa', '10', 10], name: 'Optimism' },
};

export const CHAIN_IDS = Object.values(chains).map((x: any) => x.chainId);

export const selectChains = Object.keys(chains).map((x, i) => ({
  id: i,
  name: x,
}));

export const pass: any = {
  network: {
    eth: 'Ethereum',
  },
  passport: {
    nft: 'ERC721',
  },
  factory: {
    factory: '0xbc6839ff35cef154866e044ce798239c04cdc810',
  },
};

export const PlaceHolderImage =
  'https://common-1258125078.cos.ap-shanghai.myqcloud.com/placeholder.png';

export const rules = {
  /* [0-9a-zA-Z] $-_.+!*'(), space */
  isNormalStr: (value: string): boolean => {
    return /^[0-9a-zA-Z $.+!*'()_-]+$/.test(value);
  },
  isUrl: (value: string): boolean => {
    return !!value.match(
      /https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/,
    );
  },
  isTwitterUrl: (value: string): boolean => {
    return !!value.match(/https?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/);
  },
  isAddress: (value: string): boolean => {
    return utils.isAddress(value);
  },
  isSymbol: (value: string): boolean => {
    return !!value.match(/^[A-Z]{3,6}$/);
  },
  gtZero: (value: string): boolean => {
    return +value > 0;
  },
};

export const passImages = {
  happy:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADsklEQVRoge2ZuU8VURTGz4DvkQBqIkuiQGOjhYkFCmin/g1Gox0oak2MS2EpWgsBYqeJS6KVYknvggnEhpeoEVkSxYL90fizuEMcz9x5b5YLGOVLXsIdzvm+78zcuduIbGMb/zc8FyRApYi0icgJEWkVkYMisldEav2QJRGZEZEJERkVkREReeN53k8X+qkBtAB3gCmS4yvQCzRvhfEGYAhYS2FcYw0YAOo3y/w54IcD4xpzwNmNNJ4D7pcwMA88Ai4ARzFPKef/GvxrF4HHwEIJnkEg59p8NfAqQnAC6ASqE/J1AYUIzuEkfOXEchHmV4AeYEdG7qvAqoX/pZMngb3bFIBDmcl/a3QAMxadgazE5y2k74EGR96DWs3AmEXvTFrCBsKjTWEjzAc0m4FZpfkdqEtDNqSIVlx2mxK6HUBRafcnJWkhPEn1bJBnm/4tpV0kyYyNWR4EMYEabYA8cBfz8k37OfkY3GXzgFpLV+qNa76S8NqmM0aRAHdi8MfKA66omEmgIk4Bx1TiPJZJxb97GtMx+GPlATXAoopr03G2ik6o9rDneSvljLmG53nLIjKsLp/UcbYCWlV7JELjoeXag/LWEuVpbe0tDOCDemxHI+Lyfn+eJvlLHCsPaFdexuMUoCevzVmn2700Ki/fdYytC9Wq9sLG2IuFedXeqQPKD0t/OWwFLKn2rs0wEoHdqr2oA2wFzKr2fmd2kkNra2/WAiZU+7AzO8mhtbU3awHvVDs0eQA7LaNVFswBoRdURE6V8RYGZjkbxAL2pcQNhwVcs/DblhLWOUknVmAOnYLossTlgLcOzL/Gsq/GnGAE8YU4izk/uVclF7BssIF9wOcM5j8Cey28ef9/QdyOZd4naCa8oblaIjbNk3gDNEVwXlexxajYUkUMKJJVoCMitgq4SekDq3Us+AarIriOE95S3ktk3ieqx4wOQcxQYmsH7AK6geeYrrXs/z4BzzD92jbarOe3EN6JfQP2JC7AJzxruYNjpYpIC9/8uEXvdFbiQQvpLBHdKaXGMcudB+hzQZ7DnFVqFDGnBzUZuPOY+UT3eYAXZDi21ELVEUWsP40rSQrBTFLdhIfKoHk3h7sB0RzhkSmIReAJcAmzk2r073De/7sduAw8JTzDBtHn7M5HFHIGc9znGt/I+sImKKIO6Mfed5OiCNwj7VCZsZAmzLJjMoXxSeA2SWdYBVefWStE5IiYpXeriBwQkSb58zPrlIgUxCyJR0RkdMs/s25jG/8AfgFhg71ZyWFeygAAAABJRU5ErkJggg==',
  sad: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADx0lEQVRoge2ZT2wVRRzHv4sV0j4jluaZ2OLFkHBBL1AhJCQULxJvhIDeSkLEI+GCiXgrmOiF/1wMJ0zgBmo8Vk9etByMCbUmNNAWNcQEaPOKFz4eZgjLb2ff7rw3DxLtN3nJm93ffL/fmdmd+c2stIIV/L+RpSABVkl6W9IuSZslbZQ0LOklH7Ik6Y6kaUlTkiYl/ZRl2aMU+h0DWA98BswRjzngBDDyPIwPAeeBfzowbvEQOAese1bm9wN3Exi3uAvs66XxPlyvl+EecAk4CIwCTeBF/2v6aweBr4D7bXjOAn2pzfcD35QI3gDGgf5IvgPAdAnn1zF8VWJ9JeZbwOFuestzH/FcFteSjARwIUA+D2zpmvyJxiiwENA50y3x/gDpdWA4kfe81rDnttjbKeEQxdlmvhfmc5pNYMZo/gUMdkJmZ5xWysemje4miu/E6ViS9bgFJo/DPfIc0v/EaC9HjTwuPcjjBqnn5vb6DYov9fG6lVdRzG3Ge+w55OOQ8XALlzRWVtxmKt4j1aISAWAAeGC8jNq4UIvGTPnbLMuWe2OzHFmWtSR9Zy7vsnGhBtiZ5od2QsB7uOl1DthdZSwyfrLCW1Dg16phM/H59+V2Df7a8cBW4+UXGxMagddMebbKVA9hta23IihuUlZXxO/2vXobeLcGf+14YI3x8jB5A3qJOg0IPUJLpvxyb+zVwlpTXrQBoQb8YcpvJLMTD6ttvQUb8Jspv5XMTjystvWmUH7zs6Q9ufKYpC+rlHDL/JiknZK2S3pd0pC//bekOUk/yq0r39c8E3on4K3SiJ1779MmlcDtbz8GZqmPWeBoBW8DWDT1ai1koWTuQEnsDuBmhHGLm8COEu6PTGy9ZM5XPmEqTxNIp4ENgV6KwSKwIcDbAO6Y2Ila5j3BCMUNzZGS2PFczBJwEXgf2AgMAuv8/w/8vaVcfDBNBz412nEbGk9yzpC0KMmLcAdanwN23g7FrgW+AC6V3H+T4pbyVJR5TxTa1C9E90ScZhP43Wh2tqn3hPso4jrQTOz9sfmpgN6e6trtic8GSGeATYm8P35sbM8DnExB3oc7q7Ro4U4PGl1wN4BjhI8WrwIvdN0AL9SPO6sMYQG3AR+I4BvAzfN2qsybT7sP9yNxpkQQ3Ab8MvAhbjVvAqv971V/7RBwhfZrx6lkPV/SkL24mSE1/qTbFzaiEYPAaYqLXSdYxvX6K8/EvGnIMHAcl6fE4hYwAVTvc9sg5WfWzXLnNlvkPrOO6OnPrPOSZuRS4klJU8/9M+sKVvAfwL+NGtmCYYwqLgAAAABJRU5ErkJggg==',
  eye: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADAklEQVRoge2YT0gUURzHv8+DHvzTITzUooc0NTrWMaKuZRRJgRgidDULMjsVHgMJ+nOLoIICTS27FmUWVIfCoPRStzqZQrRbpKSfDjNr22v/vLc7K4TzhYF9w/v++c3OzPvNk2LEiBEjxnqGiUIEqJW0V9IuSdslNUmql1QTTklJ+iLpo6RZSc8lTRpjUlH4FwWgAjgAPACW8McSMAG0AxVrGdwAR4HZIkLnwgxwBIjkjsgXvgV4EmFwG4+BreUKfwxIlTF8Gj+A41EGrwAurkFwG0OU+myE4W95mC4Cw0An0ApUh0dreG4knOOKm5TyXABXPczGgC0Omk3AuIfulWLDDzoa/AJOF6HfDyw7egz6ircDK47i3uEzfAYcPVaAQ66ijcCCo/BYFn4V0Ae8InhrpcLfJ4CqLPPvO3otAI2FwhtgylFwEeueBxLA2zycaSBhcZpxf7Cfku+hBnochQCGs1z5fOEzi6iyuHc9fHtyhd8AzHkIdVr8Pg9ur8Xt8uDOAXVpbuZCcVJBB+mKN9a4y4Nrz33twa2XdCo9WL2fgM+SEtkYOVBnjElm8JP60z4XQtIYs3oVCdrxbx7en4wxjdLf/8B/icwCrnlyN1njWQ/ujDXe7Ol9Pf0js4BLkuY8RHZY49se3DvWeKcHd05B1n8BdHu8DUYsbhXBK7IQpoFKizvq4dudszSChWzSUWgRaLL4iQJF5FrIXD9JJynUnQINuLcS41n4lUAv8BJIhseL8FxllvkTjl7zQEPe8Bmi+3Fv5vqdRLP7nHX0WAEO+oqfdxRfBs4UEX4A93b6nK9+2uSyowEEXWWzg2Yz7rcNQPY3jmMBhuCzzhVLBI1ZF9AG1IRHW3huFL89pBuUutUSFjHkYRoVLpQc3iqkA/i6BsGTWJ1ulEU0A4/KGP4h1tpSrkI6gPcRBn8HHC57cKuICoL14h5+ez1p/CTYXtlHCRtYUW2vV0vaI2m3pG2SWiRtlFQbTklKmpf0QUHX+kzSlDHmexT+MWLEiBFj/eI3BFUC5+wTo5oAAAAASUVORK5CYII=',
  fire: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAADuElEQVRoge2bX2hWZRzHf4/LpoWOjNEfL5YIDvKii+yP6LqxJHCZCoKQMRyKXkTRVRd1UYHXI62QXYXVRQkNBCWvHEVDneCFypQk2Nwmy0kENXrb2qeLs2Pvjuc95/c773nex+D93O3wO7/z/ez8e57nfV+RJk2aNMkA2AaMA2NAd+g83gFu8h8zwAuhM3kDeJh7mQRWh87mBWBNijDAINASOl/pADtqCAN8HDpf6QB9GcJzwPOhM5YG0LLwZM5iBFgWOmspANtzZGM+DJ21FIDzSuEZoCN03roAdillY74OnbkwwAoWDzY0zAPPhs5eCOCIUTbmROjsZoDniF43RfgH6AztoAZYDlwtKBvTH9pDDXC0TlmA34GHQrvkArxC9OApgz2hfTIBVgETJckCnKpxnG6iefUEIefVwFclygL8RWK4CSwhmlbG/Aq0hpB9vWTZmK7EcbpSagpd+kvqkH1URI4V3T+HTYm/96fUHPB07HSA457OLsBA1XE6gUpKzTyw1pq70BkGNorI3iL7KqkW6RORB1NqnIjs8pghAnDABY9nF+DOwrHezan7oRHC2nluPVSAd4iGm1nMET1LvAoPe9e18aYlv+keJlpT3mD6D/lnq6XY+tA6aKxvBC9aip22kGgdeUpE/N4zdhCRx5xztzXFljPcJfefrEh00tTLvRbhzfYsDUN9WVuEnykQpJpLkj5ELIOntYUWYXXTFI5KdNn5muGoh5gW4aL372Hn3NvOuTkRWVewRx5Pagstwm0Fgpx0zn1QZw8NK7WFhaeHCmZE5K3ENtWrowDq16tF+DdjiAHn3M3Etp+MPbT8oS20CN8whvgmZdv3IjJp7KNhWltoEb5oDHE9ucE5VxGR9419NPyiLbQInzaGSF7OIiLinPtCRMr+8OyKttAiPCjRWFpL1oJ6r4icNfTKY0hbqBZeeI8eMYSo+c51zv0tIjtFZNjQrxazEp2M8gHagCnlxPwjZb9zdS4AnPEiWxVynzLIKPCAot9K6ltFec23sAMGlGF6lD3bgWsFZEcAn4OnuwEfAS4rAo0DquEk0AHcMgr3+natDvgE8LMi1LeGnlvIX6mMGaIRZzcR8CmiezWPQ4ae/Yp+FWC9T7esgI8DP+YEnAV2K/u1A3/m9EtOShoLsBT4VCGt+lwX+Dyjz2e+fdQALwPXM8KOKvu8VGP/L7nfvoULtALvkf7EHVP2aGHxB+AAn9Doh5SFBfEe4DtgmuiLpq8a9o9/OjAOvOEza5MmTf4//Asu+x5kG0popQAAAABJRU5ErkJggg==',
  film: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAD70lEQVRoge2Zy48VRRTGv8ILZGYMBvHOYh7r2SCawKBb2Rm2BLaQEHBJ2BkfO8SFKx76D0iQgYT4iIkxEvcGSAwJAy6MziMxo2buSO7gZn4uqoiX09XdVX0bSXC+pHNvV9f31Tldt86pU1faxCb+33BtiABbJO2XdEDSXkkzkiYkPR+6PJC0LGle0k1JNyT94JzbaGP8xgCmgLPAAvlYAD4AJp+G4buAj4G/Gxhu8RC4CLz4Xxl/BFhpwXCLFeDwkzS8g3/rZVgFPgWOA7NAF9garm5oOw5cAnoVOheATtvGjwBflgx4FzgKjGTqHQPmSzS/yNGrG6xTYnwfOBV7W8A0cA1YC9d1YKZE+3TQsvi8lZkAPomILwL7SvpPA39EOH8C0yWcWWApwjk/rPFHIqK3gIkKzrUI5xHmKngTQdviUFPjd1GMNotVxgfeWoUDvRpuF7hvOL8BO5s4YCNOn5KfTYYDqwn83RTXxLlc46fwCWYQpxK51yscuJKo8Y7hrVMz81bgrBG4S2JEAGbwC9bid2AqUWOM4qI+k2r8Fop7m6NJ5H81poE5fMLqAVdSjR/QOGls+AW/aawlvm6Iq7SVVDIAjFJcT7O2X8yjN8z9V8659SdjZjmcc31JX5vmA7ZfzAEbab5/9IXEDJuKBL0bNbZFRe/Epo0GGTbB+Eo94DXz7McUYSv6UmjPyrDAQXziWwDejDyv1QPGTftKigO2SNkW2rMyLI9Hsl8jz2v1gO2m/aHVqQ9LaaAlnTq97bYh5sADc78jfH5XMeA3kbYTkhYlLYTvFil6L1T0iYPiIt4f2ofOsGacWj2KOakwM7EZuGfu90iSc+6epFckXZW0Fq45Sa865xZzHUjU25OrK+Bt4/SlbJGWgN+CVM5AjGRjb4+ns5UYA/5q4kBsM3csc/ChMzbwVmR9pEU7/InZIOZJ304PnbHD218exoFJigXN6URuo5rYaLxXJpDkQBC5aLh9ItvZCK9xTRz4LxM/Zsl2IFbULzFcUV9ZE+OL+p8q+HkZHzgc0bgFdCs4jWriYPzNKuOzHQjCFyI694HdJf2zMzb+ZxN787Y2b+RAB39WadHHnx6MRThJNTE+2rxL/Dd/FR/Sh3MgDDSCP6uMYQlfgI9m6I3i43w0VAKXga2h7/AOBKEOcL5kQPCL9zPgBD6bd4Ft4RoPbSfxs1HIsAEbwIfAcwPjtuPAgOAh/HFf21gGDkbGa9eBILoTOEcx2TXBOvARsKNkrPYdGBCfAM7gD51y8TPwPjBeM0alA23+zbpX/txmn/zfrJPyf7NuSOpJWpF0R9JtSd86524naj9mtHOuFZs3sYlnBf8AGWtdhAa1Jd0AAAAASUVORK5CYII=',
  gift: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2YwUrDQBRF74i0+g1Nf8B1v8qKf2dFtxZaUdSVLvoXKtbdcdEU6pCZJLaZMfAOBJLMHXJv3kvCRDIM408AQ+ASWAKf5bYAzoFBhX4ATD39Erio0ndtfgS8EOYBKHb0RXkuxDMwSmV+WGN+y6o0XpT7dTwlqQSbtmnKqqH5LdMUAe69i16xaakCmDUwGdMvUgT48C662+vjBgFi+ve2fo4OFaw3AHPvrs3KdhgD1w0qENPP2/pxFQY5TNRucM798tz7FrIAuTmuE/g9l5q6Z7L3FbAAual9Bv77d6H3FbAAuQm+4/3eb/s9SDW/9xWwALmxALmxALmxALmxALmxALmJrci+JZ1sD/Zdme05fx0aiFWg9X/KDrkLDcTWA2eSHiWdduGoBV+SJs65t6rBYAWcc6+SJpJuFSlhh6wl3Shi3jAMIz8/JO5trfBByOMAAAAASUVORK5CYII=',
  default:
    'data:image/png;base64,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',
};

export const approveQuantity = '100000000';

// Goerli
export const contracts = {
  alpha: {
    abi: alphaAbi,
  },
  beta: {
    abi: betaAbi,
  },
  gamma: {
    abi: gammaAbi,
  },
  delta: {
    abi: deltaAbi,
  },
  factory: {
    abi: factoryAbi.abi,
    // address: '0x1bcb5ef3c81971f3435ef9db1535f8500878982f', Goerli
    // address: '0xf46d78fd204a5537be4acd3eba04b7bc079a626a',
    address: '0x5c53b0565f47375eee9548480110408c00e3c0c4',
  },
  erc20: {
    abi: erc20Abi,
  },
  erc721: {
    abi: erc721Abi,
  },
  mintBadge: {
    abi: mintBadgeAbi,
    // OP address
    // address: '0xe31baa13df378338071106af5bb92de463bd6d89',
    // Base address
    address: '0x7721693d0529199d4B68aB4c00f1213b16092Bf9',
  },
};

export const TownhallDialogs = {
  START: 1,
  PRIVATE: 2,
  JOIN: 3,
};

export enum PASS_TYPE {
  BONDING_CURVE /* BC */,
  FIXED_PRIXED /* SB */,
  NFT_BASE /* NB */,
  TOKEN_BASE /* TB */,
}
export const NetworkType: Record<string, string> = {
  arbitrum: 'Arbitrum',
  base: 'Base',
  avalanche: 'Avalanche',
  solana: 'Solana',
  polkadot: 'Polkadot',
  kusama: 'Kusama',
  optimism: 'Optimism',

  Ethereum: 'ethereum',
  Polygon: 'matic',
  Ronin: 'ronin',
  Flow: 'flow',
  Tezos: 'tezos',
  Bsc: 'bsc',
};
export const BackNetworkType: Record<string, string> = {
  arbitrum: 'Arbitrum',
  base: 'Base',
  aptos: 'Aptos',
  avalanche: 'Avalanche',
  solana: 'Solana',
  polkadot: 'Polkadot',
  kusama: 'Kusama',
  optimism: 'Optimism',
  ethereum: 'Ethereum',
  matic: 'Polygon',
  polygon: 'Polygon',
  ronin: 'Ronin',
  flow: 'Flow',
  tezos: 'Tezos',
  gnosis: 'Gnosis',
  algorand: 'algorand',
  bsc: 'Bsc',
};

export const NetworkSymbol: Record<string, string> = {
  arbitrum: 'Arb',
  base: 'Base',
  aptos: 'Aptos',
  avalanche: 'Avalanche',
  solana: 'Solana',
  polkadot: 'Polkadot',
  kusama: 'Kusama',
  optimism: 'Op',
  ethereum: 'ETH',
  matic: 'Polygon',
  // polygon: 'Polygon',
  ronin: 'Ronin',
  flow: 'Flow',
  tezos: 'Tezos',
  gnosis: 'Gnosis',
  algorand: 'algorand',
  bsc: 'BSC',
};

export const TOKEN_BIT: any = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
};

/* TOKEN */

const ETHEREUM_TOKENS = {
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: '18',
    address: '0x0000000000000000000000000000000000000000',
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: '6',
    address: process.env.VUE_APP_USDC,
  },
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: '6',
    address: process.env.VUE_APP_USDT,
  },
  DAI: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: '18',
    address: process.env.VUE_APP_DAI,
  },
};

const POLYGON_TOKENS = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: '6',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  },
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: '6',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
  DAI: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: '18',
    address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  },
  WETH: {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: '18',
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  },
  MATIC: {
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: '18',
    address: '0x0000000000000000000000000000000000000000',
  },
};

export const FIXED_PRICE_OPTIONS_BY_NETWORK = memoize(
  (network: string): any[] => {
    const origin: any =
      network == 'Ethereum' ? ETHEREUM_TOKENS : POLYGON_TOKENS;
    const keys: any =
      network == 'Ethereum'
        ? ['DAI', 'USDC', 'USDT', 'ETH']
        : ['DAI', 'USDC', 'USDT', 'MATIC'];
    const res: any = {};
    keys.forEach((key: string) => {
      res[key] = origin[key];
    });
    return res;
  },
);

export const BONDING_CURVE_OPTIONS_BY_NETWORK = memoize(
  (network: string): any[] => {
    const origin: any =
      network == 'Ethereum' ? ETHEREUM_TOKENS : POLYGON_TOKENS;
    const keys: any =
      network == 'Ethereum'
        ? ['ETH', 'DAI', 'USDC', 'USDT']
        : ['MATIC', 'DAI', 'USDC', 'USDT', 'WETH'];
    const res: any = {};
    keys.forEach((key: string) => {
      res[key] = origin[key];
    });
    return res;
  },
);

export const getFpPaywithOptions = (network: string): Array<string> => {
  return network == 'Ethereum'
    ? ['DAI', 'USDC', 'USDT', 'ETH']
    : ['DAI', 'USDC', 'USDT', 'MATIC'];
};

export const getBcPaywithOptions = (network: string): Array<string> => {
  return network == 'Ethereum'
    ? ['ETH', 'DAI', 'USDC', 'USDT']
    : ['MATIC', 'DAI', 'USDC', 'USDT', 'WETH'];
};

export const PassTypeLongText = {
  nft_base: 'NFT base',
  token_base: 'Token Base',
  fixed_price: 'Fixed Price',
  bonding_curve: 'Bonding Curve',
};

export const TOKENLOGO = {
  DAI: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_DAI.svg',
  USDC: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg',
  USDT: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDT.svg',
  ETH: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_ETH.svg',
  MATIC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  WETH: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};

export const FACTORY_ADDRESS: Record<string, string> = {
  Ethereum: process.env.VUE_APP_ETH_FACTORY_ADDRESS as string,
  Polygon: process.env.VUE_APP_MATIC_FACTORY_ADDRESS as string,
};

export const BONDING_CURVE_FACTORY_ADDRESS: Record<string, string> = {
  Ethereum: process.env.VUE_APP_ETH_BCFACTORY_ADDRESS as string,
  Polygon: process.env.VUE_APP_MATIC_BCFACTORY_ADDRESS as string,
};
export const FREEMINT_FACTORY_ADDRESS: Record<string, string> = {
  Ethereum: process.env.VUE_APP_ETH_FREEMINT_ADDRESS as string,
  Polygon: process.env.VUE_APP_MATIC_FREEMINT_ADDRESS as string,
};

export const FP_WHITELIST_FACTORY_ADDRESS: Record<string, string> = {
  Ethereum: process.env.VUE_APP_ETH_FP_WHITELIST_ADDRESS as string,
  Polygon: process.env.VUE_APP_MATIC_FP_WHITELIST_ADDRESS as string,
};

// font 100% bg 20% bg-active 40%
export const DaoTypeColor = [
  '#8126FF',
  '#2649FF',
  '#26FFB2',
  '#26FFFF',
  '#FF2640',
  '#FF26F2',
  '#FFE426',
  '#B5FF26',
  '#26ADFF',
];

export const DaoType = [
  'ALL',
  'Infrastructure',
  'Protocol DAO',
  'Investment DAO',
  'Collector DAO',
  'Guild',
  'Creator DAO',
  // 'Community DAO',
  'Service DAO',
  'Media DAO',
];

export const DOWNLOAD_URL = `${process.env.VUE_APP_API_URL}/excel/download/whiteListTemplate`;

export const DashboardType = {
  COMPREHENSIVE: 'COMPREHENSIVE',
  PROJECT_DAO: 'PROJECT_DAO',
};

export const DashboardDisplayTypeLable = {
  ONLY_NFT_COLLECTION: 'ONLY NFT COLLECTION',
  ONLY_FT_COLLECTION: 'ONLY FT COLLECTION',
  BOTH_AND_NFT_COLLECTION_FIRST: 'BOTH AND NFT COLLECTION FIRST',
  BOTH_AND_FT_COLLECTION_FIRST: 'BOTH AND FT COLLECTION FIRST',
};

export const DashboardDisplayType = {
  ONLY_NFT_COLLECTION: 'ONLY_NFT_COLLECTION',
  ONLY_FT_COLLECTION: 'ONLY_FT_COLLECTION',
  BOTH_AND_NFT_COLLECTION_FIRST: 'BOTH_AND_NFT_COLLECTION_FIRST',
  BOTH_AND_FT_COLLECTION_FIRST: 'BOTH_AND_FT_COLLECTION_FIRST',
};

export const NetType = {
  polygon_pos: 'polygon_pos',
  polygon: 'polygon',
  bsc: 'bsc',
  solana: 'solana',
  matic: 'matic',
  ethereum: 'ethereum',
  optimism: 'optimism',
  arbitrum: 'arbitrum',
  base: 'base',
  rinkeby: 'rinkeby',
  ronin: 'ronin',
  tezos: 'tezos',
  gnosis: 'gnosis',
  algorand: 'algorand',
};

export const chainExplore: any = {
  Ethereum: 'https://etherscan.io',
  Polygon: 'https://polygonscan.com',
  Ronin: 'https://explorer.roninchain.com',
  Flow: 'https://flowscan.org',
  Tezos: 'https://tzkt.io',
  algorand: 'https://algoexplorer.io',
};

export const chartColor = [
  '#F72585FF',
  '#B5179EFF',
  '#9317B5FF',
  '#560BADFF',
  '#3A0CA3FF',
  '#3F37C9FF',
  '#4361EEFF',
  '#4895EFFF',
  '#48D1EFFF',
  '#3DFFE6FF',
  '#C6C6C6FF',
  '#E8A8C3FF',
  '#BE7DD0FF',
  '#8D57CBFF',
  '#8270ABFF',
  '#5E58C1FF',
  '#7387E9FF',
  '#B1CFF2FF',
  '#B6F2FFFF',
  '#F6FF3DFF',
];
export const typeSelection = [
  { label: 'All', value: 'all' },
  { label: 'NFT DAO', value: '0' },
  { label: 'DeFi DAO', value: '1' },
];
export const chainsSelect = [
  { label: 'All', value: 'all' },
  {
    label: 'Ethereum',
    value: 'ethereum',
    icon: require('@/assets/icons/ethw.avif'),
  },
  {
    label: 'Polygon',
    value: 'matic',
    icon: null,
    iconFont: 'icon-Polygon-24',
  },
  {
    label: 'Optimism',
    value: 'optimism',
    icon: null,
    iconFont: 'icon-OP-93',
  },
  {
    label: 'Arbitrum',
    value: 'arbitrum',
    icon: null,
    iconFont: 'icon-Arbitrum-01',
  },
  {
    label: 'Base',
    value: 'base',
    icon: null,
    iconFont: 'icon-base-01',
  },
  {
    label: 'BNB',
    value: 'bsc',
    icon: null,
    iconFont: 'icon-BNB-01',
  },
  {
    label: 'Tezos',
    value: 'tezos',
    icon: require('@/assets/icons/tezosw.avif'),
  },
  { label: 'Others', value: 'other' },
];
export const linkLogos = {
  snapshot: require('@/assets/icons/snapshot.png'),
  tally: require('@/assets/icons/tally.png'),
  nouns: require('@/assets/icons/nouns.png'),
  compound: require('@/assets/icons/compound.png'),
  openzeppelin: require('@/assets/icons/open_zeppelin.png'),
  homebase: require('@/assets/icons/homebase.png'),
  xdao: require('@/assets/icons/xdao.png'),
  colony: require('@/assets/icons/colony.png'),
  kyber: require('@/assets/icons/kyber.png'),
  osnap: require('@/assets/icons/osnap.png'),
  aragon_tao: require('@/assets/icons/aragon.png'),
  aragon_app: require('@/assets/icons/aragon.png'),
  aragon_client: require('@/assets/icons/aragon_client.png'),
  moloch: require('@/assets/icons/moloch.png'),
  makerdao: require('@/assets/icons/makerdao.png'),
  partydao: require('@/assets/icons/partyDao.png'),
  agora: require('@/assets/icons/agora.png'),
  retropgf: require('@/assets/icons/retropgf.png'),
  other: require('@/assets/icons/other.png'),
  aave: require('@/assets/icons/aave.png'),
  kleros: require('@/assets/icons/kleros.png'),
};
export const chainIcon = {
  arbitrum: require('@/assets/logo/arbitrum.jpeg'),
  base: require('@/assets/logo/base.png'),
  aptos: require('@/assets/logo/aptos.png'),
  avalanche: require('@/assets/logo/avalanche.jpeg'),
  solana: require('@/assets/logo/solana.jpeg'),
  polkadot: require('@/assets/logo/polkadot.png'),
  algorand: require('@/assets/icons/algorand.png'),
  kusama: require('@/assets/logo/kusama.jpeg'),
  optimism: require('@/assets/logo/optimism.jpeg'),
  ethereum: require('@/assets/icons/eth-s.avif'),
  matic: require('@/assets/icons/polygon-s.avif'),
  ronin: require('@/assets/icons/roin-s.avif'),
  flow: require('@/assets/icons/flow-s.avif'),
  tezos: require('@/assets/icons/tezos.avif'),
  gnosis: require('@/assets/icons/gnosis.avif'),
  bsc: require('@/assets/icons/bsc.avif'),
};

export const SkillOptions = [
  { value: 'null', label: 'Suggested Skills', disabled: true },
  { value: 'Development', label: 'Development' },
  { value: 'Design', label: 'Design' },
  { value: 'Translation', label: 'Translation' },
  { value: 'Writing', label: 'Writing' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Community', label: 'Community' },
  { value: 'Product', label: 'Product' },
  { value: 'Research', label: 'Research' },

  //   { name: 'Development', value: 'Development' },
  //   { name: 'Design', value: 'Design' },
  //   { name: 'Translation', value: 'Translation' },
  //   { name: 'Writing', value: 'Writing' },
  //   { name: 'Marketing', value: 'Marketing' },
  //   { name: 'Community', value: 'Community' },
  //   { name: 'Product', value: 'Product' },
  //   { name: 'Research', value: 'Research' },
];
