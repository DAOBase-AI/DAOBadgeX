<template>
  <div
    class="text-whitebase w-10 h-10 flex justify-center items-center"
    @click="toggleStatus"
  >
    <i class="iconfont icon-guanbi font-24" v-if="$store.state.statusShow"></i>
    <div class="relative">
      <i
        v-if="!state.isMinted && !$store.state.statusShow"
        class="notMintDotted absolute"
      />
      <i
        v-if="!$store.state.statusShow"
        class="iconfont icon-caidan-31 font-24"
      ></i>
    </div>
  </div>

  <transition name="fade">
    <div
      v-if="$store.state.statusShow"
      class="absolute bg-white left-0 mobile-box--shadow text-whitebase flex flex-col justify-between"
      style="top: 72px; height: calc(100vh - 70px); width: 100vw"
    >
      <div class="mt-3">
        <div
          class="h-12 flex justify-end items-center font-bold font-18 pr-4 mobile-tab--btn"
          v-for="(tab, i) in globalTabs"
          :key="i"
          @click="jump(tab)"
        >
          <div class="mr-2 text-sm flex items-center">
            {{ tab.name }}
            <img v-if="tab.img" class="w-5 h-5 ml-2" :src="tab.img" alt="" />
            <img v-if="tab.imgName" :src="tab.imgName" style="width: 88px" />
          </div>
        </div>
      </div>

      <div class="w-4/5 mx-auto mb-40">
        <UiButton
          v-if="!isSignedIn"
          class="rounded"
          style="height: 52px"
          type="main-white"
          @click="mittWalletSelect"
          >Sign in</UiButton
        >

        <div class="flex flex-col items-end space-y-8" v-else>
          <div
            class="font-bold flex gap-2"
            @click="
              toProfile();
              state.open = false;
            "
          >
            <span class="active-button daoBadgeButton"
              ><i class="daoBadgeIcon" />&nbsp;DAO Badge</span
            >
            Profile
          </div>
          <div class="font-bold" @click="doSignoutFunc">Sign Out</div>

          <div class="flex justify-end">
            <div>
              <div class="mb-1" @click="copyTx(userInfo.address)">
                <i class="iconfont icon-fuzhi2-29 mr-1"></i>
                <span>{{ formatAddress(userInfo.address, 5) }}</span>
              </div>
              <div class="flex justify-end">
                <div
                  class="rounded h-4 flex items-center text-mb-red mobile-network--line font-12 px-2"
                >
                  {{ chainx }}
                </div>
              </div>
            </div>
            <UiImg
              class="w-10 h-10 rounded-full overflow-hidden ml-3"
              :src="userInfo.icon"
            ></UiImg>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, watch, ref } from 'vue';
import UiButton from '@/components/UiButton.vue';
import { useSigninCheck, useUserInfo, useNetwork, useSignOut } from '@/hooks';
import { withThrottling } from '@/utils/with';
import UiImg from '@/components/UiImg.vue';
import { formatAddress, copyTx } from '@/utils';
import { useStore } from 'vuex';
import { mittWalletConnectSignOut, mittWalletSelect } from '@/libs/event';
import { getMintedPersonalData, getProfile } from '@/api/dao';
import { contracts } from '@/constants';
import { notify } from '@kyvg/vue3-notification';
import { useRouter, useRoute } from 'vue-router';

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const x = ref(null);

const userInfo = useUserInfo();
const isSignedIn = computed(() => !!userInfo.value.address);

const chainx = useNetwork();

const state = reactive({
  open: false,
  isMinted: true,
  userInfo,
});

const globalTabs = [
  {
    name: 'DAO Hub',
    link: '/creator',
    key: 'Creator',
  },
  {
    name: 'LeaderBoard',
    link: '/leaderboard',
    key: 'LeaderBoard',
    img: require('@/assets/icons/hot.gif'),
  },
  {
    name: 'Proposal',
    link: '/proposals',
    key: 'Proposals',
  },
  // {
  //   name: 'Member',
  //   img: require('@/assets/icons/new.gif'),
  //   link: '/members',
  //   key: 'Members',
  // },
  {
    name: 'Points',
    img: require('@/assets/icons/new.gif'),
    link: '/point',
    key: 'Points',
  },
  // { name: 'Ecology', link: '/ecology', key: 'Ecology' },
  // {
  //   name: 'Podcast',
  //   link: 'https://anchor.fm/thepass-to',
  //   target: '_blank',
  //   key: 'Podcast',
  // },
  // {
  //   name: 'Wiki',
  //   link: 'https://thepass.gitbook.io/the-pass/',
  //   target: '_blank',
  //   key: 'wiki',
  // },
  {
    name: 'Blogs',
    link: '/blog',
    key: 'Blog',
  },
  {
    name: 'Footprints',
    link: 'https://daobase.notion.site/DAO-BASE-Development-and-Operation-Footprints-8c85c5ed3a8e4a2f8dbb6188def3d3ba',
    target: '_blank',
    key: 'Footprints',
  },
  {
    name: null,
    link: '/mintdaobadge',
    key: 'mint dao badge',
    imgName: require('@/assets/logo/daobase.png'),
  },
];

const jump = (item) => {
  if (item.target) {
    window.open(item.link, item.target);
  } else {
    $router.push(item.link);
  }

  setTimeout(() => {
    $store.commit('toggleStatus', false);
  }, 300);
};

const mSignin = useSigninCheck();
const signIn = withThrottling(async () => {
  try {
    await mSignin();
  } catch (error) {
    console.log('mSignIn error::', error);
  }
});
const getIsMinted = async () => {
  if (state.userInfo?.isSignedIn) {
    await getPersonalPoints();
  }
};

const getPersonalPoints = async () => {
  try {
    const res = await getMintedPersonalData();
    if (res) {
      state.isMinted = true;
    } else {
      state.isMinted = false;
    }
  } catch (error) {
    notify({
      type: 'error',
      text: 'could not get mint status!',
    });
    console.error("could not get mint status::", error);
  }
};

onMounted(() => {
  getIsMinted();
});

const doSignout = useSignOut();

const doSignoutFunc = () => {
  mittWalletConnectSignOut();
  doSignout();
  location.reload();
};

const toProfile = () => {
  $router.push(`/address/details/${userInfo.value.address}`);
};

const toggleStatus = () => {
  $store.commit('toggleStatus', !$store.state.statusShow);
};

watch(
  () => state.open,
  (val) => {
    document.body.style.overflow = val ? 'hidden' : 'auto';

    const fn = (e) => {
      e.preventDefault();
    };

    if (val) {
      document.addEventListener('touchmove', fn);
    } else {
      document.removeEventListener('touchmove', fn);
    }
  },
);
</script>

<style lang="scss" scoped>
.mobile-box--shadow {
  box-shadow: 0px -8px 8px 0px rgba(255, 255, 255, 0.05);
}
.mobile-tab--btn:active {
  background: #ffffff1a;
}
.mobile-network--line {
  border: 1px solid #ff5585;
}
.notMintDotted {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: #ff5585;
  right: -5px;
  top: 5px;
}
.profileIconBadgeDotted {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background: #ff5585;
  right: 0;
  top: 4px;
}
.daoBadgeButton {
  padding: 0 8px;
  height: 20px;
  border-radius: 10px;
  font-size: 0.6rem;
}
.daoBadgeIcon {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: url('~@/assets/images/mintbadge/small.png') center center;
  background-size: 100%;
}
</style>
