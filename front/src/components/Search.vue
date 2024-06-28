<template>
  <div
    class="fixed top-1/2 right-0 z-top duration-500 transition-all"
    :class="{
      'w-full bg-black-70': state.showSearch,
      'right-1': state.hovered || state.intialEffect,
    }"
  >
    <div
      class="cursor-pointer flex items-center justify-center transition-transform duration-300"
      v-if="!state.showSearch"
    >
      <div
        class="cursor-pointer rounded-l-lg flex items-center justify-center"
        style="
          width: 48px;
          height: 80px;
          background: linear-gradient(315deg, #ff5585 0%, #268cff 100%);
        "
        :class="{
          // 'slide-right-enter-active': !state.showSearch && !state.intialEffect,
        }"
        @mouseenter="state.hovered = true"
        @mouseleave="state.hovered = false"
        @click.stop="openComponent"
      >
        <i
          class="iconfont flex items-center justify-center text-xl text-whitebase"
          :class="{
            'icon-sousuo1': !state.hovered,
            'icon-left': state.hovered,
          }"
        ></i>
        <!-- <span class="font-bold text-sm ml-2 text-whitebase">Search</span> -->
      </div>
    </div>
    <div
      @mouseenter="state.hovered = true"
      @mouseleave="state.hovered = false"
      class="fixed top-1/10 right-0 z-top w-0 rounded-l-lg transition-width duration-500 overflow-hidden opacity-0"
      style="
        height: 676px;

        background: linear-gradient(315deg, #ff5585 0%, #268cff 100%);
      "
      :class="{
        'w-2 opacity-100 ': state.hovered || state.intialEffect,
      }"
      @click.stop="openComponent"
    ></div>
    <el-drawer
      :close-delay="50"
      size="706px"
      v-model="state.showSearch"
      direction="rtl"
      :before-close="closeComponent"
      class="drawer"
      style="height: 676px"
      :with-header="false"
    >
      <div class="text-whitebase py-10 px-14 h-full">
        <div
          class="flex justify-center items-center icon iconfont rounded-r-lg bg-white-005 cursor-pointer hover:bg-white-010 absolute left-0 w-10 h-20"
          style="top: 40%"
          @click="closeComponent"
        >
          &#xe60e;
        </div>
        <div class="mb-5 text-2xl font-bold">Discover Everything About DAO</div>
        <SearchBar
          class="mb-4"
          placeholder="Search DAOs / Members / Artists / Collection"
          @focusChange="handleFocusChange"
          :searchText="state.searchText"
          :result="state.result"
          @lay="handleItemSelect"
          :selectedItem="state.selectedItem"
          @clearHistory="
            () => {
              localStorage.removeItem(SEARCH_RESULTS_KEY);
              searchResults.value = [];
            }
          "
        />
        <SuggestionList
          v-if="!state.selectedItem"
          @lay="
            (item) => {
              if (!state.searchBarFocused) handleItemSelect(item);
            }
          "
        />

        <SearchItemDetailList
          v-else-if="state.selectedItem"
          :items-list="state.itemList"
          :loadingInitial="loading"
        />
      </div>
    </el-drawer>
  </div>
</template>
<script setup>
import { reactive, watch, onMounted, onUnmounted, ref, computed } from 'vue';
import SuggestionList from '@/components/SuggestionList.vue';
import { useDesktop, useReq } from '@/hooks';
import SearchBar from './SearchBar.vue';
import { getSuggestionDetail, getSuggestionSummary } from '@/api/search';
import SearchItemDetailList from './SearchItemDetailList.vue';
import { eventBus } from '@/libs/event-bus';
import { useStore } from 'vuex';

const store = useStore();

eventBus.on('componentClose', () => {
  closeComponent();
});
const openComponent = () => {
  state.showSearch = true;
  state.delayedShowSearch = true;
};
const closeComponent = () => {
  state.showSearch = false;
  store.commit('wallet/setSearchBox', false);
  // state.delayedShowSearch = false;
  // setTimeout(() => {

  // }, 500);
};
onMounted(() => {
  localStorage.removeItem('CURRENT_SEARCH');

  setTimeout(() => {
    state.intialEffect = true;
  }, 100);
  setTimeout(() => {
    state.intialEffect = false;
  }, 600);
});

// Cleanup event listener when component is unmounted

const isDesktop = useDesktop();
const state = reactive({
  delayedShowSearch: false,
  searchBarFocused: false,
  showSearch: false,
  searchText: null,
  result: null,
  selectedItem: null,
  itemList: null,
  selectedItemDetail: null,
  tabs: [],
  history: [],

  response: [],
  nonTabKeys: [
    'daoProfile',
    'memberProfile',
    'collection',
    'type',
    'artistProfile',
    'address',
  ],
  ld: false,
  a: false,
  delayedLoading: false,
  isLoading: [false],
});
watch(
  () => state.showSearch,
  () => {
    if (state.showSearch) state.hovered = false;
  },
);

