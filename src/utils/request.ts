import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getCookie, setCookie } from '@/utils/cookie';
import appConfig, { DefaultConfig } from '../appConfig';
import Logger from './logger';

export interface IFormatResponse<P> {
  data?: P;
  message?: string;
  hasError: boolean;
}

const logger = Logger.get('utils/request');

const { axiosBaseUrl, axiosCookie, axiosTimeout }: DefaultConfig = appConfig;

function errorReport(
  url: string,
  error: string | Error,
  requestOptions: AxiosRequestConfig,
  response?: AnyObject,
) {
  /* if (window.$sentry) {
    const errorInfo: ServerApiErrorInfo = {
      error: typeof error === 'string' ? new Error(error) : error,
      type: 'request',
      requestUrl: url,
      requestOptions: JSON.stringify(requestOptions),
    };

    if (response) {
      errorInfo.response = JSON.stringify(response);
    }

    window.$sentry.log(errorInfo);
  } */
}

Axios.defaults.timeout = axiosTimeout;
Axios.defaults.baseURL = axiosBaseUrl;
Axios.defaults.withCredentials = axiosCookie;

function requestSuccess(config: any) {
  const cookie = getCookie();
  const defaultHeader: any = {
    version: '123',
  };
  if (cookie) {
    defaultHeader.Token = cookie;
  }
  // eslint-disable-next-line no-param-reassign
  config.headers = { ...defaultHeader, ...config.headers };
  return config;
}

function requestFail(error: any) {
  return Promise.reject(error);
}

function responseSuccess(response: AxiosResponse) {
  const { data } = response;
  return formatResponse<any>({
    hasError: false,
    data,
  });
}

function responseFail(error: AxiosError) {
  const { baseURL, url } = error.config;
  const { name, message } = error;

  logger.error(`接口${baseURL}${url}报错: ${name} ${message}`);

  return Promise.reject(
    formatResponse({
      hasError: true,
      message: `${name} ${message}`,
    }),
  );
}

// 添加拦截器
Axios.interceptors.request.use(requestSuccess, requestFail);
Axios.interceptors.response.use(responseSuccess, responseFail);

/**
 *
 * @param config
 */
export const request = (config: AxiosRequestConfig) =>
  Axios(config)
    .then(response => response)
    .catch(error => error);

export const Get = (url: string, params?: object, config?: AxiosRequestConfig) =>
  request(
    Object.assign({}, config, {
      url,
      params: { ...params },
      method: 'get',
    }),
  );

export const Post = (url: string, data?: object, config?: AxiosRequestConfig) =>
  request(
    Object.assign({}, config, {
      url,
      data,
      method: 'post',
    }),
  );

export const Put = (url: string, data?: object, config?: AxiosRequestConfig) =>
  request(
    Object.assign({}, config, {
      url,
      data,
      method: 'put',
    }),
  );

export const Delete = (url: string, data?: object, config?: AxiosRequestConfig) =>
  request(
    Object.assign({}, config, {
      url,
      data,
      method: 'delete',
    }),
  );

export function formatResponse<P>({
  hasError,
  data,
  message,
}: IFormatResponse<P>): IFormatResponse<P> {
  const response = { hasError };
  if (data != null) {
    Object.assign(response, { data });
  }
  if (message) {
    Object.assign(response, { message });
  }

  return response;
}
