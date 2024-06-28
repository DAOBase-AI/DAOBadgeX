<template>
  <div>
    <div class="text-whitebase flex justify-between mt-8 mb-4">
      <div class="text-xl font-bold">MY PASS</div>

      <div
        class="text-xs font-bold flex items-center cursor-pointer"
        @click="$router.back()"
      >
        <i class="iconfont icon-fanhui mr-2"></i> Back
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4" v-if="!loading">
      <div v-for="(project, i) in state.list" :key="i">
        <PassCard :info="project"></PassCard>
      </div>
    </div>
    <div v-else class="grid grid-cols-4 gap-4">
      <Skeletor
        class="h-44 rounded"
        v-for="(_, i) in Array(4).fill(0)"
        r
        :key="i"
      ></Skeletor>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, onMounted, reactive } from 'vue';
import PassCard from '@/components/Card/Pass.vue';
import { useReq } from '@/hooks';
import { queryMyPass } from '@/api/dao';
import { Skeletor } from 'vue-skeletor';

const $router = useRouter();

const state = reactive({
  list: [],
});

const { loading, loadData } = useReq(async () => {
  state.list = await queryMyPass();
});

onMounted(() => {
  loadData();
});

// TODO loaindg 无限加载
</script>

<style lang="scss" scoped></style>
