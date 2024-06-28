<template>
  <div v-if="loadingInitial">
    <div v-for="(loadingItem, i) in [1, 2, 3, 4]" :key="i">
      <Skeletor class="w-full mb-3 h-14 rounded-lg"></Skeletor>
    </div>
  </div>

  <div v-else>
    <el-tabs
      class="tabs"
      v-model="state.selectedTab"
      @click="() => handleTabChange()"
    >
      <el-tab-pane
        :label="
          tab === 'nfts' ? 'NFTs' : tab.charAt(0).toUpperCase() + tab.slice(1)
        "
        :name="tab"
        v-for="(tab, i) in ['All', ...state.tabs]"
        :key="i"
      >
      </el-tab-pane>
    </el-tabs>

    <div v-if="state.items.length > 1">
      <div class="overflow-y-auto" style="max-height: 442px" ref="containerRef">
        <div v-if="state.selectedTab === 'All'" class="space-y-2">
          <div v-for="(displayedItem, i) in displayedItems" :key="i">
            <div
              v-for="(itemType, j) in Object.keys(displayedItem)"
              :key="j"
              class="space-y-2"
              :style="{ 'animation-delay': `${j * 0.15}s` }"
            >
              <div
                v-if="
                  (typeof displayedItem[itemType] !== 'string' &&
                    typeof displayedItem[itemType] !== null &&
                    itemType !== 'address' &&
                    itemType !== 'length') ||
                  (itemType === 'transaction' &&
                    displayedItem[itemType].transaction === 'yes') ||
                  (itemType === 'proposal' &&
                    displayedItem[itemType].proposal === 'yes')
                "
              >
                <div
                  class="mb-2 border border-white-010 rounded-lg w-max px-2 py-1.5 font-bold text-xs"
                  :class="{ 'mt-6': j !== 0 }"
                >
                  {{ getItemName(itemType) }}
                </div>
                <SearchItemDetail
                  :loading="lding"
                  :isDetailed="false"
                  :type="itemType"
                  :item="displayedItem[itemType]"
                  class="space-y-2"
                  :selected-page="state.selectedPage"
                ></SearchItemDetail>
              </div>
            </div>
          </div>
          <el-pagination
            v-if="
              state.selectedTab === 'All' &&
              Math.ceil(
                state.items.length / Math.min(itemsPerPage, state.items.length),
              ) > 1
            "
            layout="prev, pager, next"
            :currentPage="currentPage"
            :pageCount="
              Math.ceil(
                state.items.length / Math.min(itemsPerPage, state.items.length),
              )
            "
            @update:current-page="handlePageUpdate"
          />
        </div>
        <div class="space-y-6" v-else>
          <div v-if="state.selectedPage === 1" class="space-y-6">
            <div v-for="(items, a) in state.items" :key="a">
              <div
                v-for="(itemType, j) in Object.keys(items)"
                :key="j"
                class="space-y-2"
                :style="{ 'animation-delay': `${j * 0.15}s` }"
              >
                <SearchItemDetail
                  v-if="itemType === state.selectedTab"
                  :loading="lding"
                  :hasDetails="false"
                  :isDetailed="false"
                  :type="itemType"
                  :item="items[itemType]"
                  class="space-y-2"
                  :selected-page="state.selectedPage"
                ></SearchItemDetail>
              </div>
            </div>
          </div>
          <SearchItemDetail
            :loading="lding"
            :selected-page="state.selectedPage"
            :isDetailed="true"
            :type="state.selectedTab"
            :item="{ detail: state.itemsByTime }"
            :itemsPerPage="20"
            class="space-y-2"
          />
          <el-pagination
            v-if="
              state.itemsByTime && Math.ceil(state.itemsByTime.length / 20) > 1
            "
            layout="prev, pager, next"
            :currentPage="state.selectedPage"
            :pageCount="Math.ceil(state.itemsByTime.length / 20)"
            @update:current-page="(newPage) => (state.selectedPage = newPage)"
          />
        </div>
      </div>
    </div>

    <div v-else>
      <div
        v-for="(item, i) in state.items"
        :key="i"
        class="space-y-4"
        :style="{ 'animation-delay': `${i * 0.15}s` }"
      >
        <div
          class="overflow-y-auto"
          style="max-height: 442px"
          ref="containerRef2"
        >
          <div v-if="state.items.length === 1">
            <div v-if="state.selectedTab === 'All'">
              <div v-if="state.selectedPage === 1">
                <div
                  v-for="(itemType, j) in Object.keys(item)"
                  :key="j"
                  :style="{ 'animation-delay': `${j * 0.15}s` }"
                >
                  <div
                    v-if="
                      (typeof item[itemType] !== 'string' &&
                        typeof item[itemType] !== null &&
                        itemType !== 'address' &&
                        itemType !== 'length') ||
                      (itemType === 'transaction' &&
                        item[itemType].transaction === 'yes') ||
                      (itemType === 'proposal' &&
                        item[itemType].proposal === 'yes')
                    "
                    class="space-y-2"
                  >
                    <div
                      class="mb-2 border border-white-010 rounded-lg w-max px-2 py-1.5 font-bold text-xs"
                      :class="{ 'mt-6': j !== 0 }"
                    >
                      {{ getItemName(itemType) }}
                    </div>
                    <SearchItemDetail
                      :loading="lding"
                      :selected-page="state.selectedPage"
                      :isDetailed="false"
                      :type="itemType"
                      :item="item[itemType]"
                      class="space-y-2"
                    />
                    <el-pagination
                      v-if="
                        itemType === state.tabs[state.tabs.length - 1] &&
                        state.totalPages > 1
                      "
                      layout="prev, pager, next"
                      :currentPage="state.selectedPage"
                      :pageCount="state.totalPages"
                      @update:current-page="
                        (newPage) => (state.selectedPage = newPage)
                      "
                    />
                  </div>
                </div>
              </div>
              <div v-if="state.selectedPage > 1">
                <SearchItemDetail
                  :loading="lding"
                  :selected-page="state.selectedPage"
                  :isDetailed="true"
                  :type="state.selectedTab"
                  :item="{ detail: state.itemsByTime }"
                  :itemsPerPage="20"
                  class="space-y-2"
                />
                <el-pagination
                  v-if="state.itemsByTime && state.totalPages > 1"
                  layout="prev, pager, next"
                  :currentPage="state.selectedPage"
                  :pageCount="state.totalPages"
                  @update:current-page="
                    (newPage) => (state.selectedPage = newPage)
                  "
                />
              </div>
            </div>
            <div v-else>
              <SearchItemDetail
                :loading="lding"
                :type="state.selectedTab"
                :item="item[state.selectedTab]"
                :selected-page="state.selectedPage"
              />
              <el-pagination
                v-if="
                  Math.ceil(item[state.selectedTab]?.detail?.length / 10) > 1
                "
                layout="prev, pager, next"
                :currentPage="state.selectedPage"
                :pageCount="
                  Math.ceil(item[state.selectedTab]?.detail?.length / 10)
                "
                @update:current-page="
                  (newPage) => (state.selectedPage = newPage)
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getSuggestionDetail } from '@/api/search';
import { startTask } from '@/api/user';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { Skeletor } from 'vue-skeletor';
import SearchItemDetail from './SearchItemDetail.vue';

