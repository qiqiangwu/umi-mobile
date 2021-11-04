import React from 'react';
import { TabBar } from 'antd-mobile';
import { history } from 'umi';
import { MenusType, MyRouteProps } from '@/common/types/index';

export interface MenuBarProps {
  pathname: string;
  routes: MyRouteProps[];
  menus: MenusType[];
  prefixCls?: string;
}

const MenuBar: React.FC<MenuBarProps> = props => {
  const { routes, menus, pathname, children } = props;

  const tabMenu: any[] = [];
  menus.forEach(m => {
    routes.forEach(route => {
      if (route?.path?.includes(m.key) && route.isMenu) {
        tabMenu.push({
          ...m,
          ...route,
        });
      }
    });
  });

  const setRouteActive = (value: string) => {
    history.push(value);
  };

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabMenu.map(({ title, icon, path }) => (
        <TabBar.Item key={path} title={title} icon={icon}>
          {children}
        </TabBar.Item>
      ))}
    </TabBar>
  );
};

MenuBar.defaultProps = {
  prefixCls: 'menu-bar',
};

export default MenuBar;
