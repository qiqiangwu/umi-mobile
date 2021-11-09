import React, { useState } from 'react';
import { connect, ConnectProps, useDispatch } from 'umi';
import { ScanningOutline, LocationFill } from 'antd-mobile-icons';
import { ActionSheet, Button } from 'antd-mobile';
import { ConnectState } from '@/models/connect';
import styles from './index.less';
import logo from './images/logo.png';
import { IUser } from '@/models/user';
import { ICurrentArea } from '@/models/app';
import Logger from '@/utils/logger';

const logger = Logger.get('Header');

interface HeaderProps extends ConnectProps {
  user?: IUser;
  currentArea?: ICurrentArea;
}

const Header: React.FC<HeaderProps> = ({ user = {}, currentArea }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const actions = [
    {
      text: '公共区域',
      key: 0,
    },
  ];
  if (user.className && user.id) {
    actions.push({
      text: user.className,
      key: user.id,
    });
  }

  const changeArea = action => {
    logger.debug('changeArea', action);
    if (currentArea?.name !== action.text) {
      dispatch({
        type: 'app/save',
        payload: {
          currentArea: {
            name: action.text,
            id: action.key,
          },
        },
      });
    }
    setVisible(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.changeArea} onClick={() => setVisible(true)}>
        <LocationFill fontSize={24} color="var(--adm-color-white)" />
        <span>{currentArea?.name || '公共区域'}</span>
        <ActionSheet
          extra="请选择区域"
          cancelText="取消"
          visible={visible}
          actions={actions}
          onAction={changeArea}
          onClose={() => setVisible(false)}
        />
      </div>
      <div className={styles.scan}>
        <ScanningOutline fontSize={32} color="var(--adm-color-white)" />
      </div>
    </div>
  );
};

export default connect(({ user, app }: ConnectState) => ({
  user: user?.currentUser,
  currentArea: app?.currentArea,
}))(Header);
