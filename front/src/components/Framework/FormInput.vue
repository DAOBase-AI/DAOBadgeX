<template>
  <div class="flex-1">
    <div v-if="!!name" class="font-bold flex relative text-black mb-4">
      <span>
        <span>{{ required ? '*' : '' }}</span> {{ name.toUpperCase() }} :</span
      >
    </div>
    <div>
      <div class="relative form-input-border flex">
        <div class="text-bold relative flex-1">
          <input
            @blur="onHover"
            v-if="!textarea"
            v-model="text"
            :type="type"
            :name="name"
            :autocomplete="autocomplete"
            :placeholder="placeholder"
            :disabled="disabled"
            @change="onInput"
            class="flex-1 block w-full h-10 min-w-0 sm:text-sm font-medium text-black focus:ring-0"
            :class="{
              'border-error': !legal,
              'bg-gray-900': disabled,
              uppercase: uppercase,
            }"
          />
          <textarea
            @blur="onHover"
            v-if="textarea"
            v-model="text"
            :name="name"
            :autocomplete="autocomplete"
            :placeholder="placeholder"
            :disabled="disabled"
            :rows="rows"
            @change="onInput"
            class="w-full border border-transparent bg-primary bg-opacity-20 form-input-border focus:border focus:border-primary focus:ring-0 min-w-0 sm:text-sm font-medium text-black"
          />
        </div>
        <div class="text-black text-lg flex items-center pr-2">
          {{ endTag }}
        </div>
        <slot name="trailing"></slot>
      </div>
      <transition name="fade">
        <div
          v-if="!!errorMessage"
          class="pr-3 mt-2 flex items-center pointer-events-none text-xs"
        >
          <ExclamationCircleIcon
            class="h-4 w-4 text-error mr-2"
            aria-hidden="true"
          />
          <span class="text-red-200">{{ errorMessage }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ExclamationCircleIcon } from '@heroicons/vue/solid';
import { rules } from '@/constants';

const ruleMapping: any = {
  normalStr: rules.isNormalStr,
  url: rules.isUrl,
  address: rules.isAddress,
  symbol: rules.isSymbol,
  gtZero: rules.gtZero,
};

const errorMsgs: any = {
  normalStr: "Only type [0-9a-zA-Z] $-_.+!*'(), character",
  url: 'Invalid URL',
  address: 'Invalid address',
  symbol: '3~6 A-Z characters',
  gtZero: 'Must great than 0',
};

export default defineComponent({
  name: 'FormInput',
  emits: ['legal', 'update:modelValue'],
  data: () => ({
    text: '',
    legal: true,
    errorMessage: '',
  }),
  props: {
    name: {
      type: String,
    },
    required: {
      type: Boolean,
    },
    textarea: {
      type: Boolean,
    },
    modelValue: {
      type: String,
    },
    type: {
      type: String,
      default: 'text',
    },
    typeMode: {
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
    rows: {
      type: String,
    },
    uppercase: Boolean,
    maxLength: { type: Number, default: 100000 },
    minLength: {
      type: Number,
      default: 0,
    },
    maxValue: Number,
    endTag: String,
  },
  components: {
    ExclamationCircleIcon,
  },
  mounted(this: any) {
    this.text = this.modelValue;
  },
  methods: {
    checkRule(val: any) {
      const words = val || this.text;

      let errorMsg = '';

      if (words === '' || words == undefined) {
        return this.required ? "Can't be empty" : '';
      }

      // Rule checking
      // Rule type: (val: string): boolean
      this.rules?.forEach((rule: any) => {
        if (errorMsg) {
          return;
        }
        if (!ruleMapping[rule](words)) {
          errorMsg = errorMsgs[rule];
        }
      });
      if (errorMsg) {
        return errorMsg;
      }

      if (words.length > this.maxLength) {
        return `Max ${this.maxLength} characters`;
      }
      if (words.length < this.minLength) {
        return `Min ${this.minLength} characters`;
      }
      if (this.maxValue && +words > this.maxValue) {
        return `No more than ${this.maxValue} ${this.endTag}`;
      }
      return '';
    },
    onHover() {
      if (!this.errorMessage) this.errorMessage = this.checkRule(this.text);
    },

    onInput(e: any) {
      let value = e.target.value;
      const key = e.data;
      let isInt = false;

      if (this.uppercase) {
        value = value.toUpperCase();
      }

      if (this.typeMode) {
        if (this.typeMode != 'FLOAT') {
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

      this.text = value;
      this.$emit('update:modelValue', value);
      this.legal = true;
      this.errorMessage = '';
    },
  },

  watch: {
    // text(val: string) {
    //   let v = val;
    //   if (this.uppercase) {
    //     v = val.toUpperCase();
    //   }

    //   console.log(this.typeMode);

    //   this.$emit('update:modelValue', v);
    //   this.legal = true;
    //   this.errorMessage = '';
    // },
    modelValue(val: string) {
      this.text = val;
    },
  },
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
  color: #737373;
  font-style: italic;
  font-weight: normal;
}
textarea::-webkit-input-placeholder {
  color: #737373;
  font-style: italic;
  font-weight: normal;
}
</style>