const handleFocusChange = (focus) => {
  state.searchBarFocused = focus;
};
const SEARCH_RESULTS_KEY = 'searchResults';
const searchResults = ref([]);

const handleItemSelect = (item) => {
  state.selectedItem = item;
  if (state.selectedItem) {
    const storedResults = localStorage.getItem(SEARCH_RESULTS_KEY);
    if (storedResults) {
      searchResults.value = JSON.parse(storedResults);
      const existingResultIndex = searchResults.value.findIndex(
        (existingItem) =>
          existingItem.name == item.name && existingItem.type === item.type,
      );

      if (existingResultIndex > -1) {
        // Remove the existing result to avoid duplicates
        searchResults.value.splice(existingResultIndex, 1);
      }
    } else {
      searchResults.value = [];
    }

    searchResults.value.unshift(item); // Add the new result at the beginning

    // Limit the number of results to MAX_RESULTS
    if (searchResults.value.length > 6) {
      searchResults.value = searchResults.value.slice(0, 6);
    }

    // Save the new search results in local storage
    localStorage.setItem(
      SEARCH_RESULTS_KEY,
      JSON.stringify(searchResults.value),
    );

    loadData();
  } else {
    state.itemList = null;
  }
};
watch(
  () => state.ld,
  () => {
    state.delayedLoading = state.ld;
  },
);

const updateBaseData = async (item, i) => {
  let logo = null;
  let name = null;
  let daoPath = null;
  let daoType = null;
  Object.keys(item).forEach((subItem, j) => {
    if (
      state.nonTabKeys.indexOf(subItem) !== -1 &&
      typeof state.response[i][subItem] === 'object' &&
      subItem !== 'type' &&
      subItem !== 'address'
    ) {
      logo = state.response[i][subItem].logo;
      daoPath = state.response[i][subItem].daoPath;
      daoType = state.response[i][subItem].daoType;
    }
  });
  Object.keys(item).forEach((subItem, j) => {
    if (
      (typeof state.response[i][subItem] === 'object' &&
        state.nonTabKeys.indexOf(subItem) === -1) ||
      subItem === 'transaction' ||
      subItem === 'proposal'
    ) {
      if (subItem === 'transaction' || subItem === 'proposal') {
        state.response[i][subItem] = {
          [subItem]: state.response[i][subItem],
        };
      }
      state.response[i][subItem].logo = logo;
      state.response[i][subItem].name = item.name;
      state.response[i][subItem].daoPath = daoPath;
      state.response[i][subItem].daoType = daoType;
    }
  });
};
const { loadData, loading } = useReq(async () => {
  // state.a = true;
  const response = await getSuggestionSummary({
    name: state.selectedItem.name,
    type: state.selectedItem.type,
    address: state.selectedItem.address,
  });
  state.response = response;
  // loadDetail();
  // state.itemList = state.response;
  // state.a = false;
  // console.log('combined', state.itemList, state.tabs);

  response.forEach(async (item, i) => {
    await updateBaseData(item, i);
  });

  state.itemList = response;
  // state.a = false;
  // console.log('combined', state.itemList, state.tabs);
});

watch(
  () => store.state.wallet.isShowSearchBox,
  (val) => {
    if(store.state.wallet.isShowSearchBox) {
      openComponent();
    }
  },
);

</script>
<style>
.el-drawer.rtl {
  top: 9% !important;
}
.drawer {
  background: transparent !important;
  backdrop-filter: blur(50px) !important;
  box-shadow: -4px 0px 16px 0px rgba(18, 20, 22, 0.4) !important;
}
.el-drawer__body {
  border-top-left-radius: 1rem !important;
  border-bottom-left-radius: 1rem !important;
  background-color: rgba(18, 20, 22, 1) !important;
  padding: 0 !important;
  overflow: hidden !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-right-width: 0px !important;
}
.slide-up-enter-active {
  animation: slide-up 0.5s ease;
  opacity: 0;
}
.slide-right-enter-active {
  animation: slide-right 0.5s ease;
  opacity: 1;
}
.slide-right-leave-active {
  animation: slide-left 0.5s ease;

  opacity: 1;
}

@keyframes slide-up {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-left {
  0% {
    transform: translateX(0%);
    opacity: 0;
  }
  100% {
    transform: translateX(100%);
    opacity: 1;
  }
}
</style>
