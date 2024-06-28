<template>
  <Listbox class="h-full" as="div" v-model="state.selected">
    <div class="relative h-full">
      <ListboxButton
        class="relative w-full h-full shadow-sm pl-3 pr-10 py-2 text-left cursor-default sm:text-sm text-black pass-cell focus:border-none focus:outline-none"
        :disabled="state.loading"
      >
        <span
          class="block truncate text-black italic"
          :class="{ ' text-red-700': index == -1 }"
          >{{ index == -1 ? 'Wrong Network !!!' : network }}</span
        >
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
        >
          <ChevronDownIcon class="h-5 w-5 text-black" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 w-full bg-white max-h-60 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm text-black shadow-none"
          style="box0-shadow: none"
        >
          <ListboxOption
            as="template"
            v-for="(item, i) in selectChains"
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
                {{ item.name }}
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
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { useNetwork } from '@/hooks';
import { chains, selectChains } from '@/constants';
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/solid';
import { switchEthChain } from '@/utils/wallet';

const network = useNetwork();

const index = computed(() => {
  const res = selectChains.findIndex((x) => x.name == network.value);
  return res;
});

// const selectedisabled = computed(() => index.value == -1);

const state = reactive({
  selected: index.value == -1 ? { name: '1' } : selectChains[index.value],
  loading: false,
});

watch(
  () => state.selected,
  async (val) => {
    if (!val) {
      return;
    }
    state.loading = true;
    await switchEthChain(chains[val.name]);
    state.loading = false;
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
