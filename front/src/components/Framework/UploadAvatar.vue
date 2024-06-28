<template>
  <div
    @click="selectFile"
    :class="props.avatarClass"
    class="cursor-pointer relative rounded-full overflow-hidden"
  >
    <img v-if="!!state.img" class="w-full h-full" :src="state.img" />
    <MultiAvatar v-else class="w-full h-full"></MultiAvatar>
    <input
      type="file"
      class="w-0 h-0 opacity-0"
      ref="file"
      @change="onChange"
    />
    <div
      class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white from-opacity-50 opacity-0 hover:opacity-100 transition-all duration-200 flex justify-center items-center"
    >
      <div class="pt-8 text-sm text-whitebase">Upload</div>
    </div>
  </div>
</template>

<script setup>
import { uploadImg } from '@/libs/upload';
import { defineProps, defineEmits, reactive, watch, onMounted, ref } from 'vue';
import MultiAvatar from './MultiAvatar.vue';

const file = ref(null);

const state = reactive({
  img: '',
});

const emits = defineEmits(['update:modelValue', 'success']);

const props = defineProps({
  modelValue: String,
  avatarClass: String,
});

onMounted(() => {
  state.img = props.modelValue;
});

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

const selectFile = () => {
  file.value.click();
};

const onChange = async (e) => {
  const [file] = e.target.files;
  const res = await uploadImg(file);
  emits('success', res);
};
</script>

<style lang="scss" scoped></style>
