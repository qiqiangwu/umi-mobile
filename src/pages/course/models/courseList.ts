import { Effect, Reducer } from 'umi';
import { fetchCourseCatalog, fetchCourseList, IMedia } from '../course.service';
import Logger from '@/utils/logger';
import { IFormatResponse } from '@/utils/request';

const logger = Logger.get('course list model');

export interface ICourseCatalog {
  name: string;
  // 目录id
  id: number;
  // 目录绑定的栏目id
  columnID: number;
  // 用于三级目录columnID和id
  extra?: string;
}

export interface ICourseListState {
  // 二维数组存储三级目录数据
  catalogList: ICourseCatalog[][];
  // 选中的目录id
  selectedCatalogIDs: number[];
  courseList?: IMedia[];
  coursePageCount?: number;
  coursePageIndex?: number;
}

export interface ICourseListModel {
  namespace: 'courseList';
  state: ICourseListState;
  effects: {
    fetchCourseCatalog: Effect;
    fetchCourseList: Effect;
  };
  reducers: {
    save: Reducer<ICourseListState>;
  };
}

const CourseListModel: ICourseListModel = {
  namespace: 'courseList',
  state: {
    catalogList: [[], [], []],
    selectedCatalogIDs: [],
  },
  effects: {
    /**
     * 获取课程目录
     * @param payload {level, columnID?, id?, resolve}
     * @param param1
     */
    *fetchCourseCatalog({ payload }, { put, call, select }) {
      // 一级目录父目录的level为-1
      const { level = -1, resolve, columnID: cid } = payload;
      // 起始目录级别
      const startLevel = level + 1;

      // 目录(实际是栏目)id
      let columnID;

      // 更新选中tab
      if (level > -1) {
        const prevSelectedCatalogIDs = yield select(
          ({ courseList }) => courseList.selectedCatalogIDs,
        );
        const selectedCatalogIDs = [...prevSelectedCatalogIDs];
        selectedCatalogIDs[level] = parseInt(payload.id, 10);

        yield put({
          type: 'save',
          payload: {
            selectedCatalogIDs,
          },
        });
      }

      const catalogList: ICourseCatalog[][] = [];

      const prevSelectedCatalogIDs = yield select(
        ({ courseList }) => courseList.selectedCatalogIDs,
      );
      const selectedCatalogIDs: number[] = [...prevSelectedCatalogIDs];

      const prevCatalogList = yield select(({ courseList }) => courseList.catalogList);
      if (prevCatalogList) {
        prevCatalogList.forEach(item => {
          const catalogListItem: ICourseCatalog[] = [];
          item.forEach(inner => {
            catalogListItem.push({
              ...inner,
            });
          });
          catalogList.push(catalogListItem);
        });
      }

      for (let currentLevel = startLevel; currentLevel < 3; currentLevel += 1) {
        // 构造三级目录
        if (currentLevel === 2) {
          const parentCatalogList = catalogList[currentLevel - 1];
          const parentSelectedCatalogID = selectedCatalogIDs[currentLevel - 1];

          const ids = parentCatalogList
            .find(item => item.id === parentSelectedCatalogID)
            ?.extra?.split('=');

          if (ids && ids.length === 2) {
            catalogList[currentLevel] = [
              {
                name: '上册',
                id: parseInt(ids[0], 10),
                columnID: parseInt(ids[0], 10),
              },
              {
                name: '下册',
                id: parseInt(ids[1], 10),
                columnID: parseInt(ids[1], 10),
              },
            ];
            selectedCatalogIDs[currentLevel] = parseInt(ids[0], 10);
          } else {
            catalogList[currentLevel] = [];

            logger.warn(
              'fetchCourseCatalog effect 构建三级目录失败，二级目录jumpAddr属性添加不正确',
            );
          }

          // 退出循环
          break;
        }

        if (currentLevel === startLevel) {
          if (level === -1) {
            columnID = cid;
          } else {
            const currentCatalogList = catalogList[currentLevel];
            columnID = currentCatalogList?.find(
              item => item.id === parseInt(payload.id, 10),
            )?.columnID;
          }
        } else {
          const parentCatalogList = catalogList[currentLevel - 1];
          const parentSelectedCatalogID = selectedCatalogIDs[currentLevel - 1];
          columnID = parentCatalogList?.find(
            item => item.id === parentSelectedCatalogID,
          )?.columnID;
        }

        if (!columnID) {
          break;
        }

        const response = yield call(fetchCourseCatalog, columnID);

        logger.debug('fetchCourseCatalog effect response:', response);

        if (Array.isArray(response.data) && response.data.length) {
          catalogList[currentLevel] = response.data;
          // 默认选中第一个
          selectedCatalogIDs[currentLevel] = response.data[0].id;
        } else {
          catalogList[currentLevel] = [];
        }
      }

      logger.debug('fetchCourseCatalog effect catalogList:', catalogList);

      yield put({
        type: 'save',
        payload: {
          catalogList,
          selectedCatalogIDs,
        },
      });

      resolve && resolve(selectedCatalogIDs);
    },
    /**
     * 获取课程列表
     * @param payload {columnID, loadMore, pageIndex, pageSize, resolve, reject}
     * @param param1
     */
    *fetchCourseList({ payload }, { call, put, select }) {
      const { columnID, loadMore, pageIndex, pageSize, resolve, reject } = payload;

      if (!loadMore) {
        // 初始化数据
        yield put({
          type: 'save',
          payload: {
            coursePageCount: 0,
            courseList: [],
            coursePageIndex: 1,
          },
        });
      }

      const response: IFormatResponse<{
        list: IMedia[];
        pageCount: number;
      }> = yield call(fetchCourseList, {
        columnID,
        pageIndex,
        pageSize,
      });

      if (!response.hasError) {
        const list = yield select(({ courseList }) => courseList.courseList);
        let courseList = list
          ? list.map(item => ({
              name: item.name,
            }))
          : [];
        if (loadMore) {
          courseList = response?.data?.list
            ? [...courseList, ...response?.data?.list]
            : [...courseList];
        } else {
          courseList = response?.data?.list ? [...response?.data?.list] : [];
        }

        const pageCount = response.data?.pageCount;
        yield put({
          type: 'save',
          payload: {
            coursePageCount: pageCount,
            courseList,
            coursePageIndex: pageIndex,
          },
        });

        resolve &&
          resolve({
            pageIndex,
            pageCount,
          });
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

export default CourseListModel;