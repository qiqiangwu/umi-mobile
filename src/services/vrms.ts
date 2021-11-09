import { Get } from '@/utils/request';

export interface GetMediasParams {
  /**
   * 栏目id
   */
  columnID: number;
  /**
   * 当前页
   */
  pageIndex: number;
  /**
   * 分页数量
   */
  pageSize: number;
}

/**
 * 获取媒体列表
 * @param param0
 * @returns
 */
export function getMedias({ columnID, pageIndex = 1, pageSize = 10 }: GetMediasParams) {
  const url = `/swatapps/ape/interface/memcache.php?url=${encodeURIComponent(
    `http://10.182.0.15:8080/VRMS/mediaInfo/getMedias?columnId=${columnID}&pageSize=${pageSize}&curPage=${pageIndex}`,
  )}&cache=true`;

  return Get(url);
}