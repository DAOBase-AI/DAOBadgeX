<template>
  <div
    class="w-full flex items-center justify-between item-hover text-base text-whitebase py-1 px-4 rounded"
  >
    <div class="flex items-center">
      <UiImg
        class="w-8 h-8 rounded-full overflow-hidden mr-4"
        :src="props.info.avatarUrl"
        alt=""
      />
      <tippy :content="formatAddr(props.info.ownerAddress)" :arrow="false">
        <div
          class="leading-4 w-16 overflow-hidden overflow-ellipsis whitespace-nowrap"
        >
          {{ props.info.ownerName }}
        </div>
      </tippy>
    </div>

    <div>#{{ props.info.tokenId || 'xxxxxx' }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import UiImg from '@/components/UiImg.vue';

const props = defineProps({
  info: { type: Object, default: () => ({}) },
});

const formatAddr = (addr) => {
  return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
};
</script>

<style scoped>
.tips-bg {
  background: linear-gradient(360deg, #191b1f 0%, #2c2f33 100%);
  box-shadow: 0px 3px 10px 0px #000000,
    1px 1px 1px 0px rgba(246, 246, 246, 0.25) inset,
    -1px -1px 1px 0px rgba(222, 222, 222, 0.65) inset;
}
.item-hover:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s;
}

:deep(.inline-block) {
  width: 100%;
}
</style>
