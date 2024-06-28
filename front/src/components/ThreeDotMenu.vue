<template>
  <div class="relative" ref="menuRef">
    <div class="menu-container" @click="toggleMenu">
      <i class="iconfont icon-gengduo cursor-pointer"></i>
    </div>

    <div v-if="isMenuOpen" class="menu rounded-lg overflow-hidden">
      <!-- Menu items here -->

      <a
        v-for="link in links"
        :key="link.key"
        :href="wrapperLink(daoInfo[link.key])"
        target="_target"
        class="block px-4 py-3 bg-pass-topbg border-b border-white-010"
        style="width: 136px; height: 40px"
      >
        <div class="flex items-center">
          <img :src="link.img" class="w-4 h-4 mr-1" alt="" />
          <div>{{ link.name }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { computed, defineProps } from 'vue';
import { wrapperLink } from '@/utils';

import iwebsite from '@/assets/icons/i-website.avif';
import itwiiter from '@/assets/icons/i-twitter.avif';
import iopensea from '@/assets/icons/i-opensea.avif';
import ilink from '@/assets/icons/i-link.avif';
import idiscord from '@/assets/icons/i-discord.avif';
import ifound from '@/assets/icons/i-found.avif';
import isuperrate from '@/assets/icons/i-superrate.avif';
import itelegram from '@/assets/icons/i-telegram.avif';
import iwhitepaper from '@/assets/icons/i-whitepaper.avif';
const isMenuOpen = ref(false);
const menuRef = ref(null);
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const props = defineProps({
  daoInfo: {
    type: Object,
    default: () => ({}),
  },
});

const links = computed(() => {
  const daoInfo = props.daoInfo;

  const res = [];
  if (daoInfo.website) {
    res.push({
      img: iwebsite,
      key: 'website',
      name: 'Website',
      link: wrapperLink(daoInfo['website']),
    });
  }

  if (daoInfo.whitepaper) {
    res.push({
      img: iwhitepaper,
      key: 'whitepaper',
      name: 'Whitepaper',
      link: wrapperLink(daoInfo['whitepaper']),
    });
  }

  if (daoInfo.twitter) {
    res.push({
      img: itwiiter,
      key: 'twitter',
      name: 'Twitter',
      link: wrapperLink(daoInfo['twitter']),
    });
  }

  if (daoInfo.openseaUrl) {
    res.push({
      img: iopensea,
      key: 'openseaUrl',
      name: 'Opensea',
      link: wrapperLink(daoInfo['openseaUrl']),
    });
  }

  if (daoInfo.superrareUrl) {
    res.push({
      img: isuperrate,
      key: 'superrareUrl',
      name: 'Superare',
      link: wrapperLink(daoInfo['superrareUrl']),
    });
  }

  if (daoInfo.foundationUrl) {
    res.push({
      img: ifound,
      key: 'foundationUrl',
      name: 'Founadtion',
      link: wrapperLink(daoInfo['foundationUrl']),
    });
  }

  if (daoInfo.discordLinkUrl) {
    res.push({
      img: idiscord,
      key: 'discordLinkUrl',
      name: 'Discord',
      link: wrapperLink(daoInfo['discordLinkUrl']),
    });
  }

  if (daoInfo.telegramLinkUrl) {
    res.push({
      img: itelegram,
      key: 'telegramLinkUrl',
      name: 'Telegram',
      link: wrapperLink(daoInfo['telegramLinkUrl']),
    });
  }

  const links = (daoInfo.customizeLink || []).filter((x) => x.name && x.url);

  if (links.length > 0) {
    res.push({
      img: ilink,
      links,
    });
  }

  return res;
});
function handleClickOutside(event) {
  if (isMenuOpen.value && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// Cleanup event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.menu-container {
  position: relative;

  cursor: pointer;
}

.menu {
  display: block;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 89;
}
</style>
