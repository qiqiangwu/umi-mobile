import React, { useEffect, useState } from 'react';
import { connect, ConnectProps, useDispatch, useHistory } from 'umi';
import { InfiniteScroll, List, Loading as AntdLoading, Tabs } from 'antd-mobile';
import Logger from '@/utils/logger';
import { ICourseListState } from './models/courseList';
import { Loading } from '@/models/connect';
import styles from './CourseList.less';
import LoadingToast from '@/components/LoadingToast';
import { setTitle } from '@/utils/nav';

const logger = Logger.get('course list');

interface CatalogListProps extends ConnectProps {
  data: ICourseListState;
  loading?: boolean;
  fetchCourseLoading?: boolean;
}

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => (
  <>
    {hasMore ? (
      <>
        <span>加载中</span>
        <AntdLoading />
      </>
    ) : (
      <span>--- 我是有底线的 ---</span>
    )}
  </>
);

const CatalogListPage: React.FC<CatalogListProps> = ({
  data = {},
  loading = false,
  match,
  fetchCourseLoading = false,
}) => {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(false);
  // 控制加载更多组件显示
  const [hasMoreVisible, setHasMoreVisible] = useState(false);

  // @ts-ignore
  const { columnID, name } = match.params;

  const {
    catalogList = [],
    selectedCatalogIDs = [],
    courseList = [],
    coursePageIndex = 1,
    coursePageCount = 0,
  } = data;

  // 三级目录
  const [catalogListLevelOne = [], catalogListLevelTwo = [], catalogListLevelThree = []] =
    catalogList;
  // 选中三级目录ID
  const [selectedIDLevelOne, selectedIDLevelTwo, selectedIDLevelThree] = selectedCatalogIDs;

  async function fetchAPI({
    columnID: cid,
    id,
    level,
  }: {
    columnID?: number;
    id?: number;
    level: number;
  }) {
    setHasMoreVisible(false);

    const catalogIDs = await new Promise((resolve: (catalogIDs: number[]) => void, reject) => {
      dispatch({
        type: 'courseList/fetchCourseCatalog',
        payload: {
          level,
          columnID: cid,
          id,
          areaID: '',
          resolve,
          reject,
        },
      });
    });

    await new Promise(
      (resolve: ({ pageIndex, pageCount }: { pageIndex: number; pageCount: number }) => void) => {
        dispatch({
          type: 'courseList/fetchCourseList',
          payload: {
            columnID: catalogIDs?.[2],
            resolve,
          },
        });
      },
    );

    setHasMoreVisible(true);
    setHasMore(true);
  }

  useEffect(() => {
    fetchAPI({ columnID, level: -1 });

    setTitle(name);
  }, []);

  const onTabChange = (level, key) => {
    logger.info(`onTabChange: ${key}`);

    fetchAPI({ id: key, level });
  };

  const loadMore = async function () {
    const { pageIndex, pageCount } = await new Promise(
      (
        resolve: ({ pageIndex, pageCount }: { pageIndex: number; pageCount: number }) => void,
        reject,
      ) => {
        dispatch({
          type: 'courseList/fetchCourseList',
          payload: {
            columnID: selectedCatalogIDs?.[2],
            loadMore: true,
            resolve,
            reject,
          },
        });
      },
    );

    logger.info(`loadMore: pageIndex=${pageIndex}`);
    logger.info(`loadMore: pageCount=${pageCount}`);

    setHasMore(pageIndex < pageCount);
  };

  logger.info('data', data);

  return (
    <LoadingToast loading={loading}>
      <div className={styles.container}>
        <Tabs activeKey={`${selectedIDLevelOne}`} onChange={key => onTabChange(0, key)}>
          {catalogListLevelOne.map(item => (
            <Tabs.TabPane title={item.name} key={`${item.id}`}></Tabs.TabPane>
          ))}
        </Tabs>
        <Tabs activeKey={`${selectedIDLevelTwo}`} onChange={key => onTabChange(1, key)}>
          {catalogListLevelTwo.map(item => (
            <Tabs.TabPane title={item.name} key={`${item.id}`}></Tabs.TabPane>
          ))}
        </Tabs>
        <Tabs
          activeKey={`${selectedIDLevelThree}`}
          activeLineMode="fixed"
          style={{
            '--fixed-active-line-width': '50px',
          }}
          onChange={key => onTabChange(2, key)}
        >
          {catalogListLevelThree.map(item => (
            <Tabs.TabPane title={item.name} key={`${item.id}`}></Tabs.TabPane>
          ))}
        </Tabs>
        <LoadingToast loading={fetchCourseLoading && !hasMoreVisible}>
          <div className={styles.list}>
            <List>
              {courseList.map(course => (
                <List.Item key={course.id}>{course.name}</List.Item>
              ))}
            </List>
            {hasMoreVisible ? (
              <InfiniteScroll loadMore={() => loadMore()} hasMore={hasMore}>
                <InfiniteScrollContent hasMore={hasMore} />
              </InfiniteScroll>
            ) : null}
          </div>
        </LoadingToast>
      </div>
    </LoadingToast>
  );
};

export default connect(
  ({ courseList, loading }: { courseList: ICourseListState; loading: Loading }) => ({
    data: courseList,
    loading: loading.effects['courseList/fetchCourseCatalog'],
    fetchCourseLoading: loading.effects['courseList/fetchCourseList'],
  }),
)(CatalogListPage);
