<template>
  <div class="grid grid-flow-row gap-6">
    <PassCell name="Network :">
      <NetworkChoose></NetworkChoose>
      <!-- <div class=" cursor-not-allowed form_cell flex text-whitebase italic text-sm pl-3 py-2 items-center">{{localNetwork}}</div> -->
    </PassCell>
    <PassCell :name="$t('CreateDAO.TokenBaseOptions.PASSContract')">
      <div
        class="cursor-not-allowed form_cell flex text-whitebase italic text-sm pl-3 py-2 items-center"
      >
        ERC721
      </div>
    </PassCell>
    <PassCell
      v-model="selectedContract"
      name="Which token needed to mint the NFT PASS :"
      :list="contracts"
    ></PassCell>
    <PassCell name="* Your token contract address :">
      <TokenSearch
        v-model="address"
        :tokenType="form.tokenMintTheNftPass"
      ></TokenSearch>
    </PassCell>
    <PassCell
      v-if="selectedContract.symbol == 'ERC20'"
      name="* Quantity needed to mint a NFT :"
    >
      <FormInput
        v-model="rate"
        min="0"
        placeholder="Num"
        required
        typeMode="FLOAT"
        :rules="['gtZero']"
      ></FormInput>
    </PassCell>
    <PassCell
      v-if="selectedContract.symbol != 'ERC20'"
      name="How many needed to mint a NFT PASS :"
    >
      <div
        class="cursor-not-allowed form_cell flex text-whitebase italic text-sm pl-3 py-2 items-center"
      >
        {{ form.nftNeeded }}
      </div>
    </PassCell>
    <div class="text-whitebase text-sm font-bold">
      If you want to create PASS at some point in the future, set the time and
      create it manually at that time.
    </div>
    <div class="form-cell h-10">
      <div class="flex mr-2">
        <ClockIcon class="w-5 h-5 text-whitebase mr-4"></ClockIcon>
        <span style="color: #831828">Scheduling ahead :</span>
      </div>

      <div class="form-input-border relative flex">
        <DatePicker
          v-model="schedulingAhead"
          class="w-full"
          inputClassName="date-picker-input"
          autoApply
          is24
          dark
          hideInputIcon
          :startDate="minDate"
          format="MMMM d, yyyy HH:mm"
          position="right"
          placeholder="Schedule Time"
          @update:modelValue="onScheduleAhead"
          @open="onOpenScheduleAhead"
        />
        <div class="px-2 font-bold text-whitebase flex items-center">(UTC)</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import { PlaceHolderImage, rules } from '@/constants';
import PassCell from '@/components/Framework/PassCell.vue';

import TokenSearch from './TokenSearch.vue';
import FormInput from '@/components/Framework/FormInput.vue';
import NetworkChoose from '@/components/CreateDAO/NetworkChoose.vue';
import DatePicker from 'vue3-date-time-picker';
import { ClockIcon } from '@heroicons/vue/outline';

import mitt from '@/libs/event';
import { utils } from 'ethers';
import { getUTCTime } from '@/utils';

const contracts = [
  {
    id: 1,
    symbol: 'ERC721',
  },
  {
    id: 2,
    symbol: 'ERC20',
  },
];

export default defineComponent({
  data: () => ({
    open: false,
    tokenInfo: false,
    selectedContract: contracts[0],
    rate: '',
    address: '0x0527E400502d0CB4f214dd0D2F2a323fc88Ff924',
    created: false,
    schedulingAhead: '',
    minDate: getUTCTime(),
  }),
  methods: {
    ...mapActions('erc20', ['fetchTokenInfo']),
    ...mapMutations('form', ['setStakingBase']),
    async getTokenInfo() {
      // TODO 这里缺一个校验
      await this.fetchTokenInfo({
        token: this.address,
      });
      this.tokenInfo = true;
    },
    checkForm() {
      let flag = true;

      if (
        !utils.isAddress(this.address) ||
        (this.selectedContract.symbol != 'ERC721' && !this.rate)
      ) {
        flag = false;
      }

      mitt.emit('checkTokenBase', flag);
    },
    onScheduleAhead(this: any, time: Date) {
      this.schedulingAhead = time;
    },
    onOpenScheduleAhead(this: any) {
      if (!this.schedulingAhead) {
        this.schedulingAhead = getUTCTime();
      }
    },
  },
  created(this: any) {
    this.selectedContract = contracts.find(
      (x) => x.symbol === this.form.tokenMintTheNftPass,
    );
    this.rate = this.form.tokensNeededToMintANft;
    this.address = this.form.tokenAddress;
    this.$nextTick(() => {
      this.created = true;
    });
  },
  watch: {
    selectedContract(val) {
      if (this.created) {
        this.address = '';
      }

      if (val.symbol == 'ERC721') {
        this.rate = '';
      }
      this.checkForm();

      this.setStakingBase({
        tokenMintTheNftPass: val.symbol,
      });
    },
    rate(val) {
      this.checkForm();
      this.setStakingBase({
        tokensNeededToMintANft: val,
      });
    },
    address(val) {
      this.checkForm();
      this.setStakingBase({
        tokenAddress: val,
        tokenContractAddress: val,
        nftContractAddress: val,
      });
    },
  },
  components: {
    PassCell,
    TokenSearch,
    FormInput,
    NetworkChoose,
    ClockIcon,
    DatePicker,
  },
  setup() {
    return {
      contracts,
      placeholderUrl: PlaceHolderImage,
      rules,
    };
  },
  computed: {
    ...mapState({
      newDAO: (state: any) => state.dao.newDAO,
      claimToken: (state: any) => state.erc20.info,
      localNetwork: (state: any) => state.wallet.network,
      form: (state: any) => state.form.stakingBase,
    }),
  },
});
</script>

<style scoped>
.form-cell {
  display: flex;
}
.form-cell > div {
  flex: 1;
}
</style>
