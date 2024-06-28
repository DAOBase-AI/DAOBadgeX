<template>
  <div class="grid grid-flow-row gap-6">
    <PassCell name="Network :">
      <NetworkChoose></NetworkChoose>
    </PassCell>
    <PassCell name="PASS contract type :">
      <div
        class="cursor-not-allowed form_cell flex text-whitebase italic text-sm pl-3 py-2 items-center"
      >
        ERC1155
      </div>
    </PassCell>
    <PassCell
      v-model="selectedCollateral"
      name="*Collateral Token :"
      :list="collaterals"
    ></PassCell>
    <PassCell name="Platform Commission :">
      <PlatformFee></PlatformFee>
    </PassCell>
    <PassCell name="*Creator Fee :">
      <FormInput
        v-model="creatorFee"
        ref="input1"
        placeholder="No more than 20%"
        endTag="%"
        :maxValue="20"
        class="text-whitebase focus:ring-0"
        typeMode="INT"
        :rules="['gtZero']"
      />
    </PassCell>
    <PassCell name="*Receiving address :">
      <FormInput v-model="receiver" ref="input2" required :rules="['address']">
      </FormInput>
    </PassCell>
    <div class="flex">
      <div class="flex-1">
        <div class="flex">
          <div
            class="h-8 font-bold text-whitebase relative mb-4 cursor-pointer"
            style="width: 5.2rem"
          >
            <div
              class="absolute top-0 h-full"
              :class="{
                'left-0': i == 0,
                'right-0': i == 1,
                basic: (activeX == 0) & (i == 0),
                'adv-unactive': (activeX == 0) & (i == 1),
                adv: (activeX == 1) & (i == 1),
                'basic-unactive': (activeX == 1) & (i == 0),
                'text-secondary-0': activeX == 0,
                'text-main-7': activeX == 1,
              }"
              v-for="(x, i) in ['Basic', 'Adv']"
              :key="x"
            >
              <div
                class="px-2 flex items-center h-full"
                :style="{ width: i == activeX ? 'fit-content' : 'w-full' }"
                @click="doSwitch(i)"
              >
                {{ x }}
              </div>
            </div>
          </div>
          <div
            class="flex-1 pr-16 pl-2 flex justify-between"
            v-if="activeX == 1"
          >
            <span class="text-whitebase font-semibold">Formulas:</span>
            <div class="form-input-border text-whitebase relative">
              <div
                class="h-10 flex justify-center items-center px-6 cursor-not-allowed"
              >
                y = m*x^n + v
              </div>
            </div>
          </div>
          <div
            v-else
            class="flex flex-1 justify-between pl-2 pr-16 items-center"
          >
            <div class="text-sm font-semibold text-whitebase whitespace-nowrap">
              * Initial price:
            </div>
            <div class="w-1/2">
              <FormInput v-model="config.price" required></FormInput>
            </div>
          </div>
        </div>

        <div class="pl-24 pr-16 mt-2">
          <div v-if="activeX == 1" class="space-y-4">
            <div class="form-input-border text-whitebase relative">
              <div
                class="h-10 flex items-center justify-center cursor-not-allowed"
              >
                if x = 1,then v = initial price - m
              </div>
            </div>

            <div
              v-for="(item, k) in [
                { label: '* Initial price', value: 'price' },
                { label: '* m', value: 'm' },
                { label: '* n', value: 'n' },
              ]"
              :key="k"
              class="flex"
            >
              <div
                class="w-5/12 text-sm font-semibold text-whitebase whitespace-nowrap"
              >
                {{ item.label }}:
              </div>
              <FormInput
                type="number"
                v-model="config[item.value]"
                required
              ></FormInput>
            </div>
          </div>
        </div>
        <div class="text-main-4 text-xs mt-2" v-if="activeX == 1">
          If you are looking for customized plan, pls contact us :
          service@thepass.to
        </div>
        <div v-else class="text-whitebase pl-24 mt-4 font-bold">
          For the whole list of price change according to supply, you can check
          it
          <span class="hover:underline cursor-pointer" style="color: #ca1a2f"
            >here</span
          >
          .
        </div>
      </div>
      <div class="flex-1 relaitve">
        <BondingCurveLine
          :m="activeX == 1 ? config.m : config.price * 0.0000002"
          :n="config.n"
          :price="config.price"
        ></BondingCurveLine>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import {
  PlaceHolderImage,
  rules,
  contracts as contract,
  BONDING_CURVE_OPTIONS_BY_NETWORK,
} from '@/constants';
import PassCell from '@/components/Framework/PassCell.vue';
import NetworkChoose from '@/components/CreateDAO/NetworkChoose.vue';
import FormInput from '@/components/Framework/FormInput.vue';
import BondingCurveLine from '@/components/BondingCurveChart.vue';
import mitt from '@/libs/event';
import BigNumber from 'bignumber.js';
import PlatformFee from './PlatformFee.vue';

