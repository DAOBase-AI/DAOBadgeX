<template>
  <div
    class="relative cursor-pointer nft_card"
    :class="{ nft_card_select: props.selected }"
  >
    <div class="w-full nft_card_inner">
      <div class="absolute top-0 left-0 w-full h-full px-2 py-3">
        <div class="relative w-full">
          <div class="nft_img_inner">
            <img
              class="absolute top-0 left-0 w-full h-full object-cover"
              :src="props.img"
              alt=""
            />
            <div></div>
          </div>
        </div>
        <div class="text-sm text-whitebase">{{ props.name }}</div>
        <div class="text-xs text-whitebase">
          # {{ props.id }}
          <div class="w-1/4 h-px-2 bg-gradient-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  img: String,
  id: String,
  selected: Boolean,
  name: String,
});
</script>

<style scoped>
.nft_card {
  background-image: url('~@/assets/images/nft_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.nft_card_inner {
  padding-bottom: 105%;
}
.nft_img_inner {
  padding-bottom: 69.2%;
}
.nft_card:hover {
  background-image: url('~@/assets/images/nft_bg_active.png');
}
.nft_card_select {
  background-image: url('~@/assets/images/nft_bg_active.png');
}
</style>
