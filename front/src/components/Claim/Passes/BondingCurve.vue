<template>
  <div>
    <LineTitle class="text-4xl">BONDING CURVE PASS</LineTitle>

    <div class="h-80 mt-4 opacity-40 box-bg" v-if="dao.loading">
      <Skeletor height="100%"></Skeletor>
    </div>

    <div v-else>
      <Tabs
        class="mt-6"
        wrapperClass="md:p-0"
        @change="onModeChange"
        :initialIndex="mode"
      >
        <Tab name="BUY"></Tab>
        <Tab name="SELL"></Tab>
      </Tabs>
      <div class="flex mt-2">
        <!-- left -->
        <div class="w-3/5" v-if="mode == 0">
          <div class="flex justify-between items-center">
            <div
              class="flex-col text-center px-4"
              v-for="item in [
                {
                  label: 'Current price',
                  value: 'bcCurrentPrice',
                  unit: dao.tokenName || 'TOKEN',
                },
                {
                  label: 'Reserve',
                  value: 'bcReserve',
                  unit: dao.tokenName || 'TOKEN',
                },
                { label: 'Issuance', value: 'bcIssuance', unit: 'PASS' },
              ]"
              :key="item.label"
            >
              <div class="text-sm" style="color: #5e6873">
                {{ item.label }}
                <span class="text-xs text-strong-blue">({{ item.unit }})</span>
              </div>
              <div class="text-whitebase font-bold px-4 mt-2">
                {{ format4(dao.tradeInfo[item.value]) }}
              </div>
            </div>
          </div>
          <div class="flex-1 relaitve mt-8 w-11/12">
            <BondingCurveLine
              :m="dao.tradeInfo.m"
              :n="dao.tradeInfo.n"
              :price="dao.tradeInfo.initialPrice"
              :height="210"
            ></BondingCurveLine>
            <!-- <img class="w-full "
               src="@/assets/images/bond_chat.avif" /> -->
          </div>
        </div>
        <div v-else class="w-3/5 flex flex-col">
          <div class="text-xl text-strong-gray font-bold mb-1">My PASS</div>
          <div class="flex-1 w-full relative box-masked">
            <div class="absolute w-full h-full">
              <BcSelect
                :mul="true"
                :list="dao.tradeInfo.passList"
                :selected="sellPassList"
              ></BcSelect>
            </div>
          </div>

          <!-- <SelectBox :data="dao.tradeInfo.passList" @infoChange="onPassSelect">
          <template v-slot="{ selected, info }">
            <NftCard
              class="mt-4"
              :img="info.image"
              :id="info.tokenId"
              :name="info.symbol"
              :selected="selected"
            ></NftCard>
          </template>
        </SelectBox> -->
        </div>
        <!-- right -->
        <div class="w-2/5 flex justify-end">
          <div class="box-bg py-6 px-8 flex flex-col">
            <!-- header -->
            <div class="flex justify-between items-center">
              <div class="flex items-center text-whitebase">
                <img
                  class="w-14 h-14 rounded-full mr-4 object-cover"
                  :src="dao.passLogo"
                  alt=""
                />
                <span class="text-xl italic">{{ dao.passName }} PASS</span>
              </div>
              <Popper placement="left">
                <img
                  src="@/assets/images/icon_setting.avif"
                  class="w-6 h-6 cursor-pointer"
                />
                <template v-slot:content="">
                  <div
                    class="text-xs text-whitebase backdrop-filter backdrop-blur py-4 px-6"
                  >
                    <div class="text-sm font-bold mb-2">
                      Transaction Settings
                    </div>
                    <div class="mb-4">Slippage tolerance?</div>
                    <div class="flex items-center">
                      <Button class="mr-2 md:h-7" @click="slippage = '0.2'"
                        >AUTO</Button
                      >
                      <div class="bg-pass-bg h-8 flex items-center">
                        <input
                          type="number"
                          v-model="slippage"
                          @blur="onSlippageBlur"
                          class="w-32 bg-transparent h-8 border-none text-right"
                        />
                        <div>%</div>
                      </div>
                    </div>
                  </div>
                </template>
              </Popper>
            </div>
            <div class="flex flex-col justify-between mt-2">
              <div>
                <div class="relative">
                  <div
                    class="pl-6 pb-5 pt-4 pr-24 bg-pass-topbg"
                    v-show="mode == 0"
                  >
                    <div class="text-xs text-whitebase">From</div>

                    <div
                      class="w-full text-whitebase text-xl rounded flex items-center h-14 mt-2"
                    >
                      {{ maxCost }}
                    </div>

                    <div style="color: #5e6873">
                      <span class="pr-4"
                        >{{ dao.tokenName || 'TOKEN' }} Balance:</span
                      >{{ format4(dao.tradeInfo.tokenBalance) }}
                    </div>
                  </div>

                  <div
                    class="pl-6 pb-5 pt-4 pr-24 bg-pass-topbg"
                    v-show="mode == 1"
                  >
                    <div class="text-xs text-whitebase mb-2">From</div>
                    <input
                      type="number"
                      :value="sellAmount"
                      @change="onSellAmountChange"
                      class="w-full bc-input-border__inner h-14 text-xl rounded"
                    />
                    <div style="color: #5e6873">
                      <span class="pr-4">PASS Balance:</span
                      >{{ dao.tradeInfo.passCount }}
                    </div>
                  </div>

                  <div class="my-2"></div>

                  <div
                    class="pl-6 pb-5 pt-4 pr-24 bg-pass-topbg"
                    v-show="mode == 0"
                  >
                    <div class="text-xs text-whitebase">To</div>
                    <input
                      type="number"
                      :value="passAmount"
                      @change="onPassAmountChange"
                      class="w-full bc-input-border__inner h-14 text-xl rounded mt-2"
                    />
                    <div style="color: #5e6873">
                      <span class="pr-4">PASS Balance:</span>
                      {{ dao.tradeInfo.passCount }}
                    </div>
                  </div>
                  <div
                    v-show="mode == 1"
                    class="pl-6 pb-5 pt-4 pr-24 bg-pass-topbg"
                  >
                    <div class="text-xs text-whitebase">To</div>
                    <div
                      class="w-full text-whitebase text-xl rounded flex items-center h-14 mt-2"
                    >
                      {{ burnCost }}
                    </div>

                    <div style="color: #5e6873">
                      <span class="pr-4"
                        >{{ dao.tokenName || 'TOKEN' }} Balance:</span
                      >
                      {{ format4(dao.tradeInfo.tokenBalance) }}
                    </div>
                  </div>

                  <div
                    class="absolute cursor-pointer top-1/2 right-2 transform -translate-y-1/2"
                    @click="onModeChange(mode == 1 ? 0 : 1)"
                  >
                    <img
                      src="@/assets/icons/swap.avif"
                      class="w-20 h-20 block mx-auto"
                    />
                  </div>
                </div>

                <div class="my-4 flex justify-end">
                  <Popper hover class="flex" placement="left">
                    <img
                      src="@/assets/images/icon_warning.avif"
                      class="w-6 h-6 cursor-pointer"
                    />
                    <template v-slot:content="">
                      <div
                        class="w-60 text-xs text-whitebase backdrop-filter backdrop-blur py-2 px-3 space-y-4"
                      >
                        <div class="flex justify-between">
                          <div>Slippage Tolerance</div>
                          <div>{{ slippage }}%</div>
                        </div>
                        <div class="flex justify-between" v-if="mode == 0">
                          <div>Maximum cost</div>
                          <div>{{ fuzzyMaxCost }} {{ dao.tokenName }}</div>
                        </div>
                        <div class="flex justify-between" v-else>
                          <div>Minimum receive</div>
                          <div>{{ fuzzyMinReceive }} {{ dao.tokenName }}</div>
                        </div>
                      </div>
                    </template>
                  </Popper>
                </div>
              </div>

              <div class="text-base text-xs">
                <!-- button -->
                <div
                  v-if="step == 0"
                  class="h-10 flex justify-center items-center text-xl text-whitebase bg-tip-0 text-center"
                >
                  {{ invalidMsg }}
                </div>
                <Button v-else-if="step == 1" error @click="doApprove"
                  >APPROVE</Button
                >
                <Button
                  v-else-if="step == 2"
                  error
                  @click="doBuy()"
                  :disabled="buyLoading"
                  >BUY</Button
                >
                <Button v-else error @click="doSell" :disabled="sellLoading"
                  >SELL</Button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
