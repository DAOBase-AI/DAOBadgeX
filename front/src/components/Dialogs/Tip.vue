<template>
  <Dialog
    :visible="state.visible"
    @close="state.visible = false"
    @ok="onOk"
    alert
    :okText="state.okText"
    :text="state.text"
  ></Dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import mitt from '@/libs/event';
import Dialog from '../Dialog.vue';

const state = reactive({
  visible: false,
  okText: undefined,
  text: '',
});

const onOk = () => {
  /*  */
};

onMounted(() => {
  mitt.on('tip', ({ okText, text }) => {
    state.visible = true;
    state.okText = okText;
    state.text = text;
  });
});
</script>

<style lang="scss" scoped></style>
