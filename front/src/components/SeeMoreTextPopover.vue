<template>
  <div class="text-sm">
    <div
      class="text-sm md:text-base"
      :class="`${'lineClamp8 md:lineClamp6 overflow-ellipsis'}`"
      :style="`max-width: ${props.maxWidth}px`"
    >
      <div v-html="props.text"></div>
    </div>

    <Popper placement="bottom-end" v-if="props.text.length > props.maxLength">
      <button>
        <div
          class="cursor-pointer text-whitebase"
          @click="handleClick"
          style="width: fit-content"
        >
          See {{ state.more ? 'less' : 'more' }}
          <i
            class="iconfont text-sm"
            :class="{
              'icon-shang1': state.more,
              'icon-xia1': !state.more,
            }"
          ></i>
        </div>
      </button>
      <template #content>
        <div class="popper relative">
          <div class="text-sm md:text-base" v-html="props.text"></div>
        </div>
      </template>
    </Popper>
  </div>
</template>

<script setup>
import { useDesktop } from '@/hooks';
import { defineProps, reactive, computed } from 'vue';
import Popper from 'vue3-popper';

const props = defineProps({
  maxWidth: {
    type: Number,
    default: 588,
  },
  maxLength: {
    type: Number,
    default: 450,
  },
  text: {
    type: String,
    default: '',
  },
});
const handleClick = () => {
  state.more = !state.more;
};

const state = reactive({
  more: false,
});
</script>

<style scoped>
.lineClamp6 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
}
.lineClamp8 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 8;
}

.popper {
  max-width: 588px;
  box-shadow: 8px 45px 32px 0px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  background: transparent;
  padding-top: 48px;
  padding-right: 24px;
  padding-left: 24px;
  padding-bottom: 24px;
  font-size: 12px;
  color: #fff;
}
</style>
