<template>
  <div class="relative">
    <slot name="label">
      <div v-if="!!label" class="text-black mb-3 h-6 flex">
        <div class="flex items-start" style="color: #ff5585ff" v-if="required">
          <div class="h-1 w-1 rounded-full bg-inputActive"></div>
        </div>
        <span> {{ label }} </span>
      </div>
    </slot>

    <div>
      <div
        class="relative flex h-14 ui-input--wrapper"
        :class="{
          'ui-input--wrapper__focus': state.focused,
          ' cursor-not-allowed': readonly,
          [props.boxStyle]: true,
        }"
      >
        <div
          v-if="readonly"
          class="flex-1 flex items-center text-whitebase pl-4"
          :class="{
            uppercase: uppercase,
          }"
          style="color: #ffffff66"
        >
          {{ modelValue }}
        </div>
        <div v-else class="relative flex-1 flex">
          <slot name="left">
            <div class="px-2 flex items-center" v-if="leftIcon">
              <i :class="`iconfont ${leftIcon}`"></i>
            </div>
          </slot>
          <input
            @blur="onBlur"
            @focus="onFocus"
            v-model="state.text"
            :type="type"
            :name="name"
            :autocomplete="autocomplete"
            :placeholder="placeholder"
            :disabled="disabled"
            @change="onInput"
            class="flex-1 min-w-0 w-full ui-input text-whitebase"
            :class="{
              uppercase: uppercase,
            }"
            ref="input"
          />
          <transition name="fade">
            <div
              v-if="!!state.text && state.focused && hasDeleteIcon"
              class="w-4 h-4 rounded-full flex items-center justify-center absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer"
              style="background: rgba(255, 255, 255, 0.1)"
              @click="state.text = ''"
            >
              <i class="iconfont icon-guanbi text-sm"></i>
            </div>
          </transition>
        </div>

        <slot name="trailing">
          <div v-if="endTag" class="text-black flex items-center px-2">
            {{ endTag }}
          </div>
        </slot>
      </div>
      <transition name="fade">
        <div
          v-if="!!state.errorMessage && props.showError"
          class="pr-3 mt-2 ml-1 flex items-center pointer-events-none text-xs text-error break-all"
        >
          <i class="iconfont icon-tishi mr-2"></i>
          <span>{{ state.errorMessage }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {
  defineEmits,
  reactive,
  defineProps,
  defineExpose,
  watch,
  watchEffect,
  ref,
} from 'vue';
import { rules } from '@/constants';

const input = ref(null);

const ruleMapping = {
  normalStr: rules.isNormalStr,
  url: rules.isUrl,
  address: rules.isAddress,
  symbol: rules.isSymbol,
  gtZero: rules.gtZero,
};

const errorMsgs = {
  normalStr: "Only type [0-9a-zA-Z] $-_.+!*'(), character",
  url: 'Invalid URL',
  address: 'Invalid address',
  symbol: '3~6 A-Z characters',
  gtZero: 'Must great than 0',
};

const $emits = defineEmits(['legal', 'update:modelValue']);

const state = reactive({
  text: '',
  errorMessage: '',
  focused: false,
});

const props = defineProps({
  hasDeleteIcon: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
  },
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
  },
  modelValue: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
  },
  numMode: {
    type: String,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  placeholder: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
  rules: {
    type: Array,
  },
  leftIcon: String,
  uppercase: Boolean,
  maxLength: { type: Number, default: 100000 },
  minLength: {
    type: Number,
    default: 0,
  },
  maxValue: Number,
  endTag: String,
  readonly: {
    type: Boolean,
    default: false,
  },
  boxStyle: String,
  showError: {
    type: Boolean,
    defult: false,
  },
});

const checkRule = (val) => {
  const words = val || state.text;

  let errorMsg = '';

  if (words === '' || words == undefined) {
    return props.required ? `${props.label} Can't be empty` : '';
  }

  // Rule checking
  // Rule type: (val: string): boolean
  props.rules?.forEach((rule) => {
    if (errorMsg) {
      return;
    }
    if (!ruleMapping[rule](words)) {
      errorMsg = `${props.label} ${errorMsgs[rule]}`;
    }
  });
  if (errorMsg) {
    return errorMsg;
  }

  if (words.length > props.maxLength) {
    return `${props.label} Max ${props.maxLength} characters`;
  }
  if (words.length < props.minLength) {
    return `${props.label} no less than ${props.minLength} characters`;
  }
  if (props.maxValue && +words > props.maxValue) {
    return `${props.label} No more than ${props.maxValue} ${props.endTag}`;
  }
  return '';
};

const onBlur = () => {
  state.focused = false;
  if (!state.errorMessage) {
    state.errorMessage = checkRule(state.text);
  }
};

const onFocus = () => {
  state.focused = true;
};

const onInput = (e) => {
  let value = e.target.value;
  const key = e.data;
  let isInt = false;

  if (props.uppercase) {
    value = value.toUpperCase();
  }

  if (props.numMode) {
    if (props.numMode != 'FLOAT') {
      isInt = true;
    }
    value = value.replace(/[^\d.]/g, '');
    if (!/(\d|\.)/.test(key)) {
      value = value.substr(0, value.length - 1);
    } else {
      if (key == '.') {
        if (!isInt) {
          if (value == '.' || value == '0.') {
            value = '0.';
          } else {
            const res = value.match(/\./g);
            if (res && res.length > 1) {
              value = value.substr(0, value.length - 1);
            }
          }
        } else {
          value = value.substr(0, value.length - 1);
        }
      }
      value = value.replace(/^0+/g, '0');
      if (
        value[0] == '0' &&
        value[1] !== '0' &&
        value[1] != '.' &&
        value[1] != undefined
      ) {
        value = value.substring(1);
      }
    }
  }

  state.text = value;
  $emits('update:modelValue', value);
  state.errorMessage = '';
};

const setErrorMsg = (text) => {
  state.errorMessage = text;
};

watchEffect(() => {
  state.text = props.modelValue;
});

watch(
  () => state.text,
  (x) => {
    $emits('update:modelValue', x);
  },
);

defineExpose({
  checkRule,
  setErrorMsg,
});
</script>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<style scoped>
input::-webkit-input-placeholder {
  font-size: 16px;
  color: #ffffff66;
  font-weight: normal;
}

.ui-input--wrapper {
  background: #121416;
  border-radius: 4px;
  border: 1px solid #2a2e33;
  transition: all 0.3s;
  outline: none;
}
.ui-input--wrapper.ui-input--wrapper__focus {
  border-color: #831828;
}

.ui-input {
  background: transparent;
  outline: none;
  border: none;
  padding: 8px 16px;
  line-height: normal;
}
</style>
