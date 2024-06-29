<template>
  <div>
    <LineTitle class="text-4xl">NFT BASED PASS</LineTitle>

    <div class="h-80 mt-4 opacity-40 box-bg" v-if="dao.loading">
      <Skeletor height="100%"></Skeletor>
    </div>
    <PureTabs
      class="mt-6"
      :tabs="['CLAIM', 'REDEEM']"
      @change="onTabChange"
      v-else
    >
      <template v-slot="{ current }">
        <div v-if="current == 0">
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

          <div>
            <div class="text-xl text-strong-gray font-bold my-6">My NFT</div>
            <SelectBox
              :data="dao.tradeInfo.claimPassList || []"
              v-model="tempTokenId"
            >
              <template v-slot="{ selected, info }">
                <NftCard
                  class="mt-4"
                  :img="info.image"
                  :id="info.tokenId"
                  :name="info.symbol"
                  :selected="selected"
                ></NftCard>
              </template>
            </SelectBox>
          </div>
        </div>

        <div v-else>
          <div class="text-xl text-strong-gray font-bold my-6">My PASS</div>
          <SelectBox :data="dao.tradeInfo.passList" v-model="redeemTokenId">
            <template v-slot="{ selected, info }">
              <NftCard
                class="mt-4"
                :img="info.image"
                :id="info.tokenId"
                :name="info.symbol"
                :selected="selected"
              ></NftCard>
            </template>
          </SelectBox>

          <!-- <div class="text-xl text-strong-gray font-bold my-6">
            NFT
          </div>
          <div class="flex space-x-4">
            <NftCard></NftCard>
            <NftCard></NftCard>
          </div> -->
        </div>

        <!-- claim -->
        <div class="text-right text-sm text-tip-0 mt-6 mb-2">
          You need stake 1 {{ dao.tokenName }} to mint a PASS
        </div>
        <Button error v-if="step == 1" @click="doApprove">Approve</Button>
        <Button
          error
          v-else-if="step == 2"
          @click="doClaim"
          :disabled="dao.tradeInfo.claimPassList.length == 0"
          >Claim</Button
        >
        <Button
          error
          v-else-if="step == 3"
          @click="doRedeem"
          :disabled="dao.tradeInfo.passList.length == 0"
          >Reddem</Button
        >
        <div
          v-else
          class="h-10 flex justify-center items-center text-xl text-whitebase bg-tip-0 text-center"
        >
          Sorry, You don't have corresponding NFT to mint a PASS.
        </div>
      </template>
    </PureTabs>
  </div>
</template>

<script lang="ts">
import { PlaceHolderImage, rules } from '@/constants';
import { defineComponent, ref } from 'vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

import { sendTradeInfo } from '@/api/dao';
import Button from '@/components/Button.vue';
import NftCard from '@/components/Card/NFT.vue';
import LineTitle from '@/components/LineTitle.vue';
import SelectBox from '@/components/SelectBox.vue';
import { PureTabs } from '@/components/Tabs';
import {
  approveNFT,
  buyNftBase,
  getSingerAddr,
  sellNftBase,
} from '@/constants/contract';
import { nftBaseContract } from '@/constants/contract/read';
import { mittContract } from '@/libs/event';
import { delayTime, getUTCTime, handleWalletError } from '@/utils';
import { withThrottling, withWalletFlow } from '@/utils/with';
import { notify } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import { Skeletor } from 'vue-skeletor';

const getNetwork = (ins: any) => {
  return ins.dao.network;
};

export default defineComponent({
  name: 'Action',
  data: () => ({
    selected: [] as any,
    address: '',
    tokenId: '',
    approved: false,
    approvable: true,
    claimed: false,
    working: false,
    tokenErrMessage: '',
    step: 0,
    prevStep: 0,
    tempTokenId: -1,
    redeemTokenId: -1,
    tab: 0,
  }),
  computed: {
    ...mapState({
      dao: (state: any) => state.dao.claimDAO,
      address: (state: any) => state.user.address,
    }),
    ...mapGetters('user', ['getAddress']),
    seeBtn(): any[] {
      return [this.dao.tradeInfo, this.tab];
    },
  },
  components: {
    // FormInput,
    LineTitle,
    Button,
    PureTabs,
    NftCard,
    SelectBox,
    Skeletor,
  },
  methods: {
    ...mapActions('erc20', ['approve', 'getApproved', 'ownerOf']),
    ...mapActions('pass', ['stakeBeta']),
    ...mapActions('user', ['getUser']),
    ...mapActions('dao', ['setClaimDAO']),
    ...mapMutations(['openContractDialog', 'closeContractDialog']),
    async select(id: number) {
      const index = this.selected.indexOf(id);
      if (index !== -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(id);
      }
    },
    onTabChange(i: any) {
      this.tab = i;
    },
    doApprove: withThrottling(
      withWalletFlow(async function (this: any) {
        try {
          mittContract(true, false);
          if (!(await this.canMint())) {
            mittContract(false);
            return;
          }
          await approveNFT(
            this.dao.tradeInfo.nftAddress,
            this.dao.contractAddress,
            () => {
              this.dao.tradeInfo.needApprove = false;
              this.step = 2;
              mittContract(false);
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
        if (this.tempTokenId == -1) {
          notify({
            type: 'error',
            text: 'No NFT selected.',
            duration: 2000,
          });
          return;
        }

        try {
          mittContract(true, false);
          if (!(await this.canMint())) {
            mittContract(false);
            return;
          }

          await buyNftBase(
            this.dao.contractAddress,
            this.dao.tradeInfo.claimPassList[this.tempTokenId].tokenId,
            async ({ transactionHash }: any) => {
              await sendTradeInfo(
                this.dao.passType,
                this.dao.id,
                transactionHash,
                'CLAIM',
              );
              mittContract(false);
              this.tempTokenId = -1;
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
    doRedeem: withThrottling(
      withWalletFlow(async function (this: any) {
        if (this.redeemTokenId == -1) {
          notify({
            type: 'error',
            text: 'No NFT selected.',
            duration: 2000,
          });
          return;
        }

        try {
          mittContract(true, false);
          await sellNftBase(
            this.dao.contractAddress,
            this.dao.tradeInfo.passList[this.redeemTokenId].tokenId,
            async ({ transactionHash }: any) => {
              await sendTradeInfo(
                this.dao.passType,
                this.dao.id,
                transactionHash,
                'REDEEM',
              );
              mittContract(false);
              this.redeemTokenId = -1;
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
    async canMint() {
      const contract = nftBaseContract(
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
  watch: {
    seeBtn(val) {
      const [info, tab] = val;

      if (tab == 1) {
        this.step = 3;
        return;
      }

      if (info.needApprove == undefined) return;
      if (info.needApprove) {
        this.step = 1;
      } else if (info.needApprove == false) {
        this.step = 2;
      }
    },
  },
  setup() {
    const open = ref(false);
    return {
      open,
      rules,
      placeholderUrl: PlaceHolderImage,
    };
  },
});
</script>
