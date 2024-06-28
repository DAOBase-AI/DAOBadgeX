<template>
  <Dialog :visible="state.show" @close="state.show = false" alert>
    <div class="mt-12 mb-4 inline-block align-bottom text-left w-full">
      <div>
        <img
          class="block mx-auto w-20"
          src="@/assets/images/icons/loading_png.png"
          alt=""
        />
        <div class="text-center font-bold text-whitebase">
          <div as="h3" class="mt-2 mb-8 text-2xl leading-6 font-medium">
            {{ state.title }}
          </div>
          <div class="mt-2">
            <p class="">
              {{ state.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import Dialog from '@/components/Dialog.vue';
import mitt from '@/libs/event';

const state = reactive({
  show: false,
  title: '',
  desc: '',
});

onMounted(() => {
  mitt.on('contractBadge', ({ flag = true } = {}) => {
    console.log('mitt contractBadge time ::', new Date().toLocaleString( ).split('/').join('-'));
    state.show = flag;
    state.title = 'Minting…';
    state.desc = 'Your transaction is pending and waiting for network confirmation. \n';
  });
});
</script>

<style lang="scss" scoped></style>
