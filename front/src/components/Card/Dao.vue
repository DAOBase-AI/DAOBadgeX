<template>
  <div
    class="relative bg-white-005 rounded w-full h-72 cursor-pointer text-whitebase p-4 profile-dao-box"
    @click="doDao"
  >
    <div class="flex justify-between mb-4">
      <img
        class="w-16 h-16 rounded-full object-cover"
        :src="info.logo"
        alt=""
      />

      <div>
        <div class="flex justify-end" v-if="!props.isCreated">
          <div
            class="bg-white-010 text-white-070 text-xs h-6 flex items-center px-2 rounded mb-2"
          >
            {{
              info.role == null
                ? 'DAO Creator'
                : info.role == 0
                ? 'DAO Administrator'
                : 'Editor'
            }}
          </div>
        </div>

        <!-- Time -->
        <div class="text-xs text-tip-0" v-if="!props.info.isActivityTemp">
          <span
            :style="{
              color:
                state.isDeployed ||
                props.info.status == 0 ||
                props.info.status == 1 ||
                props.info.status == 2 ||
                props.info.status == 5
                  ? '#5E6873FF'
                  : '#FF5585FF',
            }"
            >{{
              formatDate(
                state.isDeployed ||
                  props.info.status == 0 ||
                  props.info.status == 1 ||
                  props.info.status == 2 ||
                  props.info.status == 5
                  ? props.info.createTime
                  : scheduleTime,
                'YYYY-MM-DD HH:mm:ss',
              )
            }}</span
          >
        </div>
      </div>
    </div>

    <div class="font-bold line-clamp-1 h-6 mb-4">
      {{ info.name || ' ' }}
    </div>

    <tippy :content="info.intro" :arrow="false">
      <div class="line-clamp-1 h-4 mb-4 text-xs">
        {{ info.intro || ' ' }}
      </div>
    </tippy>

    <div>
      <div class="text-tip-0 text-xs mb-2">NFT PASS</div>
      <div class="relative">
        <UiImg
          v-if="info.passLogo"
          class="w-10 h-10 rounded-full overflow-hidden mb-6 object-cover"
          :src="info.passLogo"
          alt=""
        />
        <img
          v-else
          class="w-10 h-10 rounded-full mb-6"
          src="@/assets/images/icons/nopass.avif"
          alt=""
        />

        <div class="absolute left-0 top-0">
          <img
            v-if="info.passType == 'bonding_curve'"
            class="w-4 h-4"
            src="@/assets/icons/bc.avif"
            alt=""
          />

          <img
            v-else-if="info.passType == 'fixed_price'"
            class="w-4 h-4"
            src="@/assets/icons/fp.avif"
            alt=""
          />

          <img
            v-else-if="!!info.passType"
            class="w-4 h-4"
            src="@/assets/icons/sb.avif"
            alt=""
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center">
      <div class="space-y-2 text-center w-10/12 mx-auto">
        <!-- 

          isDeploying
          isDeployed
          isDeployFailed
          isCanDeployFuture
          isCanDeployNow
          isOnlyDao
          
         -->

        <!-- Button -->
        <div class="flex space-x-4 absolute bottom-4 right-4">
          <UiButton
            type="outline"
            size="sm"
            v-if="props.isEdit"
            error
            @click.stop="doEdit(info)"
            >Settings</UiButton
          >
          <UiButton
            v-else-if="!isCanDeployFuture && !isCanDeployNow"
            error
            @click.stop="info.passType, info.name"
            :disabled="props.info.isActivityTemp || !isDeployed"
            >GET PASS</UiButton
          >

          <UiButton
            v-if="
              isDeployed ||
              info.isActivityTemp ||
              (!props.isEdit && !isCanDeployFuture && !isCanDeployNow)
            "
            type="outline"
            size="sm"
            @click.stop="doSquad(props.info.name, props.info.passType)"
            :disabled="info.isActivityTemp || !isDeployed"
            >SQUAD</UiButton
          >
          <UiButton
            v-else-if="props.isEdit && isOnlyDao"
            type="outline"
            size="sm"
            @click.stop="doCreate(props.info.daoPath)"
            >CREATE</UiButton
          >
          <UiButton
            type="outline"
            size="sm"
            v-else-if="props.isEdit"
            @click.stop="doDeploy()"
            :disabled="!state.canDeployed"
            >DEPLOY</UiButton
          >
        </div>
      </div>

      <!-- <div
        v-if="info.passType"
        class="
          absolute
          top-8
          left-1
          flag_bg
          rounded-1
          w-8
          h-7
          flex
          items-center
        "
      >
        <div
          class="
            flag_bg
            text-main-5
            italic
            w-full
            m-px-2
            font-bold
            self-stretch
            text-center
          "
        >
          {{
            {
              nft_base: 'NB',
              token_base: 'TB',
              fixed_price: 'FP',
              bonding_curve: 'BC',
            }[info.passType]
          }}
        </div>
      </div> -->
      <div
        v-if="
          ['fixed_price', 'bonding_curve'].includes(info.passType) &&
          props.isEdit &&
          props.isCreated
        "
        class="absolute top-8 right-px-2 flag_bg rounded-1 h-7 flex items-center text-sm cursor-pointer"
        @click.stop="doProfits(info.passType, info.name)"
      >
        <div
          class="flag_bg text-main-5 italic w-full m-px-2 font-bold self-stretch text-center"
        >
          Profits
        </div>
      </div>
    </div>
    <!-- <div
      v-if="props.info.expired"
      class="absolute top-0 left-0 bg-dark w-full h-full flex items-center"
    >
      <div class="bg-gradient-error w-full text-center text-main-5 mb-8">
        <div class="bg-gradient-error w-full text-center text-main-5 m-px-2">
          PASS Expired
        </div>
      </div>
      <div
        class="
          absolute
          w-3/4
          px-3
          left-1/2
          transform
          -translate-x-1/2
          bottom-12
        "
      >
        <Button @click.stop="doIssue">ISSUE</Button>
      </div>
    </div> -->
  </div>

  <Dialog
    :visible="state.show"
    @close="state.show = false"
    theme="dark"
    containerClass="dialog-class"
  >
    <UiScrollbars class="h-96 mt-12 mb-6">
      <div class="pr-4 pb-16 text-whitebase">
        <!-- baseic -->
        <div>
          <div class="text-xl font-bold">Edit Basic Information</div>
          <div class="my-6 space-y-3">
            <div v-for="(key, i) in linkKeys" :key="i">
              <div class="grid grid-box gap-6">
                <div class="h-10 flex items-center justify-end">
                  <span class="text-xs">{{ linkLabel[key] }}</span>
                </div>

                <UiInput
                  v-model="state[key]"
                  v-if="key != 'customizeLink'"
                  :placeholder="linkLabel[key]"
                ></UiInput>
                <div v-else class="space-y-3">
                  <div
                    v-for="(link, j) in state[key]"
                    :key="j"
                    class="flex relative"
                  >
                    <UiInput
                      v-model="link.name"
                      class="w-1/3 mr-2 md:flex-none"
                      placeholder="Name"
                    ></UiInput>
                    <UiInput
                      v-model="link.url"
                      class="flex-1"
                      placeholder="Link"
                    ></UiInput>
                    <div
                      class="flex items-center text-whitebase absolute -right-1 -top-1 cursor-pointer"
                    >
                      <XIcon
                        v-if="j != 0"
                        class="w-4 h-4"
                        @click="state[key].splice(j, 1)"
                      ></XIcon>
                    </div>
                  </div>

                  <div class="flex">
                    <div
                      class="iconfont icon-tianjia-46 cursor-pointer"
                      @click="state[key].push({ name: '', url: '' })"
                      v-if="state[key].length < 5"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- whitelist mode -->
        <div>
          <div class="text-xl text-whitebase font-bold">Whitelist Mode</div>
          <div class="my-6">
            <div class="grid grid-box gap-6">
              <div class="flex items-center mb-1 justify-end h-10 text-xs">
                address
              </div>
              <div class="flex items-center">
                <UiTabs
                  v-model="state.whiteMode"
                  :tabs="['Add', 'Delete']"
                ></UiTabs>
              </div>
            </div>

            <div v-if="state.whiteMode == 0">
              <div class="grid grid-box gap-6">
                <div class="flex items-center mb-1 justify-end h-10"></div>
                <div>
                  <div>
                    <UiInput v-model="state.addAddressText"></UiInput>
                    <div
                      class="iconfont icon-tianjia-46 cursor-pointer inline-table"
                      @click="addWhite"
                    ></div>
                  </div>

                  <div class="text-xs mt-6 mb-2">
                    Or drag the file down below（<a
                      :href="downloadUrl"
                      class="underline"
                      style="color: #268cff"
                      >download templete here</a
                    >）
                  </div>

                  <UiUploadFile
                    :onUpload="
                      uploadWl(
                        `/whitelist/addByExcel/${state.chain}/${state.contractAddr}`,
                      )
                    "
                    class="dao-upload"
                  ></UiUploadFile>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="grid grid-box gap-6">
                <div class="flex items-center mb-1 justify-end h-10"></div>
                <div>
                  <div>
                    <UiInput v-model="state.delAddressText"></UiInput>

                    <div
                      class="cursor-pointer inline-table"
                      @click="delWhite()"
                    >
                      --
                    </div>
                  </div>

                  <div class="text-xs mt-6 mb-2">
                    Or drag the file down below（<a
                      :href="downloadUrl"
                      class="underline"
                      style="color: #268cff"
                      >download templete here</a
                    >）
                  </div>

                  <UiUploadFile
                    :onUpload="
                      uploadWl(
                        `/whitelist/delByExcel/${state.chain}/${state.contractAddr}`,
                      )
                    "
                    class="dao-upload"
                  ></UiUploadFile>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- dashboard -->
        <div>
          <div class="text-xl font-bold">Dashboard</div>
          <div class="mt-8 space-y-3">
            <div>
              <div class="grid grid-box gap-6">
                <div class="flex items-center mb-1 justify-end h-10">
                  <span class="text-xs">Display Order</span>
                </div>
                <div class="flex items-center">
                  <!-- <UiTabs
                    v-model="state.displayMode"
                    :tabs="['NFT Vault First', 'FT Vault First']"
                  ></UiTabs> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiScrollbars>

    <div class="mt-12 w-1/3 mx-auto">
      <Button bold @click.stop="doSave">Save</Button>
    </div>
  </Dialog>
