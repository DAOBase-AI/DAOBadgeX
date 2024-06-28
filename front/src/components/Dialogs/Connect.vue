<template>
  <Dialog
    :visible="state.visible"
    @close="state.visible = false"
    @ok="connect"
    alert
    okText="Connect Wallet"
    text="The wallet hasn't been installed yet."
  ></Dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import mitt from '@/libs/event';
import Dialog from '../Dialog.vue';
import { useSigninCheck } from '@/hooks';
import { withThrottling } from '@/utils/with';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const $route = useRoute();
const store = useStore();

const state = reactive({
  visible: false,
});

const mSignin = useSigninCheck();

const connect = withThrottling(async () => {
  try {
    await mSignin();
  } catch (error) {
    console.log("signIn error::", error);
  }
});

onMounted(() => {
  mitt.on('connect', (visible = true) => {
    state.visible = visible;
  });
});
</script>

<style lang="scss" scoped></style>
