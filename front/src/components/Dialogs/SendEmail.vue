<template>
  <Dialog :visible="state.visible" @close="state.visible = false">
    <div class="flex mt-8 mb-4">
      <span class="text-xl font-bold text-whitebase">Subscribe</span>
    </div>
    <div>
      <p class="text-whitebase mb-4">Email :</p>
      <UiInput v-model="state.email" placeholder="xxx@xxx.xxx"></UiInput>
    </div>
    <div class="flex justify-center mt-10">
      <UiButton class="w-40" @click="doSend" :loading="state.loading"
        >Send</UiButton
      >
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, reactive, defineProps, defineEmits, watch } from 'vue';
import { useStore } from 'vuex';
import Dialog from '../Dialog.vue';
import { withThrottling } from '@/utils/with';
import UiInput from '@/components/UiInput.vue';
import UiButton from '@/components/UiButton.vue';
import { notify } from '@kyvg/vue3-notification';
import { subscribeEmail } from '@/api/dao';

const $store = useStore();

const props = defineProps({
  modelValue: Boolean,
  username: String,
});

const emits = defineEmits(['update:modelValue']);

const state = reactive({
  visible: false,
  email: '',
  loading: false,
});

const doSend = withThrottling(async () => {
  state.loading = true;
  try {
    await subscribeEmail(state.email);
    state.visible = false;
    notify({
      type: 'success',
      text: 'Subscribe Success.',
    });
  } catch (error) {
    notify({
      type: 'error',
      text: 'Subscribe Failed.',
    });
  }

  state.loading = false;
});

onMounted(() => {
  state.visible = props.modelValue;
});

watch(
  () => props.modelValue,
  (val) => {
    state.visible = val;
  },
);

watch(
  () => state.visible,
  (val) => {
    if (!val) {
      state.email = '';
    }
    emits('update:modelValue', val);
  },
);
</script>

<style scoped></style>
