import axios from 'axios';
import config from '@/config';

export interface SMMSResponse {
  data: TokenData | UploadData[];
  success: boolean;
  code: string;
  RequestId: string;
  message: string;
}

export interface TokenData {
  token: string;
}

export interface UploadData {
  file_id: number;
  width: number;
  height: number;
  filename: string;
  storename: string;
  size: number;
  path: string;
  hash: string;
  created_at: number;
  url: string;
  delete: string;
  page: string;
}

export const getToken = async (): Promise<any> => {
  return (
    await axios.post(
      `${config.imgBed.baseUrl}${config.imgBed.tokenPath}?username=${config.imgBed.user.name}&password=${config.imgBed.user.password}`,
    )
  ).data;
};
