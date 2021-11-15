import { getStuById, boosCheckPhone } from './edums';
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
          phone,
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
              phone,
            },
          });
        }
      } else {
        return formatResponse({
          hasError: false,
          message: '获取用户信息失败',
        });
      }
    }
    return formatResponse({
      ...response,
      message: '获取用户信息失败',
    });
  });
}

/**
 * 检查是否订购产品
 * @param phone
 */
export async function checkBookProduct(phone: string) {
  return boosCheckPhone({ phone }).then((response: IFormatResponse<any>) => {
    if (!response.hasError) {
      let overday;
      try {
        const rows = JSON.parse(response?.data?.rows);
        overday = +rows?.overday;
      } catch (e) {
        logger.error(`接口数据反序列化失败: ${(e as Error).message}`);
        return formatResponse({
          ...response,
          message: '检查订购产品权限失败',
        });
      }

      if (overday > 0) {
        return formatResponse<boolean>({
          hasError: false,
          data: true,
        });
      } if (overday === 0) {
        return formatResponse<boolean>({
          hasError: true,
          message: '您的教育产品已到期！订购或详情咨询，请拨打全州统一客服电话96599',
        });
      }
        return formatResponse<boolean>({
          hasError: true,
          message: '未订购教育产品，订购或详情咨询，请拨打全州统一客服电话96599',
        });
    }

    return formatResponse({
      ...response,
      message: '检查订购产品权限失败',
    });
  });
}
