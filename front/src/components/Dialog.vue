<template>
  <teleport to="#app">
    <transition name="fade">
      <div
        v-if="props.visible"
        class="fixed inset-0 bg-masked opacity-100 z-top"
        @click="clickMasked"
      >
        <div
          class="absolute top-1/2 left-1/2 box-w shadow-x px-4 md:px-8 pb-4 md:pb-8 bg-white"
          :style="props.boxStyle"
          @click.passive="noop"
        >
          <!-- <div class="logo"></div> -->
          <div
            v-if="props.showClose"
            class="cursor-pointer absolute top-6 right-6 transform -translate-y-1/2 hover:opacity-80 hover:scale-110 z-top"
            @click="onCancel"
          >
            <XIcon class="w-5 h-5 text-whitebase"></XIcon>
          </div>
          <div class="text-whitebase font-semibold mt-8" v-if="!!props.title">
            {{ props.title }}
          </div>
          <slot :close="onCancel">
            <div
              class="text-whitebase pt-8 pb-10"
              :class="{
                'text-center': props.textAlign == 'cneter',
                'text-left': props.textAlign == 'left',
                'text-right': props.textAlign == 'right',
              }"
              v-html="props.text"
            ></div>
            <div v-if="props.alert" class="flex justify-center">
              <UiButton class="alert_btn" bold @click="doOk">{{
                props.okText
              }}</UiButton>
            </div>
            <div class="flex justify-end" v-else>
              <UiButton class="w-1/3" type="outline" @click="doCancel">{{
                props.cancelText
              }}</UiButton>
              <UiButton class="w-1/3 ml-4" @click="doOk">{{
                props.okText
              }}</UiButton>
            </div>
          </slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import UiButton from './UiButton.vue';
import { XIcon } from '@heroicons/vue/outline';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  maskedClose: {
    type: Boolean,
    default: false,
  },
  textAlign: {
    type: String,
    default: 'center',
  },
  text: {
    type: String,
    default: 'Charlotte Wanna Invite you to Speak.',
  },
  alert: {
    type: Boolean,
    default: false,
  },
  okText: {
    type: String,
    default: 'Ok',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  title: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: '',
  },
  containerClass: {
    type: String,
    default: '',
  },
  boxStyle: String,
});
const emits = defineEmits(['close', 'ok', 'reject', 'cancel']);

const noop = () => {
  /*  */
};

const onCancel = () => {
  emits('close');
  emits('cancel');
};

const clickMasked = () => {
  if (props.maskedClose) {
    onCancel();
  }
};

const doOk = () => {
  emits('close');
  emits('ok');
};

const doCancel = () => {
  onCancel();
  emits('reject');
};
</script>

<style scoped>
/* .logo {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-40%, -40%);
  width: 5rem;
  height: 5rem;
  background-image: url('../assets/images/dialog_icon.avif');
  background-repeat: no-repeat;
  background-size: contain;
} */
.shadow-x {
  box-shadow: 0px 0px 16px 0px #898a8b;
  border-radius: 8px;
}
.box-w {
  width: 30rem;
  transform: translate(-50%, -60%);
}

@media (max-width: 768px) {
  .box-w {
    width: 80%;
  }
}

.alert_btn {
  min-width: 12rem;
}
</style>
