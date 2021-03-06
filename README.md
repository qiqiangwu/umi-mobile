# 移动端h5模版

技术栈：`react` `umi3.x` `antd-mobile` `typescript`

- [umi](https://umijs.org/)
- [antd-mobile](https://mobile.ant.design/) 
- [typescript](https://www.typescriptlang.org/)

umi集成的插件
- [dva](https://dvajs.com/)
- [umi-plugin-keep-alive](https://github.com/alitajs/umi-plugin-keep-alive)

## 功能列表
- [x] git commit message 规范方案
- [x] eslint+prettier代码格式化
- [x] 高清方案配置(移动端适配)
- [x] 应用多环境管理
- [x] 全局样式注入
- [x] 使用`antd-mobile`组件库
- [x] 通用布局组件封装
- [x] 使用`dva`
- [x] `h5`内部导航封装
- [x] 引入`js-Logger`日志库
- [x] 请求二次封装
- [ ] 引入状态保持组件 umi-plugin-keep-alive
- [ ] 权限封装
- [ ] 使用`Sentry`进行异常监控
- [ ] `analyze`打包资源分析
- [ ] 微信`js-sdk`二次封装

### 功能描述

- 全局样式注入

使用时，在编写`less`样式时，可使用`styles/index.less`下引入的所有样式，包括`mixins/`下工具，以及`themes/default`下`antd-mobile`的主题变量

不需要单独在每个页面单独引入


## Issues
- umi-plugin-keep-alive

useActivate, useUnActivate hooks不起作用