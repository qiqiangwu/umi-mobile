/*
 * 代理配置
 */

const { UMI_ENV = 'dev' } = process.env;

/**
 * 接口前缀 用于代理
 */
const ProConfig = {
  mock: 'http://www.bndtn.com:8564',
  dev: 'http://www.bndtn.com:8564',
  test: 'http://www.bndtn.com:8564',
  pro: 'http://www.bndtn.com:8564',
};

export default {
  '/api/ancms_server_interface': {
    target: 'http://www.bndtn.com:8180',
    changeOrigin: true,
    pathRewrite: { '^/api/ancms_server_interface': 'ancms_server_interface' },
  },
  '/api/swatapps': {
    target: 'http://www.bndtn.com',
    changeOrigin: true,
    pathRewrite: { '^/api/swatapps': 'swatapps' },
  },
  '/api': {
    target: ProConfig[UMI_ENV],
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
};