</template>

<script setup>
import Button from '@/components/Button.vue';
import Dialog from '@/components/Dialog.vue';
import UiButton from '@/components/UiButton.vue';
import { computed, defineProps, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { addWlBatch, delWlBatch, uploadFile } from '@/api/common';
import { sendDaoTxHash, updateDao } from '@/api/dao';
import UiImg from '@/components/UiImg.vue';
import UiInput from '@/components/UiInput.vue';
import UiScrollbars from '@/components/UiScrollbars.vue';
import UiTabs from '@/components/UiTabs.vue';
import UiUploadFile from '@/components/UiUploadFile.vue';
import {
  BackNetworkType,
  FIXED_PRICE_OPTIONS_BY_NETWORK,
  NetworkType,
} from '@/constants';
import { getFactoryMethods } from '@/constants/contract';
import { mittContract } from '@/libs/event';
import { formatDate, getClaimPath, handleWalletError } from '@/utils';
import { withOwnPass, withThrottling, withWalletFlow } from '@/utils/with';
import { XIcon } from '@heroicons/vue/outline';
import { notify } from '@kyvg/vue3-notification';
import { useStore } from 'vuex';

const $router = useRouter();

const TestList = [
  {
    network: 'Polygon',
    trackedAddress: '0xdae36002431aa9394be363d3d43fbdb6de6af7cc',
  },
  {
    network: 'Polygon',
    trackedAddress: '0x23eb4e02c29e69452718cd5caf2255488bc7ce3a',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0x23eb4e02c29e69452718cd5caf2255488bc7ce3a',
  },
  {
    network: 'Polygon',
    trackedAddress: '0xf6dcc7aed1efecee267542e26be742b7f8f095ff',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0xf6dcc7aed1efecee267542e26be742b7f8f095ff',
  },
  {
    network: 'Polygon',
    trackedAddress: '0x6e7f09aa3d151b932de2e7846e8341902d0fbeef',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0x6e7f09aa3d151b932de2e7846e8341902d0fbeef',
  },
  {
    network: 'Polygon',
    trackedAddress: '0x1af5478e25BC877d27f794962696211eac474FcE',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0x1af5478e25BC877d27f794962696211eac474FcE',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0xcafeacdadd29f55ce935492e20f1f982df3fb51d',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0x12eca18aac6db2470e000c0688cf11b9d8ea1d31',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0x2662A2d03695C80ca3C5645cbC2E7547842dA6bC',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0x16b281438C5984A46D94acc6C4b31e252A03DFCf',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0xF0103243F4d22B5696588646b21313d85916A16A',
  },
  {
    network: 'Ethereum',
    trackedAddress: '0xe30ED74c6633a1B0D34a71c50889f9F0fDb7D68A',
  },
];

const linkKeys = [
  'website',
  'twitter',
  'discordLinkUrl',
  'telegramLinkUrl',
  'whitepaper',
  'openseaUrl',
  'superrareUrl',
  'foundationUrl',
  'customizeLink',
];
const linkLabel = {
  website: 'Website',
  whitepaper: 'WhitePaper',
  twitter: 'Twitter',
  superrareUrl: 'Superrare',
  openseaUrl: 'Opensea',
  foundationUrl: 'Fundation',
  customizeLink: 'For More',
  discordLinkUrl: 'Discrod',
  telegramLinkUrl: 'Telegram',
};

const botKeys = ['discordLinkUrl', 'telegramLinkUrl'];
const botLabel = {
  discordLinkUrl: 'Discrod',
  telegramLinkUrl: 'Telegram',
};

const $store = useStore();

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
  isEdit: Boolean,
  isCreated: Boolean,
});

