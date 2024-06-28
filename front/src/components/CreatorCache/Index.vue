<template>
  <Page :bottomPadding="false">
    <!-- <video
      class="w-full h-full fixed top-0 left-0 object-fill"
      src="@/assets/videos/creator-cache.mp4"
      loop
      autoplay
      muted
      type="video/mp4"
    ></video> -->
    <div class="flex text-whitebase mt-20">
      <!-- <Swiper
        :speed="800"
        mousewheel
        :allowTouchMove="false"
        :spaceBetween="400"
        @swiper="getSwiper"
      > -->
      <!-- <SwiperSlide> -->
      <div class="relative w-full z-10">
        <div class="text-7xl font-bold" style="line-height: 1.2">
          CREATE YOUR<br />DAO COMMUNITY!
        </div>
        <div class="w-1/2 pt-4 h-28">
          Join the community with excluesive NFT PASS!<br />
          Manage the community through townhall and governance!
        </div>

        <div class="flex mt-20">
          <router-link
            to="/create/dao"
            custom
            v-slot="{ navigate }"
            class="creator-btn flex justify-center items-center cursor-pointer font-bold text-main-4"
          >
            <Button error class="mr-8 h-10" @click="toCreateDao(navigate)" bold>
              CREATE DAO
            </Button>
          </router-link>
          <router-link
            to="/creator/all"
            custom
            v-slot="{ navigate }"
            style="width: fit-content"
          >
            <Button error class="h-10" @click="navigate" bold
              >Explore all communities first</Button
            >
          </router-link>
        </div>

        <div
          class="absolute top-1/3 right-0 cursor-pointer flex items-center wrapper-btn text-lg font-bold italic"
          @click="doNext"
        >
          <!-- FLASH DAO -->
          <div class="-ml-3 arrow-loop" style="width: 88px; height: 88px"></div>
        </div>
      </div>
      <!--  </SwiperSlide> -->
      <!-- <SwiperSlide> -->
      <!-- <div class="relative w-full z-10">
        <div class="text-7xl font-bold" style="line-height: 1.2">
          WANNA SKIP<br />THE FUSS?
        </div>
        <div class="w-1/2 pt-4 h-28">HOW ABOUT A RANDOM FLASH TOWNHALL?</div>

        <div class="flex mt-20">
          <router-link
            to="/townhallcreate"
            custom
            v-slot="{ navigate }"
            class="
              creator-btn
              flex
              justify-center
              items-center
              cursor-pointer
              font-bold
              text-main-4
            "
          >
            <Button
              error
              class="mr-8 h-10"
              @click="toCreateTownhall(navigate)"
              bold
            >
              CREATE TOWNHALL
            </Button>
          </router-link>
          <router-link
            to="/townhalllist"
            custom
            v-slot="{ navigate }"
            style="width: fit-content"
          >
            <Button error class="h-10" @click="navigate" bold
              >Explore townhall room list</Button
            >
          </router-link>
        </div>

        <div
          class="
            absolute
            top-1/3
            right-0
            cursor-pointer
            flex
            items-center
            wrapper-btn
            text-lg
            font-bold
            italic
          "
          @click="doPrev"
        >
          <div
            class="-mr-3 arrow-loop-reserve"
            style="width: 88px; height: 88px"
          ></div>

          CREATOR DAO
        </div>
      </div> -->
      <!-- </SwiperSlide>
      </Swiper> -->
    </div>
  </Page>
  <!-- <div class="float-bg w-7/12 text-whitebase relative">
    <RotateView
      v-if="tab == 0"
      class="absolute top-1/2 left-1/2"
      :style="{ transform: 'translate(-50%,-50%)' }"
    ></RotateView>

    <img v-if="tab == 0" class="w-full" src="@/assets/images/cc-bg.avif" />
    <img v-if="tab != 0" src="@/assets/images/cc-bgy.avif" class="w-full" />

    </div>
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import Page from '@/components/Page.vue';
import Button from '@/components/Button.vue';
import { withConnectWallet } from '@/utils/with';

