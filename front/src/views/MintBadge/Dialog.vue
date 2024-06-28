<template>
  <teleport to="#app">
    <transition name="fade">
      <div
        v-if="props.visible"
        class="fixed inset-0 bg-masked opacity-100 z-top"
        @click="clickMasked"
      >
        <div
          class="absolute top-1/2 left-1/2 box-w shadow-x px-4 py-4 md:px-8 md:py-8 bg-white"
          :style="props.boxStyle"
          @click.passive="noop"
        >
          <!-- <div class="logo"></div> -->
          <div
            v-if="props.showClose"
            class="cursor-pointer absolute top-8 md:top-10 right-6 transform -translate-y-1/2 hover:opacity-80 hover:scale-110 z-top"
            @click="onCancel"
          >
            <XIcon class="w-5 h-5 text-whitebase"></XIcon>
          </div>
          <div class="text-whitebase font-semibold mt-8" v-if="!!props.title">
            {{ props.title }}
          </div>
          <slot :close="onCancel">
            <div
              class="text-whitebase text-center font-bold text-xl"
              :class="{
                'text-center': props.textAlign == 'cneter',
                'text-left': props.textAlign == 'left',
                'text-right': props.textAlign == 'right',
              }"
              v-html="props.text"
            ></div>
            <div class="text-white-080 mt-2 text-center">
              Please enter your invitation code to join, mint your DAO badges, and earn points!
            </div>
            <div class="border border-white-040 w-full h-12 my-4 rounded-lg">
              <input
                ref="inputRef"
                class="w-full bg-transparent border-0 text-black text-xl font-bold text-center"
                style="line-height: 32px;"
                v-model="state.word"
                type="text"
                @focus="state.focus = true"
                @input="convertToUppercase"
              />
            </div>
            <div class="flex justify-center">
              <button
                @click="doOk"
                class="active-button mt-2 text-sm font-bold rounded-lg h-12 w-full"
              >
                <span class="text-whitebase text-xl">Verify</span>
                <div v-if="loading" class="flex justify-center items-center pr-2">
                  <Spin></Spin>
                </div>
              </button>
            </div>
          </slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { defineEmits, defineProps, onMounted, reactive, ref, watch } from 'vue';
import UiButton from '@/components/UiButton.vue';
import { XIcon } from '@heroicons/vue/outline';
import { notify } from '@kyvg/vue3-notification';
import { verifyAccessCode } from '@/api/user';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const $route = useRoute();
const store = useStore();
const inputRef = ref(null);

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

const state = reactive({
  word: '',
  focus: false,
  loading: false,
});
const emits = defineEmits(['close', 'ok', 'reject', 'cancel']);

// Function to convert input to uppercase
const convertToUppercase = (event) => {
  state.word = event.target.value.toUpperCase();
};

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

const doOk = async () => {
  state.loading = true;
  try {
    const res = await verifyAccessCode(state.word);
    if (res.data) {
      notify({ 
        text: 'Correct invitation code!', 
      });
      emits('close');
      emits('ok');
    } else {
      notify({ 
        type: 'error', 
        text: 'Incorrect invitation code!', 
      });
    }
  } catch (error) {
    console.error("error!", error);
    notify({ 
      type: 'error', 
      text: 'error! ' + error, 
    });
  }
  state.loading = false;
};

const doCancel = () => {
  onCancel();
  emits('reject');
};

// watch(
//   () => store.state.wallet?.urlInviteId,
//   (val) => {
//     state.word = store.state.wallet?.urlInviteId;
//   }
// );

onMounted(() => {
  const urlInviteId = localStorage.getItem('urlInviteId') || $route.query.inviteId;
  state.word = urlInviteId;
});

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
  border-radius: 16px;
}
.box-w {
  width: 34rem;
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
