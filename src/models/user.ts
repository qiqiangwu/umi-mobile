import { Effect, Reducer, Subscription } from 'umi';
import { fetchUser } from '@/services/user';
import Logger from '@/utils/logger';

export interface IUser {
  areaID?: string;
  className?: string;
  classID?: string;
  id?: number;
  checkState?: number;
}

export interface IUserModelState {
  currentUser: IUser;
}

const logger = Logger.get('user model');

export interface IUserModel {
  namespace: 'user';
  state: IUserModelState;
  effects: {
    // 获取当前用户信息
    fetchCurrentUser: Effect;
  };
  reducers: {
    save: Reducer<IUserModelState>;
  };
}

const UserModel: IUserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCurrentUser({ payload }, { call, put }) {
      logger.debug('fetchCurrentUser payload:', payload);

      const response = yield call(fetchUser, payload.id);

      logger.debug('fetchCurrentUser response:', response);
      yield put({
        type: 'save',
        payload: {
          currentUser: response.data,
        },
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

export default UserModel;
