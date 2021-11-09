import React, { useEffect } from 'react';
import { connect, Link, ConnectProps, useDispatch } from 'umi';
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

const logger = Logger.get('/home');

interface HomePageProps extends ConnectProps {
  data: IHomeState;
  loading?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ data = {}, loading = false }) => {
  const dispatch = useDispatch();

  const { slides, columns } = data;

  useEffect(() => {
    dispatch({
      type: 'home/fetchColumnList',
      payload: {
        id: appConfig.data.home.id,
        areaID: '',
      },
    });
  }, []);

  return (
    <LoadingToast loading={loading}>
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
    </LoadingToast>
  );
};

export default connect(({ home, loading }: { home: IHomeState; loading: Loading }) => ({
  data: home,
  loading: loading.effects['home/fetchColumnList'],
}))(HomePage);