const state = reactive({
  show: false,
  id: '',
  whitepaper: '',
  website: '',
  twitter: '',
  superrareUrl: '',
  openseaUrl: '',
  foundationUrl: '',
  customizeLink: [{ name: '', url: '' }],
  discordLinkUrl: '',
  telegramLinkUrl: '',
  isDeployed: true,
  canDeployed: true,
  dashboardSwitch: props.info.dashboardIsOpen,
  daoInitialFundraising: [],
  daoDashboardConfig: [],
  addAddressText: '',
  delAddressText: '',
  chain: '',
  contractAddr: '',
  whiteMode: 0,
  displayMode: 0,
});

const formData = computed(() => JSON.parse(props.info.formJson || '{}'));
const network = computed(() => {
  const { passType, passBondingCurve, passFixedPrice, passStakingBasedDTO } =
    formData.value;
  const net = (
    passType == 'fixed_price'
      ? passFixedPrice
      : passType == 'bonding_curve'
      ? passBondingCurve
      : passStakingBasedDTO
  ).network;

  return BackNetworkType[net];
});
const scheduleTime = computed(() => {
  const { passType, passBondingCurve, passFixedPrice, passStakingBasedDTO } =
    formData.value;
  const obj =
    passType == 'fixed_price'
      ? passFixedPrice
      : passType == 'bonding_curve'
      ? passBondingCurve
      : passStakingBasedDTO;

  if (obj) {
    return obj.schedulingAhead;
  } else {
    return props.info.schedulingAhead || '';
  }
});

