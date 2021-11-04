import { defineConfig } from 'umi';
import routes from './routes';
import plugins from './plugins';
import babelConfig from './babel.config';

/**
 * umi 公共配置
 */
export default defineConfig({
  plugins: plugins,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: routes,
  fastRefresh: {},
  hd: {
    px2rem: {
      rootValue: 50, // 开启hd后需要换算：rootValue=designWidth*100/750,此处设计稿为375，所以375*100/750=50
      propBlackList: [
        'border-top-width',
        'border-left-width',
        'border-right-width',
        'border-bottom-width',
      ], // 这些属性不需要转换
      selectorBlackList: ['no_hd'], // 以包含no_hd的class不需要转换
    },
  },
  antd: {
    mobile: false,
  },
  dva: {},
  extraBabelPlugins: babelConfig,
  define: {
    'process.env.UMI_ENV': process.env.UMI_ENV,
  },
  lessLoader: {
    modifyVars: {
      hack: 'true; @import "~@/styles/index.less";',
    },
  },
  cssLoader: {
    localsConvention: 'camelCase',
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
