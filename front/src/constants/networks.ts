export const EthereumNetwork = {
  url: 'https://etherscan.io',
  shortName: 'ethereum',
  chainId: '1',
};
export const MaticNetwork = {
  url: 'https://polygonscan.com',
  shortName: 'matic',
  chainId: '137',
};
export const GnosisNetwork = {
  url: 'https://gnosisscan.io',
  shortName: 'gnosis',
  chainId: '100',
};
export const OptimismNetwork = {
  url: 'https://optimistic.etherscan.io',
  shortName: 'optimism',
  chainId: '10',
};
export const ArbitrumNetwork = {
  url: 'https://arbiscan.io',
  shortName: 'arbitrum',
  chainId: '42161',
};
export const SolanaNetwork = {
  url: 'https://solscan.io',
  shortName: 'solana',
  chainId: '',
};
export const BscNetwork = {
  url: 'https://bscscan.com',
  shortName: 'bsc',
  chainId: '56',
};
export const AvalancheNetwork = {
  url: 'https://snowtrace.io',
  shortName: 'avalanche',
  chainId: '43114',
};
export const AptosNetwork = {
  url: 'https://aptoscan.com',
  shortName: 'aptos',
  chainId: '',
};
export const KusamaNetwork = {
  url: 'https://kusama.subscan.io',
  shortName: 'kusama',
  chainId: '',
};
export const PolkadotNetwork = {
  url: 'https://polkadot.subscan.io',
  shortName: 'polkadot',
  chainId: '',
};

const Networks = new Map();

Networks.set('ethereum', EthereumNetwork);
Networks.set('matic', MaticNetwork);
Networks.set('gnosis', GnosisNetwork);
Networks.set('optimism', OptimismNetwork);
Networks.set('arbitrum', ArbitrumNetwork);
Networks.set('solana', SolanaNetwork);
Networks.set('bsc', BscNetwork);
Networks.set('avalanche', AvalancheNetwork);
Networks.set('aptos', AptosNetwork);
Networks.set('kusama', KusamaNetwork);
Networks.set('polkadot', PolkadotNetwork);

const NetworksById = new Map();

NetworksById.set('1', EthereumNetwork);
NetworksById.set('137', MaticNetwork);
NetworksById.set('100', GnosisNetwork);
NetworksById.set('10', OptimismNetwork);
NetworksById.set('42161', ArbitrumNetwork);
NetworksById.set('56', BscNetwork);
NetworksById.set('43114', AvalancheNetwork);

export const NetworkList = Networks;
export const NetworkByIdList = NetworksById;
