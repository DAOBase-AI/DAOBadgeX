<template>
  <div class="flex" style="min-height: 2.5rem">
    <label
      class="flex-1 flex items-center self-start text-sm font-bold text-black mr-2 pl-2 h-10"
    >
      {{ name }}
    </label>
    <div class="flex-1 mt-1 sm:mt-0 sm:col-span-1 max-w-lg min-h-full relative">
      <slot>
        <Listbox class="h-full" as="div" v-model="state.selected">
          <div class="relative h-full">
            <ListboxButton
              class="relative w-full h-full shadow-sm pl-3 pr-10 py-2 text-left cursor-default sm:text-sm text-black pass-cell focus:border-none focus:outline-none"
              :class="[props.disabled ? 'opacity-50' : '']"
              :disabled="props.disabled"
            >
              <span class="block truncate text-black italic">{{
                state.selected ? state.selected.symbol : ''
              }}</span>
              <span
                class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
              >
                <ChevronDownIcon
                  class="h-5 w-5 text-black"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-40 w-full bg-white max-h-60 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm text-black shadow-none"
                style="box0-shadow: none"
              >
                <ListboxOption
                  as="template"
                  v-for="(item, i) in props.list"
                  :key="i"
                  :value="item"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'pass-cell-item active' : 'pass-cell-item',
                      'cursor-default select-none relative py-2 pl-3 pr-9 mt-1',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate',
                      ]"
                      class="text-black"
                    >
                      {{ item.symbol }}
                    </span>

                    <span
                      v-if="selected"
                      :class="[
                        active ? 'text-white' : 'text-primary',
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                      ]"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, reactive } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/solid';

const props = defineProps({
  modelValue: Object,
  name: String,
  disabled: Boolean,
  type: {
    type: String,
    validator: () => {
      return true;
    },
  },
  list: {
    type: Array,
    default: () => [],
  },
});

const state = reactive({
  selected: props.modelValue || props.list[0],
});

const emits = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  (val) => {
    state.selected = val;
  },
);

watch(
  () => state.selected,
  (val) => {
    emits('update:modelValue', val);
  },
);
</script>

<style scoped>
.pass-cell-item.active {
  background: linear-gradient(90deg, #2e141a 0%, #181317 100%);
  outline: none;
}
.pass-cell-item {
  color: #737373;
  background: linear-gradient(90deg, #1c1417 0%, #131416 100%);
  outline: none;
}

.pass-cell {
  background: linear-gradient(90deg, #1c1417 0%, #131416 100%);
  outline: none;
}

.pass-cell-item::before,
.pass-cell::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #831828 0%, rgba(131, 24, 40, 0.2) 100%);
}
</style>
