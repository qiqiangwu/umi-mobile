import React, { useEffect } from 'react';
import { Toast } from 'antd-mobile';
import Logger from '@/utils/logger';

const logger = Logger.get('LoadingToast');

interface ILoadingToast {
  loading: boolean;
}

// 延时提示信息ms
const delay = 800;
let timerID;

const LoadingToast: React.FC<ILoadingToast> = ({ loading, children }) => {
  logger.debug('render');

  useEffect(() => {
    logger.debug(`loading: ${loading}`);

    if (loading) {
      timerID = setTimeout(() => {
        Toast.show({
          icon: 'loading',
          content: '加载中…',
          duration: 0,
        });
      }, delay);
    } else {
      logger.debug(`timerID: ${timerID}`);
      if (timerID != null) {
        clearTimeout(timerID);
        timerID = null;
      }

      Toast.clear();
    }
  }, [loading]);

  return <>{children}</>;
};

export default LoadingToast;
