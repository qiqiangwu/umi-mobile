import React from 'react';
import { AppOutline, UserOutline } from 'antd-mobile-icons';
import IconTypes from './icons';
import { MenusType } from './types/menus';

const commonMenu: MenusType[] = [
  {
    key: 'home',
    icon: <AppOutline />,
  },
  {
    key: 'my',
    icon: <UserOutline />,
  },
];

/**
 *接口响应枚举
 */
enum HttpCode {
  SUCCESS = 0, // 成功
  FAIL = 1, // 失败
  WARN = 2, // 警告
  NO_LOGIN = 1000, // 需要登录
}

/**
 * 权限状态
 */
enum AuthorityStatus {
  USER = 1,
  ADMIN = 2,
  CLOSE = 3,
  GUEST = 0,
}

export { commonMenu, IconTypes, HttpCode, AuthorityStatus };
