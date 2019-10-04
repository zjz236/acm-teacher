import cookies from 'cookie-universal-nuxt'
import ajaxService from './ajaxService'

export function inBrowser() {
    return typeof window != 'undefined';
}

export function tokenError() {
    if (process.client) {
        window.location.href = '/login'
    }
}

export function isLogin() {
    ajaxService.islogin()
}
