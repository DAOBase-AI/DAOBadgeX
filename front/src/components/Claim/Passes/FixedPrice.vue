<template>
  <div>
    <LineTitle class="text-4xl">FIXED PRICE PASS</LineTitle>

    <div class="h-80 mt-4 opacity-40 box-bg" v-if="dao.loading">
      <Skeletor height="100%"></Skeletor>
    </div>

    <div class="px-16 py-6 box-bg mt-4" v-else>
      <div class="flex items-end text-whitebase">
        <div class="flex items-end text-whitebase">
          <img
            class="w-12 h-12 rounded-full mr-4 object-cover"
            :src="dao.passLogo"
            alt=""
          />
          <div class="pb-1">
            <span class="text-xl">{{ dao.passName }} PASS</span>
            <div class="bg-gradient-4 w-28 h-1 mt-2"></div>
          </div>
        </div>
      </div>
      <div
        class="mt-6 px-12 py-4 bg-pass-topbg border border-pass-border text-whitebase text-sm font-bold"
      >
        <div class="grid grid-cols-2 items-center table-box__head">
          <div class="table-box__cell">PAY WITH</div>
          <div class="table-box__cell">
            <TokenLogo
              class="mr-4"
              :tokenName="dao.tradeInfo.payWith"
            ></TokenLogo>
            {{ dao.tradeInfo.payWith }}
          </div>
        </div>
        <div class="grid grid-cols-2">
          <div class="table-box__cell">Total payment</div>
          <div class="table-box__cell">
            <TokenLogo
              class="mr-4"
              :tokenName="dao.tradeInfo.payWith"
            ></TokenLogo>
            <span>
              {{ +dao.tradeInfo.paymentText }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2">
          <div class="table-box__cell">Balance</div>
          <div class="table-box__cell">
            <TokenLogo
              class="mr-4"
              :tokenName="dao.tradeInfo.payWith"
            ></TokenLogo>
            <span>
              {{ +dao.tradeInfo.fixed_balance }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2">
          <div class="table-box__cell">Term of Validity</div>
          <div class="table-box__cell">
            <span v-if="dao.certainTime">
              {{ formatDateLong(dao.certainTime + getOffsetTime()) }} (UTC)
            </span>
            <span v-else-if="dao.tradeInfo.termOfValidity">
              {{ dao.tradeInfo.termOfValidity }} months
            </span>
            <span v-else> ∞ </span>
          </div>
        </div>
        <div class="grid grid-cols-2" v-if="dao.tradeInfo.mintLimit">
          <div class="table-box__cell">Mint Limit</div>
          <div class="table-box__cell">{{ dao.tradeInfo.mintLimit }}</div>
        </div>
        <div class="grid grid-cols-2" v-if="dao.tradeInfo.isWhiteList">
          <div class="table-box__cell">Mode</div>
          <div class="table-box__cell">WhiteList</div>
        </div>
      </div>

      <div class="text-right text-sm text-tip-0 mt-6 mb-2">
        You need pay {{ +dao.tradeInfo.paymentText }}
        {{ dao.tradeInfo.payWith }} to mint a PASS
      </div>
      <div v-if="!dao.isFreeMint">
        <div
          v-if="step == 0"
          class="h-10 flex justify-center items-center text-xl text-whitebase bg-tip-0 text-center"
        >
          Insufficient {{ dao.tradeInfo.payWith }} balance
        </div>
        <Button v-if="step == 1" error @click="doApprove">APPROVE</Button>
        <Button
          v-if="step == 2"
          error
          @click="doBuy"
          :disabled="dao.id == '299' || +dao.tradeInfo.paymentText == 0"
          >BUY</Button
        >
      </div>
      <div v-else>
        <!-- <div
          v-if="dao.freeMintStatus == 3"
          class="
            h-10
            flex
            justify-center
            items-center
            text-xl text-whitebase
            bg-tip-0
            text-center
          "
        >
          NOT IN WHITELIST
        </div> -->
        <Button error @click="doMint" :loading="mintLoading"> MINT</Button>
      </div>
    </div>
  </div>
  <Dialog :visible="mintingDialog" @close="mintingDialog = false" alert>
    <div class="flex flex-col items-center text-whitebase mt-10">
      <svg
        class="base-loading__icon ml-2"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 100 100;270 100 100"
            begin="0s"
            dur="1.6s"
            fill="freeze"
            repeatCount="indefinite"
          ></animateTransform>
          <circle
            fill="none"
            stroke="currentColor"
            stroke-width="20"
            stroke-linecap="round"
            cx="100"
            cy="100"
            r="90"
            stroke-dasharray="567"
            stroke-dashoffset="1848"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 100 100;135 100 100;450 100 100"
              begin="0s"
              dur="1.6s"
              fill="freeze"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="stroke-dashoffset"
              values="567;142;567"
              begin="0s"
              dur="1.6s"
              fill="freeze"
              repeatCount="indefinite"
            ></animate>
          </circle>
        </g>
      </svg>

      <div class="mt-8 mb-4 text-xl">Minting Now!</div>
      <div class="text-center">
        The transaction is gas fee and you can check your NFT in history and
        profile after it's done.
      </div>
    </div>
  </Dialog>
  <Dialog
    :visible="mintedDialog"
    @close="mintedDialog = false"
    alert
    title="Congrats!"
  >
    <div class="flex flex-col items-center text-whitebase text-center">
      <img class="w-20 h-20 my-8 rounded-full" :src="dao.passLogo" alt="" />
      <div class="mb-4">
        You have minted <span class="font-bold">{{ dao.passName }}</span
        >.View it in your
        <a href="/profile/overview" class="underline">profile</a>.
      </div>

      <Button class="w-40" @click="mintedDialog = false">Sure</Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import { fromInteger2Float } from '@/libs';
import LineTitle from '@/components/LineTitle.vue';
import Button from '@/components/Button.vue';
import TokenLogo from '@/components/TokenLogo.vue';
import {
  approve,
  buyFixedPrice,
  buyWlFixedPrice,
  getSingerAddr,
} from '@/constants/contract';
import { freeMint, getTradeInfo, sendTradeInfo } from '@/api/dao';
import {
  delayTime,
  getBackFixedTokenAddress,
  getUTCTime,
  handleWalletError,
  formatDateLong,
  getOffsetTime,
} from '@/utils';
import { withThrottling, withWalletFlow } from '@/utils/with';
import { mittContract } from '@/libs/event';
import { Skeletor } from 'vue-skeletor';
import { notify } from '@kyvg/vue3-notification';
import Dialog from '@/components/Dialog.vue';
import {
  fixedPriceContract,
  fpWhitelistMintedNum,
  isFpWhitelist,
} from '@/constants/contract/read';
import dayjs from 'dayjs';

const getNetwork = (ins: any) => {
  return ins.dao.network;
};

export default defineComponent({
  name: 'ClaimFixedPrice',
  data: () => ({
    step: 0,
    sending: false,
    errorNotification: false,
    mintLoading: false,
    mintingDialog: false,
    mintedDialog: false,
  }),
  computed: {
    ...mapState({
      dao: (state: any) => state.dao.claimDAO,
      token: (state: any) => state.erc20.info,
      claimable: (state: any) => state.pass.gammaClaimable,
    }),
  },
  watch: {
    ['dao.tradeInfo'](val) {
      if (+this.dao.tradeInfo.paymentText == 0) {
        this.step = 2;
        return;
      }

      if (val.needApprove == undefined) return;
      if (+val.fixed_balance < +(val.payment || val.amount)) return;

      if (val.needApprove) {
        this.step = 1;
      } else {
        this.step = 2;
      }
    },
  },
  methods: {
    ...mapActions('dao', ['getClaimDAOClaimed', 'setClaimDAO']),
    ...mapActions('erc20', ['approve', 'isApproved', 'fetchTokenInfo']),
    ...mapActions('pass', ['stakeGamma', 'redeemGamma', 'claimableGamma']),
    ...mapMutations('erc20', ['resetClaimToken']),
    ...mapMutations('dao', ['subFixedBalance']),
    ...mapMutations(['openContractDialog', 'closeContractDialog']),
    formatDateLong,
    getOffsetTime,

    async canMint() {
      const contract = fixedPriceContract(
        this.dao.contractAddress,
        this.dao.network,
      );

      if (this.dao.tradeInfo.duration) {
        if (
          !dayjs(
            (await contract.mintDeadlineTime()).toString() * 1000 +
              new Date().getTimezoneOffset() * 60000,
          ).isAfter(getUTCTime())
        ) {
          notify({
            type: 'error',
            text: 'The Mint period has passed',
          });
          return false;
        }
      }

      const caller = await getSingerAddr();

      if (this.dao.tradeInfo.isWhiteList) {
        if (!(await contract.isWhite(caller))) {
          notify({
            type: 'error',
            text: 'Not in whitelist',
          });
          return false;
        }
      }

      if (
        this.dao.tradeInfo.mintLimit &&
        (await contract.mintNumber(caller)).toString() ==
          this.dao.tradeInfo.mintLimit
      ) {
        notify({
          type: 'error',
          text: 'Reach the Mint limit',
        });
        return false;
      }

      return true;
    },
    doApprove: withThrottling(
      withWalletFlow(async function (this: any) {
        try {
          mittContract(true, false);
          if (!(await this.canMint())) {
            mittContract(false);
            return;
          }
          await approve(
            getBackFixedTokenAddress(this.dao.tokenName, this.dao.chain),
            this.dao.contractAddress,
            async ({ transactionHash }: any) => {
              // await sendTradeInfo(this.dao.passType, this.dao.id, transactionHash);
              mittContract(false);
              this.dao.tradeInfo.needApprove = false;
              this.step = 2;
            },
          );
        } catch (error) {
          mittContract(false);
          handleWalletError(error);
        }
      }, getNetwork),
    ),
    doBuy: withThrottling(
      withWalletFlow(async function (this: any) {
        try {
          mittContract(true, false);
          if (!(await this.canMint())) {
            mittContract(false);
            return;
          }

          await buyFixedPrice(
            this.dao.contractAddress,
            this.dao.tokenName,
            this.dao.tradeInfo.payment,
            async ({ transactionHash }: any) => {
              try {
                await sendTradeInfo(
                  this.dao.passType,
                  this.dao.id,
                  transactionHash,
                  'BUY',
                );
              } catch (error) {
                /*  */
              }

              mittContract(false);
              await delayTime();
              await this.setClaimDAO({ name: this.dao.name });
            },
          );
        } catch (error) {
          mittContract(false);
          handleWalletError(error);
        }
      }, getNetwork),
    ),
    /* freeMint */
    doMint: withThrottling(
      withWalletFlow(async function (this: any) {
        try {
          this.mintLoading = true;
          const mintStatus = await freeMint(this.dao.id);
          if (mintStatus == 3) {
            throw new Error('Not in the whilelist.');
          }
          if (mintStatus == 1) {
            throw new Error("Yon've minted.");
          }
          this.mintingDialog = true;
          this.loopQuery();
        } catch (error: any) {
          /*  */
          notify({ type: 'error', text: error.message });
        }
        this.mintLoading = false;
      }, getNetwork),
    ),
    async loopQuery() {
      // const res = xxx;
      const res = await getTradeInfo(this.dao.passType, this.dao.id);

      if (res.mintStatus == 1) {
        await delayTime();
        await this.setClaimDAO({ name: this.dao.name });
        this.mintingDialog = false;
        this.mintedDialog = true;
      } else {
        await delayTime();
        this.loopQuery();
      }
    },
  },
  components: {
    Skeletor,
    LineTitle,
    Button,
    TokenLogo,
    Dialog,
  },
  setup() {
    const open = ref(false);
    return {
      fromInteger2Float,
      open,
    };
  },
});
</script>

<style scoped>
.base-loading__icon {
  width: 6rem;
  height: 6rem;
}
</style>
