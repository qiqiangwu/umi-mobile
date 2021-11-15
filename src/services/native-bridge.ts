import Logger from '@/utils/logger';

const logger = Logger.get('native bridge');

// 播放监控或者视频
export const METHOD_PLAY_MONITOR = 'gotoVideoPlaybAct';
/**
 * 获取客户端标识
 * @returns
 */
function getPlatform() {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // 判断是否是 android终端
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否是 iOS终端
  if (isAndroid) {
    return 'Android';
  } if (isIOS) {
    return 'IOS';
  }
    return 'PC';
}

// 获取方法命名空间
function getNS(method: string) {
  if (method === 'watchLive' || method === 'hostEnterLive') {
    return 'ELive';
  }
    return 'cloudVideo';
}

export function invoke(method, ...params) {
  logger.info(`invoke() 调用Native方法${method}`);
  logger.info(`invoke() 传入参数: ${JSON.stringify(params)}`);

  const namespace = getNS(method);
  const platform = getPlatform();

  let result;
  let newParams = params;

  if (newParams.length) {
    newParams = newParams.map(item => {
      if (item == null) {
        return '';
      } if (typeof item === 'object') {
        return JSON.stringify(item);
      }
        return item;
    });
  }

  // 开发模式取消调用移动端原生方法
  if (process.env.UMI_ENV === 'dev') {
    return;
  }

  if (platform === 'IOS') {
    result = window.prompt(
      JSON.stringify({
        method,
        params: newParams,
      }),
    );
  } else {
    // @ts-ignore
    result = window[namespace][method](...newParams);
  }

  return result;
}
