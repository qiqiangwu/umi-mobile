import { getStuById } from './edums';
import Logger from '@/utils/logger';
import { IUser } from '@/models/user';
import { formatResponse, IFormatResponse } from '@/utils/request';

const logger = Logger.get('services/user');

/**
 * 获取用户信息
 */
export async function fetchUser(id: number) {
  return getStuById({ id }).then((response: IFormatResponse<any>) => {
    if (!response.hasError) {
      const { data } = response;
      if (data && data.rows && typeof data.rows === 'object') {
        const {
          areaid: areaID,
          className,
          classid: classID,
          id: uid,
          ckstate: checkState,
        } = data.rows;
        if (uid) {
          return formatResponse<IUser>({
            ...response,
            data: {
              areaID,
              className,
              classID,
              id: uid,
              checkState,
            },
          });
        }
      }
    }
    return formatResponse({
      ...response,
      message: '获取用户信息失败',
    });
  });
}
