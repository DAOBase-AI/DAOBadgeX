import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class HttpRequest {
  baseUrl: string;
  queue: any;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }

  getInsideConfig(): AxiosRequestConfig {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Authorization: '',
      },
    };
    return config;
  }

  destroy(url: string): void {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors(instance: AxiosInstance, url: string): any {
    instance.interceptors.request.use(
      (config: any) => {
        if (!Object.keys(this.queue).length) {
          // Spin.show() 
        }
        this.queue[url] = true;
        return config;
      },
      (error: Error) => {
        return Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      (res: any) => {
        this.destroy(url);
        const { data } = res;
        if (typeof data === 'object') {
          if (data.result) {
            return data.result;
          }
        }
        return data;
      },
      (error: any) => {
        this.destroy(url);
        let errorInfo = error.response;
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
          console.log(errorInfo);
        }
        return Promise.reject(error);
      },
    );
  }

  request(options: AxiosRequestConfig): any {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url || '');
    return instance(options);
  }
}

export default HttpRequest;
