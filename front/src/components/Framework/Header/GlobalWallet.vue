<template>
  <div class="flex items-center justify-end">
    <div ref="locationTarget">
      <div
        v-if="!userInfo.icon || userInfo.icon === ''"
        ref="button"
        class="relative cursor-pointer"
        @click="openUnsignInMenu"
      >
        <div
          class="rounded-lg text-whitebase px-6 py-2 text-xs font-bold flex items-center justify-center bg-white"
          style="border-width: 1.8px; color: #5e6873"
          :style="{ top: state.top + 'px', right: state.right + 'px' }"
          v-click-away="closeUnsignInMenu"
          @click="closeUnsignInMenu"
        >
          <div
            class="x-menu--item lighter-text text-whitebase"
            @click="mittWalletSelect"
          >
            Sign In
          </div>
        </div>
      </div>
    </div>

    <el-dropdown
      v-if="userInfo.isSignedIn"
      trigger="click"
      placement="bottom"
      @command="handleClick"
    >
      <div class="flex relative">
        <div
          class="w-max mr-2 transform hover:scale-105"
          :class="{ 'scale-105 ': state.signInedMenu }"
          style="transition-duration: 0.3s"
        >
          <div class="text-base font-bold text-whitebase text-right">
            {{ addressText }}
          </div>
          <div class="text-white-040 text-xs text-right">
            Related DAOs: {{ state.relatedDao }}
          </div>
        </div>
        <UiImg
          class="w-10 h-10 rounded-full overflow-hidden cursor-pointer transform hover:scale-125"
          style="transition-duration: 0.3s"
          :src="userInfo.icon"
          alt=""
          @click="openSignInedMenu"
        />
        <i v-if="!state.isMinted" class="notMintDotted absolute" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(option, i) in [
              {
                label: addressText,
                icon:
                  chainx === 'Polygon'
                    ? 'icon-Polygon-24'
                    : chainx === 'Ethereum'
                    ? 'icon-ETH'
                    : chainx === 'Tezos'
                    ? 'icon-tezos-01'
                    : '',
                type: 'address',
              },
              { label: 'Profile', icon: 'icon-renshu', type: 'profile' },
              { label: 'List DAO', icon: 'icon-chuangjian2', type: 'listDao' },
              { label: 'Points', icon: 'icon-jifen-011', type: 'point' },
              {
                label: 'DAO Managed',
                icon: 'icon-qita-01',
                type: 'daoManaged',
              },
              { label: 'Settings', icon: 'icon-shezhi', type: 'settings' },
              { label: 'Logout', icon: 'icon-likai', type: 'logout' },
            ]"
            :key="i"
            :command="option"
            class="h-14 px-2 py-1.5"
            style="min-width: 144px"
            ><div class="flex items-center gap-1">
              <div class="relative">
                <i
                  v-if="option.type === 'profile' && !state.isMinted"
                  class="absolute profileIconBadgeDotted"
                />
                <i class="icon iconfont" :class="option.icon"></i>
              </div>

              <span class="text-whitebase mr-1">{{ option.label }}</span>
              <span
                v-if="option.type === 'profile'"
                class="active-button daoBadgeButton"
                >
                <i class="daoBadgeIcon" />DAO Badge
              </span>
              <span
                v-if="option.type === 'point'"
                class="bg-mb-red rounded-xl text-xs px-1 text-center"
                >
                {{state.userPointInfo.totalPoints }}
              </span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <!-- <transition name="left2bottom">
    <div
      v-if="state.unsignInMenu && !userInfo.isSignedIn"
      class="
        fixed
        top-0
        right-0
        rounded
        w-48
        text-whitebase
        mt-2
        text-xs
        font-bold
        overflow-hidden
        bg-white
        z-50
      "
      style="border-width: 1.8px; color: #5e6873"
      :style="{ top: state.top + 'px', right: state.right + 'px' }"
      v-click-away="closeUnsignInMenu"
      @click="closeUnsignInMenu"
    >
      <div
        class="x-menu--item lighter-text text-whitebase"
        @click="mittWalletSelect"
      >
        Sign In
      </div>
    </div>
  </transition> -->

  <!-- <transition name="left2bottom">
    <div
      v-if="state.signInedMenu && userInfo.isSignedIn"
      class="
        fixed
        top-0
        right-0
        rounded
        w-48
        text-whitebase
        mt-2
        text-xs
        font-bold
        overflow-hidden
        bg-white
        z-50
      "
      style="border-width: 1.8px; color: #5e6873"
      :style="{ top: state.top + 'px', right: state.right + 'px' }"
      v-click-away="closeSignInedMenu"
      @click="closeSignInedMenu"
    >
      <div class="x-menu--item lighter-text" @click="copyAddress">
        {{ addressText }}
        <i class="iconfont icon-fuzhi2-29 pl-4"></i>
      </div>
      <router-link class="x-menu--item lighter-text" to="/profile/overview"
        >Profile</router-link
      >
      <div class="x-menu--item lighter-text" @click="doSignout">Sign Out</div>
    </div>
  </transition> -->
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { notify } from '@kyvg/vue3-notification';
import { useUserInfo, useNetwork, useSignOut, useSigninCheck } from '@/hooks';
import copy from 'copy-to-clipboard';
import { withThrottling } from '@/utils/with';
import * as mojs from '@mojs/core';
import { formatAddress } from '@/utils';
import UiImg from '@/components/UiImg.vue';
import { mittWalletSelect, mittWalletConnectSignOut, mittSmartWalletSignOut } from '@/libs/event';
import { getMintedPersonalData, getProfile, getRelatedDaos } from '@/api/dao';
import { contracts } from '@/constants';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { getUserPoints } from '@/api/user';

