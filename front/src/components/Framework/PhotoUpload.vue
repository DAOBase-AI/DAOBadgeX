<template>
  <div class="relative flex flex-col items-center justify-center w-44">
    <div
      class="relative img-bg rounded-full p-px-2 cursor-pointer hover:opacity-80"
      :style="{ width: props.size + 'px', height: props.size + 'px' }"
    >
      <div
        class="w-full h-full bg-white overflow-hidden flex justify-center items-center rounded-full"
        @click="selectFile"
      >
        <div v-if="state.loading" class="lds-ripple">
          <div></div>
          <div></div>
        </div>
        <div
          v-else-if="!state.img"
          class="flex flex-col justify-center items-center"
        >
          <img class="my-2 w-8" src="@/assets/images/upload_add.avif" />
          <!-- <div class="text-strong-gray italic">Upload PIC</div> -->
        </div>
        <img
          v-else
          :src="state.img"
          :alt="props.alt"
          class="block w-full h-full object-cover rounded-full"
        />
        <input
          type="file"
          class="w-0 h-0"
          ref="fileInput"
          accept="image/*"
          @change="doUpload"
        />
      </div>
    </div>

    <div class="font-bold text-black mt-4 mb-2" v-if="props.name">
      <span style="color: #831828" v-if="props.required" class="mr-2">*</span>
      {{ name }}
    </div>

    <div class="text-xs text-center text-gray-level w-44">
      File types Supported: JPG, PNG, GIF, SVG. <br />Max size: 100 M
    </div>
  </div>
</template>

<script setup>
import { uploadImg } from '@/libs/upload';
import { notify } from '@kyvg/vue3-notification';
import { defineProps, defineEmits, reactive, ref, watch, onMounted } from 'vue';

const fileInput = ref(null);

const state = reactive({
  img: '',
  loading: false,
});

const emits = defineEmits(['success', 'fail', 'update:modelValue']);

const props = defineProps({
  modelValue: String,
  alt: String,
  name: String,
  required: {
    type: Boolean,
    default: true,
  },
  size: Number,
});

const selectFile = () => {
  if (state.loading) {
    return;
  }
  fileInput.value.click();
};

const doUpload = async (e) => {
  const [file] = e.target.files;
  state.loading = true;
  try {
    const res = await uploadImg(file);
    state.img = res;
    emits('success', res);
  } catch (error) {
    notify({
      type: 'error',
      text: error.message,
      duration: 5000,
    });
    emits('fail', error);
  }
  state.loading = false;
};

watch(
  () => state.img,
  (val) => {
    emits('update:modelValue', val);
  },
);

watch(
  () => props.modelValue,
  (val) => {
    state.img = val;
  },
);

onMounted(() => {
  state.img = props.modelValue;
  console.log(state.img, props.modelValue);
});
</script>

<style scoped>
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 50%;
    left: 50%;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
.img-bg {
  background: #fff;
}
</style>
