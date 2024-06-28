<template>
  <div
    class="text-sm font-bold px-2 py-13px rounded-lg hover:bg-white-005 cursor-pointer"
  >
    <div class="flex justify-between items-center" v-if="item.type">
      <div class="flex items-center">
        <UiImg
          class="w-10 h-10 rounded-full mr-2"
          :src="item.logo"
          alt="search result logo"
        />
        <div>
          <div>{{ item.name }}</div>
          <div class="flex gap-2">
            <ItemInfo
              :label="item.info[infoIndex]"
              v-for="(infoIndex, i) in Object.keys(item.info ? item.info : {})"
              :key="i"
            />
            <ItemInfo
              v-if="item.address"
              :label="formatAddress(item.address, 4)"
            />
            <ItemInfo v-if="item.twitter" :label="'@' + item.twitter" />
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div
        v-if="!isSearchBar"
        class="rounded-lg border border-white-010 px-4 py-5px"
      >
        {{ item.type }}
      </div>
    </div>
    <div v-else>{{ item.name }}</div>
  </div>
</template>
<script setup>
import ItemInfo from '@/components/ItemInfo.vue';
import { formatAddress } from '@/utils';
import UiImg from './UiImg.vue';
const props = defineProps({
  item: Array,
  isSearchBar: { type: Boolean, default: false },
});
</script>
<style></style>
