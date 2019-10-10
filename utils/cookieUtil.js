import {inBrowser} from './commonUtil';

export function getCookie(name) {
    if (process.client) {
        const reg = new RegExp(`(^|; )${name}=([^;]*)(;|$)`);
        const match = document.cookie.match(reg) || '';
        return decodeURIComponent(match[2] || '');
    }
}

export function setCookie(key, value, path = '/') {
    if (process.client) {
        console.log(document.cookie)
        document.cookie = `${key}=${value}; max-age=${60 * 60 * 24}; path=${path};`;
    }
}

export function delCookie(key, path = '/') {
    if (process.client) {
        const exp = new Date(new Date() - 233);
        const val = getCookie(key);
        document.cookie = `${key}=${val};expires=${exp.toGMTString()};path=${path}`;
    }
}