// TODO 这里 m 不再存在，并且没有它具体的实际意义

export default defineComponent({
  name: 'ClaimBondingCurve',
  data: () => ({
    selectedCollateral: undefined,
    receiver: '',
    creatorFee: '',
    config: {
      price: '',
      n: '2',
      m: '0.000001',
    },
    an: '2',
    am: '0.000001',

    activeX: 0,
  }),
  components: {
    PassCell,
    FormInput,
    BondingCurveLine,
    NetworkChoose,
    PlatformFee,
  },
  mounted() {
    this.selectedCollateral = this.collaterals.find(
      (x: any) => x.symbol == this.form.collateralTokens,
    );

    this.creatorFee = this.form.creatorFee;
    this.receiver = this.form.receivingAddress;
    this.config.price = this.form.initialPrice;
    this.config.m = this.form.m;
    this.config.n = this.form.n;
    this.activeX = this.form.activeX || 0;

    if (this.activeX == 1) {
      this.an = this.form.n;
    }
  },
  watch: {
    // passBondingCurve
    selectedCollateral(val: any) {
      this.setBondingCurve({
        collateralTokens: val.symbol,
      });
    },
    creatorFee(val) {
      this.checkForm();
      this.setBondingCurve({
        creatorFee: val,
      });
    },
    receiver(val) {
      this.checkForm();
      this.setBondingCurve({
        receivingAddress: val,
      });
    },
    collaterals(val: any) {
      const index = val.findIndex(
        (x: any) => x.symbol == (this.selectedCollateral as any).symbol,
      );
      this.selectedCollateral = val[index == -1 ? 0 : index];
    },
    ['config.price'](val) {
      this.checkForm();

      const obj: any = {
        initialPrice: val,
      };
      if (this.activeX == 0) {
        obj.m = this.configM;
      }

      this.setBondingCurve(obj);
    },
    ['config.m'](val) {
      this.checkForm();
      this.setBondingCurve({
        m: val,
      });
    },
    ['config.n'](val) {
      this.checkForm();
      this.setBondingCurve({
        n: val,
      });
    },
    activeX(val) {
      if (val == 0) {
        this.an = this.config.n;
        this.config.n = '2';
        this.setBondingCurve({
          n: this.config.n,
          m: this.configM,
        });
      } else {
        this.config.n = this.an;
        this.setBondingCurve({
          n: this.config.n,
          m: this.config.m,
        });
      }
      this.checkForm();
      this.setBondingCurve({
        activeX: val,
      });
    },
  },
  setup() {
    const input1 = ref(null);
    const input2 = ref(null);
    return {
      placeholderUrl: PlaceHolderImage,
      rules,
      // collaterals,
      commission: '2%',
      input1,
      input2,
    };
  },
  computed: {
    ...mapState({
      newDAO: (state: any) => state.dao.newDAO,
      info: (state: any) => state.erc20.info,
      localNetwork: (state: any) => state.wallet.network,
      form: (state: any) => state.form.bondingCurve,
    }),
    ...mapGetters('wallet', {
      networkParam: 'networkParam',
    }),
    collaterals(): any {
      const res = this.localNetwork
        ? Object.values(BONDING_CURVE_OPTIONS_BY_NETWORK(this.localNetwork))
        : [];

      return res;
    },
    configM() {
      if (this.config.price === '') {
        return 0;
      }

      BigNumber.config({ DECIMAL_PLACES: 18 });
      return new BigNumber(this.config.price + '')
        .multipliedBy(new BigNumber('0.0000002'))
        .toString(10);
    },
  },
  methods: {
    ...mapMutations('form', ['setBondingCurve']),
    doSwitch(i: any) {
      this.activeX = i;
    },
    checkForm() {
      let flag = true;

      if (
        (this.input1 as any).checkRule() ||
        (this.input2 as any).checkRule() ||
        !this.config.price ||
        (this.activeX == 1 && (!this.config.n || !this.config.m))
      ) {
        flag = false;
      }

      mitt.emit('checkBondingCurve', flag);
    },
  },
});
</script>

<style scope>
.adv {
  background: linear-gradient(270deg, #7f1a27 0%, #611822 100%);
  border-radius: 2px;
  z-index: 2;
}
.adv-unactive {
  transform: scale(0.9);
  background: linear-gradient(
    270deg,
    rgba(30, 113, 219, 0.1) 0%,
    rgba(30, 113, 219, 0.5) 100%
  );
  border-radius: 2px;
  opacity: 0.6;
  z-index: 1;
}

.basic {
  background: linear-gradient(90deg, #1b5eb2 0%, #18447a 100%);
  z-index: 2;
}
.basic-unactive {
  transform: scale(0.9);
  background: linear-gradient(
    90deg,
    rgba(140, 27, 41, 0.1) 0%,
    rgba(140, 27, 41, 0.5) 100%
  );
  border-radius: 2px;
  opacity: 0.6;
  z-index: 1;
}
</style>
