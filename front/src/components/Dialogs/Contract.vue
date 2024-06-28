<template>
  <Dialog :visible="state.show" @close="state.show = false" alert>
    <div class="mt-12 mb-4 inline-block align-bottom text-left w-full">
      <div>
        <img class="block mx-auto w-20" src="@/assets/gif/loading.gif" alt="" />
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
  mitt.on('contract', ({ flag = true, deployed = true } = {}) => {
    state.show = flag;
    state.title = deployed ? 'Deploying…' : 'Waiting for confirmation…';
    state.desc = deployed
      ? ' The construction of deploying has been sent to your wallet, waiting for transaction receipt, you can check your transaction manually over the corresponding blockchain explorer.'
      : 'The transaction has been sent to your wallet, waiting for transaction receipt, you can check your transaction manually over the corresponding blockchain explorer.';
  });
});
</script>

<style lang="scss" scoped></style>
