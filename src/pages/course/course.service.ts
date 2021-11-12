import { AxiosRequestConfig } from 'axios';
import { getAutoPageContent } from '@/services/aums';
import { formatResponse, IFormatResponse } from '@/utils/request';
import { ICourseCatalog } from './models/CourseList';
import Logger from '@/utils/logger';
import { getMedias, GetMediasParams } from '@/services/vrms';

const logger = Logger.get('home service');

export function fetchCourseCatalog(columnID: number, areaID: string, config?: AxiosRequestConfig) {
  return getAutoPageContent({ columnID, areaID, terminalIdentify: 'JDH', config }).then(
    (response: IFormatResponse<any>) => {
      if (!response.hasError) {
        const data = response?.data?.data;
        if (Array.isArray(data)) {
          const catalogList: ICourseCatalog[] = data.map(item => ({
            name: item.name,
            id: item.id,
            columnID: item.columnId,
            extra: item.jumpAddr,
          }));

          return formatResponse({
            hasError: false,
            data: catalogList,
          });
        }
      }

      return formatResponse({
        ...response,
        message: '获取课程目录失败',
      });
    },
  );
}

export interface IMedia {
  id: number;
  name: string;
}

export function fetchCourseList({
  columnID,
  pageSize = 10,
  pageIndex = 1,
  config,
}: GetMediasParams) {
  return getMedias({ columnID, pageSize, pageIndex, config }).then(
    (response: IFormatResponse<any>) => {
      if (!response.hasError) {
        const data = response?.data?.data;
        const total = response?.data?.mediaCount;
        if (Array.isArray(data)) {
          const mediaList: IMedia[] = data.map(item => ({
            name: item.mediaName,
            id: item.id,
          }));

          return formatResponse({
            hasError: false,
            data: {
              list: mediaList,
              pageCount: Math.ceil(parseInt(total, 10) / pageSize),
            },
          });
        }
      }

      return formatResponse({
        ...response,
        message: '获取课程列表失败',
      });
    },
  );
}
