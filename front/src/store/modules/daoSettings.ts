import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex';

const mutations: MutationTree<any> = {};

const getters: GetterTree<any, any> = {};

const actions: ActionTree<any, any> = {};

export const daoSettings: Module<any, any> = {
  namespaced: true,
  state: {
    id: 0,
    daoInfo: {
      name: '',
      intro: '',
      logo: '',
      daoTag: [],
      daoType: '',
      website: '',
      whitepaper: '',
      twitter: '',
      openseaUrl: '',
      superrareUrl: '',
      foundationUrl: '',
      customizeLink: [],
      discordLinkUrl: '',
      telegramLinkUrl: '',
      mirrorUrl: '',
      daoCategory: 'NFT',
      daoRelationship: [],
    },
    passInfo: {
      passName: '',
      passSymbol: '',
      passLogo: '',
      passType: '',
      passBondingCurve: {
        network: '',
        passContractType: 'ERC1155',
        collateralTokens: '',
        creatorFee: '',
        receivingAddress: '',
        platformCommission: '',
        initialPrice: '',
        m: '0.000001',
        n: 2,
        erc20Address: '',
      },
      passFixedPrice: {
        network: '',
        passContractType: 'ERC721',
        payment: '',
        payWith: '',
        validityType: 'certain_time',
        termOfValidity: '',
        certainTime: '',
        platformCommission: '',
        receivingAddress: '',
        supply: '',
        schedulingAhead: '',
        isFreeMint: false,
        /* - - */
        isWhiteList: false,
        whiteMode: 0,
        excelUuid: '',
        fileName: '',
        whiteList: [],
        duration: '',
        validityStatus: false,
        mintLimit: '',
      },
      passStakingBasedDTO: {
        network: '',
        passContractType: 'ERC721',
        tokenMintTheNftPass: 'ERC20',
        tokenContractAddress: '',
        nftContractAddress: '',
        tokensNeededToMintANft: '',
        /* - - */
        isWhiteList: false,
        whiteMode: 0,
        excelUuid: '',
        fileName: '',
        whiteList: [],
        duration: '',
        mintLimit: '',
        schedulingAhead: '',
      },
    },
  },
};