const props = defineProps({
  itemsList: Array || Object,
  loadingInitial: Boolean,
});

const state = reactive({
  itemsLength: {},
  items: props.itemsList,
  itemsByTime: [],
  selectedPage: 1,
  selectedTab: 'All',
  tabs: [],
  nonTabKeys: [
    'daoProfile',
    'memberProfile',
    'collection',
    'type',
    'artistProfile',
    'address',
  ],
  totalPages: 0,
});
watch(
  () => props.itemsList,
  async () => {
    state.items = props.itemsList;
    loadDetails();
  },
);

const getItemName = (itemType) => {
  if (itemType === 'daoProfile') {
    return 'Dao Profile';
  } else if (itemType === 'memberProfile') {
    return 'Member Profile';
  } else if (itemType === 'artistProfile') {
    return 'Artist Profile';
  } else if (itemType === 'collection') {
    return 'Collection Profile';
  } else if (itemType === 'nfts') {
    return 'NFTs';
  } else {
    return itemType.charAt(0).toUpperCase() + itemType.slice(1);
  }
};
const calculateTotalPages = () => {
  let sum = 0;
  let noOfItemTypes = 0;
  let noOfPage = 0;

  noOfItemTypes = Object.keys(state.itemsLength)?.length;
  let prev = 0;
  let max = 0;
  let deduct = 0;
  Object.keys(state.itemsLength)?.map((a) => {
    sum += state.itemsLength[a];
    if (a === 'social') deduct += 2;
    else deduct += 5;
    if (state.itemsLength[a] > prev) {
      max = state.itemsLength[a];
      prev = state.itemsLength[a];
    }
  });

  // state.totalPages = (sum -5 )
  if (sum - 5 * noOfItemTypes > 0) noOfPage++;
  state.totalPages =
    noOfPage + Math.ceil((state.itemsByTime.length - deduct) / 20);
};

