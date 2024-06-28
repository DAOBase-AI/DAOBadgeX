import Mitt from 'mitt';

const mitt = Mitt();

export default mitt;

export const mittOwnPass = (daoId: string, passType: string) => {
  mitt.emit('ownPass', { id: daoId, passType });
};

export const mittNetwork = (visible = true, skip = false): void => {
  mitt.emit('network', { visible, skip });
};

export const mittSwitchNetWork = (network: string): void => {
  mitt.emit('switch-network', network);
};

export const mittDownload = (flag?: boolean): void => {
  mitt.emit('download', flag);
};

export const mittConnect = (flag?: boolean): void => {
  mitt.emit('connect', flag);
};

export const mittContract = (flag?: boolean, deployed?: boolean): void => {
  mitt.emit('contract', { flag, deployed });
};

export const mittContractBadge = (flag?: boolean): void => {
  mitt.emit('contractBadge', { flag });
};

export const mittLoading = (id: string, visible = true): void => {
  mitt.emit('loading', { id, visible });
};

export const mittWalletSelect = () => {
  mitt.emit('wallet-select');
};

export const mittWalletSelectHide = (): void => {
  mitt.emit('wallet-select-hide');
};
export const mittWalletConnect = () => {
  mitt.emit('wallet-connect');
};
export const mittWalletConnectSignOut = () => {
  mitt.emit('wallet-connect-disconnect');
};

export const mittWalletConnectChainChange = (): void => {
  mitt.emit('wallet-connect-chain-change');
};

export const mittSmartWalletSign = () => {
  mitt.emit('smartwallet-sign');
};
export const mittSmartWalletSignOut = () => {
  mitt.emit('smartwallet-signout');
};

export const mittSmartWalletChange = (): void => {
  mitt.emit('smartwallet-chain-change');
};