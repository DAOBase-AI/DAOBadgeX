<template>
  <Swiper
    :speed="800"
    mousewheel
    :spaceBetween="100"
    @swiper="getSwiper"
    class="mt-10"
  >
    <SwiperSlide v-for="(intro, i) in intros" :key="i">
      <div class="relative flex justify-center items-center">
        <UiImg
          :src="intro.img"
          class="bg-whitebase mb-4 img-line rounded"
          :style="{ width: '284px', height: '200px' }"
        ></UiImg>
        <div
          class="absolute bottom-1 left-1 right-1 bg-white rounded introview-box p-2"
          style="height: 148px"
        >
          <div class="flex items-center mb-2">
            <span class="font-10 mr-2"> (0{{ i + 1 }}) </span>
            <span class="font-14 font-bold">
              {{ intro.name }}
            </span>
          </div>
          <p class="font-10" v-for="(text, k) in intro.labels" :key="k">
            {{ text }}
          </p>
          <div class="mb-1"></div>
          <p
            :class="{
              ' text-tip-0': text.type != 'label',
            }"
            class="font-10"
            v-for="(text, k) in intro.texts"
            :key="k"
          >
            {{ text }}
          </p>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
  <div class="flex justify-center mt-3">
    <div class="flex space-x-4">
      <div
        class="w-6 h-1 introview-page rounded"
        :class="{
          'introview-page__active': i == state.selected,
        }"
        v-for="(_, i) in Array(4).fill(0)"
        :key="i"
        @click="onSelect(i)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import UiImg from '@/components/UiImg.vue';
import { reactive, ref } from 'vue';
import nftpass from '@/assets/images/home/NFTPASS.avif';
import dashboard from '@/assets/images/home/DashBoard.avif';
import dao from '@/assets/images/home/DAO.avif';
import voting from '@/assets/images/home/Voting.avif';

const switer = ref(null);

const state = reactive({
  selected: 0,
});

const onSelect = (i) => {
  state.selected = i;
  switer.value.slideTo(i);
};

const intros = [
  {
    name: 'DAO Creation',
    labels: ['1.DAO information aggregation', '2.Social signal display'],
    img: dao,
  },
  {
    name: 'NFT PASS Offering',
    labels: [
      'DAO BASE offers three types of NFT PASSes for selection including Bonding Curve NFT PASS,Fixed priced PASS and Staking Token NFT PASS for better DAO/community management.',
    ],
    texts: [
      '1.Proof of Passion & NFT gated community',
      '2.Fundraising through PASS offering',
      '3.Premiun privilage unlokced by NFT PASS',
      '4.One PASS, One Voting Power',
    ],
    img: dashboard,
  },
  {
    name: 'Dashboard',
    labels: [
      'Dashboard is committed to providing transparent data about DAO treasury including FT vault and NFT vault.',
    ],
    texts: [
      '1.The lists of specific FT and NFT assets',
      '2.NFT assets evaluation according to historical trades and floor price',
      '3.Historical transaction chart categorized by traits',
    ],
    img: nftpass,
  },
  {
    name: 'Voting',
    labels: [
      'Voting function is for satisfying the governance of DAO and community through NFT PASSes.',
    ],
    img: voting,
  },
];

const getSwiper = (swiper) => {
  swiper.on('slideChange', ({ activeIndex }) => {
    state.selected = activeIndex;
  });
  switer.value = swiper;
};
</script>

<style lang="scss" scoped>
.introview-page {
  background: #ffffff1a;
}
.introview-page:hover,
.introview-page__active {
  background: #fff;
}

.introview-box {
  box-shadow: 0px 8px 24px 0px rgba(18, 20, 22, 0.3);
  background: #1c1d1fff;
}
.img-line {
  border: 1px solid #fff;
}
</style>
