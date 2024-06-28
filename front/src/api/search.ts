import { getSuccessResultAsync, passHttp } from '@/utils/req';

export const getSuggestionList = async (keyword = null) => {
  const res = await passHttp.get('/search/suggestionList', {
    params: {
      keyword,
    },
  });

  if (res.data) {
    return res.data;
  } else {
    return null;
  }
};
export const getSuggestionSummary = async ({
  name,
  type,
  address,
}: {
  name: string;
  type: string;
  address: string;
}) => {
  const res = await passHttp.get('/search/summary', {
    params: {
      name,
      type,
      address,
    },
  });

  if (res.data) {
    return res.data;
  } else {
    return null;
  }
};
export const getSuggestionDetail = async ({
  name,
  type,
  address,
}: {
  name: string;
  type: string;
  address: string;
}) => {
  const res = await passHttp.get('/search/detailList', {
    params: {
      name,
      type,
      address,
    },
  });

  if (res.data) {
    return res.data;
  } else {
    return null;
  }
};
