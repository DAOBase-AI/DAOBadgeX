<template>
  <div
    class="flex h-44 rounded cursor-pointer text-whitebase bg-white-005 p-2 profile-pass-box"
    @click="doPass"
  >
    <div class="relative">
      <UiImg
        class="flex-0 rounded-full object-cover w-40 h-40"
        :src="props.info.passLogo"
        alt=""
      />
      <div
        class="absolute left-0 top-0 text-xs font-bold py-1 px-2 rounded"
        :style="{
          background: {
            nft_base: 'linear-gradient(135deg, #73AAE0 0%, #5168FF 100%)',
            token_base: 'linear-gradient(135deg, #73AAE0 0%, #5168FF 100%)',
            fixed_price: 'linear-gradient(135deg, #E07380 0%, #FF5585 100%)',
            bonding_curve: 'linear-gradient(135deg, #DD73E0 0%, #B451FF 100%)',
          }[info.passType],
        }"
      >
        {{ PassTypeLongText[props.info.passType] }}
      </div>

      <div
        class="absolute bottom-0 left-0 text-xs p-2"
        style="
          background: linear-gradient(
            180deg,
            rgba(18, 20, 22, 0) 0%,
            #121416 100%
          );
        "
      >
        {{ info.daoName }}
      </div>
    </div>

    <div class="ml-2 text-xs space-y-4 relative flex-1">
      <div>
        <div class="text-tip-0">Token ID</div>
        <div>#{{ info.tokenId }}</div>
      </div>
      <div>
        <div class="text-tip-0">Expiration Date</div>
        <span>{{
          props.info.expirationDate
            ? dayjs(props.info.expirationDate).format('YYYY-MM-DD')
            : '∞'
        }}</span>
      </div>

      <div v-if="props.info.passType == 'bonding_curve'">
        <div class="text-tip-0">Balance</div>
        <div>{{ props.info.balance }}</div>
      </div>

      <div class="absolute bottom-0 w-full">
        <!-- fixedPrice -->
        <div
          v-if="props.info.passType === 'fixed_price'"
          class="grid grid-flow-col gap-2 px-6"
        >
          <!-- <Button @click.stop="doSquad">SQUAD</Button> -->
        </div>
        <!-- bc -->
        <div v-else-if="props.info.passType === 'bonding_curve'">
          <UiButton type="outline" size="sm" @click.stop="doDao">SELL</UiButton>
          <!-- <Button class="w-1/2" @click.stop="doSquad">SQUAD</Button> -->
        </div>
        <!-- stakingBase -->
        <div v-else>
          <UiButton class="w-full" type="outline" size="sm" @click.stop="doDao"
            >REDEEM</UiButton
          >
          <!-- <Button class="w-1/2" @click.stop="doSquad">SQUAD</Button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/Button.vue';
import Tag from '@/components/Tag.vue';
import { defineProps } from 'vue';
import { PassTypeLongText } from '@/constants';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { getClaimPath } from '@/utils';
import UiImg from '@/components/UiImg.vue';
import UiButton from '@/components/UiButton.vue';

const $router = useRouter();

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});

const doPass = () => {
  $router.push(`/dao/${props.info.daoPath}`);
};

const doDao = () => {
  $router.push(getClaimPath(props.info.passType, props.info.daoName));
};

const doSquad = () => {
  $router.push(`/squad/${props.info.daoName}`);
};

/*
  TODO 没有无效
    NFT-BASE/TOKEN-BASE REDEEM/SQUAD
    FixedPrice SQUAD
    BondingCurve SELL/SQUAD

    只有 fixedprice 有有效期，过期就盖一个蒙版
    Flag 标记全部都是红色
 */
</script>

<style scoped>
.profile-pass-box {
  transition: all 0.3s;
}
.profile-pass-box:hover {
  box-shadow: 0px 2px 8px 0px rgba(255, 255, 255, 0.5);
}
</style>
