import React, { useEffect, useState } from 'react';
import { connect, ConnectProps, useDispatch } from 'umi';
import { Dialog, InfiniteScroll, List, Loading as AntdLoading, Tabs, Toast } from 'antd-mobile';
import Logger from '@/utils/logger';
import { ICourseListState } from './models/courseList';
import { Loading } from '@/models/connect';
import styles from './CourseList.less';
import LoadingToast from '@/components/LoadingToast';
import { setTitle } from '@/utils/nav';
import itemLabel from './images/icon.png';
import { IMedia } from './course.service';
import LoginPrompt from '@/components/LoginPrompt';
import { IUser, IUserModelState } from '@/models/user';
import { IFormatResponse } from '@/utils/request';
import { METHOD_PLAY_MONITOR, invoke } from '@/services/native-bridge';

const logger = Logger.get('course list');

interface CatalogListProps extends ConnectProps {
  data: ICourseListState;
  loading?: boolean;
  fetchCourseLoading?: boolean;
  currentUser: IUser;
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
  currentUser,
}) => {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(false);
  // 控制加载更多组件显示
  const [hasMoreVisible, setHasMoreVisible] = useState(false);

  // 是否显示提示登录
  const [visible, setVisible] = useState(false);

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

  async function gotoPlay(course: IMedia) {
    // 验证用户登录
    const isLogin = await new Promise(resolve => {
      dispatch({
        type: 'user/checkLogin',
        payload: {
          resolve,
        },
      });
    });
    // 未登录，显示提示登录框
    logger.info(`gotoPlay isLogin: ${isLogin}`);
    if (!isLogin) {
      setVisible(true);
      return;
    }

    // 检查用户是否订购产品
    const checkBookProductResult = await new Promise<IFormatResponse<boolean>>(resolve => {
      dispatch({
        type: 'user/checkBookProduct',
        payload: {
          resolve,
          phone: currentUser.phone,
        },
      });
    });
    if (checkBookProductResult.hasError) {
      Dialog.show({
        content: checkBookProductResult.message,
        closeOnAction: true,
        actions: [
          {
            key: 'close',
            text: '关闭',
          },
        ],
      });
      return;
    }

    const { playURL, name: courseName, guid } = course;
    const courseColumnID = selectedIDLevelThree;
    const courseColumnName = catalogListLevelThree?.find(
      item => item.id === courseColumnID,
    )?.name;
    const stbNO = '';
    try {
      invoke(
        METHOD_PLAY_MONITOR,
        playURL,
        courseName,
        guid,
        courseColumnName,
        courseColumnID,
        stbNO,
      );
    } catch (e) {
      logger.error(`播放课程视频失败: ${(e as Error).message}`);

      setTimeout(() => {
        Toast.show({
          icon: 'fail',
          content: '播放课程视频失败',
        });
      }, 0);
    }
  }

  return (
    <>
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
                  <List.Item key={course.id} onClick={() => gotoPlay(course)}>
                    <div className={styles.item}>
                      <img src={itemLabel} alt="" />
                      {course.name}
                    </div>
                  </List.Item>
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
      <LoginPrompt visible={visible} onClose={() => setVisible(false)} onLoginClick={() => {}} />
    </>
  );
};

export default connect(
  ({
    courseList,
    loading,
    user,
  }: {
    courseList: ICourseListState;
    loading: Loading;
    user: IUserModelState;
  }) => ({
    data: courseList,
    loading:
      loading.effects['courseList/fetchCourseCatalog'] || loading.effects['user/checkBookProduct'],
    fetchCourseLoading: loading.effects['courseList/fetchCourseList'],
    currentUser: user.currentUser,
  }),
)(CatalogListPage);
