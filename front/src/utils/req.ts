import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import store from '@/store';
import { checkWalletFlow } from '@/libs/check';
import { mittWalletSelect } from '@/libs/event';
import { notify } from '@kyvg/vue3-notification';
import mitt from '@/libs/event';
class HttpRequest {
  baseUrl: string;
  queue: any;
  queueCancel: any;
  axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.queue = {};
    this.queueCancel = {};
    this.axios = axios.create();
    this.setupAxios();
  }

  getInsideConfig(): AxiosRequestConfig {
    const $store = store as any;
    const config = {
      headers: {
        Authorization: $store.state.wallet.token || '',
        visitorToken: $store.state.user.visitorToken || '',
      },
    };
    return config;
  }

  setupAxios(): void {
    this.axios.interceptors.request.use(
      (config: any) => {
        if (!Object.keys(this.queue).length) {
        }
        this.queue[config.url] = true;
        return config;
      },
      (error: Error) => Promise.reject(error),
    );

    this.axios.interceptors.response.use(
      (res: any) => {
        this.destroy(res.config.url);
        const { data } = res;
        if (typeof data === 'object') {
          if (data.result) {
            return data.result;
          }
        }
        return data;
      },
      (error: any) => {
        let errorInfo = error.response;

        if (error.response.status != 401) {
          if (!errorInfo) {
            const {
              request: { statusText, status },
              config,
            } = JSON.parse(JSON.stringify(error));
            errorInfo = {
              statusText,
              status,
              request: { responseURL: config.url },
            };
          }
          return Promise.reject(error);
        } else {
          store.dispatch('logOut', true);
          mittWalletSelect();
        }
      },
    );
  }

  destroy(url: string): void {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  request(options: AxiosRequestConfig, cancel = false): any {
    if (!options.url) {
      throw new Error('Invalid url.');
    }

    let cancelToken;
    if (cancel) {
      if (this.queueCancel[options.url]) {
        this.queueCancel[options.url].cancel('The request canceled.');
        this.queueCancel[options.url] = undefined;
      }

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      this.queueCancel[options.url] = source;
      cancelToken = source.token;
    }

    options = {
      baseURL: this.baseUrl,
      ...options,
      cancelToken,
      ...this.getInsideConfig(),
      headers: { ...this.getInsideConfig().headers, ...options.headers },
    };

    return this.axios(options).catch(() => {
      this.destroy(options.url || '');
    });
  }

  get(url: string, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: 'get' }, cancel);
  }

  post(url: string, data: any = {}, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: 'post', data }, cancel);
  }

  delete(url: string, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: 'delete' }, cancel);
  }

  put(url: string, data: any = {}, config = {}, cancel?: boolean): any {
    return this.request({ ...config, url, method: 'put', data }, cancel);
  }
}

export default HttpRequest;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const passHttp = new HttpRequest(process.env.VUE_APP_API_URL);
// export const passHttp = new HttpRequest('https://test.thepass.to/bhousedao');
export const getSuccessResult = (data: any) => {
  if (data.code == '600') {
    notify({
      type: 'error',
      text: 'Login authentication failed, please Login again.',
    });
    mitt.emit('wallet-select');
  } else if (data && data.success) {
    return data.data;
  } else {
    throw new Error(data ? data.msg : 'Req Error');
  }
};

export const getSuccessResultAsync = async (promise: any): Promise<any> => {
  const res = await promise;
  return getSuccessResult(res);
};
