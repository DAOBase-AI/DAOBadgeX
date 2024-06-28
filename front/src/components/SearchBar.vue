<template>
  <div
    class="text-whitebase text-xs w-full h-14 md:bg-white-005 rounded-lg"
    ref="target"
  >
    <div
      class="flex h-full items-center rounded relative bg-transparent md:bg-white-005 px-4 py-4"
    >
      <i
        class="iconfont icon-sousuo1 flex items-center justify-center text-xl"
      ></i>

      <input
        ref="inputRef"
        class="w-full bg-transparent border-0 text-base"
        v-model="state.word"
        :placeholder="state.focus ? '' : placeholder"
        type="text"
        @focus="state.focus = true"
      />
      <div
        v-if="state.word"
        class="w-6 h-6 flex justify-center items-center rounded-full absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        style="background: #ffffff1a"
        @click.stop="state.word = ''"
      >
        <i class="iconfont icon-guanbi text-base"></i>
      </div>

      <div
        class="absolute -bottom-4 left-0 transform translate-y-full px-2 py-4 w-full rounded-lg font-normal text-left z-40"
        style="background: #2a2e33ff"
        v-if="
          state.focus && (state.word !== '' || state.searchResults.length > 0)
        "
      >
        <div v-if="loading && state.word != ''">
          <div v-for="(filler, i) in [1, 2, 3, 4, 5, 6]" :key="i">
            <Skeletor class="w-full mb-3 h-14 rounded-lg"></Skeletor>
          </div>
        </div>
        <UiScrollBars
          v-else-if="state.result.length > 0"
          class="w-full"
          style="max-height: 423px"
        >
          <div
            v-for="(item, i) in state.result"
            :key="i"
            @click.stop="onSelect(item)"
          >
            <div
              v-if="state.typeIndexes.indexOf(i) !== -1 && item.type !== null"
              class="px-2 text-base text-white-070"
              :class="{ 'mt-4': i !== 0 }"
            >
              {{ item.type }}
            </div>
            <SearchItem :item="item" :isSearchBar="true" />
          </div>
        </UiScrollBars>
        <div
          v-else-if="state.searchResults.length > 0 && state.word === ''"
          class="px-2"
        >
          <div class="text-base font-bold text-white-070 px-2">History</div>

          <div
            class="font-bold rounded-lg hover:bg-white-005 cursor-pointer px-2"
            v-for="(searched, i) in state.searchResults"
            :key="i"
            @click.stop="onSelect(searched)"
            style="padding-top: 17px; padding-bottom: 17px"
          >
            {{ searched.name }}
          </div>
          <div
            class="pt-4 flex justify-center items-center border-t border-white-005 font-bold cursor-pointer"
            @click.stop="clearHistory"
          >
            Clear All
          </div>
        </div>
        <div v-else><div v-if="state.word !== ''">No items found</div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineProps,
  nextTick,
  reactive,
  ref,
  watch,
  defineEmits,
  onMounted,
  computed,
  onUnmounted,
  onBeforeUnmount,
} from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useDesktop, useReq, useReqByBool } from '@/hooks';
import { Skeletor } from 'vue-skeletor';
import Spin from '@/components/Spin.vue';
// import ChainCell from './ChainCell.vue';
import UiScrollBars from '@/components/UiScrollbars.vue';
import { formatAddress } from '@/utils';
import SearchItem from './SearchItem.vue';
import { getSuggestionList, getSuggestionSummary } from '@/api/search';
const isDesktop = useDesktop();
const target = ref(null);
const inputRef = ref(null);

const $emits = defineEmits([
  'lay',
  'textUpdate',
  'clearHistory',
  'focusChange',
]);
const clearHistory = () => {
  localStorage.removeItem(SEARCH_RESULTS_KEY);
  state.searchResults = [];
  $emits('clearHistory', null);
};
const props = defineProps({
  placeholder: String,
  onSearch: Function,

  alignRight: Boolean,
  result: Array,
  selectedItem: Object,
});
const SEARCH_RESULTS_KEY = 'searchResults';

const state = reactive({
  searchResults: [],
  word: '',
  status: false,
  focus: false,
  result: [],
  selectItem: null,
  typeIndexes: [],
});

const debounce = (fn, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
watch(
  () => props.selectedItem,
  () => {
    if (props.selectedItem) state.word = props.selectedItem.name;
  },
);
watch(
  () => state.focus,
  () => {
    $emits('focusChange', state.focus);
    const storedResults = localStorage.getItem(SEARCH_RESULTS_KEY);
    if (storedResults) {
      state.searchResults = JSON.parse(storedResults);
    } else {
      state.searchResults = [];
    }
  },
);
watch(
  () => state.word,
  debounce(async (val) => {
    if (val !== '') {
      localStorage.setItem('CURRENT_SEARCH', state.word);

      await loadData();
    } else {
      localStorage.setItem('CURRENT_SEARCH', state.word);

      state.result = [];
      $emits('lay', null);
    }
  }, 1000),
);

const onSelect = (item) => {
  state.focus = false;
  state.selectItem = item;

  state.word = state.selectItem.name;
  $emits('lay', state.selectItem);
};

onClickOutside(target, () => {
  if (!state.word) state.status = false;
  state.focus = false;
});

const onFocus = () => {
  state.status = true;
  state.focus = true;

  nextTick(() => {
    inputRef.value.focus();
  });
};
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleEnterPress();
  }
};
const handleEnterPress = () => {
  console.log(state.result);
  if (state.result.length > 0) onSelect(state.result[0]);
};
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress);
  const storedResults = localStorage.getItem(SEARCH_RESULTS_KEY);
  const currentSearch = localStorage.getItem('CURRENT_SEARCH');
  if (storedResults) {
    state.searchResults = JSON.parse(storedResults);
  }
  if (currentSearch) state.word = currentSearch;
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress);
});
const { loadData, loading } = useReqByBool(async () => {
  const response = await getSuggestionList(state.word);
  const hasFuzzySearch = await getSuggestionSummary({ name: state.word });

  response.forEach((suggestion, i) => {
    if (suggestion.twitter)
      response[i].twitter = suggestion.twitter.replace(
        'https://twitter.com/',
        '',
      );
    if (suggestion.info) {
      response[i].info = JSON.parse(response[i].info);
    }
  });
  if (hasFuzzySearch)
    if (hasFuzzySearch.length > 0) response.unshift({ name: state.word });
  const distinctTypes = response
    .map((item) => item.type)
    .filter((type, index, currentVal) => currentVal.indexOf(type) === index);
  state.typeIndexes = distinctTypes.map((type) => {
    return response.findIndex((e) => e.type === type);
  });
  console.log(distinctTypes, state.typeIndexes);
  if (state.word !== '') {
    state.result = response;
  }
});
</script>

<style scoped>
.item-hover:hover {
  background: #ffffff0d;
}
</style>
