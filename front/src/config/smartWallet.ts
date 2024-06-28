import { http, createConfig, fallback } from '@wagmi/vue';
import { base } from '@wagmi/core/chains';
import { coinbaseWallet, walletConnect, injected } from '@wagmi/vue/connectors';

export const projectId = '8210413ca73c65db256bcfe94b8bc70a';

export const metadata = {
  name: 'daobase.ai',
  description: 'daobase ai',
  url: 'https://daobase.ai', // origin must match your domain & subdomain
  icons: ['https://daobase.ai/favicon.ico'],
};

export const smartWalletConfig = createConfig({
  // @ts-ignore
  chains: [base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [base.id]: fallback([
      http('https://base.blockpi.network/v1/rpc/public'),
      http()
    ])
  },
  connectors: [
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
      // preference: 'smartWalletOnly',
    })
  ]
});