const doDao = () => {
  $router.push(`/dao/${props.info.daoPath}`);
};

const doSquad = withOwnPass();

const doEdit = (info) => {
  $router.push(`/pass_settings/${props.info.daoPath}`);

  // state.show = true;

  // linkKeys.forEach((key) => {
  //   state[key] = info[key];
  //   if (key == 'customizeLink') {
  //     state[key] =
  //       state[key] && state[key].length > 0
  //         ? state[key]
  //         : [{ name: '', url: '' }];
  //   }
  // });

  // state.id = info.id;

  // state.daoInitialFundraising =
  //   !info.daoInitialFundraising || info.daoInitialFundraising.length == 0
  //     ? [
  //         {
  //           symbol: '',
  //           quantity: '',
  //         },
  //       ]
  //     : info.daoInitialFundraising;

  // if (info.daoDashboardConfig) {
  //   info.daoDashboardConfig.forEach((obj) => {
  //     obj.network = BackNetworkType[obj.network];
  //   });
  // }

  // state.daoDashboardConfig =
  //   !info.daoDashboardConfig || info.daoDashboardConfig.length == 0
  //     ? [
  //         {
  //           network: {
  //             label: 'Ethereum',
  //             value: 'ethereum',
  //           },
  //           trackedAddress: '',
  //         },
  //       ]
  //     : info.daoDashboardConfig.map((x) => ({
  //         network: {
  //           label: x.network,
  //           value: x.network,
  //         },
  //         trackedAddress: x.trackedAddress,
  //       }));

  // (async () => {
  //   const res = await queryDAOById(props.info.id);
  //   state.chain = res.chain;
  //   state.contractAddr = res.contractAddress;
  // })();
};
const doGetPass = (passType, id) => {
  $router.push(getClaimPath(passType, id));
};