// import { contracts } from '@/constants';
import LineTitle from '@/components/LineTitle.vue';
import { Tab, Tabs } from '@/components/Tabs';
import Button from '@/components/Button.vue';
import BondingCurveLine from '@/components/BondingCurveChart.vue';
import BcSelect from '../BcSelect.vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Popper from 'vue3-popper';
import {
  approve,
  buyBondingCurve,
  sellBondingCurve,
} from '@/constants/contract';
import { getBurnCost, getMaximumCost } from '@/constants/contract/read';
import { BackNetworkType, BONDING_CURVE_OPTIONS_BY_NETWORK } from '@/constants';
import { sendTradeInfo } from '@/api/dao';
import { notify } from '@kyvg/vue3-notification';
import { withWalletFlow } from '@/utils/with';
import sortBy from 'lodash/sortBy';
import { mittContract } from '@/libs/event';
import { Skeletor } from 'vue-skeletor';
import { handleWalletError } from '@/utils';

const defaultSlippage = '0.2';

const getNetwork = (ins: any) => {
  return ins.dao.network;
};

export default defineComponent({
  components: {
    Tabs,
    Tab,
    LineTitle,
    Button,
    Popper,
    BondingCurveLine,
    BcSelect,
    Skeletor,
  },
  data: () => ({
    mode: 0,
    invalidMsg: '',
    step: 0,
    prevStep: 0,
    passAmount: '',
    sellAmount: '',
    balance: '0',
    maxCost: '0',
    burnCost: '0',
    slippage: defaultSlippage,
    tokenId: '',
    tokenBalance: 0,
    sellPassList: {},
    buyLoading: false,
    sellLoading: false,
  }),
  methods: {
    ...mapActions('erc20', ['fetchTokenInfo', 'approve']),
    ...mapActions('dao', ['setClaimDAO']),
    ...mapActions('pass', [
      'buyDelta',
      'sellDelta',
      'deltaCirculation',
      'deltaBalance',
    ]),
    ...mapMutations(['openContractDialog', 'closeContractDialog']),
    format4(tx: string | number) {
      return +(+tx).toFixed(4);
    },
    onSlippageBlur() {
      if (this.slippage == '') {
        this.slippage = defaultSlippage;
      }
      if (+this.slippage > 5) {
        this.slippage = '5';
      }
    },
    onModeChange(val: number) {
      this.mode = val;
    },
    async onPassAmountChange(e: any) {
      const value = Math.floor(+e.target.value);

      if (!value) {
        this.passAmount = '';
        this.maxCost = '0';
        return;
      }

      this.passAmount = '' + value;
      const network = BackNetworkType[this.dao.chain];

      const prevValue = this.passAmount;

      this.buyLoading = true;
      const res = await getMaximumCost(
        this.dao.contractAddress,
        '' + value,
        BONDING_CURVE_OPTIONS_BY_NETWORK(network)[this.dao.tokenName].decimals,
        BackNetworkType[this.dao.chain],
      );
      this.buyLoading = false;
      if (prevValue == this.passAmount) {
        this.maxCost = res;
      }
    },
    onNftActived(amount: number) {
      if (amount == 0) {
        this.sellPassList = {};
        return;
      }

      const num = Math.min(amount, this.dao.tradeInfo.passCount);
      let res: any = {};
      if (num == this.dao.tradeInfo.passCount) {
        this.dao.tradeInfo.passList.forEach((pass: any) => {
          res[pass.tokenId] = pass.balance;
        });
      } else {
        const dataSet = sortBy(this.dao.tradeInfo.passList, [(o) => o.balance]);

        let minMax: any = null;
        let result: any = {};
        let sum: any = 0;

        const subset = (i: number, j: number) => {
          if (i < 0) {
            return;
          }
          const balance = dataSet[i].balance;
          if (balance > j) {
            if (!minMax) minMax = dataSet[i];
          } else {
            result[dataSet[i].tokenId] = balance;
            sum += balance;
          }
          if (balance != j) {
            subset(i - 1, balance < j ? j - balance : j);
          }
        };
        subset(dataSet.length - 1, num);
        res = result;
        if (sum < num) {
          res[minMax.tokenId] = num - sum;
        }
      }
      this.sellPassList = res;
    },
    async onSellAmountChange(this: any, e: any) {
      const value = Math.floor(+e.target.value);
      const network = this.dao.network;

      if (!value) {
        this.onNftActived(0);
        this.sellAmount = '';
        this.burnCost = '0';
        return;
      }

      this.sellAmount = value;
      const prevValue = this.sellAmount;
      this.sellLoading = true;
      const res = await getBurnCost(
        this.dao.contractAddress,
        '' + value,
        BONDING_CURVE_OPTIONS_BY_NETWORK(network)[this.dao.tokenName].decimals,
        BackNetworkType[this.dao.chain],
      );
      this.sellLoading = false;

      if (prevValue == this.sellAmount) {
        this.burnCost = res;
        this.onNftActived(prevValue);
      }
    },
    doApprove: withWalletFlow(async function (this: any) {
      mittContract(true, false);
      this.openContractDialog();
      try {
        await approve(
          BONDING_CURVE_OPTIONS_BY_NETWORK(this.localNetwork)[
            this.dao.tokenName
          ].address,
          this.dao.contractAddress,
          () => {
            this.step = 2;
            this.dao.tradeInfo.needApprove = false;
            mittContract(false);
          },
        );
      } catch (error) {
        mittContract(false);
        handleWalletError(error);
      }
    }, getNetwork),
    doBuy: withWalletFlow(async function (this: any) {
      if (!this.passAmount) {
        notify({
          text: 'No Amount',
          duration: 2000,
          type: 'error',
        });
        return;
      }

      mittContract(true, false);
      try {
        await buyBondingCurve(
          this.dao.contractAddress,

          BONDING_CURVE_OPTIONS_BY_NETWORK(this.localNetwork)[
            this.dao.tokenName
          ].address,
          this.passAmount,
          (+this.maxCost * (100 + +this.slippage)) / 100 + '',
          this.dao.tradeInfo.bcCurrentPrice,
          async ({ transactionHash }: any) => {
            await sendTradeInfo(
              this.dao.passType,
              this.dao.id,
              transactionHash,
              'BUY',
            );
            await this.setClaimDAO({ name: this.dao.name });
            this.onPassAmountChange({ target: { value: '' } });
            mittContract(false);
          },
        );
      } catch (error) {
        mittContract(false);
        handleWalletError(error);
      }
    }, getNetwork),
    doSell: withWalletFlow(async function (this: any) {
      if (!this.sellAmount) {
        notify({
          text: 'No Amount',
          duration: 2000,
          type: 'error',
        });
        return;
      }

      mittContract(true, false);

      try {
        await sellBondingCurve(
          this.dao.contractAddress,
          BONDING_CURVE_OPTIONS_BY_NETWORK(this.localNetwork)[
            this.dao.tokenName
          ].address,
          Object.keys(this.sellPassList),
          Object.values(this.sellPassList),
          async ({ transactionHash }: any) => {
            await sendTradeInfo(
              this.dao.passType,
              this.dao.id,
              transactionHash,
              'SELL',
            );
            await this.setClaimDAO({ name: this.dao.name });
            this.onSellAmountChange({ target: { value: '' } });
            mittContract(false);
          },
        );
      } catch (error) {
        mittContract(false);
        handleWalletError(error);
      }
    }, getNetwork),
  },
  computed: {
    ...mapState({
      dao: (state: any) => state.dao.claimDAO,
      circulation: (state: any) => state.pass.deltaCirculation,
      totalSupply: (state: any) => state.erc20.info.totalSupply,
      decimal: (state: any) => state.erc20.info.decimals,
      symbol: (state: any) => state.erc20.info.symbol,
      allowance: (state: any) => state.erc20.info.allowance,
      tokenBalance: (state: any) => state.erc20.info.balance,
      passBalance: (state: any) => state.pass.deltaBalance,
      localNetwork: (state: any) => state.wallet.network,
    }),
    ...mapGetters('erc20', ['approved']),
    fuzzyMaxCost(): any {
      return ((+this.maxCost * (100 + +this.slippage)) / 100).toFixed(6);
    },
    fuzzyMinReceive(): any {
      return ((+this.burnCost * (100 - +this.slippage)) / 100).toFixed(6);
    },
    seeBuyBtn(): any {
      return {
        balance: this.dao.tradeInfo.tokenBalance,
        needApprove: this.dao.tradeInfo.needApprove,
        maxCost: this.maxCost,
        mode: this.mode,
      };
    },
    seeSellBtn(): any {
      return {
        balance: this.dao.tradeInfo.passCount,
        sellCount: this.sellAmount,
        mode: this.mode,
      };
    },
  },
  watch: {
    seeBuyBtn(val) {
      if (this.mode !== 0) {
        return;
      }

      if (
        val.balance == undefined ||
        +val.balance == 0 ||
        +val.balance < +val.maxCost
      ) {
        this.invalidMsg = `Insufficient ${
          this.dao.tokenName || 'Token'
        } balance`;
        this.step = 0;
      } else if (val.needApprove) {
        this.step = 1;
      } else {
        this.step = 2;
      }
    },
    seeSellBtn(val) {
      if (this.mode !== 1) {
        return;
      }
      if (+val.sellCount > +val.balance) {
        this.invalidMsg = 'Insufficient PASS balance';
        this.step = 0;
      } else {
        this.step = 3;
      }
    },
  },
});
</script>

<style scoped>
.box-border {
  border: 2px solid;
  border-image: linear-gradient(
      270deg,
      rgba(131, 24, 40, 0.2),
      rgba(131, 24, 40, 1)
    )
    2 2;
  background: #232526;
}
.bc-input-border {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.bc-input-border__inner {
  color: #fff;
  border: none;
  background: #212529;
  box-shadow: -8px -8px 15px 0px rgba(0, 0, 0, 0.1) inset,
    8px 8px 15px 0px rgba(0, 0, 0, 0.1) inset;
}
input::-webkit-input-placeholder {
  font-weight: bold;
  color: #737373;
  font-size: 1.25rem;
}

:deep(.popper) {
  box-shadow: 8px 45px 32px 0px rgba(0, 0, 0, 0.4);
  border: 2px solid;
  border-radius: 1rem;
  border-image: linear-gradient(
      90deg,
      rgba(149, 230, 246, 1),
      rgba(149, 230, 246, 0.2)
    )
    2 2;
}
.box-masked:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2rem;
  background: linear-gradient(0deg, #121416 0%, rgba(0, 0, 0, 0) 100%);
}
</style>
