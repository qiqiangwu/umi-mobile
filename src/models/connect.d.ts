import { IAppModelState } from '@/.umi/plugin-dva/connect';
import { IUserModelState } from '@/models/user';

export interface ConnectState {
  loading: Loading;
  user?: IUserModelState;
  app?: IAppModelState;
}

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    app?: boolean;
    user?: boolean;
  };
}

export interface BaseRoute {
  authority?: string[] | string;
  children?: BaseRoute[];
  icon?: string;
  name?: string;
  path: string;
  isMenu?: boolean;
  [key: string]: any;
}

export interface Route extends BaseRoute {
  routes?: Route[];
}
