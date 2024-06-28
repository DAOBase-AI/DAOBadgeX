<template>
  <Dialog :visible="state.visible" @close="state.visible = false">
    <div class="flex mt-8 mb-4">
      <img class="h-8 mr-2" src="@/assets/images/icon_warningx.avif" alt="" />
      <span class="text-xl font-bold text-whitebase">Edit Username</span>
    </div>
    <div>
      <p class="text-whitebase mb-4">Username</p>

      <FormInput v-model="state.username"></FormInput>
    </div>
    <div class="flex mt-10">
      <Button error class="flex-1" size="lg" @click="state.visible = false"
        >Cancel</Button
      >
      <div class="mx-2"></div>
      <Button @click="doChangeName" class="flex-1" size="lg">Save</Button>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, reactive, defineProps, defineEmits, watch } from 'vue';
import { useStore } from 'vuex';
import Dialog from '../Dialog.vue';
import { withThrottling } from '@/utils/with';
import FormInput from '@/components/Framework/FormInput.vue';
import Button from '@/components/Button.vue';
import { notify } from '@kyvg/vue3-notification';

const $store = useStore();

const props = defineProps({
  modelValue: Boolean,
  username: String,
});

const emits = defineEmits(['update:modelValue']);

const state = reactive({
  visible: false,
  username: '',
});

const doChangeName = withThrottling(async () => {
  await $store.dispatch('user/setNickname', state.username);
  notify({
    text: 'Change Successfully.',
  });
  state.visible = false;
});

onMounted(() => {
  state.visible = props.modelValue;
  state.username = props.username;
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
    emits('update:modelValue', val);
  },
);

watch(
  () => props.username,
  (val) => {
    state.username = val;
  },
);
</script>

<style scoped></style>
