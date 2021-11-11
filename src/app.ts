import { Toast } from 'antd-mobile';
import appConfig, { DefaultConfig } from './appConfig';
import Logger from '@/utils/logger';

const logger = Logger.get('app');

const { enableVConsole }: DefaultConfig = appConfig;

if (enableVConsole) {
  logger.info('vConsole init success');
  // @ts-ignore
  new VConsole();
}

// export function onRouteChange({ location, matchedRoutes }) {
//   logger.info('onRouteChange', location, matchedRoutes);
// }
