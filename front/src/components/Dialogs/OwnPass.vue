<template>
  <Dialog
    :visible="state.visible"
    @close="state.visible = false"
    @ok="onOk"
    alert
    okText="GET PASS"
    text="Ops, You can access it only with its unique NFT PASS.<br/> Claim or buy it below."
  ></Dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import mitt from '@/libs/event';
import Dialog from '../Dialog.vue';
import { getClaimPathX } from '@/utils';

const $router = useRouter();

const state = reactive({
  visible: false,
  daoId: '',
  passType: '',
});

const onOk = () => {
  $router.push(getClaimPathX(state.passType, state.daoId));
};

onMounted(() => {
  mitt.on('ownPass', ({ id, passType }) => {
    if (!id && !passType) {
      state.visible = false;
    } else {
      state.visible = true;
      state.daoId = id;
      state.passType = passType.replace('_', '-');
    }
  });
});
</script>

<style lang="scss" scoped></style>
