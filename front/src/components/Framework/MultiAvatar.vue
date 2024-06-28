<template>
  <div v-html="svgCode"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import multiavatar from '@multiavatar/multiavatar';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'multi-avatar',
  data: () => ({
    svgCode: '',
  }),
  computed: {
    ...mapState({
      accounts: (state: any) => state.wallet.accounts as Array<string>,
    }),
  },
  created() {
    this.svgCode = multiavatar(this.accounts[0] || 'unknown');
  },
});
</script>