const doCreate = (id) => {
  $router.push(`/pass_settings/${id}/pass`);
};

const doProfits = (passType, id) => {
  $router.push(`/dao-profit/${passType}/${id}`);
};

const doSave = async () => {
  const params = { id: state.id };

  linkKeys.forEach((key) => {
    params[key] = state[key];
  });

  params.daoInitialFundraising = state.daoInitialFundraising;
  params.daoDashboardConfig = JSON.parse(
    JSON.stringify(state.daoDashboardConfig),
  );
  params.dashboardIsOpen = state.dashboardSwitch;

  params.daoDashboardConfig.forEach((obj) => {
    obj.network = NetworkType[obj.network.label];
  });

  if (await updateDao(params)) {
    state.show = false;
    notify({
      text: 'Update success',
      duration: 20000,
    });
  }
};

const doDeploy = withThrottling(
  withWalletFlow(
    async () => {
      const res = formData.value;

      // console.log(res);
      mittContract(true);
      const {
        name: daoName,
        passName: name,
        passSymbol: symbol,
        passFixedPrice,
        passBondingCurve,
        passStakingBasedDTO,
      } = res;
      const {
        payWith,
        receivingAddress,
        supply: quantity,
        payment,
        validityType,
        certainTime,
      } = passFixedPrice;

      const receiveAddress =
        res.passType === 'fixed_price'
          ? FIXED_PRICE_OPTIONS_BY_NETWORK(network.value)[payWith].address
          : payWith;

      let method = await getFactoryMethods(
        res.passType,
        passStakingBasedDTO.tokenMintTheNftPass,
      );
      let params = { name, symbol, daoName };

      if (res.passType == 'staking_based') {
        const {
          tokenContractAddress,
          nftContractAddress,
          tokensNeededToMintANft,
          mintLimit,
          isWhiteList,
          duration,
        } = passStakingBasedDTO;

        // method = await getFactoryMethods(
        //   res.passType,
        //   tokenMintTheNftPass,
        // );

        /*
         name,
        symbol,
        daoName = 'test',
        address = '0xc2d6b32e533e7a8da404abb13790a5a2f606ad75',
        repeatMintNum,
        mintDeadlineTime,
        isNotWhitelist,
         */

        params = {
          ...params,
          address: tokenContractAddress || nftContractAddress,
          num: tokensNeededToMintANft,
          repeatMintNum: mintLimit,
          mintDeadlineTime: duration,
          isNotWhitelist: Boolean(isWhiteList),
        };
      }

      if (res.passType == 'fixed_price') {
        params = {
          ...params,
          receiveAddress,
          receivingAddress,
          quantity: quantity == -1 ? undefined : quantity,
          payment,
          validityType,
          certainTime,
          repeatMintNum: passFixedPrice.mintLimit,
          mintDeadlineTime: passFixedPrice.duration,
          isNotWhitelist: Boolean(passFixedPrice.isWhiteList),
        };
      }

      if (res.passType == 'bonding_curve') {
        params = {
          ...params,
          bond_receiver_addr: passBondingCurve.receivingAddress,
          bond_rate: passBondingCurve.creatorFee,
          bond_init_price: passBondingCurve.initialPrice,
          bond_token: passBondingCurve.collateralTokens,
          bond_m: passBondingCurve.m,
          bond_n: passBondingCurve.n,
        };
      }
      try {
        const tx = await method(params);
        await tx.wait();
        await sendDaoTxHash(tx.hash, props.info.id);
        mittContract(false);
        state.isDeployed = true;
      } catch (error) {
        handleWalletError(error);
        mittContract(false);
      }
    },
    () => network.value,
  ),
);

