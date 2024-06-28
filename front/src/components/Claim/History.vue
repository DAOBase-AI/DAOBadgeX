<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div>
    <div class="pt-8"></div>
    <LineTitle class="text-4xl">{{
      $t(`Claim.History.Title`).toUpperCase()
    }}</LineTitle>

    <div class="h-80 mt-4 opacity-40 box-bg" v-if="dao.loading">
      <Skeletor height="100%"></Skeletor>
    </div>

    <div class="mt-6 box-bg text-whitebase" v-else>
      <div class="align-middle inline-block min-w-full">
        <div class="w-full">
          <div class="grid grid-flow-row">
            <!-- head -->
            <div
              class="grid grid-flow-col h-14 table-box__head font-bold"
              :class="{
                'table-box':
                  dao.passType == 'token_base' || dao.passType == 'nft_base',
                'table-box_fixed': dao.passType == 'fixed_price',
                'table-box_bonding': dao.passType == 'bonding_curve',
              }"
            >
              <div
                class="flex pl-8 items-center text-xl"
                v-for="(item, i) in headers"
                :key="i"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <PerfectScrollbar class="h-72">
            <div
              class="grid grid-flow-col h-10 text-sm"
              :class="{
                'table-box':
                  dao.passType == 'token_base' || dao.passType == 'nft_base',
                'table-box_fixed': dao.passType == 'fixed_price',
                'table-box_bonding': dao.passType == 'bonding_curve',
              }"
              v-for="obj in dao.tradeInfo ? dao.tradeInfo.histories : []"
              :key="obj.id"
            >
              <div
                class="flex justify-start items-center pl-8 overflow-hidden"
                v-for="(item, i) in getBody(obj)"
                :key="i"
              >
                <div
                  v-if="item.type == 'hash'"
                  class="text-strong-blue underline overflow-ellipsis whitespace-nowrap overflow-hidden pr-8 cursor-pointer"
                  @click="jumpHash(obj.transaction)"
                >
                  {{ item.text }}
                </div>

                <Popper v-else-if="item.type == 'time'" placement="left" hover>
                  <div class="text-strong-gray italic cursor-default">
                    {{ item.text }}
                  </div>

                  <template v-slot:content="">
                    <div
                      v-if="item.detailText"
                      class="text-xs text-whitebase backdrop-filter backdrop-blur py-2 px-3"
                    >
                      {{ item.detailText }}
                    </div>
                  </template>
                </Popper>
                <div v-else>
                  {{ item.text }}
                </div>
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getDAOTokensByOwner } from '@/api/eth';
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import LineTitle from '@/components/LineTitle.vue';
import { formatDateText } from '@/utils';
import { chainExplore } from '@/constants';
import dayjs from 'dayjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Popper from 'vue3-popper';
import { Skeletor } from 'vue-skeletor';

