# 移动端h5模版

技术栈：`react` `umi3.x` `antd-mobile` `typescript`

## 功能列表
- [x] git commit message 规范方案
- [x] eslint+prettier代码格式化
- [x] 高清方案配置(移动端适配)
- [x] 应用多环境管理
- [x] 全局样式注入
- [x] 使用`antd-mobile`组件库
- [ ] 通用布局组件封装
- [ ] 使用`dva`
- [ ] `h5`内部导航封装
- [ ] 权限封装
- [ ] 请求二次封装
- [ ] 使用`Sentry`进行异常监控
- [ ] `analyze`打包资源分析
- [ ] 微信`js-sdk`二次封装

### 功能描述

- 全局样式注入

使用时，在编写`less`样式时，可使用`styles/index.less`下引入的所有样式，包括`mixins/`下工具，以及`themes/default`下`antd-mobile`的主题变量

不需要单独在每个页面单独引入

也可在`config/theme.config.ts`下修改`antd-mobile`变量值

例子:
```less
.page{
  display: flex;
  font-size: 15px;
  color: @brand-primary; // antd-mobile主题变量 并且在config/theme.config.ts 修改过
  background-color: @brand-important; // antd-mobile主题变量 默认没有修改过
  .ellipsis(); // styles/mixins/util.less 的工具样式
}
```

组件应用样式参考[https://github.com/gajus/babel-plugin-react-css-modules]

```
import React from 'react';
import './table.less';

export default class Table extends React.Component {
  render () {
    return <div styleName='table'>
      <div styleName='row'>
        <div styleName='cell'>A0</div>
        <div styleName='cell'>B0</div>
      </div>
    </div>;
  }
}
```

全局样式和组件样式
```
<div className='global-css' styleName='local-module'></div>
```