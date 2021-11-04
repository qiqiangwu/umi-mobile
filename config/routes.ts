/**
 * 路由配置
 */

const routes = [
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: '/home',
        title: '首页',
        name: 'home',
        isMenu: true,
        component: '@/pages/home',
        routes: [
          {
            path: '/home/123',
            name: 'home123',
            component: '@/pages/home',
            title: '二级导航',
          },
        ],
      },
      {
        path: '/my',
        title: '我的',
        name: 'my',
        isMenu: true,
        component: '@/pages/mine',
      },
    ],
  },
];
export default routes;
