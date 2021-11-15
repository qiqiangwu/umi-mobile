import { Button, Popup } from 'antd-mobile';
import React from 'react';
import styles from './index.less';

interface LoginPromptProps {
  visible: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ visible, onClose, onLoginClick }) => (
    <Popup bodyClassName={styles.container} visible={visible}>
      <div className="inner">
        <div className="title">需要登录才可进行此操作</div>
        <div className="btns">
          <Button color="primary" onClick={() => onClose()}>
            取消
          </Button>
          <Button color="primary" onClick={() => onLoginClick()}>
            登录
          </Button>
        </div>
      </div>
    </Popup>
  );

export default LoginPrompt;
