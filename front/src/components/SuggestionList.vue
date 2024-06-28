<template>
  <div class="flex">
    Popular
    <span class="ml-1 icon iconfont w-4 h-4 text-inputActive">&#xe68c;</span>
  </div>
  <div class="overflow-y-auto" style="max-height: 442px">
    <transition-group name="slide-up">
      <div
        v-for="(filler, i) in [1, 2, 3, 4, 5, 6]"
        :key="i"
        :style="{ 'animation-delay': `${i * 0.15}s` }"
      >
        <div v-if="loading">
          <Skeletor class="w-full mb-3 h-14 rounded-lg"></Skeletor>
        </div>
      </div>
      <div
        v-for="(suggestion, i) in state.suggestions"
        :key="i"
        :style="{
          'animation-delay': `${i * 0.15}s`,
        }"
      >
        <div v-if="!loading">
          <SearchItem
            :item="suggestion"
            @click.stop="$emits('lay', suggestion)"
          />
        </div></div
    ></transition-group>
  </div>
</template>
<script setup>
import { getSuggestionList } from '@/api/search';
import { useReqByBool } from '@/hooks';
import SearchItem from '@/components/SearchItem.vue';
import { onMounted, reactive } from 'vue';
import { Skeletor } from 'vue-skeletor';
const state = reactive({
  suggestions: [],
});
const $emits = defineEmits(['lay']);
const { loadData, loading } = useReqByBool(async () => {
  const response = await getSuggestionList();

  state.suggestions = response;

  state.suggestions.forEach((suggestion, i) => {
    if (suggestion.twitter)
      state.suggestions[i].twitter = suggestion.twitter.replace(
        'https://twitter.com/',
        '',
      );
    if (suggestion.info) {
      state.suggestions[i].info = JSON.parse(state.suggestions[i].info);
    }
  });
});
onMounted(() => {
  loadData();
});
</script>
<style></style>
