<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-32"
    v-if="state.loading"
  >
    <div
      v-for="(project, i) in Array(8).fill(0)"
      :key="i"
      class="h-40 md:h-64 p-3 md:p-6 space-y-2"
      style="background: rgba(255, 255, 255, 0.05); border-radius: 8px"
    >
      <div class="flex justify-center">
        <Skeletor class="w-14 h-14 md:w-24 md:h-24 rounded-full"></Skeletor>
      </div>

      <div class="flex justify-center items-center">
        <Skeletor class="h-4 w-36 rounded-none"></Skeletor>
        <Skeletor class="w-4 h-4 ml-2"></Skeletor>
      </div>
      <div>
        <Skeletor class="rounded-none"></Skeletor>
        <Skeletor class="rounded-none"></Skeletor>
        <Skeletor class="rounded-none hidden md:block"></Skeletor>
      </div>
    </div>
  </div>

  <div
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-32"
    v-else
  >
    <router-link
      v-for="(project, i) in state.list"
      :key="i"
      class="h-40 md:h-64 p-3 md:p-6 space-y-2 md:space-y-4 text-xs box-hover"
      style="background: rgba(255, 255, 255, 0.05); border-radius: 8px"
      :to="`/dao/${project.daoPath}`"
    >
      <div class="relative mx-auto" style="width: fit-content">
        <UiImg
          class="w-14 h-14 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto"
          :src="project.daoLogo"
        ></UiImg>
        <tippy content="Twitter is authenticated" :arrow="false">
          <img
            class="absolute right-0 bottom-0 w-4 h-4 md:w-5 md:h-5"
            src="@/assets/icons/tw_ok.avif"
            alt=""
            v-if="project.isTwitterOauth"
          />
        </tippy>
      </div>

      <div class="flex justify-center items-center">
        <div class="font-bold font-12">{{ project.daoName }}</div>
      </div>
      <div class="text-center line-clamp-3 md:line-clamp-4 font-10">
        {{ project.intro }}
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import UiImg from '@/components/UiImg.vue';
import { queryDAOPage } from '@/api/dao';
import { useRouter } from 'vue-router';
import { Skeletor } from 'vue-skeletor';

/*
    TODO 还差一个loading...
 */

const $router = useRouter();

const state = reactive({
  loading: false,
  list: [],
});

onMounted(async () => {
  try {
    state.loading = true;
    const res = await queryDAOPage(1, 8, 'home', '', 1);

    state.list = res.records;
  } catch (error) {
    /*  */
  }
  state.loading = false;
});
</script>

<style scoped>
.home-padding {
  padding: 0 8.3vw;
}
.box-hover {
  transition: all 0.3s;
}
.box-hover:hover {
  cursor: pointer;
  box-shadow: inset 0px 0px 16px 0px rgba(255, 255, 255, 0.3);
}
</style>
