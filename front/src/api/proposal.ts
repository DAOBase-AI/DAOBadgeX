import { getSuccessResultAsync, passHttp } from '@/utils/req';

export const getWordGraph = (type: string, chain: string, days: string, filterSpam: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/proposal/TopTags', {
      params: {
        type,
        chain,
        days,
        filterSpam,
      },
    }),
  );
export const getProposalDistribution = (type: string, chain: string, filterSpam: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/proposals/distribution', {
      params: {
        type,
        chain,
        filterSpam,
      },
    }),
  );
export const getVoterDistribution = (type: string, chain: string, filterSpam: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/voter/distribution', {
      params: {
        type,
        chain,
        filterSpam,
      },
    }),
  );
export const getProposalOverview = (type: string, chain: string, filterSpam: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/proposals/overview', {
      params: {
        type,
        chain,
        filterSpam,
      },
    }),
  );
export const getPopularProposal = (type: string, chain: string, filterSpam: boolean) =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/proposal/active', {
      params: {
        type,
        chain,
        filterSpam,
      },
    }),
  );

export const getNewProposalTop100 = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/createdProposalRanking', {
      params,
    }),
  );

export const getAvgVotersProposalTop100 = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/votesRanking', {
      params,
    }),
  );

export const getProposalProposerPerMonth = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/proposerStatsMonthly', {
      params,
    }),
  );

export const getProposalDistributionOutcomes = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/resultDistribution', {
      params,
    }),
  );

export const getApprovalRate = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/approvalRate', {
      params,
    }),
  );

export const getStrategyStats = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/strategyStats', {
      params,
    }),
  );

export const getQuorumThresholdAvgPercent = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/quorumThresholdAvgPercent', {
      params,
    }),
  );

export const getUnmetQuorumProposalRatio = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/unmetQuorumProposalRatio', {
      params,
    }),
  );

export const getDelegationDaosAndProposals = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/delegationDaosAndProposals', {
      params,
    }),
  );

export const getVotingPeriodStats = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/votingPeriodStats', {
      params,
    }),
  );

export const getDaoProposalWithDelegation = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/daoProposalWithDelegation', {
      params,
    }),
  );

export const getDaoDelegationRate = (params: any): Promise<any> =>
  getSuccessResultAsync(
    passHttp.get('/governance/view/daoDelegationRate', {
      params,
    }),
  );
