<template>
  <div class="relative text-whitebase">
    <div
      class="flex justify-between w-full mb-6 items-baseline mt-12"
      v-if="loading || list.length > 0"
    >
      <div class="text-xl font-bold">MY PASS</div>
      <div class="text-xs font-bold cursor-pointer" @click="toMore">
        SEE MORE <i class="iconfont icon-right"></i>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4" v-if="!loading">
      <div v-for="(project, i) in list" :key="i">
        <PassCard :info="project"></PassCard>
      </div>
    </div>
    <div v-else class="grid grid-cols-4 gap-4">
      <Skeletor
        class="h-44 rounded"
        v-for="(_, i) in Array(4).fill(0)"
        :key="i"
      ></Skeletor>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import PassCard from '@/components/Card/Pass.vue';
import { useReq } from '@/hooks';
import { queryMyPass } from '@/api/dao';
import { Skeletor } from 'vue-skeletor';
import { useRouter } from 'vue-router';

const $router = useRouter();

const state = reactive({
  list: [],
});

const { loading, loadData } = useReq(async () => {
  state.list = await queryMyPass();
});

const list = computed(() => state.list.slice(0, 4));

onMounted(() => {
  loadData();
});

const toMore = () => {
  $router.push('/profile/collections');
};
</script>

<style scoped></style>
