<template>
  <div
    class="relative bg-white px-8 py-2 z-10"
    style="border-radius: 4px; border: 1px solid #831828"
  >
    <ul class="w-full space-y-2">
      <li
        class="flex italic justify-between"
        v-for="(item, i) in [
          { name: $t('CreateDAO.PASSSettings.Alert.Name'), value: name },
          {
            name: $t('CreateDAO.PASSSettings.Alert.Symbol'),
            value: symbol,
          },
          {
            name: $t('CreateDAO.PASSSettings.Alert.Decimal'),
            value: type == 'ERC721' ? '-' : decimal,
          },
          { name: $t('CreateDAO.PASSSettings.Alert.Type'), value: type },
          {
            name: $t('CreateDAO.PASSSettings.Alert.TotalSupply'),
            value: totalSupply,
          },
        ]"
        :key="i"
      >
        <div class="w-36">{{ item.name }}</div>
        <div class="">{{ item.value }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
// import { InformationCircleIcon } from '@heroicons/vue/solid';

export default {
  components: {
    // InformationCircleIcon,
  },
  props: {
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    decimal: {
      type: String,
    },
    type: {
      type: String,
    },
    totalSupply: {
      type: String,
    },
  },
};
</script>
