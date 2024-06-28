import { mittWalletSelect } from '@/libs/event';
import { default as store } from '@/store';
import { withWalletLogin } from '@/utils/with';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'LandingPage',
  //   component: () => import('@/views/LandingPage.vue'),
  //   meta: {
  //     ladingpage: true,
  //   },
  // },
  {
    path: '/',
    name: 'Home',
    // component: () => import('@/views/Home/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    meta: {
      title: 'DAO BASE - DAO Aggregator',
      description:
        'DAOBase is a comprehensive DAO aggregator and search engine. It assists DAOs and users in building their own reputation layer by aggregating fundamental information, social data, treasury assets, governance details, and more. With DAOBase, you can seamlessly monitor and evaluate the performance of DAOs, enabling you to gather valuable insights and make well-informed decisions.        ',
    },
  },
  {
    path: '/address/details/:address',
    name: 'Address Details',
    // component: () => import('@/views/DaoPage/AddressDetail.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/mintdaobadge',
    name: 'Mint Badge',
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/proposal/details/:id',
    name: 'Proposal Details',
    // component: () => import('@/views/DaoPage/ProposalDetail.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/ecology/:ecoCode',
    name: 'Ecology System',
    meta: {
      nav: 'Ecology',
    },
    // component: () => import('@/views/Ecology/EcosystemProfile.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: (to) => {
    //   return `${to.path}/details`;
    // },
    // children: [
    //   {
    //     meta: {
    //       nav: 'Ecology',
    //     },
    //     name: 'Ecosystem Details',
    //     path: 'details',
    //     component: () => import('@/views/Ecology/EcosystemProfile.vue'),
    //   },
    // ],
  },
  {
    meta: {
      nav: 'Ecology',
      title: 'Ecology - DAO BASE',
      description:
        'Whether you are a joiner, investor, developer, or community member easily view DAOs within the same ecosystem and learn more about the various DAOs in your area of interest.',
    },
    path: '/ecology',
    name: 'Ecology',
    // component: () => import('@/views/Ecology/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    meta: {
      nav: 'Points',
      title: 'Points - DAO BASE',
      description:
        'Whether you are a joiner, investor, developer, or community member easily view DAOs within the same ecosystem and learn more about the various DAOs in your area of interest.',
    },
    path: '/point',
    name: 'Points',
    // component: () => import('@/views/Point/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: () => {
    //   // @ts-ignore
    //   if(store.state.wallet.isSignedIn) {
    //     // @ts-ignore
    //     return `/point/task?address=${store.state.wallet.accounts[0]}`;
    //   } else {
    //     mittWalletSelect();
    //   }
    // },
    // children: [
    //   {
    //     name: 'Point Tasks',
    //     path: 'task',
    //     component: () => import('@/views/Point/Task.vue'),
    //   },
    //   {
    //     name: 'Point Leaderboard',
    //     path: 'leaderboard',
    //     component: () => import('@/views/Point/Leaderboard.vue'),
    //   },
    //   {
    //     name: 'Point Invites',
    //     path: 'invites',
    //     component: () => import('@/views/Point/Invites.vue'),
    //     props: true,
    //   },
    //   {
    //     name: 'Point Guides',
    //     path: 'guides',
    //     component: () => import('@/views/Point/Guides.vue'),
    //   },
    // ],
  },
  {
    path: '/profile',
    name: 'Profile',
    // component: () => import('@/views/Profile.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: '/profile/overview',
    // children: [
    //   {
    //     path: 'overview',
    //     component: () => import('@/components/Profile/Overview.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     path: 'collections',
    //     name: 'Collections',
    //     component: () => import('@/components/Profile/PassList.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    // ],
  },
  {
    path: '/creator',
    name: 'Creator',
    // component: () => import('@/views/Creator.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: '/creator/all',
    // meta: {
    //   nav: 'Creator',
    //   title: 'DAO Hub - DAO BASE',
    //   description:
    //     'The DAO Hub module allows you to see all the DAOs that are actively onboarded to DAO BASE and to filter those that are Verified.',
    // },
    // children: [
    //   {
    //     name: 'all',
    //     path: 'all',
    //     component: () => import('@/components/RouteEmpty.vue'),
    //   },
    //   {
    //     name: 'hot',
    //     path: 'hot',
    //     component: () => import('@/components/RouteEmpty.vue'),
    //   },
    // ],
  },
  {
    path: '/create',
    name: 'Create Flow',
    // component: () => import('@/views/CreateFlow/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: '/create/dao',
    // children: [
    //   {
    //     path: 'dao',
    //     name: 'Create Flow Dao',
    //     component: () => import('@/views/CreateFlow/Dao.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     path: 'treasury',
    //     name: 'Create Flow Dashboard',
    //     component: () => import('@/views/CreateFlow/Treasury.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     path: 'governance',
    //     name: 'Create Flow Governance',
    //     component: () => import('@/views/CreateFlow/Governance.vue'),
    //   },
    //   {
    //     path: 'passsettings',
    //     name: 'Create Flow Pass Settings',
    //     component: () => import('@/views/CreateFlow/PassSettings.vue'),
    //   },
    //   {
    //     path: 'addpass',
    //     name: 'Create Flow AddPass',
    //     component: () => import('@/views/CreateFlow/AddPass.vue'),
    //   },

    //   {
    //     path: 'pass/:daoId?',
    //     name: 'Create Flow Pass',
    //     component: () => import('@/views/CreateFlow/Pass.vue'),
    //     redirect: (to) => {
    //       if (to.params.daoId) {
    //         return `/create/pass/${to.params.daoId}/fp`;
    //       }
    //       return '/create/pass/fp';
    //     },
    //     children: [
    //       {
    //         path: 'fp',
    //         name: 'Create Flow Pass FP',
    //         component: () =>
    //           import('@/views/CreateFlow/PassType/FixedPrice.vue'),
    //         meta: {
    //           noMb: true,
    //         },
    //       },
    //       {
    //         path: 'bc',
    //         name: 'Create Flow Pass BC',
    //         component: () =>
    //           import('@/views/CreateFlow/PassType/BondingCurve.vue'),
    //         meta: {
    //           noMb: true,
    //         },
    //       },
    //       {
    //         path: 'sb',
    //         name: 'Create Flow Pass SB',
    //         component: () =>
    //           import('@/views/CreateFlow/PassType/StakingBase.vue'),
    //         meta: {
    //           noMb: true,
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: 'Create Flow Calendar',
    //     path: 'calendar',
    //     component: () => import('@/views/CreateFlow/Events.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    // ],
  },
  {
    path: '/verified/email',
    name: 'email verification',
    // component: () => import('@/views/ProfileSetting/EmailVerified.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/settings',
    name: 'Setting Page',
    // component: () => import('@/views/ProfileSetting/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: (to) => {
    //   return '/settings/profile';
    // },
    // children: [
    //   {
    //     name: 'Profile Setting',
    //     path: 'profile',
    //     component: () => import('@/views/ProfileSetting/index.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     name: 'Notify Setting',
    //     path: 'notify',
    //     component: () => import('@/views/ProfileSetting/index.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    // ],
  },
  {
    path: '/pass_settings/:name',
    name: 'Pass Settings',
    // component: () => import('@/views/CreateFlow/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: (to) => {
    //   return `/pass_settings/${to.params.name}/dao`;
    // },
    // children: [
    //   {
    //     name: 'Pass Settings Dao',
    //     path: 'dao',
    //     component: () => import('@/views/CreateFlow/Dao.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     name: 'Pass Settings Pass',
    //     path: 'addpass',
    //     component: () => import('@/views/CreateFlow/AddPass.vue'),
    //   },
    //   {
    //     name: 'Pass Settings Treasury ',
    //     path: 'treasury',
    //     component: () => import('@/views/CreateFlow/Treasury.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     name: 'Pass Settings Governance ',
    //     path: 'governance',
    //     component: () => import('@/views/CreateFlow/Governance.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     path: 'addpass',
    //     name: 'Pass Settings AddPass',
    //     component: () => import('@/views/CreateFlow/AddPass.vue'),
    //   },

    //   {
    //     name: 'Pass Settings Pass',
    //     path: 'pass',
    //     component: () => import('@/views/CreateFlow/Pass.vue'),
    //     redirect: (to) => {
    //       if (to.params.name) {
    //         return `/pass_settings/${to.params.name}/pass/fp`;
    //       }
    //       return '/pass_settings/pass/fp';
    //     },
    //     children: [
    //       {
    //         path: 'fp',
    //         name: 'Pass Settings Pass FP',
    //         component: () =>
    //           import('@/views/CreateFlow/PassType/FixedPrice.vue'),
    //         meta: {
    //           noMb: true,
    //         },
    //       },
    //       {
    //         path: 'bc',
    //         name: 'Pass Settings Pass BC',
    //         component: () =>
    //           import('@/views/CreateFlow/PassType/BondingCurve.vue'),
    //         meta: {
    //           noMb: true,
    //         },
    //       },
    //       {
    //         path: 'sb',
    //         name: 'Pass Settings  Pass SB',
    //         component: () =>
    //           import('@/views/CreateFlow/PassType/StakingBase.vue'),
    //         meta: {
    //           noMb: true,
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     name: 'Pass Settings Calendar',
    //     path: 'calendar',
    //     component: () => import('@/views/CreateFlow/Events.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    // ],
  },
  {
    path: '/create-success',
    name: 'create-success',
    // component: () => import('@/views/CreateDAO/CreateDAOSuccess.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    meta: {
      noMb: true,
    },
  },

  {
    path: '/claim',
    name: 'Claim',
    // component: () => import('@/views/Claim.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: '/claim/token-base',
    // children: [
    //   {
    //     name: 'claim-token-base',
    //     path: 'token-base',
    //     component: () => import('@/components/Claim/Passes/TokenBased.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     name: 'claim-fixed-price',
    //     path: 'fixed-price',
    //     component: () => import('@/components/Claim/Passes/FixedPrice.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     name: 'claim-nft-base',
    //     path: 'nft-base',
    //     component: () => import('@/components/Claim/Passes/NFTBased.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    //   {
    //     name: 'claim-bonding-curve',
    //     path: 'bonding-curve',
    //     component: () => import('@/components/Claim/Passes/BondingCurve.vue'),
    //     meta: {
    //       noMb: true,
    //     },
    //   },
    // ],
  },
  {
    path: '/dao-profit/:type/:name',
    name: 'Dao Profit',
    // component: () => import('@/views/Profit.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // meta: {
    //   noMb: true,
    // },
    // beforeEnter(to) {
    //   if (
    //     ['fixed_price', 'bonding_curve'].findIndex(
    //       (x) => x == to.params.type,
    //     ) === -1
    //   ) {
    //     return false;
    //   }
    // },
  },
  {
    path: '/venture-dao',
    name: 'Venture DAO',
    // component: () => import('@/views/Common/ComingSoon.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/gov-dao',
    name: 'Governance DAO',
    // component: () => import('@/views/Common/ComingSoon.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/wiki',
    name: 'Wiki',
    // component: () => import('@/views/Common/ComingSoon.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/brand',
    name: 'Brand',
    // component: () => import('@/views/Brand.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/dao100/:type',
    name: 'Dao 100',
    // component: () => import('@/views/AnnualRanking/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    meta: {
      nav: 'Dao 100',
      title: 'Dao 100 - DAO BASE',
    },
  },
  {
    path: '/dao100',
    name: 'Dao 100 Default',
    redirect: {
      name: 'Dao 100',
      params: {
        type: 'bytreasury',
      },
    },
  },
  {
    path: '/0xSaya',
    name: 'metaren',
    // component: () => import('@/views/SayaLin.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },

  {
    path: '/blog',
    name: 'Blog',
    // component: () => import('@/views/Blog/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    meta: {
      nav: 'Blog',
      title: 'Blogs - DAO BASE',
      description:
        'View important information about the DAO ecosystem, partner updates, monthly product updates, and industry analysis reports.',
    },
  },
  {
    path: '/blog/:id',
    name: 'BlogDetails',
    // component: () => import('@/views/Blog/Details.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/twoauth/:daoName',
    name: 'TwitterOauth',
    // component: () => import('@/views/TwOauth.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/leaderboard',
    name: 'Leader Board Default',
    redirect: {
      name: 'Leader Board',
      params: {
        type: 'all',
        chain: 'ethereum',
      },
    },
  },
  {
    path: '/proposals',
    name: 'Proposals Default',

    redirect: {
      name: 'proposal dasboard',
      params: {
        type: 'all',
        chain: 'ethereum',
        tab: 'proposal',
      },
    },
  },
  {
    path: '/members',
    name: 'Members Default',

    redirect: {
      name: 'member dasboard',
      params: {
        type: 'all',
        chain: 'ethereum',
        tab: 'member',
      },
    },
  },
  {
    path: '/partners',
    name: 'Partners',
    // component: () => import('@/views/Partners.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/audit',
    name: 'Audit',
    meta: {
      nav: 'Service',
      type: 'Audit',
    },
    // component: () => import('@/views/Audit.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/leaderboard/:type/:chain',
    name: 'Leader Board',
    // component: () => import('@/views/LeaderBoard/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),

    meta: {
      nav: 'LeaderBoard',
      title: 'Leaderboard - DAO BASE',
      description:
        'View polygon, ethereum, tezos chain data on the DAO Leaderboard, view the treasury and governance overview of the DAOs of each chain or all combined.',
    },
  },
  {
    path: '/proposals/:type/:chain/:tab',
    name: 'proposal dasboard',
    // component: () => import('@/views/Proposal/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    meta: {
      nav: 'Proposals',

      title: 'Proposals - DAO BASE',
      description:
        'View polygon, ethereum, tezos chain data on the DAO Proposal, view the overview of the DAOs of each chain or all combined.',
    },
  },
  {
    path: '/members/:type/:chain/:tab',
    name: 'member dasboard',
    // component: () => import('@/views/Member/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    meta: {
      nav: 'Members',

      title: 'Members - DAO BASE',
      description:
        'View polygon, ethereum, tezos chain data on the DAO Proposal, view the overview of the DAOs of each chain or all combined.',
    },
  },
  {
    path: '/comeon/:daoName/:twName',
    name: 'Come on',
    // component: () => import('@/views/LeaderBoard/Verify.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
  },
  {
    path: '/dao/:name',
    name: 'New DaoPage',
    // component: () => import('@/views/DaoPage/index.vue'),
    component: () => import('@/views/MintBadge/MintBadge.vue'),
    // redirect: (to) => {
    //   return `${to.path}/DAOPage`;
    // },
    // children: [
    //   {
    //     name: 'DaoPage Overview',
    //     path: 'DAOPage',
    //     component: () => import('@/views/DaoPage/Overview.vue'),
    //   },
    //   {
    //     name: 'DaoPage NftPass',
    //     path: 'NFTPASS',
    //     component: () => import('@/views/DaoPage/NftPass.vue'),
    //   },
    //   {
    //     name: 'DaoPage Treasury',
    //     path: 'treasury',
    //     component: () => import('@/views/DaoPage/Treasury/index.vue'),
    //     children: [
    //       {
    //         name: 'NFT VAULT',
    //         path: 'nft',
    //         component: () => import('@/views/DaoPage/Treasury/Nft.vue'),
    //         redirect: (to) => {
    //           return `${to.path}/list/asset`;
    //         },
    //         children: [
    //           {
    //             name: 'NFT VAULT LIST',
    //             path: 'list',
    //             redirect: (to) => {
    //               return `${to.path}/asset`;
    //             },
    //             component: () => import('@/views/DaoPage/Treasury/NftList.vue'),
    //             children: [
    //               {
    //                 name: 'NFT VAULT LIST STATE',

    //                 path: ':state',
    //                 component: () =>
    //                   import('@/views/DaoPage/Treasury/NftList.vue'),
    //               },
    //             ],
    //           },
    //           {
    //             name: 'NFT VAULT DETAIL',
    //             path: 'detail/:projectName',
    //             component: () =>
    //               import('@/views/DaoPage/Treasury/NftDetails.vue'),
    //           },
    //         ],
    //       },
    //       {
    //         name: 'FT VAULT',
    //         path: 'ft',
    //         component: () => import('@/views/DaoPage/Treasury/Ft.vue'),
    //         redirect: (to) => {
    //           return `${to.path}/asset`;
    //         },
    //         children: [
    //           {
    //             name: 'FT VAULT STATE',
    //             path: ':state',
    //             component: () => import('@/views/DaoPage/Treasury/Ft.vue'),
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     name: 'Report',
    //     path: 'report',
    //     component: () => import('@/views/DaoPage/Treasury/Report.vue'),
    //   },
    //   {
    //     name: 'DaoPage Governance',
    //     path: 'Governance',
    //     component: () => import('@/views/DaoPage/Governance.vue'),
    //   },
    //   {
    //     name: 'DaoPage Member',
    //     path: 'Member',
    //     component: () => import('@/views/DaoPage/Members.vue'),
    //   },
    //   {
    //     name: 'DaoPage Calendar',
    //     path: 'calendar',
    //     component: () => import('@/views/DaoPage/Events.vue'),
    //   },
    // ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (/new-dao/.test(from.path) && /new-dao/.test(to.path)) {
      return;
    }
    if (/\/creator\//.test(from.path) && /\/creator\//.test(to.path)) {
      return;
    }
    if (/\/dao\//.test(from.path) && /\/dao\//.test(to.path)) {
      return;
    }
    if (/\/create\//.test(from.path) && /\/create\//.test(to.path)) {
      return;
    }
    if (
      /\/pass_settings\/.*\/pass\//.test(from.path) &&
      /\/pass_settings\/.*\/pass\//.test(to.path)
    ) {
      return;
    }

    if (/\/newdaopage\//.test(from.path) && /\/newdaopage\//.test(to.path)) {
      return;
    }

    const fromSubTask = 
    from.name === 'Point Task' || 
    from.name === 'Point Invites' || 
    from.name === 'Point Leaderboard' || 
    from.name === 'Point Guides';

    const toSubTask = 
    to.name === 'Point Invites' || 
    to.name === 'Point Leaderboard' || 
    to.name === 'Point Guides';

    if (fromSubTask && to.name === 'Point Task') {
      if(window.screen.width <= 768) {
        return { left: 0, top: 812 };
      } else {
        return { left: 0, top: 395 };
      }
    }

    if (toSubTask) {
      if(window.screen.width <= 768) {
        return { left: 0, top: 812 };
      } else {
        return { left: 0, top: 395 };
      }
    }

    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to, from) => {
  setTimeout(() => {
    store.commit('toggleStatus', false);
  }, 300);

  // @ts-ignore
  if (to.name == 'Create Flow Dao' && !store.state.wallet.isSignedIn) {
    withWalletLogin(() => {
      /*  */
    })();
    return false;
  }

  if (to.path !== "/mintdaobadge") {
    console.log('to.path::', to);
    window.open(`https://daobase.ai${to.path}`, '_blank');
    return false;
  }

});

export default router;
