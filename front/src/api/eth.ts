import { eth } from '@/utils/request';

export interface LoginDto {
  nonce: string;
  exp: string;
  sign: string;
}

export interface UserDto {
  id?: number;
  address?: string;
  nickname?: string;
  icon_url?: string;
  icon_hash?: string;
}

export interface CreatorDAO {
  owner?: string;
  name?: string;
  intro?: string;
  logo?: string;
  hash?: string;
  website?: string;
  whitepaper?: string;
  twitter?: string;
  erc20?: string;
  factory?: string;
  kind?: string;
  network?: string;
  rate?: string;
}

export const postSessions = (): Promise<any> => {
  return eth.request({
    url: '/sessions',
    method: 'post',
    data: {},
  });
};

export const login = (data: LoginDto): Promise<any> => {
  return eth.request({
    url: '/sessions/login',
    method: 'post',
    data,
  });
};

export const authorize = (token: string): Promise<any> => {
  return eth.request({
    url: '/sessions/authorize',
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: {},
  });
};

export const getUserProfile = (address: string): Promise<any> => {
  return eth.request({
    url: `/users/${address}`,
    method: 'get',
  });
};

export const putUser = (
  address: string,
  token: string,
  data: UserDto,
): Promise<any> => {
  return eth.request({
    url: `/users/${address}`,
    method: 'put',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const updateNickname = (
  name: string,
  token: string,
  address: string,
  data: LoginDto,
): Promise<any> => {
  return eth.request({
    url: `/users/${address}/nickname/${name}`,
    method: 'put',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const createDAO = (data: CreatorDAO, token: string): Promise<any> => {
  return eth.request({
    url: '/daos',
    method: 'post',
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const queryDAO = (
  where?: string,
  limit?: number,
  offset?: number,
): Promise<any> => {
  return eth.request({
    url: '/daos/',
    method: 'get',
    params: {
      limit,
      offset,
      where,
    },
  });
};

export const queryDAOById = (id: number): Promise<any> => {
  return eth.request({
    url: `/daos/${id}`,
    method: 'get',
  });
};

export const updateDAO = (
  id: number,
  token: string,
  data: CreatorDAO,
): Promise<any> => {
  return eth.request({
    url: `/daos/${id}`,
    method: 'put',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const getTransaction = (txHash: string): Promise<any> => {
  return eth.request({
    url: `/chain/txs/${txHash}`,
    method: 'get',
  });
};

export const getDAOTokensByOwner = (
  id: number,
  address: string,
  offset?: number,
  limit?: number,
): Promise<any> => {
  return eth.request({
    url: `/daos/${id}/tokens?owner=${address}&offset=${offset || 0}&limit=${
      limit || 10
    }`,
  });
};

export const getDAOTokens = (
  id: number,
  offset?: number,
  limit?: number,
): Promise<any> => {
  return eth.request({
    url: `/daos/${id}/tokens?offset=${offset || 0}&limit=${limit || 10}`,
  });
};

export const getDAOCount = (where: string): Promise<any> => {
  return eth.request({
    url: `/daos/count?where=${where}`,
  });
};

export const getPASSByDAO = (
  id: number,
  where?: string,
  offset?: number,
  limit?: number,
): Promise<any> => {
  return eth.request({
    url: `/daos/${id}/tokens`,
    params: {
      where,
      offset,
      limit,
    },
  });
};

export const getPassDAOClaimed = (id: number): Promise<any> => {
  return eth.request({
    url: `/daos/${id}/tokens/count`,
    method: 'GET',
  });
};

export const getTokensByOwner = (
  address: string,
  offset?: number,
  limit?: number,
): Promise<any> => {
  return eth.request({
    url: `/daos/tokens?owner=${address}&offset=${offset || 0}&limit=${
      limit || 10
    }`,
  });
};

export const getDAOJoined = (address: string): Promise<any> => {
  return eth.request({
    url: '/daos/tokens/count',
    params: {
      owner: address,
    },
  });
};
