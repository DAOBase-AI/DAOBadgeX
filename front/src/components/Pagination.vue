<template>
  <div class="pagination flex justify-center gap-1 cursor-pointer mt-2">
    <span
      class="icon iconfont pagination-arrow w-8 h-8 flex items-center justify-center hover:bg-white-005 rounded"
      @click.stop="previousPage"
      >&#xe60d;</span
    >
    <span
      v-for="pageNumber in displayedPages"
      :key="pageNumber"
      :class="[
        'pagination-page flex items-center justify-center w-8 h-8',
        {
          'hover:bg-white-005 rounded': pageNumber !== currentPage,
          'text-whitebase rounded bg-inputActive': pageNumber === currentPage,
        },
      ]"
      @click.stop="updatePagination(pageNumber)"
    >
      {{ pageNumber }}
    </span>
    <span
      v-if="hasRightEllipsis"
      class="pagination-ellipsis w-8 h-8 flex items-center justify-center"
      >...</span
    >
    <span
      v-if="currentPage < totalPages - 3"
      class="pagination-page w-8 h-8 flex items-center justify-center"
      :class="{
        'hover:bg-white-005 rounded': pageNumber !== currentPage,
        'text-whitebase rounded-lg bg-inputActive': totalPages === currentPage,
      }"
      @click.stop="updatePagination(totalPages)"
    >
      {{ totalPages }}
    </span>
    <span
      class="icon iconfont pagination-arrow w-8 h-8 flex items-center justify-center hover:bg-white-005 rounded"
      @click.stop="nextPage"
      >&#xe60e;</span
    >
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({ totalPages: Number });
const currentPage = ref(1);

const $emits = defineEmits(['updatePage']);
const displayedPages = computed(() => {
  let startPage = Math.max(1, currentPage.value - 3);
  let endPage = Math.min(props.totalPages, currentPage.value + 3);

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );
});

const hasLeftEllipsis = computed(() => currentPage.value > 4);
const hasRightEllipsis = computed(
  () => currentPage.value < props.totalPages - 3,
);

function updatePagination(newPage) {
  currentPage.value = newPage;
  $emits('updatePage', newPage - 1);
}

function previousPage() {
  if (currentPage.value > 1) {
    updatePagination(currentPage.value - 1);
  }
}

function nextPage() {
  if (currentPage.value < props.totalPages) {
    updatePagination(currentPage.value + 1);
  }
}
</script>

<style>
/* Add your custom styles here */
.pagination {
  /* Your styles for the pagination container */
}

.pagination-arrow {
  /* Your styles for the pagination arrow */
}

.pagination-page {
  /* Your styles for the pagination page */
  margin-right: 4px; /* Add spacing between numbers */
}

.pagination-ellipsis {
  /* Your styles for the pagination ellipsis */
  margin-right: 4px; /* Add spacing between ellipsis and numbers */
}

.active {
  /* Your styles for the active page */
  color: white;
}
</style>
