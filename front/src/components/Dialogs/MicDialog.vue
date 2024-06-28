<template>
  <Dialog
    :visible="state.visible"
    :showClose="false"
    @close="state.visible = false"
    @ok="fn"
    alert
    okText="RECONNECT"
    text="Your Mic loss"
  ></Dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import mitt from '@/libs/event';
import Dialog from '../Dialog.vue';
const fn = ref(null);

const state = reactive({
  visible: false,
});

onMounted(() => {
  mitt.on('mic-sure', (fnx) => {
    state.visible = true;
    fn.value = fnx;
  });
});
</script>

<style lang="scss" scoped></style>
