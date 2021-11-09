import { Effect, Reducer } from 'umi';
import { fetchColumnList } from '../home.service';

/**
 * 头部滚动图片
 */
export interface ISlide {
  id: number;
  image: string;
}

/**
 * 栏目
 */
export interface IColumn {
  name: string;
  image: string;
  id: number;
}

export interface IHomeState {
  slides?: ISlide[];
  columns?: IColumn[];
}

export interface IHomeModel {
  namespace: 'home';
  state: IHomeState;
  effects: {
    fetchColumnList: Effect;
  };
  reducers: {
    save: Reducer<IHomeState>;
  };
}

const HomeModel = {
  namespace: 'home',
  state: {},
  effects: {
    *fetchColumnList({ payload }, { put, call }) {
      const response = yield call(fetchColumnList, payload.id, payload.areaID);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default HomeModel;
