import { Reducer, Effect } from 'umi';

export interface ICurrentArea {
  id: number;
  name: string;
}

export interface IAppModelState {
  appStatus: string;
  currentArea?: ICurrentArea;
}

export interface IAppModel {
  namespace: 'app';
  state: IAppModelState;
  effects: {};
  reducers: {
    save: Reducer<any>;
  };
}

const AppModel: IAppModel = {
  namespace: 'app',
  state: {
    appStatus: '',
  },
  effects: {},
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default AppModel;
