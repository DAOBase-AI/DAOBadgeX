import { DAppClient, SigningType, toHex } from '@airgap/beacon-sdk';

let connected = false;

const signTezosMsg = (str: string) => {
  const msg = [
    'Tezos Signed Message:',
    location.origin,
    new Date().toISOString(),
    str,
  ].join(' ');

  const hexStr = toHex(msg);

  return '05' + '0100' + toHex(hexStr.length.toString()) + hexStr;
};

export const tezosDapp = new DAppClient({
  name: 'DAO BASE',
});

export const clearTezosUser = () => tezosDapp.removeAllAccounts();

export const connectTezos = async () => {
  const account = await tezosDapp.requestPermissions();
  const address = account.address;
  connected = true;
  return address;
};

export const signedTezosMsg = async (msg: string): Promise<any> => {
  const res = await tezosDapp.requestSignPayload({
    signingType: SigningType.MICHELINE,
    payload: signTezosMsg(msg),
  });

  return res.signature;
};

export const disconnectTezos = async () => tezosDapp.disconnect();

export const isTezosConnect = () => connected;
