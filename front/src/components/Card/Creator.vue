<template>
  <router-link
    class="relative text-whitebase cursor-pointer"
    :to="`/dao/${props.info.daoPath || props.info.name}`"
  >
    <div
      class="px-4 pt-2 pb-4 bg-white-005 creator-wrapper rounded-2xl"
      :style="`height: ${isLarge ? 308 : 240}px`"
    >
      <div class="relative flex justify-between mb-2 md:mb-6">
        <div class="relative">
          <UiImg
            class="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover overflow-hidden"
            :src="info.daoLogo"
            style="box-shadow: 0px 0px 16px 0px rgba(94, 104, 115, 0.3)"
          ></UiImg>
          <tippy content="Twitter is authenticated" :arrow="false">
            <img
              v-if="info.isTwitterOauth"
              class="absolute right-0 bottom-0 w-4 h-4 md:w-5 md:h-5"
              src="@/assets/icons/tw_ok.avif"
              alt=""
            />
          </tippy>
        </div>

        <div class="flex flex-col items-end">
          <div class="text-xs text-white-040 text-right">
            {{ info.schedulingAhead ? 'Created in:' : '' }}
            <span>{{
              formatDateLong(
                info.schedulingAhead
                  ? info.schedulingAhead - getOffsetTime()
                  : info.createTime,
              )
            }}</span>
          </div>

          <div class="flex bg-white-010 p-1 rounded-full space-x-1">
            <UiImg
              class="w-5 h-5 rounded-full overflow-hidden"
              :src="chainIcon[chain]"
              v-for="(chain, i) in props.info.chain"
              :key="i"
            ></UiImg>
          </div>
        </div>
      </div>
      <div class="text-sm md:text-xl font-bold w-full line-clamp-1 mb-2">
        {{ info.daoName }}
      </div>
      <div
        class="text-white-070 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 h-8 md:h-9 break-all"
      >
        {{ info.intro }}
      </div>
      <div class="flex items-center space-x-4 mb-2 md:mb-4">
        <div class="text-white-040 text-xs md:text-base">NFT PASS</div>
        <div class="relative">
          <UiImg
            v-if="info.passLogo"
            class="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden object-cover"
            :src="info.passLogo"
            alt=""
          />
          <img
            v-else
            class="w-8 h-8 md:w-10 md:h-10 rounded-full"
            src="@/assets/images/icons/nopass.avif"
            alt=""
          />

          <div class="absolute left-0 top-0">
            <img
              v-if="info.passType == 'bonding_curve'"
              class="w-4 h-4"
              src="@/assets/icons/bc.avif"
              alt=""
            />

            <img
              v-else-if="info.passType == 'fixed_price'"
              class="w-4 h-4"
              src="@/assets/icons/fp.avif"
              alt=""
            />

            <img
              v-else-if="!!info.passType"
              class="w-4 h-4"
              src="@/assets/icons/sb.avif"
              alt=""
            />
          </div>
        </div>
      </div>

      <div
        v-if="info.dashboardIsOpen"
        class="flex md:items-center flex-col md:flex-row"
      >
        <div class="text-white-040 mr-4 text-xs md:text-base">Treasury:</div>
        <div cl>
          <span class="text-sm md:text-base font-bold">
            {{
              info.totalValueUsd
                ? `$${numeral(info.totalValueUsd).format('0.0a').toUpperCase()}`
                : '--'
            }}
          </span>
          <span
            class="text-xs ml-1"
            :style="`color:${+info.rate < 0 ? '#FF2640FF' : '#51D55BFF'}`"
          >
            {{ suffixNum((info.rate * 100).toFixed(2)) }}%
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';
import Img from '@/components/Img.vue';
import { formatDateLong, getOffsetTime, suffixNum } from '@/utils';
import { useRouter } from 'vue-router';
import UiImg from '@/components/UiImg.vue';
import numeral from 'numeral';
import { chainIcon } from '@/constants';
import { useDesktop } from '@/hooks';

const $router = useRouter();

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});

const isLarge = useDesktop();

const toPath = () => {
  $router.push(`/dao/${props.info.daoName.replace(/\s/g, '')}`);
};
</script>

<style scoped>
.creator-wrapper {
  transition: all 0.3s;
}
.creator-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0px 3px 10px 0px rgba(255, 255, 255, 0.5),
    inset 0px 2px 0px 0px rgba(255, 255, 255, 0.1);
}
</style>
