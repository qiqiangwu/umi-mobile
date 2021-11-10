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
  // 是否获取栏目数据
  init?: boolean;
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
      const { id, areaID, resolve, reject } = payload;
      const response = yield call(fetchColumnList, id, areaID);
      if (!response.hasError) {
        yield put({
          type: 'save',
          payload: response.data
            ? {
                ...response.data,
                init: true,
              }
            : {},
        });
      }

      if (resolve) {
        resolve(response);
      }
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
