<template>
  <div>
    <div class="max-w-lg flex shadow-sm relative h-10 text-whitebase">
      <FormInput
        v-model="state.address"
        type="text"
        :placeholder="$t('CreateDAO.TokenBaseOptions.Address')"
        :rules="['address']"
        required
      ></FormInput>
      <!-- <SearchIcon class="absolute right-2 my-2 w-5 h-5 text-black cursor-pointer" /> -->
    </div>
    <div
      v-if="state.loading"
      class="relative bg-gradient-1 bg-opacity-50 px-8 py-8 z-10 border-gradient-2 flex flex-col justify-center items-center"
    >
      <Loading class="w-8 h-8"></Loading>
      <!-- <div class="mt-4">Searching...</div> -->
    </div>
    <div
      v-else-if="state.msg"
      class="relative text-strong-gray italic bg-gradient-1 bg-opacity-50 px-8 py-8 z-10 border-gradient-2 flex flex-col justify-center items-center"
    >
      <div class="cursor-pointer" @click="loadInfo()">
        <!-- <svg xmlns="http://www.w3.org/2000/svg"
             class="h-8 w-8"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg> -->
      </div>
      {{ state.msg }}
    </div>
    <Info
      class="mt-2"
      v-if="state.token"
      :decimal="state.token.decimals"
      :name="state.token.name"
      :symbol="state.token.symbol"
      :totalSupply="state.token.totalSupply"
      :type="state.token.tokenType"
    />
  </div>
</template>

<script setup>
import { isAddress } from '@ethersproject/address';
import { defineProps, defineEmits, onMounted, reactive, watch } from 'vue';
import { getTokeninfo } from '@/constants/contract/read';
import Info from './Info.vue';
import Loading from '@/components/Loading.vue';
import { useNetwork } from '@/hooks';
import FormInput from '@/components/Framework/FormInput.vue';

const network = useNetwork();

const state = reactive({
  address: '',
  token: null,
  loading: false,
  msg: '',
});

const props = defineProps({
  modelValue: String,
  tokenType: {
    type: String,
    default: 'ERC20',
  },
});

const emits = defineEmits(['update:modelValue']);

onMounted(() => {
  state.address = props.modelValue;
});

const loadInfo = async (address) => {
  state.loading = true;
  state.token = null;
  try {
    const info = await getTokeninfo(
      address || state.address,
      props.tokenType,
      network.value,
    );
    if (state.address === info.address) {
      state.loading = false;
      state.token = info;
    }
    state.msg = '';
  } catch (error) {
    console.log(error);
    state.loading = false;
    state.msg = 'Invalid address / Load info failed';
  }
};

watch(
  () => state.address,
  (val) => {
    if (isAddress(val)) {
      loadInfo(val);
    } else {
      state.loading = false;
      state.token = null;
      state.msg = '';
    }

    emits('update:modelValue', val);
  },
);

watch(
  () => props.modelValue,
  (val) => {
    state.address = val;
  },
);
</script>

<style scoped></style>
