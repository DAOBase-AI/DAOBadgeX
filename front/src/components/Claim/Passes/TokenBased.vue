<template>
  <div>
    <LineTitle class="text-4xl">ERC20 TOKEN BASED PASS</LineTitle>

    <div class="h-80 mt-4 opacity-40 box-bg" v-if="dao.loading">
      <Skeletor height="100%"></Skeletor>
    </div>

    <!-- 这里需要一个Tab功能 -->
    <PureTabs
      class="mt-6"
      :tabs="['CLAIM', 'REDEEM']"
      @change="onTabChange"
      v-else
    >
      <template v-slot="{ current }">
        <div class="flex items-end text-whitebase" v-if="current == 0">
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
        <div v-else class="text-xl text-strong-gray font-bold">
          My Pass
          <SelectBox
            :data="dao.tradeInfo.passList || []"
            v-model="selectTokenId"
          >
            <template v-slot="{ selected, info }">
              <NftCard
                class="mt-4"
                :img="dao.passLogo"
                :id="info.tokenId"
                :name="dao.passName"
                :selected="selected"
              ></NftCard>
            </template>
          </SelectBox>
        </div>

        <!-- claim -->
        <div
          class="mt-6 px-12 py-4 bg-pass-topbg text-whitebase text-sm font-bold"
        >
          <div class="grid grid-cols-2 items-center table-box__head">
            <div class="table-box__cell">Token Staked</div>
            <div class="table-box__cell">
              <TokenLogo class="mr-4" :tokenName="dao.tokenName"></TokenLogo>
              {{ dao.tokenName }}
            </div>
          </div>
          <div class="grid grid-cols-2">
            <div class="table-box__cell">Amount</div>
            <div class="table-box__cell">
              <TokenLogo class="mr-4" :tokenName="dao.tokenName"></TokenLogo>
              <span>
                {{ +dao.tradeInfo.amount }}
              </span>
            </div>
          </div>
          <div class="grid grid-cols-2">
            <div class="table-box__cell">Balance</div>
            <div class="table-box__cell">
              <TokenLogo class="mr-4" :tokenName="dao.tokenName"></TokenLogo>
              <span>
                {{ +dao.tradeInfo.fixed_balance }}
              </span>
            </div>
          </div>
        </div>
        <div class="text-right text-sm text-tip-0 mt-6" v-if="step != 3">
          You need stake {{ +dao.tradeInfo.amount }} {{ dao.tokenName }} to mint
          a PASS
        </div>
        <div class="mt-4">
          <div
            class="h-10 flex justify-center items-center text-xl text-whitebase bg-tip-0 text-center"
            v-if="step == 0"
          >
            Insufficient {{ dao.tokenName }} balance
          </div>
          <Button error v-if="step == 1" @click="doApprove">Approve</Button>
          <Button error v-if="step == 2" @click="doClaim">Claim</Button>
          <Button error v-if="step == 3" @click="doReddem">Reddem</Button>
        </div>
      </template>
    </PureTabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import TokenLogo from '@/components/TokenLogo.vue';
import { PureTabs } from '@/components/Tabs';
import LineTitle from '@/components/LineTitle.vue';
import Button from '@/components/Button.vue';
import NftCard from '@/components/Card/NFT.vue';
import SelectBox from '@/components/SelectBox.vue';
import {
  approve,
  buyTokenBase,
  getSingerAddr,
  sellTokenBase,
} from '@/constants/contract';
import { tokenBaseContract } from '@/constants/contract/read';
import { sendTradeInfo } from '@/api/dao';
import { notify } from '@kyvg/vue3-notification';
import { withThrottling, withWalletFlow } from '@/utils/with';
import { mittContract } from '@/libs/event';
import { Skeletor } from 'vue-skeletor';
import { delayTime, getUTCTime, handleWalletError } from '@/utils';
import dayjs from 'dayjs';

const getNetwork = (ins: any) => {
  return ins.dao.network;
};

export default defineComponent({
  data: () => ({
    sending: false,
    step: 0,
    prevStep: 0,
    selectTokenId: -1,
    tab: 0,
  }),
  computed: {
    ...mapState({
      dao: (state: any) => state.dao.claimDAO,
      token: (state: any) => state.erc20.info,
      claimable: (state: any) => state.pass.alphaClaimable,
    }),
    seeBtn(): any[] {
      return [this.dao.tradeInfo, this.tab];
    },
  },
  watch: {
    seeBtn(val) {
      const [info, tab] = val;
      if (tab == 1) {
        this.step = 3;
        return;
      }
      if (info.needApprove == undefined) return;
      if (+info.fixed_balance < +(info.payment || info.amount)) return;

      if (info.needApprove) {
        this.step = 1;
      } else {
        this.step = 2;
      }
    },
  },
  methods: {
    ...mapActions('dao', ['getClaimDAOClaimed', 'setClaimDAO']),
    ...mapActions('erc20', ['approve', 'isApproved', 'fetchTokenInfo']),
    ...mapActions('pass', ['stakeAlpha', 'redeemAlpha', 'claimableAlpha']),
    ...mapMutations('erc20', ['resetClaimToken']),
    onSelect(info: any) {
      this.selectTokenId = info.tokenId;
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
            this.dao.tradeInfo.miaAddress,
            this.dao.contractAddress,
            async () => {
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
    doClaim: withThrottling(
      withWalletFlow(async function (this: any) {
        try {
          mittContract(true, false);
          if (!(await this.canMint())) {
            mittContract(false);
            return;
          }
          await buyTokenBase(
            this.dao.contractAddress,
            async ({ transactionHash }: any) => {
              await sendTradeInfo(
                this.dao.passType,
                this.dao.id,
                transactionHash,
                'CLAIM',
              );
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
    doReddem: withThrottling(
      withWalletFlow(async function (this: any) {
        if (this.selectTokenId == -1) {
          notify({
            type: 'error',
            text: 'No Selected NFT',
          });
          return;
        }

        try {
          mittContract(true, false);
          await sellTokenBase(
            this.dao.contractAddress,
            this.dao.tradeInfo.passList[this.selectTokenId].tokenId,
            async ({ transactionHash }: any) => {
              await sendTradeInfo(
                this.dao.passType,
                this.dao.id,
                transactionHash,
                'REDDEM',
              );
              this.selectTokenId = -1;
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
    onTabChange(i: any) {
      this.tab = i;
    },
    async canMint() {
      const contract = tokenBaseContract(
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

      if (this.dao.tradeInfo.isWhiteList) {
        if (!(await contract.isWhite(getSingerAddr()))) {
          notify({
            type: 'error',
            text: 'Not in whitelist',
          });
          return false;
        }
      }

      if (
        this.dao.tradeInfo.mintLimit &&
        (await contract.mintNumber(getSingerAddr())).toString() ==
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
  },
  components: {
    // CurrencyDollarIcon,
    Skeletor,
    LineTitle,
    Button,
    PureTabs,
    SelectBox,
    NftCard,
    TokenLogo,
  },
});
</script>
