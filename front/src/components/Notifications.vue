<template>
  <notifications
    :width="isDesktop ? '320px' : '100%'"
    :style="isDesktop ? 'top: 5rem; right: 8rem' : 'top:5rem;padding:0 16px'"
    animationName="vn-slide"
    :speed="300"
    :duration="2000"
  >
    <template v-slot:body="slotProps">
      <div class="relative mb-2 text-whitebase text-sm">
        <div
          class="relative pr-16 notify-box overflow-hidden bg-white"
          :class="{
            'font-bold': slotProps.item.data.textBold,
          }"
        >
          <div
            class="absolute w-2/5 h-full"
            :class="{
              'notify-normal':
                slotProps.item.type == 'normal' || !slotProps.item.type,
              'notify-error': slotProps.item.type == 'error',
              'notify-success': slotProps.item.type == 'success',
            }"
          ></div>
          <div
            class="close cursor-pointer absolute top-1/2 right-6 transform -translate-y-1/2"
            @click="slotProps.close"
          ></div>
          <div class="relative z-10 py-2 flex">
            <div class="flex items-center">
              <i
                class="iconfont pl-4 pr-2"
                :class="{
                  'icon-tishi':
                    slotProps.item.type == 'normal' || !slotProps.item.type,
                  'icon-jinggao': slotProps.item.type == 'error',
                  'icon-gou': slotProps.item.type == 'success',
                }"
              ></i>
            </div>
            <div class="break-all">
              {{ slotProps.item.text }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </notifications>
</template>

<script setup>
import { useDesktop } from '@/hooks';

const isDesktop = useDesktop();

// TODO 需要区分 success 和 error
</script>

<style scoped>
.close {
  width: 1rem;
  height: 1rem;
  background-image: url('../assets/images/icon_close.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.notify-box {
  border-radius: 8px;
  border: 1px solid #292c2e;
}

.notify-success {
  background: linear-gradient(90deg, #3c8542 0%, #121416 100%);
}
.notify-error {
  background: linear-gradient(90deg, #852a35 0%, #121416 100%);
}
.notify-normal {
  background: linear-gradient(90deg, #135c8b 0%, #121416 100%);
}
.icon-gou {
  color: rgba(94, 255, 106, 1);
}
.icon-jinggao {
  color: rgba(255, 38, 64, 1);
}
.icon-tishi {
  color: rgba(38, 170, 255, 1);
}
</style>
