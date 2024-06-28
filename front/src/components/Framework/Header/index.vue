<template>
  <div
    class="sticky top-0 w-full border-b border-white-010"
    :class="{ 'bg-white': !isBaseRoute }"
    style="z-index: 100"
  >
    <div
      v-if="isBaseRoute"
      class="w-full bg-white h-full absolute top-0 text-whitebase"
      :style="`opacity:${scrollPercentage}`"
    ></div>
    <div class="relative z-40 home-padding" style="height: 72px">
      <div class="w-full h-full flex items-center justify-between">
        <div class="flex items-center">
          <router-link to="/">
            <img
              class="h-12 w-12 mr-10"
              src="@/assets/logo/logo-beta.avif"
              alt=""
            />
          </router-link>

          <GlobalNav></GlobalNav>
        </div>

        <div>
          <GlobalWallet v-if="isDesktop"></GlobalWallet>
          <div v-else class="flex items-center">
            <!-- <div
              v-if="showTreasuryCurrency && !isDesktop && treasuryCurrency"
              class="text-whitebase w-14 h-9 bg-white-005 flex items-center justify-center mr-3"
              @click="
                () => {
                  store.commit(
                    'setTreasuryCurrency',
                    treasuryCurrency === 'USDT' ? 'ETH' : 'USDT',
                  );
                }
              "
              style="border-radius: 18px"
            >
              <img
                class="w-5 h-5 rounded-full mr-1"
                v-if="treasuryCurrency === 'USDT'"
                src="@/assets/icons/usdt.avif"
                alt="usdt logo"
              />
              <img
                class="w-5 h-5 rounded-full mr-2"
                v-if="treasuryCurrency === 'ETH'"
                src="@/assets/icons/eth-s.avif"
                alt="eth logo"
              />
              <span
                class="icon iconfont icon-qiehuan-36 w-4 h-4"
                style="transform: rotate(90deg)"
              ></span>
            </div> -->
            <MobileNav></MobileNav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { checkScreenSize } from '@/hooks';
import GlobalNav from './GlobalNav.vue';
import GlobalWallet from './GlobalWallet.vue';
import MobileNav from './MobileNav.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';
const store = useStore();
const showTreasuryCurrency = computed(() => store.state.showTreasuryCurrency);
const treasuryCurrency = computed(() => store.state.treasuryCurrency);
console.log(store.state);
const isDesktop = checkScreenSize();
import { useRoute } from 'vue-router';

const route = useRoute();
const isBaseRoute = computed(() => route.path === '/');
const scrollPercentage = ref(0);
let lastKnownScrollPosition = 0;
let ticking = false;

const calculateScrollPercentage = () => {
  const windowHeight = window.innerHeight;
  const maxScroll = windowHeight; // Maximum scroll value for 100vh

  const newPercentage = Math.min(
    (lastKnownScrollPosition / maxScroll) * 100,
    100,
  );

  if (Math.abs(scrollPercentage.value - newPercentage) >= 1) {
    scrollPercentage.value = newPercentage / 100; // Scale down for opacity
  }
};

const throttledScrollHandler = () => {
  lastKnownScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      calculateScrollPercentage();
      ticking = false;
    });

    ticking = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', throttledScrollHandler);
});

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScrollHandler);
});
</script>

<style scoped></style>
