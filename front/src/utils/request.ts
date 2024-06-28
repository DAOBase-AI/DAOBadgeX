import HttpRequest from '@/utils/axios';
import config from '@/config';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro;

export const eth = new HttpRequest(baseUrl.eth);
