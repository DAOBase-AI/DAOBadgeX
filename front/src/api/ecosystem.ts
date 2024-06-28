import { getSuccessResultAsync, passHttp } from '@/utils/req';

export const queryEcoSystemList = () =>
  getSuccessResultAsync(passHttp.get('/ecosystem/list'));

export const getEcosystem = async (ecoCode: string) =>
  getSuccessResultAsync(passHttp.get(`/ecosystem/stats/${ecoCode}`, {}));
