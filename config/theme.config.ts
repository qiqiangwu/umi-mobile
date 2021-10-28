/**
 * 主题定制
 */

import appConfig, { DefaultConfig } from '../src/appConfig';

const { appPrimary }: DefaultConfig = appConfig;
export default {
  '@brand-primary': appPrimary,
};