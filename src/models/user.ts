import { Effect, Reducer, Subscription } from 'umi';
import { fetchUser, checkBookProduct } from '@/services/user';
import Logger from '@/utils/logger';

export interface IUser {
  areaID?: string;
  className?: string;
  classID?: string;
  id?: number;
  checkState?: number;
  phone?: string;
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
    // 验证用户是否登录
    checkLogin: Effect;
    // 检查是否订购产品
    checkBookProduct: Effect;
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
      if (!response.hasError) {
        yield put({
          type: 'save',
          payload: {
            currentUser: response.data,
          },
        });
      }
    },
    /**
     * 验证用户是否登录
     * @param payload {resolve}
     * @param param1
     */
    *checkLogin({ payload }, { select }) {
      const { resolve = () => {} } = payload;
      const currentUser = yield select(({ user }) => user.currentUser);
      if (currentUser) {
        resolve(true);
      } else {
        resolve(false);
      }
    },
    /**
     * 检查用户是否订购产品
     * @param payload {phone, resolve}
     * @param param1
     */
    *checkBookProduct({ payload }, { call }) {
      const { phone, resolve = () => {} } = payload;
      const result = yield call(checkBookProduct, phone);

      resolve(result);
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
