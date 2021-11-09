import React, { useEffect } from 'react';
import { connect, ConnectProps, useDispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import Logger from '@/utils/logger';
import { formatterMenu, getMenuRoute } from '@/utils/utils';
import NavigationBar from '@/components/NavigationBar';
import Header from '@/components/Header';
import { navigationRef } from '@/utils/nav';
import './MainLayout.less';

interface MainLayoutProps extends ConnectProps {
  prefixCls?: string;
}

const logger = Logger.get('MainLayout');

const MainLayout: React.FC<MainLayoutProps> = props => {
  const { children, route, location, prefixCls } = props;
  const { pathname } = location;
  const { routes = [] } = route;
  const menuRoute = getMenuRoute(routes);
  const allRoutes = formatterMenu(routes);
  const currentRoute = (allRoutes && allRoutes.find(r => r.path === pathname)) || {};

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'user/fetchCurrentUser',
      payload: {
        id: 29,
      },
    });
  }, []);

  if (menuRoute.indexOf(pathname) >= 0) {
    return (
      <div className={prefixCls}>
        <div className={`${prefixCls}-body`}>
          <Header></Header>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-body`}>
        <NavigationBar ref={navigationRef} title={currentRoute.title || ''} />
        <div className={`${prefixCls}-main`}>
          <div className={`${prefixCls}-main-inner`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

MainLayout.defaultProps = {
  prefixCls: 'main-layout',
};

export default connect(({ user }: ConnectState) => ({ user }))(MainLayout);
