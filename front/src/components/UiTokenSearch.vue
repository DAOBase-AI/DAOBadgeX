<template>
  <div>
    <div>
      <UiInput
        label="Your token contract address"
        v-model="state.address"
        type="text"
        :placeholder="$t('CreateDAO.TokenBaseOptions.Address')"
        :rules="['address']"
        required
      ></UiInput>
    </div>
    <div
      v-if="state.loading"
      class="relative h-10 z-10 flex justify-center items-center mt-2"
      style="border-radius: 4px; border: 1px solid #831828"
    >
      <Loading class="w-8 h-8"></Loading>
    </div>
    <div
      v-else-if="state.msg"
      class="relative italic h-10 z-10 flex flex-col justify-center items-center text-xs mt-2"
      style="border-radius: 4px; border: 1px solid #831828"
    >
      <div class="cursor-pointer" @click="loadInfo()"></div>
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
import Info from './CreateDAO/Info.vue';
import Loading from '@/components/Loading.vue';
import { useNetwork } from '@/hooks';
import UiInput from './UiInput.vue';

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