const containerRef = ref(null);
const containerRef2 = ref(null);
function scrollToTop() {
  const container = containerRef.value;
  const container2 = containerRef2.value;
  if (container) {
    container.scrollTop = 0;
  }
  if (container2) {
    container2.scrollTop = 0;
  }
}
watch([() => state.selectedPage, () => state.selectedTab], scrollToTop);
const handleTabChange = () => {
  currentPage.value = 1;
  state.selectedPage = 1;
};
const handlePageUpdate = (page) => {
  scrollToTop();
  currentPage.value = page;
};

let completedItems = 0;
const handleCompletedItem = () => {
  completedItems++;
  if (completedItems >= state.items.length) {
    lding.value = 0;
  }
};
const lding = ref(0);
const loadDetails = async () => {
  state.itemsByTime = [];
  state.tabs = [];
  state.items?.map(async (item, i) => {
    lding.value = 1;
    try {
      const res = await getSuggestionDetail({
        name: item.name,
        type: item.type,
        address: item.address,
      });
      const taskRes = await startTask(23);
      console.log('task done::', taskRes);
      await processDetail(res, item, i);
    } catch (error) {
      // Handle errors
    } finally {
      handleCompletedItem();
    }
  });
};

// const displayedItemsByTime = computed(() => {
//   const itemsPerPageByTime = 20;
//   console.log(state.itemsByTime);
//   if (state.itemsByTime) {
//     if (currentPage.value === 1) {
//       return state.itemsByTime.slice(0, itemsPerPageByTime);
//     } else {
//       const start =
//         itemsPerPageByTime + (currentPage.value - 1) * itemsPerPageByTime;
//       const end = start + itemsPerPageByTime;
//       return state.itemsByTime.slice(start, end);
//     }
//   } else {
//     return [];
//   }
// });
const getItemType = (type) => {
  if (
    type === 'daoProfile' ||
    type === 'collection' ||
    type === 'memberProfile' ||
    type === 'artistProfile'
  ) {
    return 1;
  } else if (type === 'social') {
    return 2;
  } else if (type === 'governance') {
    return 3;
  } else if (type === 'treasury') {
    return 4;
  } else if (type === 'artwork') {
    return 5;
  } else if (type === 'nfts') {
    return 6;
  } else if (type === 'transaction') {
    return 7;
  } else if (type === 'proposal') {
    return 8;
  } else {
    return null;
  }
};
const processDetail = async (res, item, i) => {
  const longestDetailLength = {};

  Object.keys(item).forEach((subItem, j) => {
    if (
      (typeof state.items[i][subItem] === 'object' &&
        state.nonTabKeys.indexOf(subItem) === -1) ||
      subItem === 'transaction' ||
      subItem === 'proposal'
    ) {
      if (subItem === 'nfts') {
        state.items[i][subItem].detail = res['nftList'];
      } else {
        state.items[i][subItem].detail = res[subItem + 'List'];
      }

      state.items[i][subItem].detail.map((a, x) => {
        if (subItem === 'social' || subItem === 'proposal')
          state.items[i][subItem].detail[x].createdAt =
            state.items[i][subItem].detail[x].createdAt * 1000;

        state.items[i][subItem].detail[x] = {
          ...a,
          dname: state.items[i][subItem].name,
          dlogo: state.items[i][subItem].logo,
          itemType: getItemType(subItem),
        };
      });
    }
    if (subItem !== 'type' && subItem !== 'address' && subItem !== 'length')
      if (state.items[i][subItem].detail) {
        const detailLength = state.items[i][subItem].detail.length;
        if (
          !longestDetailLength[subItem] ||
          detailLength > longestDetailLength[subItem]
        ) {
          longestDetailLength[subItem] = detailLength;
        }
      }
    if (subItem !== 'type' && subItem !== 'address')
      if (
        state.items[i][subItem].detail &&
        state.tabs.indexOf(subItem) === -1 &&
        state.nonTabKeys.indexOf(subItem) === -1
      ) {
        state.tabs.push(subItem);
      }
  });

  Object.keys(longestDetailLength).forEach((subItem) => {
    let longestLength = longestDetailLength[subItem];

    state.items.forEach((item) => {
      const itemDetail = item[subItem]?.detail;
      if (
        itemDetail &&
        Array.isArray(itemDetail) &&
        itemDetail.length > longestLength
      ) {
        longestLength = itemDetail.length;
      }
    });

    longestDetailLength[subItem] = longestLength;
  });
  state.itemsLength = longestDetailLength;
};

