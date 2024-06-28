import { computed, ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useRoute } from 'vue-router';
export * from './user';
export * from './dashboard';

/* 
    - lists
    - next
    - rows
    - pages
    - total
 */

export const useReqPages = (req: any) => {
  const loading = ref(0);
  const isEnd = ref(false);
  const isEmpty = ref(false);
  const current = ref(0);
  const next: any = ref(1);
  const rows = ref(-1);
  const total = ref(-1);
  const pages = ref(-1);
  const results: any = ref([]);

  const loadNext = async (cancel = false) => {
    if (isEnd.value || (!cancel && loading.value)) {
      return;
    }
    current.value = next.value;
    loading.value++;
    let result = null;
    try {
      result = await req(current.value, cancel);
    } catch (error) {
      /*  */
      console.log("useReqPages loadNext error::", error);
    }

    if (!result) {
      loading.value--;
      return;
    }

    next.value = current.value + 1;
    rows.value = result.rows;
    total.value = result.total;
    pages.value = result.pages;

    if (current.value === 1) {
      results.value = result.lists;
    } else {
      // console.log(results.value, result.lists);
      results.value = [
        ...JSON.parse(JSON.stringify(results.value)),
        ...result.lists,
      ];
    }

    if (results.value.length == 0) {
      isEmpty.value = true;
    }

    if (next.value > pages.value) {
      next.value = null;
      isEnd.value = true;
    }
    loading.value--;
  };

  const loadRestConf = () => {
    current.value = 0;
    next.value = 1;
    isEnd.value = false;
    results.value = [];
    isEmpty.value = false;
  };

  const loadRest = async (cancel = false) => {
    loadRestConf();
    await loadNext(cancel);
  };

  return {
    isEnd,
    isEmpty,
    loading,
    current,
    next,
    rows,
    total,
    results,
    loadNext,
    loadRest,
    loadRestConf,
  };
};

export const useReq = (req: any) => {
  const loading = ref(0);

  const loadData = async () => {
    loading.value++;
    try {
      const res = await req();
      loading.value--;
      return res;
    } catch (error) {
      loading.value--;
    }
  };

  return {
    loading,
    loadData,
  };
};

export const useReqByBool = (req: any) => {
  const flag = ref(0);
  const loading = ref(true);

  const loadData = async (...args: any) => {
    flag.value++;
    loading.value = flag.value > 0;
    try {
      const res = await req(...args);
      flag.value--;
      loading.value = flag.value > 0;
      return res;
    } catch (error) {
      console.error("useReqByBool loadData error::", error);
      flag.value--;
    }
    loading.value = flag.value > 0;
  };

  return {
    loading,
    loadData,
  };
};

export const useDesktop = (size = 'md') => {
  if (size === 'md') {
    const isMediumScreen = useMediaQuery('(min-width: 768px)');
    return isMediumScreen;
  }
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  return isLargeScreen;
};

export const checkScreenSize = (size = 'lg') => {
  if (size === 'md') useMediaQuery('(min-width: 768px)');
  return useMediaQuery('(min-width: 1024px)');
};
export const isMdScreen = () => {
  return useMediaQuery('(min-width: 768px)');
};
export const useIsNft = () => {
  const $route = useRoute();
  return computed(
    () => /\/nft$/.test($route.path) || /\/nft\//.test($route.path),
  );
};
