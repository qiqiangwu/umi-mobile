import { getAutoPageContent } from '@/services/aums';
import { formatResponse, IFormatResponse } from '@/utils/request';
import { IColumn, ISlide } from './models/home';
import Logger from '@/utils/logger';

const logger = Logger.get('home service');

export function fetchColumnList(columnID: number, areaID: string) {
  return getAutoPageContent({ columnID, areaID }).then((response: IFormatResponse<any>) => {
    if (!response.hasError) {
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        const columns: IColumn[] = data
          .filter(item => item.displayType === 'image' && item.actionType === 'column')
          .map(item => ({
            name: item.name,
            image: item.displayContent,
            id: item.columnId,
          }));

        const slides: ISlide[] = data
          .filter(item => item.displayType === 'topAdvert')
          .map(item => ({
            image: item.displayContent,
            id: item.id,
          }));

        return formatResponse({
          hasError: false,
          data: {
            slides,
            columns,
          },
        });
      }
    }

    return formatResponse({
      ...response,
      message: '获取首页栏目失败',
    });
  });
}
