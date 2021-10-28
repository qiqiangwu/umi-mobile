import { defineConfig } from 'umi';
import routes from './routes';

/**
 * umi 公共配置
 */
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: routes,
  fastRefresh: {},
  antd: {
    mobile: false,
  },
  define: {
    'process.env.UMI_ENV': process.env.UMI_ENV,
  },
  chunks: ['vendors', 'umi'],
  chainWebpack(config) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendors: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
  },
});