export default defineComponent({
  data: function () {
    return {
      tab: 0,
      swiper: null,
    };
  },
  components: {
    Page,
    // SwiperSlide,
    // Swiper,
    Button,
    // RotateView,
  },
  computed: {
    ...mapState({
      token: (state: any) => state.wallet.token,
      isSignedIn: (state: any) => state.wallet.isSignedIn,
      accessToken: (state: any) => state.wallet.accessToken,
      accessTokenExp: (state: any) => state.wallet.accessTokenExp,
      accounts: (state: any) => state.wallet.accounts,
    }),
  },
  methods: {
    ...mapActions('wallet', ['getAuthorizeToken', 'signIn']),
    async redirect() {
      try {
        if (!this.token || !this.isSignedIn) {
          await this.signIn();
        }
        await this.getAuthorizeToken();
      } catch (e) {
        console.error(e);
      }
      window.location.href = `https://townhall.beeperdao.io?access_token=${encodeURIComponent(
        this.accessToken,
      )}&exp=${encodeURIComponent(
        this.accessTokenExp,
      )}&addr=${encodeURIComponent(this.accounts[0])}`;
    },

    getSwiper(swiper: any) {
      this.swiper = swiper;
    },
    doNext() {
      console.log(this.swiper);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.swiper?.slideNext();
    },
    doPrev() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.swiper?.slidePrev();
    },
    toCreateDao: withConnectWallet(function (navigate: any) {
      navigate();
    }),
  },
});
</script>

<style scoped>
.text-bg {
  background-size: 100% auto;
  background-image: url('~@/assets/images/cc-text_bg.avif');
  background-repeat: no-repeat;
}
.tab-btn {
  display: flex;
  justify-content: center;
  justify-items: center;
  font-weight: bold;
  background-image: url('~@/assets/images/cc-tab_btn.avif');
  background-size: 100% 100%;
}
.tab-btn.active {
  background-image: url('~@/assets/images/cc-tab_btnx.avif');
}
.link-btn {
  background-size: 100% 100%;
  background-image: url('~@/assets/images/cc-link_btn.avif');
}

.css-leftright {
  animation: leftright ease-out 2s infinite;
}

@keyframes leftright {
  0% {
    transform: translateX(0%);
  }
  25% {
    transform: translateX(50%);
  }
  50% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(50%);
  }
  100% {
    transform: translateX(0%);
  }
}
.float-bg {
  position: absolute;
  top: 20%;
  right: 0;
}

@media (min-width: 1024px) {
  .float-bg {
    top: 0;
  }
}

.creator-format-btn {
  background-image: url('~@/assets/bgs/creator-format-btn.avif');
}
.creator-flash-btn {
  background-image: url('~@/assets/bgs/creator-flash-btn.avif');
}
.creator-format-btn,
.creator-flash-btn {
  transition: all 0.3s;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.hand-btn {
  background-size: 100% 100%;
  background-image: url('~@/assets/icons/hand.avif');
  background-repeat: no-repeat;
}
.hand-btn:hover,
.wrapper-btn:hover .hand-btn {
  background-image: url('~@/assets/icons/hand-active.avif');
}

.creator-btn {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('~@/assets/bgs/creator-btn.avif');
}
.creator-btn:hover {
  background-image: url('~@/assets/bgs/creator-btn-active.avif');
}

@keyframes arrow-x {
  0% {
    background-position-y: 0;
  }

  100% {
    background-position-y: -5016px;
  }
}
.arrow-loop {
  transform: scale(0.8);
  background-image: url('~@/assets/gif/arrow.avif');
  background-repeat: no-repeat;
  animation: arrow-x steps(57) 2s infinite;
}
.arrow-loop-reserve {
  transform: scale(0.8) rotate(180deg);
  background-image: url('~@/assets/gif/arrow.avif');
  background-repeat: no-repeat;
  animation: arrow-x steps(57) 2s infinite;
}
</style>
