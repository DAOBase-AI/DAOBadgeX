<template>
  <div class="font-bold flex-wrap" :class="defaultStyle">
    <div
      v-for="link in links"
      :key="link.key"
      @click.stop="handleClick(daoInfo[link.key], link.key)"
    >
      <div v-if="!link.links">
        <tippy :content="link.name" :arrow="false">
          <div
            class="w-8 h-6 flex items-center justify-center hover:bg-white-010 rounded"
          >
            <img :src="link.img" class="w-4 h-4" alt="" />
          </div>
        </tippy>
      </div>

      <div v-else class="flex items-center">
        <div class="bg-white-030 mx-1" style="width: 1px; height: 20px"></div>

        <Popper hover>
          <div
            class="w-8 h-6 flex items-center justify-center hover:bg-white-010 rounded"
          >
            <i class="iconfont icon-gengduo cursor-pointer"></i>
          </div>

          <template v-slot:content="">
            <ul class="px-4 py-2 poper-box rounded">
              <li
                v-for="(outLink, i) in link.links"
                :key="i"
                class="text-sm text-whitebase flex items-center"
              >
                {{ outLink.name }}&nbsp;
                <a
                  :href="wrapperLink(outLink.url)"
                  class="text-secondary-7 underline hover:opacity-80 w-60 overflow-hidden overflow-ellipsis whitespace-nowrap block"
                  target="_blank"
                  >{{ wrapperLink(outLink.url) }}</a
                >
              </li>
            </ul>
          </template>
        </Popper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { wrapperLink } from '@/utils';
import Popper from 'vue3-popper';

import iwebsite from '@/assets/icons/i-website.avif';
import itwiiter from '@/assets/icons/i-twitter.avif';
import iopensea from '@/assets/icons/i-opensea.avif';
import ilink from '@/assets/icons/i-link.avif';
import idiscord from '@/assets/icons/i-discord.avif';
import ifound from '@/assets/icons/i-found.avif';
import isuperrate from '@/assets/icons/i-superrate.avif';
import itelegram from '@/assets/icons/i-telegram.avif';
import iwhitepaper from '@/assets/icons/i-whitepaper.avif';
import iMirror from '@/assets/icons/mirror.png';
import iEmail from '@/assets/icons/email.png';
import { notify } from '@kyvg/vue3-notification';
import copy from 'copy-to-clipboard';
const props = defineProps({
  daoInfo: {
    type: Object,
    default: () => ({}),
  },
  defaultStyle: {
    type: String,
    default: 'hidden md:flex',
  },
});
const handleClick = (link, key) => {
  if (key == 'discord' || key == 'email' || key == 'telegram' || key == 'twitter') {
    if (key == 'twitter' && link.includes('.com')) {
      window.open(wrapperLink(link), '_blank')
    } else {
      if (copy(link)) {
        notify({
          text: 'Copy Successfully',
        });
      }
    }
  } else if (key == 'other') {
    return;
  } else window.open(wrapperLink(link), '_blank');
};
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
  if (daoInfo.mirror) {
    res.push({
      img: iMirror,
      key: 'mirror',
      name: 'Mirror',
      link: wrapperLink(daoInfo['mirror']),
    });
  }
  if (daoInfo.email) {
    res.push({
      img: iEmail,
      key: 'email',
      name: 'Email',
      link: wrapperLink(daoInfo['email']),
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
  if (daoInfo.discord) {
    res.push({
      img: idiscord,
      key: 'discord',
      name: 'Discord',
      link: wrapperLink(daoInfo['discord']),
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
  if (daoInfo.telegram) {
    res.push({
      img: itelegram,
      key: 'telegram',
      name: 'Telegram',
      link: wrapperLink(daoInfo['telegram']),
    });
  }

  const links = (daoInfo.customizeLink || []).filter((x) => x.name && x.url);

  if (links.length > 0) {
    res.push({
      img: ilink,
      key: 'other',
      links,
    });
  }

  return res;
});
</script>

<style scoped>
:deep(.popper) {
  box-shadow: 8px 45px 32px 0px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  background: transparent;
  padding: 4px;
  font-size: 12px;
  color: #fff;
}
</style>
