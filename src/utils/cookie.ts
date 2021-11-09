import Cookies from 'js-cookie';

const cookieKey = 'umiMobileCookie';

export function getCookie(name?: string) {
  return Cookies.get(name || cookieKey);
}

export function setCookie(name: string, value: string | object) {
  Cookies.set(name || cookieKey, value);
}

export function removeCookie(name?: string) {
  Cookies.remove(name || cookieKey);
}
