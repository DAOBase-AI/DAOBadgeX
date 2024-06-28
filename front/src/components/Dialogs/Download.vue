<template>
  <Dialog
    :visible="state.visible"
    @close="state.visible = false"
    @ok="toDownload"
    alert
    okText="Download"
    text="The wallet hasn't been installed yet."
  ></Dialog>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue';
import { toDownload } from '@/utils/wallet';
import mitt from '@/libs/event';
import Dialog from '../Dialog.vue';
import { useUserInfo } from '@/hooks';
const userInfo = useUserInfo();
const state = reactive({
  visible: false,
});

onMounted(() => {
  mitt.on('download', (visible = true) => {
    if (!userInfo.value.isSignedIn) state.visible = visible;
  });
});
</script>

<style lang="scss" scoped></style>
