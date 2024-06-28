<template>
  <div class="w-3/4">
    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
      <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:mt-5 border border-disabled"
      >
        <div class="block text-sm text-black sm:mt-px sm:pt-2 ml-2 font-bold">
          {{ $t('CreateDAO.TokenBaseOptions.Network') }}
        </div>
        <div class="mt-1 sm:mt-0 sm:col-span-1 max-w-lg">
          <Listbox as="div" v-model="selectedNetwork">
            <div class="relative">
              <ListboxButton
                class="bg-disabled relative w-full shadow-sm pl-3 pr-10 py-2 text-left text-black cursor-default focus:outline-none sm:text-sm"
                disabled
              >
                <span class="block truncate">{{ newDAO.network }}</span>
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
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                  <ListboxOption
                    as="template"
                    v-for="person in networks"
                    :key="person.id"
                    :value="person"
                    v-slot="{ active, selected }"
                  >
                    <li
                      :class="[
                        active ? 'text-white bg-primary' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-semibold' : 'font-normal',
                          'block truncate',
                        ]"
                        class="text-black"
                      >
                        {{ person.symbol }}
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
        </div>
      </div>
    </div>
    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
      <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:mt-5 border border-primary"
      >
        <label class="block text-sm font-bold text-black sm:mt-px sm:pt-2 ml-2">
          {{ $t('CreateDAO.TokenBaseOptions.PASSContract') }}
        </label>
        <div class="mt-1 sm:mt-0 sm:col-span-1 max-w-lg">
          <Listbox as="div" v-model="selectedContract">
            <div class="relative">
              <ListboxButton
                class="relative w-full shadow-sm pl-3 pr-10 py-2 text-left bg-primary cursor-default focus:outline-none focus:ring-1 focus:ring-title focus:border-title sm:text-sm text-black"
              >
                <!-- <span class="block truncate text-black">{{ newDAO.passport }}</span> -->
                <span class="block truncate text-black">ERC721</span>
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
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm text-black"
                >
                  <ListboxOption
                    as="template"
                    v-for="contract in contracts"
                    :key="contract.id"
                    :value="contract"
                    v-slot="{ active, selected }"
                  >
                    <li
                      :class="[
                        active ? 'text-white bg-primary' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-semibold' : 'font-normal',
                          'block truncate',
                        ]"
                        class="text-black"
                      >
                        {{ contract.symbol }}
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
        </div>
      </div>
    </div>
    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
      <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:mt-5 border border-disabled"
      >
        <label class="block text-sm font-bold text-black sm:mt-px sm:pt-2 ml-2">
          {{ $t('CreateDAO.TokenBaseOptions.FactoryAddr') }}
        </label>
        <div class="mt-1 sm:mt-0 sm:col-span-1">
          <input
            v-model="newDAO.factory"
            type="text"
            disabled
            placeholder="0xbc6839ff35cef154866e044ce798239c04cdc810"
            class="w-full bg-disabled text-black border-0"
          />
        </div>
      </div>
    </div>
    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
      <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:mt-5 border border-disabled"
      >
        <label class="block text-sm font-bold text-black sm:mt-px sm:pt-2 ml-2">
          {{ $t('CreateDAO.TokenBaseOptions.TotalSupply') }}
        </label>
        <div class="mt-1 sm:mt-0 sm:col-span-1">
          <div class="max-w-lg flex shadow-sm">
            <div
              class="flex justify-center items-center w-full h-9 bg-disabled focus:ring-title focus:border-title min-w-0 sm:text-sm border-gray-300"
            >
              <img
                src="https://img.icons8.com/ios-filled/50/666666/infinity-large.png"
                class="w-8 h-8"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
      <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:mt-5 border border-disabled"
      >
        <label class="block text-sm font-bold text-black sm:mt-px sm:pt-2 ml-2">
          {{ $t('CreateDAO.TokenBaseOptions.TermOfValidity') }}
        </label>
        <div class="mt-1 sm:mt-0 sm:col-span-1">
          <div class="max-w-lg flex shadow-sm">
            <div
              class="flex justify-center items-center w-full h-9 bg-disabled focus:ring-title focus:border-title min-w-0 sm:text-sm border-gray-300"
            >
              <img
                src="https://img.icons8.com/ios-filled/50/666666/infinity-large.png"
                class="w-8 h-8"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
      <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:mt-5 border border-primary"
      >
        <label
          class="block text-sm font-medium text-black sm:mt-px sm:pt-2 pl-3"
        >
          {{ $t('CreateDAO.TokenBaseOptions.Burn') }}
        </label>
        <div class="mt-1 sm:mt-0 sm:col-span-1">
          <div class="max-w-lg flex shadow-sm">
            <div
              class="flex justify-center items-center w-full h-9 min-w-0 sm:text-sm bg-primary cursor-default focus:outline-none focus:ring-1 focus:ring-title focus:border-title"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
      <div
        class="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:mt-5 border border-primary"
      >
        <label class="block text-sm font-bold text-black sm:mt-px sm:pt-2 ml-2">
          *{{ $t('CreateDAO.TokenBaseOptions.ERC721Addr') }}
        </label>
        <div class="mt-1 sm:mt-0 sm:col-span-1">
          <div class="max-w-lg flex shadow-sm relative">
            <SearchIcon
              class="absolute right-2 my-2 w-5 h-5 text-black"
              @click="tokenInfo = !tokenInfo && getTokenInfo()"
            />
            <input
              v-model="newDAO.erc20"
              type="text"
              name="username"
              autocomplete="username"
              :placeholder="$t('CreateDAO.TokenBaseOptions.Address')"
              class="bg-primary w-full border-0 placeholder-black placeholder-opacity-50 pr-10 text-black focus:ring-0"
            />
          </div>
          <Info
            class="mt-2"
            v-if="tokenInfo"
            :decimal="info.decimals"
            :name="info.name"
            :symbol="info.symbol"
            :totalSupply="info.totalSupply"
            :type="info.type"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/solid';
import { SearchIcon } from '@heroicons/vue/outline';
import { PlaceHolderImage, rules } from '@/constants';

import Info from './Info.vue';

const networks = [{ id: 1, symbol: 'Ethereum' }];

const contracts = [
  {
    id: 1,
    symbol: 'ERC721',
  },
];

export default defineComponent({
  name: 'ClaimNFTBased',
  data: () => ({
    open: false,
    tokenInfo: false,
    selectedNetwork: networks[0],
    selectedContract: contracts[0],
  }),
  components: {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    ChevronDownIcon,
    SearchIcon,
    Info,
  },
  methods: {
    ...mapActions('erc20', ['fetchTokenInfo']),
    async getTokenInfo() {
      try {
        await this.fetchTokenInfo({
          token: this.newDAO.erc20,
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
  setup() {
    return {
      networks,
      contracts,
      placeholderUrl: PlaceHolderImage,
      rules,
    };
  },
  computed: {
    ...mapState({
      newDAO: (state: any) => state.dao.newDAO,
      info: (state: any) => state.erc20.info,
    }),
  },
});
</script>
