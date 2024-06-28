<template>
  <Dialog
    :visible="state.visible"
    @cancel="()=> {
      console.log('cancel');
      $router.push('/');
    }"
    @ok="() => {
      state.visible = false;
    }"
    alert
    okText="Verify"
    text="EARLY ACCESS"
  >
    <!-- <div class="border w-full h-10"></div> -->
  </Dialog>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue';
import mitt from '@/libs/event';
import Dialog from './Dialog.vue';
import { useUserInfo } from '@/hooks';
import { useRouter } from 'vue-router';
const userInfo = useUserInfo();
const state = reactive({
  visible: true,
});

const $router = useRouter();

onMounted(() => {
  // mitt.on('download', (visible = true) => {
  //   if (!userInfo.value.isSignedIn) state.visible = visible;
  // });
});
</script>

<style lang="scss" scoped></style>
