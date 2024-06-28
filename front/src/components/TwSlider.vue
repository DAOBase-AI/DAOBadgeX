<template>
  <div class="w-full mt-4">
    <div class="swiper-container" v-show="state.swiper">
      <div class="swiper-wrapper" :class="{ 'mb-10': links?.length > 3 }">
        <div
          class="swiper-slide"
          v-for="(link, i) in links"
          :id="`twitter-${i}`"
          :key="i"
        >
          <div class="w-full">
            <blockquote class="twitter-tweet" data-lang="en" data-theme="dark">
              <Skeletor
                class="w-full h-80 rounded-md"
                style="height: 480px"
              ></Skeletor>
              <a :href="link"></a>
            </blockquote>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>

      <div
        class="cursor-pointer h-10 w-10 rounded-full flex items-center justify-center absolute top-1/3 left-2.5 z-top text-white-040 prev"
        @click="slideThreeToLeft"
        v-if="links?.length > 3"
      >
        <span class="icon iconfont text-2xl">&#xe60d;</span>
      </div>
      <div
        class="cursor-pointer h-10 w-10 rounded-full flex items-center justify-center absolute top-1/3 right-2.5 z-top text-white-040 next"
        @click="slideThreeToRight"
        v-if="links?.length > 3"
      >
        <span class="icon iconfont text-2xl">&#xe60e;</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { Skeletor } from 'vue-skeletor';
import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css';
Swiper.use([Navigation, Pagination, Autoplay]);
const links = [
  'https://twitter.com/Metaguild/status/1539619026099486722',
  ' https://twitter.com/foreverlandsxyz/status/1547165560961646592',
  ' https://twitter.com/sharkdao/status/1608999284413792257',
  ' https://twitter.com/GoodTeamGuild/status/1504751357114593280',
  ' https://twitter.com/JennyMetaverse/status/1542834904026603521',
  ' https://twitter.com/Tezos_JP/status/1603752933190795265',
  ' https://twitter.com/thepass_to/status/1616767813406060544',
  ' https://twitter.com/ETHGlobal/status/1617569177354776577',
  'https://twitter.com/SpoolFi/status/1687185175141130240',
];
const state = reactive({
  swiper: null,
});
function slideThreeToRight() {
  const index = state.swiper.activeIndex + 3;
  const lastIndex = state.swiper.slides.length - 1;
  state.swiper.slideTo(index <= lastIndex ? index : lastIndex);
}
function slideThreeToLeft() {
  const index = state.swiper.activeIndex - 3;
  state.swiper.slideTo(index >= 0 ? index : 0);
}
onMounted(() => {
  state.swiper = new Swiper('.swiper-container', {
    slidesPerView: 2,
    spaceBetween: 24,
    shortSwipes: false,
    observeParents: true,
    observer: true,
    autoplay: 500,
    speed: 800,
    parallax: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    preloadImages: true,
    updateOnImagesReady: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
      renderBullet: function (index, className) {
        return '<div class="' + className + '"></div>';
      },
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
});
</script>

<style>
.twitter-tweet {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
.swiper-pagination {
  margin-top: 20px;
}
.swiper-pagination-bullet {
  width: 15px !important;
  height: 4px !important;
  background: rgba(255, 255, 255, 0.6) !important;
  border-radius: 4px !important;
}
.swiper-pagination-bullet-active {
  color: #fff !important;
  width: 20px !important;
  height: 4px !important;
  background: #fff !important;
}

.swiper-button-prev,
.swiper-button-next {
  top: 90% !important;
  width: 10px !important;
  height: 10px !important;
  color: rgba(255, 255, 255, 0.4) !important;
}
.prev,
.next {
  transition: all 0.2s ease-in-out;

  background: #2a2e33;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.prev:hover {
  transform: translateX(-6px);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.4);
}
.next:hover {
  transform: translateX(6px);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.4);
}
.data-container {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
@media (min-width: 31.25em) {
  .swiper-slide {
    /* going for a 2 column layout here */
    width: 50%;
  }
}
@media (min-width: 43.75em) {
  .swiper-slide {
    /* upping it to a 3 column layout */
    width: 33.33333333333%;
  }
}
</style>
