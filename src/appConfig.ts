/**
 * 默认配置
 */
export interface DefaultConfig {
  appName: string;
  enableVConsole: boolean;
  axiosTimeout: number;
  axiosCookie: boolean;
  axiosBaseUrl: string;
  enableSentry: boolean;
  data: {
    home: {
      id: number;
    };
  };
}

const appConfig: DefaultConfig = {
  appName: 'umi-mobile', // 项目title
  enableVConsole: true, // 开启vconsole
  axiosTimeout: 10000,
  axiosCookie: false,
  axiosBaseUrl: '/api',
  enableSentry: false,
  data: {
    home: {
      // 栏目id
      id: 567,
    },
  },
};

export default appConfig;
