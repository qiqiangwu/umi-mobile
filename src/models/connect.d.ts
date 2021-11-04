export interface ConnectState {
  loading: Loading;
}

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    app?: boolean;
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
