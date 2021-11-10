import React, { useEffect } from 'react';
import { connect, ConnectProps, KeepAlive, useActivate, useUnactivate } from 'umi';
import { PullToRefresh } from 'antd-mobile';
import Logger from '@/utils/logger';
import appConfig from '@/appConfig';
import { IHomeState } from './models/home';
import { Loading } from '@/models/connect';
import HomeSlides from './components/HomeSlides';
import styles from './index.less';
import onlineClass from './images/online-class.png';
import searchClass from './images/search-class.png';
import HomeMainColumns from './components/HomeMainColumns';
import LoadingToast from '@/components/LoadingToast';
import Header from '@/components/Header';

const logger = Logger.get('/home');

interface HomePageProps extends ConnectProps {
  data: IHomeState;
  loading?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ data = {}, loading = false, dispatch }) => {
  const { slides, columns, init = false } = data;

  useEffect(() => {
    if (!init) {
      dispatch?.({
        type: 'home/fetchColumnList',
        payload: {
          id: appConfig.data.home.id,
          areaID: '',
        },
      });
    }
  }, []);

  async function doRefresh() {
    return new Promise((resolve, reject) => {
      dispatch?.({
        type: 'home/fetchColumnList',
        payload: {
          id: appConfig.data.home.id,
          areaID: '',
          resolve,
        },
      });
    });
  }

  return (
    <PullToRefresh onRefresh={() => doRefresh()}>
      <Header></Header>
      <LoadingToast loading={loading}>
        <KeepAlive>
          <HomeSlides slides={slides}></HomeSlides>
          <div className={styles.row}>
            <div>
              <img src={onlineClass} alt="" />
            </div>
            <div>
              <img src={searchClass} alt="" />
            </div>
          </div>
          <HomeMainColumns columns={columns}></HomeMainColumns>
        </KeepAlive>
      </LoadingToast>
    </PullToRefresh>
  );
};

export default connect(({ home, loading }: { home: IHomeState; loading: Loading }) => ({
  data: home,
  loading: loading.effects['home/fetchColumnList'],
}))(HomePage);
