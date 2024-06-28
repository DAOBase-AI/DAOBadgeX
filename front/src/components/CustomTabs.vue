<script setup>
import { useSlots, ref, provide, inject } from 'vue';
import Search from '@/components/LeaderBoard/Search.vue';
import UiDropdown from '@/components/UiDropdown.vue';
import { typeLables } from '@/constants/leaderboard';
const props = defineProps({
  isSearch: { type: Boolean, default: false },
  startingIndex: { type: Number, default: 0 },
  handleClick: {
    type: Function,
    default() {
      return;
    },
  },
});
const slots = useSlots();

const tabTitles = ref(slots.default().map((tab) => tab?.props?.title));
const selectedTitle = ref(tabTitles.value[props.startingIndex]);
provide('selectedTitle', selectedTitle);
const filterState = inject('filterState');
</script>

<template>
  <div class="tabs">
    <ul
      class="tabs__header flex items-center"
      :class="{
        'flex-row': selectedTitle === 'Asset' || selectedTitle === 'Activity',
        'flex-col md:flex-row':
          selectedTitle !== 'Asset' && selectedTitle !== 'Activity',
      }"
    >
      <li
        v-for="(title, i) in tabTitles"
        :key="title"
        class=""
        :class="{
          'tabs__item xs:text-sm md:text-xl font-bold': !isSearch,
          'tabs__item_search text-base': isSearch,
          selected: selectedTitle === title,
        }"
        @click="
          () => {
            selectedTitle = title;
            handleClick(i);
          }
        "
      >
        {{ title }}
      </li>

      <div
        v-if="selectedTitle === 'DAOs'"
        class="flex justify-between space-y-4 md:space-y-0 items-center flex-1 min-w-0 flex-col md:flex-row w-full py-1"
      >
        <Search
          class="w-full ml-2 md:ml-8 mr-8 md:mr-16"
          v-model="filterState.keyword"
        ></Search>

        <UiDropdown
          widthClass="w-40"
          v-model="filterState.type"
          :options="typeLables"
        ></UiDropdown>
      </div>
    </ul>

    <div v-if="selectedTitle === 'Asset'">
      <slot name="header"></slot>
    </div>

    <slot />
  </div>
</template>

<style>
.tabs {
  max-width: 100%;
  margin: 0 auto;
}
.tabs__header {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid theme('colors.white-010');

  display: flex;
}
.tabs__item_search {
  padding: 5px 0;
  margin-right: 32px;
  padding-bottom: 3px;
  transition: 0.4s all ease-out;
  cursor: pointer;
  user-select: none;
}
.tabs__item_search.selected {
  border-bottom: 1px solid theme('colors.inputActive');
}
.tabs__item {
  padding: 5px 0;
  margin-right: 35px;
  padding-bottom: 14px;
  transition: 0.4s all ease-out;
  cursor: pointer;
  user-select: none;
}
.tabs__item.selected {
  border-bottom: 1px solid theme('colors.inputActive');
}
.tabs__content {
  min-height: 300px;

  /* background-color: theme('colors.background'); */
}
</style>
