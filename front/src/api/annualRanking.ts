import { getSuccessResult, getSuccessResultAsync, passHttp } from '@/utils/req';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getTopDaosByTreasury = async () =>
  getSuccessResultAsync(passHttp.get('/annual/topTreasuryDao'));

export const getTopDaosByGovernance = async () =>
  getSuccessResultAsync(passHttp.get('/annual/topGovernanceDao'));

export const getTopDaosByInfrastructure = async () =>
  getSuccessResultAsync(passHttp.get('/annual/topInfra'));

export const getTopDaosByTopPerson = async () =>
  getSuccessResultAsync(passHttp.get('/annual/topPerson'));

export const getTopDaosByFrontier = async () =>
  getSuccessResultAsync(passHttp.get('/annual/topNewFrontierDao'));
