/**
 * 打印日志
 *
 * @example
 * 命名日志
 * const logger = Logger.get('/home');
 * logger.debug('I am a debug message');
 * logger.info('OMG! Check this window out!');
 * logger.warn('Purple Alert! Purple Alert!');
 * logger.error('HOLY SHI... no carrier.');
 */
import Logger from 'js-logger';

Logger.useDefaults({
  defaultLevel: Logger.DEBUG,
});

// Send messages to a custom logging endpoint for analysis.
/* Logger.setHandler((messages, context) => {

}); */

export default Logger;
