import createPersistedState from 'vuex-persistedstate';

export default createPersistedState({
  paths: [
    'version',
    'locale',
    'wallet.authorized',
    'wallet.accounts',
    'wallet.chainId',
    'wallet.balances',
    'wallet.tokenExp',
    'wallet.token',
    'wallet.isSignedIn',
    'wallet.network',
    'user',
  ],
});
