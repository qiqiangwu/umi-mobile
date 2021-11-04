import React from 'react';
import { ConnectProps, connect } from 'umi';
import { getMenuRoute, formatterMenu } from '@/utils/utils';
import MenuBar from '@/components/MenuBar';
import { commonMenu } from '@/common/index';
import './BasicLayout.less';
import NavigationBar from '@/components/NavigationBar';
import { navigationRef } from '@/utils/nav';

interface BasicLayoutProps extends ConnectProps {
  prefixCls?: string;
  route: any;
}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { children, prefixCls, route, location } = props;
  const { pathname } = location;
  const { routes } = route;
  const menuRoute = getMenuRoute(routes);
  const allRoutes = formatterMenu(routes);
  const currentRoute = (allRoutes && allRoutes.find(r => r.path === pathname)) || {};
  // 包含底部菜单
  if (menuRoute.indexOf(pathname) >= 0) {
    return (
      <div className={prefixCls}>
        <div className={`${prefixCls}-body`}>{children}</div>
        <div className={`${prefixCls}-bottom`}>
          <MenuBar menus={commonMenu} routes={routes} pathname={pathname}></MenuBar>
        </div>
      </div>
    );
  }

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-body`}>
        <NavigationBar ref={navigationRef} title={currentRoute.title || ''} />
        {children}
      </div>
    </div>
  );
};

BasicLayout.defaultProps = {
  prefixCls: 'basic-layout',
};

export default connect()(BasicLayout);
