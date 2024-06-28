<template>
  <div>
    <Header></Header>

    <router-view v-slot="{ Component }">
      <main v-show="!$store.state.statusShow">
        <KeepAlive>
          <component
            :is="Component"
            v-if="$route.meta.keepAlive"
            :key="$route.path"
          />
        </KeepAlive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
      </main>
    </router-view>
  </div>

  <Search v-if="isAtleastMdScreen" />

  <div v-if="width < 870 && $route.meta.noMb">
    <div
      class="w-screen h-screen items-center px-8 fixed top-0 left-0 bg-white z-top"
    >
      <div class="pt-64 pl-4 pb-4 relative">
        <img
          src="https://img.icons8.com/material/50/999999/computer-chat.png"
          class="w-10 h-auto animate-pulse"
        />
      </div>
      <div class="text-4xl text-gray-600 font-light">
        {{ $t('Common.ScreenSmall')
        }}<span class="ml-2">{{ $t('Common.MobileSite') }}</span>
      </div>
    </div>
  </div>

  <!-- <Footer /> -->

  <transition name="fade">
    <div
      class="fixed right-8 bottom-40 w-16 h-16 rounded-full bg-whitebase flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition-all"
      @click="scrollToTop"
      v-if="isAtleastMdScreen && state.showScrollBtn"
    >
      <i
        class="iconfont icon-xiajiantou text-white text-3xl transform rotate-180"
      ></i>
    </div>
  </transition>
  <ContractBadge></ContractBadge>
  <SubWallet></SubWallet>
  <WalletSelect></WalletSelect>
  <SmartWallet></SmartWallet>
  <WalletConnect></WalletConnect>
  <Notifications></Notifications>
  <ContractDialog></ContractDialog>
  <OwnPassDialog></OwnPassDialog>
  <TipDialog></TipDialog>
  <DownloadDialog></DownloadDialog>
  <ConnectDialog></ConnectDialog>
  <NetworkDialog></NetworkDialog>
  <SwitchNetworkDialog></SwitchNetworkDialog>
  <MicDialog></MicDialog>
  <LoadingDialog></LoadingDialog>
</template>

<script setup>
import ContractBadge from '@/components/Dialogs/ContractBadge.vue';
import ConnectDialog from '@/components/Dialogs/Connect.vue';
import ContractDialog from '@/components/Dialogs/Contract.vue';
import DownloadDialog from '@/components/Dialogs/Download.vue';
import LoadingDialog from '@/components/Dialogs/Loading.vue';
import MicDialog from '@/components/Dialogs/MicDialog.vue';
import NetworkDialog from '@/components/Dialogs/Network.vue';
import OwnPassDialog from '@/components/Dialogs/OwnPass.vue';
import SwitchNetworkDialog from '@/components/Dialogs/SwitchNetwork.vue';
import TipDialog from '@/components/Dialogs/Tip.vue';
import WalletSelect from '@/components/Dialogs/WalletSelect.vue';
import Header from '@/components/Framework/Header/index.vue';
import { KeepAlive, watch } from 'vue';
import { useWindowSize } from 'vue-window-size';
import Notifications from '@/components/Notifications.vue';
import Search from '@/components/Search.vue';
import SubWallet from '@/components/Framework/SubWallet.vue';
import TWEEN from '@tweenjs/tween.js';
import { onMounted, reactive } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import 'vue-skeletor/dist/vue-skeletor.css';
import { useStore } from 'vuex';
import { isMdScreen } from './hooks';
import SmartWallet from '@/components/Dialogs/SmartWallet.vue';
import WalletConnect from '@/components/Dialogs/WalletConnect.vue';
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

// import { mittContract } from './libs/event';

const { width } = useWindowSize();
const isAtleastMdScreen = isMdScreen();
const $route = useRoute();
const $store = useStore();

const state = reactive({
  showScrollBtn: false,
});

const animate = (time = 300) => {
  requestAnimationFrame(animate);
  TWEEN.update(time);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('scroll', (e) => {
  state.showScrollBtn = window.scrollY > window.innerHeight * 2;
});

onMounted(() => {
  requestAnimationFrame(animate);
  watch(
    () => $route.meta,
    () => {
      // let title = $route.meta.title;
      // let description = $route.meta.description;
      // console.log($route);
      // console.log($route.meta);
      // if ($route.params.ecoCode) {
      //   if ($route.params.ecoCode === 'Nouns_DAO_Ecosystem') {
      //     title = 'Nouns DAO Ecosystem - DAO BASE';
      //     description =
      //       'Nouns DAO Ecosystem is a gathering place for Nouns-related DAOs on DAO BASE, Nouns is an open source experiment on how to scale a brand the fastest way.';
      //   } else if ($route.params.ecoCode === 'Desci_Ecosystem') {
      //     title = 'Desci Ecosystem - DAO BASE';
      //     description =
      //       'DeSci Ecosystem is a gathering place for DeSci-related DAOs on DAO BASE, it is an emerging ecosystem that leverages decentralized technologies to facilitate scientific research and development.';
      //   } else if ($route.params.ecoCode === 'Bankless_DAO_Ecosystem') {
      //     title = 'Bankless DAO Ecosystem - DAO BASE';
      //     description =
      //       'Bankless DAO Ecosystem is a gathering place for Bankless-related DAOs on DAO BASE, Bankless DAO is focused on accelerating the adoption and education of decentralized finance (DeFi) and the broader world of Web3 .';
      //   } else if ($route.params.ecoCode === 'Music_Ecosystem') {
      //     title = 'Music Ecosystem - DAO BASE';
      //     description =
      //       'Music Ecosystem is a gathering place for Music-related DAOs on DAO BASE, it is a complex and diverse network of individuals, businesses, and technologies that support the creation, production, distribution, and consumption of music.';
      //   }
      // } else if ($route.name) {
      //   if ($route.name.includes('DaoPage')) {
      //     title = `${
      //       $route.params.name.indexOf('_') == -1
      //         ? $route.params.name
      //         : $route.params.name.substring(0, $route.params.name.indexOf('_'))
      //     } - DAO BASE`;
      //   }
      // }
      // if (title) document.title = title;
      // const metaDescription = document.querySelector(
      //   'meta[name="description"]',
      // );
      // if (description)
      //   if (metaDescription) {
      //     metaDescription.content = description;
      //   } else {
      //     const meta = document.createElement('meta');
      //     meta.name = 'description';
      //     meta.content = description;
      //     document.head.appendChild(meta);
      //   }
    },
  );
  // mittContract(true, false);
});
</script>
