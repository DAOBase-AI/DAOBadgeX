<template>
  <div class="relative text-whitebase">
    <ul
      class="flex items-center space-x-10 mb-6 vault-nav mt-12 relative"
      style="border-bottom: 1px solid #ffffff1a"
    >
      <li
        class="relative text-2xl"
        @click="state.selected = i"
        :class="{
          active: state.selected == i,
        }"
        v-for="(item, i) in ['DAO CREATED', 'DAO MANAGED']"
        :key="i"
      >
        <div
          class="flex items-center cursor-pointer font-bold h-12 transition-all"
          :class="{
            'text-whitebase': state.selected == i,
            ' text-gray-level': state.selected != i,
          }"
        >
          {{ item }}
        </div>
      </li>
      <li class="absolute right-0 font-bold flex gap-2">
        {{ list.length }}
        <div class="font-normal text-white-040">Results</div>
      </li>
    </ul>

    <!-- <div class="text-xl font-bold mb-6 mt-12">DAO CREATED</div> -->

    <div class="relative grid grid-cols-4 gap-4" v-if="!loading">
      <div v-for="(project, i) in list" :key="i">
        <DaoCard :info="project" isEdit :isCreated="state.selected == 0" />
      </div>

      <div
        v-if="state.selected == 0"
        class="flex flex-col justify-center items-center w-full h-72 profle-dao-add cursor-pointer"
        @click="toCreate"
      >
        <img
          class="w-16 h-16 mb-4"
          src="@/assets/images/profile-dao-add.avif"
          alt=""
        />
        <div class="font-bold text-xl text-tip-0">Create DAO</div>
      </div>
    </div>

    <div class="relative grid grid-cols-4 gap-4" v-else>
      <Skeletor
        v-for="(project, i) in Array(4).fill(0)"
        :key="i"
        class="relative bg-white-005 rounded w-full h-72 cursor-pointer text-whitebase p-4"
      ></Skeletor>
    </div>
    <div
      v-if="!loading && state.selected == 1 && list.length < 1"
      class="flex items-center justify-center"
    >
      <img
        src="@/assets/bgs/no_data.avif"
        alt="no daos data found"
        class="relative"
      />
      <div class="text-white-040 absolute">No Data</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import DaoCard from '@/components/Card/Dao.vue';
import { useRouter } from 'vue-router';
import { getMyDaos } from '@/api/dao';
import { useReqByBool } from '@/hooks';
import { Skeletor } from 'vue-skeletor';

const state = reactive({
  daoCreated: [],
  daoManaged: [],
  selected: 0,
});

const $store = useStore();

const $router = useRouter();

const list = computed(() => {
  return state.selected == 0 ? state.daoCreated : state.daoManaged;
});

const { loading, loadData } = useReqByBool(async () => {
  const res = await getMyDaos();
  state.daoCreated = res.creator;
  state.daoManaged = res.manager;
});

const toCreate = () => {
  $router.push('/create');
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.vault-nav li div:before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: #ff5585ff;
  transition: all 0.3s;
}
.vault-nav li.active div:before {
  width: 100%;
}
</style>

<style>
.arrow-right {
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 10px solid #8c1b29;
}
.card-style {
  width: calc((100% - 6%) / 4);
}
.card-style:not(:nth-child(4n)) {
  margin-right: 2%;
}
.profle-dao-add {
  background-image: url('~@/assets/images/profile-dao-bg.avif');
  background-size: 100% 100%;
}
</style>
