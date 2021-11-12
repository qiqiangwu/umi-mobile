import { AxiosRequestConfig } from 'axios';
import { Get } from '@/utils/request';

export interface GetAutoPageContentParams {
  /**
   * 栏目id
   */
  columnID: number;
  /**
   * 区域id
   */
  areaID?: string;
  /**
   * 终端类型
   */
  terminalIdentify?: 'PHONE' | 'JDH';
  config?: AxiosRequestConfig;
}

/**
 * 获取栏目列表
 * @param param0
 * @returns
 */
export function getAutoPageContent({
  columnID,
  areaID,
  terminalIdentify = 'PHONE',
  config,
}: GetAutoPageContentParams) {
  let url = `/ancms_server_interface/autoPageServlet/getAutoPageContent?columnId=${columnID}&terminalIdentify=${terminalIdentify}`;
  if (areaID != null) {
    url += `&areaId=${areaID}`;
  }
  return Get(url, {}, config);
}