const $route = useRoute();
const store = useStore();

const router = useRouter();
const handleClick = (x) => {
  console.log(x);
  if (x.type === 'address') {
    copyAddress();
  } else if (x.type === 'profile') {
    router.push(`/address/details/${userInfo.value.address}`);
  } else if (x.type === 'listDao') {
    router.push('/create/dao');
  } else if (x.type === 'point') {
    router.push(`/point/task?address=${userInfo.value.address}`);
  } else if (x.type === 'daoManaged') {
    router.push('/profile/overview');
  } else if (x.type === 'settings') {
    router.push('/settings/profile');
  } else if (x.type === 'logout') {
    mittSmartWalletSignOut();
    mittWalletConnectSignOut();
    doSignout();
    location.reload();
  }
};
// *** animation elements ***
const locationTarget = ref(null);
const roundLine = ref(null);
const aniCtrl = ref(null);

const state = reactive({
  top: 0,
  right: 0,
  signInedMenu: false,
  unsignInMenu: false,
  loading: false,
  relatedDao: 0,
  isMinted: true,
  userPointInfo: {
    totalPoints: 0,
    rank: null,
    basicPoints: 0,
    inviteUsers: 0,
    inviteRewardPoints: 0,
    nextLevelStartCount: 1,
    progressPct: 0,
    inviteLevel: 'V0',
    inviteBonusRate: 0,
    communityBonusRate: 0,
  },
});

const calcPosition = () => {
  const { height, width, left, top } =
    locationTarget.value.getBoundingClientRect();

  state.top = top + height + 8;
  state.right = window.innerWidth - left - width;
};


const userInfo = useUserInfo();

// **** address-6 ****
const addressText = computed(() => {
  if (userInfo.value.address) {
    return formatAddress(userInfo.value.address, 6);
  }
  return '';
});
const chainx = useNetwork();

// const mSignin = useSigninCheck();
// const signIn = withThrottling(async () => {
//   state.loading = true;
//   aniCtrl.value.resume(1);
//   aniCtrl.value.replay();
//   try {
//     // TODO 这里要区分钱包选择，然后再进行对应的事件调用，
//     // 所以 dialog 也需要有一个回调的状态，才能结束这里的状态
//     await mSignin();
//   } catch (error) {
//     console.log("mSignin error::", error);
//   }
//   aniCtrl.value.pause();
//   aniCtrl.value.setProgress(0);
//   state.loading = false;
// });

const copyAddress = () => {
  if (copy(userInfo.value.address)) {
    notify({
      text: 'Copy Successfully',
    });
  }
};

const doSignout = useSignOut();

const openSignInedMenu = () => {
  calcPosition();
  state.signInedMenu = true;
};
const closeSignInedMenu = () => {
  state.signInedMenu = false;
};

const openUnsignInMenu = () => {
  if (state.loading) {
    return;
  }
  calcPosition();
  state.unsignInMenu = true;
};

const closeUnsignInMenu = () => {
  state.unsignInMenu = false;
};

// animated...
watch(
  () => roundLine.value,
  (x) => {
    if (x) {
      aniCtrl.value = new mojs.Shape({
        parent: roundLine.value,
        shape: 'circle',
        fill: 'none',
        radius: 23.5,
        stroke: '#fff',
        strokeDasharray: '100%',
        strokeDashoffset: { 0: '75%' },
        duration: 150,
        isShowStart: true,
      }).then({
        strokeDashoffset: '75%',
        rotate: { 90: 450 },
        duration: 600,
        repeat: 999,
      });
    }
  },
);
const getData = async () => {
  if (userInfo?.value?.address) {
    const res = await getRelatedDaos(userInfo.value.address);
    state.relatedDao = res ?? 0;
    const resPoints = await getUserPoints(userInfo.value.address);
    state.userPointInfo = resPoints;
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

const getIsMinted = async () => {
  if (userInfo?.value?.isSignedIn) {
    await getPersonalPoints();
  }
};
onMounted(() => {
  if (userInfo?.value?.isSignedIn) getData();
  getIsMinted();
  watch(
    () => userInfo.value.isSignedIn,
    (val) => {
      if (userInfo.value.isSignedIn) {
        getData();
        getIsMinted();
      }
      window.location.reload();
    },
  );
});
</script>

<style scoped>
.lighter-text:hover {
  color: white;
}
.x-menu--item {
  display: flex;
  align-items: center;
}
.x-menu--item.text-whitebase {
  color: #fff;
}
.notMintDotted {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background: #ff5585;
  right: 0;
  top: 0;
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
