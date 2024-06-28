import { BackNetworkType, DashboardDisplayType, NetType } from '@/constants';
import { computed, reactive, watch } from 'vue';

export const useDashboardConf = (formInfo: any) => {
  const NetworkType = [
    { label: 'Ethereum', value: NetType.ethereum },
    {
      label: 'Polygon',
      value: NetType.matic,
    },
    {
      label: 'Ronin',
      value: NetType.ronin,
    },
    {
      label: 'Tezos',
      value: NetType.tezos,
    },
    {
      label: 'Gnosis',
      value: NetType.gnosis,
    },
    {
      label: 'Algorand',
      value: NetType.algorand,
    },
  ];

  const state: any = reactive({
    applyTip: false,

    displayType: {
      label: formInfo.dashboard.displayType.split('_').join(' '),
      value: formInfo.dashboard.displayType,
    },
    fts: [
      {
        network: { label: 'Ethereum', value: NetType.ethereum },
        trackedAddress: '',
      },
    ],
    nfts: [
      {
        network: { label: 'Ethereum', value: NetType.ethereum },
        trackedAddress: '',
      },
    ],
  });

  watch(
    () => JSON.stringify(state.displayType),
    (val) => {
      formInfo.dashboard.displayType = JSON.parse(val).value;
    },
  );

  ['fts', 'nfts'].forEach((key) => {
    state[key] =
      formInfo.dashboard[key].length == 0
        ? [
            {
              network: { label: 'Ethereum', value: NetType.ethereum },
              trackedAddress: '',
            },
          ]
        : formInfo.dashboard[key].map((x: any) => ({
            network: { label: BackNetworkType[x.network], value: x.network },
            trackedAddress: x.trackedAddress,
          }));

    watch(
      () => JSON.stringify(state[key]),
      (val: any) => {
        const res = JSON.parse(val);
        formInfo.dashboard[key] = res
          .filter((x: any) => !!x.trackedAddress)
          .map((x: any) => ({
            network: x.network.value,
            trackedAddress: x.trackedAddress,
          }));
      },
    );
  });

  const formOptions = [
    {
      label: 'ONLY NFT COLLECTION',
      value: DashboardDisplayType.ONLY_NFT_COLLECTION,
    },
    {
      label: 'ONLY FT COLLECTION',
      value: DashboardDisplayType.ONLY_FT_COLLECTION,
    },
    {
      label: 'BOTH AND NFT COLLECTION FIRST',
      value: DashboardDisplayType.BOTH_AND_NFT_COLLECTION_FIRST,
    },
    {
      label: 'BOTH AND FT COLLECTION FIRST',
      value: DashboardDisplayType.BOTH_AND_FT_COLLECTION_FIRST,
    },
  ];

  const isNft = computed(() => state.displayType.label != formOptions[1].label);
  const isFt = computed(() => state.displayType.label != formOptions[0].label);

  const collection = computed(() => {
    const index = formOptions.findIndex(
      (x) => x.label == state.displayType.label,
    );

    const res = [];

    const ft = {
      text: 'FT Collection',
      value: state.fts,
    };
    const nft = {
      text: 'NFT Collection',
      value: state.nfts,
    };

    if (index == 0) {
      res.push(nft);
    }

    if (index == 1) {
      res.push(ft);
    }

    if (index == 2) {
      res.push(nft);
      res.push(ft);
    }

    if (index == 3) {
      res.push(ft);
      res.push(nft);
    }

    return res;
  });

  const delAddress = (target: any, index: number) => {
    target.splice(index, 1);
  };

  const addAddress = (target: any) => {
    target.push({
      network: { label: 'Ethereum', value: NetType.ethereum },
      trackedAddress: '',
    });
  };

  return {
    delAddress,
    addAddress,
    collection,
    NetworkType,
    formOptions,
    state,
  };

  /*  */
};
