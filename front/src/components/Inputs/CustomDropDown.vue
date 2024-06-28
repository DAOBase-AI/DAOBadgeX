<template>
  <div :class="containerStyle">
    <div
      v-if="label"
      :class="labelStyle"
      class="text-whitebase text-xs md:text-sm"
    >
      <span> {{ label }} </span>
    </div>
    <div v-click-away="onClose" class="text-sm relative">
      <div
        class="ui-dropdown--box px-2 py-2.5 flex justify-between items-center text-whitebase cursor-pointer outline-none text-xs h-8"
        :class="{
          'ui-dropdown--box__border': !props.noBorder,
          [props.boxStyle]: true,

          'justify-between': props.isBetween,
          'justify-center': !props.isBetween,
          'font-bold': props.bold,
        }"
        @click="state.open = !state.open"
        tabIndex="1"
        @keyup="onKeyup"
      >
        <div
          class="flex items-center text-sm font-bold"
          style="line-height: 100% !important"
          :class="{
            'flex-1': props.isBetween,
            uppercase: props.textCapital,
          }"
          v-if="
            props.options[selectedIndex].label ||
            props.options[selectedIndex].name
          "
        >
          <img
            v-if="props.options[selectedIndex].icon"
            class="w-3 h-3 mr-0.5"
            :src="props.options[selectedIndex].icon"
            alt="option logo"
          />
          <i
            v-if="props.options[selectedIndex].iconFont"
            class="w-3 h-3 mr-1 icon iconfont text-whitebase"
            :class="props.options[selectedIndex].iconFont"
          ></i>
          {{
            props.options[selectedIndex].label
              ? props.options[selectedIndex].label
              : props.options[selectedIndex].name
          }}
        </div>

        <i
          class="ml-1 text-xs leading-3 iconfont icon-right transition-all text-white-040"
          :class="{
            'transform rotate-90': state.open,
          }"
        ></i>
      </div>
      <transition name="fade" class="w-full">
        <div
          v-if="state.open"
          class="absolute w-full ui-dropdown--optionsx mt-2 z-40 bg-white"
          role="listbox"
          :class="dropDownStyle"
        >
          <div
            v-for="(item, i) in options"
            :key="item"
            class="ui-dropdown--optionx h-10 w-full px-2"
            :class="{
              'ui-dropdown--option--active': props.selectedIndex == i,
            }"
            role="option"
            tabindex="-1"
            @click="handleChange(i)"
          >
            {{ item.label ? item.label : item.name }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, watchEffect } from 'vue';

const $emits = defineEmits(['change']);

const props = defineProps({
  options: Array,
  selectedIndex: Number,
  label: String,
  containerStyle: { type: String, default: 'mr-2 w-24' },
  labelStyle: { type: String, default: 'mb-2' },
  dropDownStyle: { type: String, default: '' },
});

const state = reactive({
  open: false,
  selectIndex: 0,
});

watchEffect(() => {
  const index = props.options.findIndex(
    (x) => x.label == props.selectedIndex?.label,
  );
  state.selectIndex = index == -1 ? 0 : index;
});

const onClose = () => {
  state.open = false;
};

const onKeyup = (e) => {
  if (e.keyCode == '38') {
    state.selectIndex = Math.max(0, state.selectIndex - 1);
  }
  if (e.keyCode == '40') {
    state.selectIndex = Math.min(
      props.options.length - 1,
      state.selectIndex + 1,
    );
  }
  // do->select
  if (e.keyCode == '13') {
    const obj = props.options[state.selectIndex];
    $emits('change', obj);
    state.open = false;
  }
};

const handleChange = (index) => {
  $emits('change', index);
  state.open = false;
};
</script>

<style scoped>
.ui-dropdown--box {
  border-radius: 8px;
  border: 1px solid #2a2e33;
}

.ui-dropdown--optionsx {
  border-radius: 4px;
  overflow: hidden;
  background: #2a2e34;
}
.ui-dropdown--optionx {
  display: flex;
  align-items: center;
  /* height: 30px; */
  padding-left: 16px;
  cursor: pointer;
  color: #fff;
  /* border-bottom: 1px solid #ffffff1a; */
}

.ui-dropdown--option:hover,
.ui-dropdown--option--active {
  background: rgba(255, 255, 255, 0.1);
}
</style>
