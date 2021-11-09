import React, { useEffect, useState } from 'react';
import { connect, ConnectProps, useDispatch } from 'umi';
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

const CatalogListPage: React.FC<CatalogListProps> = ({ data = {}, loading = false, match }) => {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);

  // @ts-ignore
  const { columnID, name } = match.params;

  const {
    catalogList,
    selectedCatalogIDs,
    courseList = [],
    coursePageIndex = 1,
    coursePageCount = 0,
  } = data;

  useEffect(() => {
    logger.debug('match', match);

    new Promise((resolve: (catalogIDs: number[]) => void, reject) => {
      dispatch({
        type: 'courseList/fetchCourseCatalog',
        payload: {
          level: -1,
          columnID,
          areaID: '',
          resolve,
          reject,
        },
      });
    }).then(catalogIDs => {
      dispatch({
        type: 'courseList/fetchCourseList',
        payload: {
          columnID: catalogIDs?.[2],
        },
      });
    });

    setTitle(name);
  }, []);

  const onTabChange = (level, key) => {
    logger.info(`onTabChange: ${key}`);

    new Promise((resolve: (catalogIDs: number[]) => void, reject) => {
      dispatch({
        type: 'courseList/fetchCourseCatalog',
        payload: {
          level,
          id: key,
          areaID: '',
          resolve,
          reject,
        },
      });
    }).then(catalogIDs => {
      setHasMore(true);

      dispatch({
        type: 'courseList/fetchCourseList',
        payload: {
          columnID: catalogIDs?.[2],
          pageIndex: 1,
        },
      });
    });
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
            pageIndex: coursePageIndex + 1,
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
        <Tabs activeKey={`${selectedCatalogIDs?.[0]}`} onChange={key => onTabChange(0, key)}>
          {catalogList?.[0] &&
            catalogList?.[0].map(item => (
              <Tabs.TabPane title={item.name} key={`${item.id}`}></Tabs.TabPane>
            ))}
        </Tabs>
        <Tabs activeKey={`${selectedCatalogIDs?.[1]}`} onChange={key => onTabChange(1, key)}>
          {catalogList?.[1] &&
            catalogList?.[1]?.map(item => (
              <Tabs.TabPane title={item.name} key={`${item.id}`}></Tabs.TabPane>
            ))}
        </Tabs>
        <Tabs
          activeKey={`${selectedCatalogIDs?.[2]}`}
          activeLineMode="fixed"
          style={{
            '--fixed-active-line-width': '50px',
          }}
          onChange={key => onTabChange(2, key)}
        >
          {catalogList?.[2]
            ? catalogList?.[2]?.map(item => (
                <Tabs.TabPane title={item.name} key={`${item.id}`}>
                  <List>
                    {courseList.map(course => (
                      <List.Item key={course.id}>{course.name}</List.Item>
                    ))}
                  </List>
                  <InfiniteScroll loadMore={() => loadMore()} hasMore={hasMore}>
                    <InfiniteScrollContent hasMore={hasMore} />
                  </InfiniteScroll>
                </Tabs.TabPane>
              ))
            : null}
        </Tabs>
      </div>
    </LoadingToast>
  );
};

export default connect(
  ({ courseList, loading }: { courseList: ICourseListState; loading: Loading }) => ({
    data: courseList,
    loading: loading.effects['courseList/fetchCourseCatalog'],
  }),
)(CatalogListPage);
