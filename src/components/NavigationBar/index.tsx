/*
 * 顶部导航
 */
import React from 'react';

import { NavBar } from 'antd-mobile';
import { history } from 'umi';
import { NavigationBarOption } from '@/common/types';
import styles from './index.less';

export interface NavigationBarProps {
  title: string;
  ref?: any;
}

export interface NavigationBarState {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  title?: string;
}

class NavigationBar extends React.PureComponent<NavigationBarProps, NavigationBarState> {
  constructor(props: NavigationBarProps) {
    super(props);
    this.state = {
      leftContent: null,
      rightContent: null,
    };
  }

  onLeftClick = () => {
    const { leftContent } = this.state;
    if (leftContent) return;
    history.goBack();
  };

  setOption = (option: NavigationBarOption) => {
    const { leftContent, rightContent } = option;
    this.setState({
      leftContent,
      rightContent,
    });
  };

  setTitle = (title: string) => {
    this.setState({
      title,
    });
  };

  render() {
    const { rightContent, leftContent } = this.state;
    const title = this.state?.title || this.props?.title;

    const rightContentRender = () => {
      if (rightContent && typeof rightContent !== 'string') {
        return [rightContent];
      }

      return null;
    };

    const leftContentRender = () => {
      if (leftContent && typeof leftContent !== 'string') {
        return [leftContent];
      }
      return null;
    };

    return (
      <div className={styles.container}>
        <NavBar
          left={leftContentRender()}
          backArrow={leftContent ? null : true}
          onBack={this.onLeftClick}
          right={rightContentRender()}
        >
          {title}
        </NavBar>
      </div>
    );
  }
}

export default NavigationBar;
