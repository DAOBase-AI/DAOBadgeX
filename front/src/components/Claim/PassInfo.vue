<template>
  <!-- Skeletor -->
  <div class="mt-2 pass-infobox box-bg relative" v-if="dao.loading">
    <div
      class="absolute top-0 left-0 w-full h-full flex flex-col justify-between pb-4 px-16"
    >
      <div class="flex justify-between items-center mt-6">
        <div class="flex items-center">
          <Skeletor class="w-24 h-24 mr-6" Pill circle></Skeletor>
          <div>
            <Skeletor height="60" width="400"></Skeletor>
            <Skeletor
              class="flex justify-center items-center cursor-pointer px-3 mt-4 text-sm"
              height="20"
              width="100"
            ></Skeletor>
          </div>
        </div>
        <div class="flex flex-col justify-center items-center">
          <Skeletor width="40"></Skeletor>
          <Skeletor width="100" class="mt-2"></Skeletor>
        </div>
      </div>
      <div>
        <div class="flex">
          <Skeletor class="mr-2" width="100"></Skeletor>
          <Skeletor width="400"></Skeletor>
        </div>
        <div class="flex mt-6">
          <Skeletor class="mr-2" width="100"></Skeletor>
          <Skeletor width="400"></Skeletor>
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-5 right-0 flex justify-between items-center h-14 overflow-hidden"
    >
      <Skeletor width="200" height="100"></Skeletor>
    </div>
  </div>

  <div class="mt-2 pass-info relative overflow-hidden" v-else>
    <!-- Bg -->
    <img
      src="@/assets/bgs/claim-x.avif"
      alt=""
      class="w-full h-full absolute"
    />
    <img
      src="@/assets/bgs/claim-case.avif"
      alt=""
      class="h-52 absolute right-5 top-5"
    />

    <div class="pb-6 pl-10 pr-20 relative">
      <div class="flex justify-between items-center mt-6">
        <div class="flex">
          <img
            v-lazy="{
              src: dao.logo,
              loading: 'https://dummyimage.com/200x200/eeeeee/eeeeee',
            }"
            alt="dao_logo"
            class="rounded-full w-32 h-32 mr-6 object-cover"
          />
          <div class="relative flex flex-col justify-center">
            <img
              src="@/assets/bgs/claim-title-case.avif"
              alt=""
              class="absolute w-20 -left-8 -top-2"
            />
            <div
              class="text-4xl font-bold text-whitebase italic md:break-words whitespace-pre-wrap"
            >
              {{ dao.name || 'DAO BASE' }}
            </div>

            <div
              v-if="dao.network"
              class="flex justify-center items-center cursor-pointer px-4 mt-2 h-6"
              style="
                border: 1px solid #5e6873;
                color: #5e6873;
                width: fit-content;
              "
            >
              {{ dao.network }}
            </div>
          </div>
        </div>

        <div class="text-center relative">
          <div class="highlight text-4xl font-bold">
            {{ dao.claim == undefined ? ' ' : dao.claim }}
          </div>
          <div class="text-whitebase text-xs mt-1">Claimed</div>
        </div>
      </div>
      <div class="space-y-4 mt-16">
        <div class="flex" v-for="(item, i) in hello" :key="i">
          <span class="ml-1 text-whitebase mr-2 font-bold">
            {{ item.label }}
          </span>
          <span class="text-strong-blue" v-if="!item.link">
            {{ item.value }}
          </span>
          <a
            :href="item.link"
            class="text-strong-blue hover:underline"
            target="_target"
            v-else
          >
            {{ item.value }}
          </a>
        </div>
      </div>
    </div>
    <div
      class="absolute bottom-6 right-0 pass-member text-whitebase flex justify-between items-center h-14"
    >
      <div class="pl-2 flex" v-if="dao.membersUser.length > 0">
        <div
          v-for="(item, i) in dao.membersUser"
          :key="i"
          class="w-12 h-12 rounded-full overflow-hidden"
          :class="{ '-ml-4': i !== 0 }"
          :style="{ zIndex: 3 - i }"
        >
          <img
            v-if="item.avatarUrl"
            :src="item.avatarUrl"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          class="w-12 h-12 rounded-full bg-strong-gray opacity-50 z-0"
          :class="[!dao.members ? 'pl-2' : '-ml-10']"
        ></div>
      </div>
      <div class="mr-12 ml-4">{{ dao.members }} Members</div>
    </div>
  </div>
</template>

<script lang="ts">
import { chainExplore } from '@/constants';
import { defineComponent } from 'vue';
import { Skeletor } from 'vue-skeletor';
import { mapActions, mapState } from 'vuex';

const pass = {
  name: 'MiaCrap',
  creator: 'Mia_Blockchain',
  address: '0x008d0f0156a2a439ae2aba26612dfc9271cb5033',
  token: 'MIA',
  tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  claim: 2333,
};

export default defineComponent({
  name: 'Action',
  components: {
    Skeletor,
  },
  methods: {
    ...mapActions('user', ['getUser']),
    ...mapActions('dao', ['getClaimDAOClaimed', 'getSimpleDao']),
  },
  data: () => ({
    user: {} as any,
  }),
  async mounted() {
    // await this.getSimpleDao(this.$route.query.id);
    // console.log(this.dao);
  },
  computed: {
    ...mapState({
      dao: (state: any) => state.dao.claimDAO,
      token: (state: any) => state.erc20.info,
    }),
    hello() {
      const res: any = [
        {
          label: this.$t('Claim.Creator'),
          value: this.dao.creatorName || 'Unamed',
        },
        {
          label: 'PASS ' + this.$t('Claim.Address'),
          value: this.dao.contractAddress,
          link: this.dao.network
            ? `${chainExplore[this.dao.network]}/address/${
                this.dao.contractAddress
              }`
            : '',
        },
      ];

      if (/base/.test(this.dao.passType)) {
        res.push({
          label: this.dao.tokenName + this.$t('Claim.Address'),
          value: (
            this.dao.tradeInfo.miaAddress ||
            this.dao.tradeInfo.nftAddress ||
            ''
          ).toLowerCase(),
          link: this.dao.network
            ? `${chainExplore[this.dao.network]}/address/${
                this.dao.tradeInfo.miaAddress ||
                this.dao.tradeInfo.nftAddress ||
                ''
              }`
            : '',
        });
      }

      return res;
    },
  },
  props: {
    address: {
      type: String,
    },
    name: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  setup() {
    return {
      pass,
    };
  },
});
// TODO Hello
</script>

<style scoped>
.pass-infobox {
  width: 100%;
  padding-bottom: 24%;
}
.pass-info {
  width: 100%;
  /* padding-bottom: 24%; */
  background: linear-gradient(180deg, #212529 0%, #191c1f 100%);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.5),
    0px 2px 0px 0px rgba(255, 255, 255, 0.1) inset;
}

.pass-member {
  background: #2a2e33;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.5),
    0px 2px 0px 0px rgba(255, 255, 255, 0.1);
  border-radius: 100px 0px 0px 100px;
}
</style>