// const scrollToTop = () => {
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// };
const itemsPerPage = 5;
const currentPage = ref(1);
const displayedItems = computed(() => {
  if (state.items)
    if (currentPage.value - 1 === 0) {
      return state.items.slice(0, itemsPerPage);
    } else {
      const start = itemsPerPage + (currentPage.value - 2) * itemsPerPage;
      const end = start + itemsPerPage;
      return state.items.slice(start, end);
    }
  else {
    return [];
  }
});
onMounted(async () => {
  watch(
    () => [state.selectedTab, lding.value],
    () => {
      if (lding.value === 0) {
        state.itemsByTime = [];
        state.items?.forEach(async (item, i) => {
          Object.keys(item).forEach((subItem, j) => {
            if (state.selectedTab !== 'All') {
              if (
                state.selectedTab === subItem &&
                state.items[i][subItem]?.detail
              ) {
                state.itemsByTime = [
                  ...state.itemsByTime,
                  ...state.items[i][subItem].detail,
                  // .slice(
                  //   subItem === 'social' ? 2 : 5,
                  // ),
                ];
              }
            } else {
              if (state.items[i][subItem]?.detail) {
                if (subItem === 'social')
                  state.itemsByTime = [
                    ...state.itemsByTime,
                    ...state.items[i][subItem]?.detail.slice(2),
                  ];
                else {
                  state.itemsByTime = [
                    ...state.itemsByTime,
                    ...state.items[i][subItem]?.detail.slice(5),
                  ];
                }
                // state.itemsByTime = [
                //   ...state.itemsByTime,
                //   ...state.items[i][subItem]?.detail,
                // ];
              }
            }
          });
        });
        state.itemsByTime = state.itemsByTime.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        calculateTotalPages();
      }
    },
  );
  loadDetails();
});
</script>
<style>
.el-tabs__nav-wrap::after {
  height: 1px !important;
  background-color: #ffffff0d !important;
}
.el-tabs__item.is-active {
  color: #ffffffff !important;
}
.el-tabs__item {
  cursor: pointer;
  font-size: 16px !important;
  font-weight: bold !important;
  color: #ffffffb3 !important;
}
.el-tabs__item:hover {
  color: #ffffffff !important;
}
.el-tabs__active-bar {
  background-color: #ff5585ff !important;
  height: 4px !important;
}
.tabs > .el-tabs__content {
  display: none;
}
.el-pagination {
  margin-top: 24px;
  justify-content: center;
}
.el-pager li {
  font-weight: normal !important;
  border-radius: 4px !important;
  background-color: transparent !important;
  color: #ffffffb3 !important;
}
.el-pager li:hover {
  color: #ffffffff !important;
  background-color: #ffffff0d !important;
}
.el-pagination button {
  font-weight: normal !important;
  border-radius: 4px !important;
  background-color: transparent !important;
  color: #ffffffb3 !important;
}
.el-pagination button:hover {
  color: #ffffffff !important;
  background-color: #ffffff0d !important;
}
.el-pager li.is-active {
  color: #ffffffff !important;
  background-color: #ff5585ff !important;
}
</style>