const isDeploying = computed(() => props.info.status == 0);
const isDeployed = computed(() => state.isDeployed);
const isDeployFailed = computed(() => props.info.status == 2);
const isCanDeployFuture = computed(() => props.info.status == 3);
const isCanDeployNow = computed(() => props.info.status == 4);
const isOnlyDao = computed(() => props.info.status == 5);

const downloadUrl = computed(
  () => `${process.env.VUE_APP_API_URL}/excel/download/whiteListTemplate`,
);

onMounted(() => {
  state.isDeployed = +props.info.status == 1;
  state.canDeployed = [4, 2, 0].includes(+props.info.status);
});

const delFund = (index) => {
  state.daoInitialFundraising.splice(index, 1);
};

const addFund = () => {
  /*  */
  state.daoInitialFundraising.push({
    quantity: '',
    symbol: '',
  });
};

const delAddress = (index) => {
  state.daoDashboardConfig.splice(index, 1);
};

const addAddress = () => {
  state.daoDashboardConfig.push({
    network: 'Ethereum',
    trackedAddress: '',
  });
};

const addWhite = async () => {
  try {
    await addWlBatch([state.addAddressText], state.chain, state.contractAddr);
    state.addAddressText = '';
    notify({
      text: 'Add address successfully',
    });
  } catch (error) {
    notify({
      type: 'error',
      text: 'Add failed.',
    });
  }
};

const delWhite = async () => {
  try {
    await delWlBatch([state.delAddressText], state.chain, state.contractAddr);
    state.delAddressText = '';
    notify({
      text: 'Del address successfully',
    });
  } catch (error) {
    notify({
      type: 'error',
      text: 'Del failed',
    });
  }
};

const uploadWl = (url) => (file) => uploadFile(url, file);
</script>

<style scoped>
/* .dao_bg {
  background-image: url('~@/assets/bgs/dao-card.avif');
  background-repeat: no-repeat;
  background-size: 100% 100%;
} */
/* .dao_bg:hover {
  background-image: url('~@/assets/bgs/dao-card-active.avif');
} */

.bg-gradient-error {
  background: linear-gradient(
    90deg,
    rgba(140, 27, 41, 0.5) 0%,
    rgba(140, 27, 41, 0.1) 100%
  );
}
.bg-dark {
  background: rgba(18, 20, 22, 0.8);
}

.flag_bg {
  background: linear-gradient(
    90deg,
    rgba(140, 27, 41, 0.5) 0%,
    rgba(140, 27, 41, 0.1) 100%
  );
}
.grid-box {
  grid-template-columns: 3fr 10fr;
}
/* .dao_bg {
  
} */
/* .dao_bg.active {
  background-image: url('~@/assets/images/dao_card_active.avif');
} */
.dao-upload {
  height: 160px !important;
}
.profile-dao-box {
  transition: all 0.3s;
}
.profile-dao-box:hover {
  box-shadow: 0px 2px 8px 0px rgba(255, 255, 255, 0.5);
}
</style>

<style>
.dialog-class {
  width: 40rem !important;
}
</style>
