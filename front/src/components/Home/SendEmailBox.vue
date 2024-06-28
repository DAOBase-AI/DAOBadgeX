<template>
  <div class="home-padding w-4/5 mx-auto mb-10 flex md:hidden">
    <input
      v-model="state.email"
      type="text"
      class="flex-1 min-w-0 mr-2 rounded p-0 text-white px-4"
    />
    <UiButton
      class="rounded"
      :style="{ width: '80px', height: '36px' }"
      type="main-white"
      @click="doSend"
    >
      <i class="iconfont icon-youxiang-06 font-16"></i>
    </UiButton>
  </div>
</template>

<script setup>
import { subscribeEmail } from '@/api/dao';
import { withThrottling } from '@/utils/with';
import { notify } from '@kyvg/vue3-notification';
import { reactive, watch } from 'vue';
import UiButton from '@/components/UiButton.vue';

const state = reactive({
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
</script>

<style lang="scss" scoped></style>