export default defineComponent({
  data: () => ({
    history: [] as Array<{
      date: string;
      passId: string;
      expiry: string;
    }>,
  }),
  components: {
    LineTitle,
    Popper,
    Skeletor,
  },
  computed: {
    ...mapState({
      accounts: (state: any) => state.wallet.accounts,
      dao: (state: any) => state.dao.claimDAO,
      claimable: (state: any) => state.pass.gammaClaimable,
      localNetwork: (state: any) => state.wallet.network,
    }),
    headers() {
      if (this.dao.passType == 'fixed_price')
        return [
          'Address',
          'Transaction',
          'Event',
          'Token ID',
          'Expiration Date',
          'Create Date',
        ];
      if (this.dao.passType == 'bonding_curve')
        return [
          'Address',
          'Tx ID',
          'Event',
          'Token ID',
          'Quantity',
          'Create Date',
        ];
      return ['Address', 'Transaction', 'Event', 'Token ID', 'Create Date'];
    },
  },
  methods: {
    ...mapActions('pass', [
      'claimableAlpha',
      'claimableBeta',
      'claimableGamma',
      'redeemAlpha',
      'redeemBeta',
      'redeemGamma',
    ]),
    ...mapActions('dao', ['getPassDAO']),
    ...mapActions('erc20', ['fetchTokenInfo']),
    formatDateText,
    getBody(info: any) {
      const res: any = [
        {
          text: `0x${(info.address || '').substring(2, 6)}......${(
            info.address || ''
          ).substring(36)}`,
        },
        { text: info.transaction, type: 'hash' },
        { text: info.event.toUpperCase() },
        { text: info.tokenId },
      ];

      if (this.dao.passType == 'bonding_curve')
        res.push({ text: info.balance });

      if (this.dao.passType == 'fixed_price')
        res.push({
          text: info.expirationDate
            ? dayjs(info.expirationDate).format('YYYY-MM-DD HH:mm:ss')
            : '∞',
          type: 'time',
        });

      res.push({
        text: formatDateText(info.createDate),
        detailText: dayjs(info.createDate).format('MMMM d YYYY, hh:mm a'),
        type: 'time',
      });

      return res;
    },
    jumpHash(hash: string) {
      window.open(`${chainExplore[this.dao.network]}/tx/${hash}`, '_target');
    },
    async getHistory() {
      const resp = await getDAOTokensByOwner(
        parseInt(this.$route.query.id as string),
        this.accounts[0],
      );
      this.history = [];
      resp.logs.forEach((element: any) => {
        this.history.push({
          date: '2021-8-13',
          passId: parseInt(element.args[1], 16).toString(),
          expiry: '∞',
        });
      });
    },
    async redeem(id: string) {
      try {
        console.log('redeem', id);
        switch (this.dao.kind) {
          case 'token-base':
            await this.redeemAlpha({
              passport: this.dao['passport_address'],
              id: parseInt(id),
            });
            break;
          case 'nft-base':
            await this.redeemBeta({
              passport: this.dao['passport_address'],
              id: parseInt(id),
            });
            break;
          case 'fixed-price':
            await this.redeemGamma({
              passport: this.dao['passport_address'],
              id: parseInt(id),
            });
            break;
          default:
            console.warn('no matched kind');
            break;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
  async created() {
    // await this.getPassDAO(parseInt(this.$route.query.id as string));
    // await this.getHistory();
    // let claimableFunction: any;
    // switch (this.dao.kind) {
    //   case 'token-base':
    //     claimableFunction = this.redeemAlpha;
    //     break;
    //   case 'nft-base':
    //     claimableFunction = this.redeemBeta;
    //     break;
    //   case 'fixed-price':
    //     claimableFunction = this.redeemGamma;
    //     break;
    //   default:
    //     console.warn('no matched kind');
    //     break;
    // }
    // claimableFunction &&
    //   (await claimableFunction(this.dao['passport_address']));
    // setInterval(async () => {
    //   await this.getHistory();
    //   claimableFunction &&
    //     (await claimableFunction(this.dao['passport_address']));
    // }, 10000);
  },
});
</script>

<style>
.table-box {
  grid-template-columns: 26fr 23fr 17fr 17fr 17fr;
}
.table-box_fixed {
  grid-template-columns: 3fr 3fr 2fr 2fr 3fr 3fr;
}
.table-box_bonding {
  grid-template-columns: 26fr 28fr 14fr 16fr 14fr 24fr;
}
.table-box__head {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-box > div:not(:last-child),
.table-box_fixed > div:not(:last-child),
.table-box_bonding > div:not(:last-child) {
  /* border-right: 1px solid rgba(255, 255, 255, 0.1); */
}
.table thead {
  border-bottom: 1px solid #d8d8d81a;
}
</style>

<style scoped>
:deep(.popper) {
  box-shadow: 8px 45px 32px 0px rgba(0, 0, 0, 0.4);
  border: 0.1rem solid;
  border-radius: 1rem;
  border-image: linear-gradient(
      90deg,
      rgba(149, 230, 246, 1),
      rgba(149, 230, 246, 0.2)
    )
    2 2;
}
</style>
