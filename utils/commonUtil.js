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

export function getExamStatus(start, finish) {
    let now = new Date()
    start = new Date(start)
    finish = new Date(finish)
    if (now < start) {
        return 'pending'
    } else if (now >= start && now < finish) {
        return 'starting'
    } else {
        return 'ending'
    }
}
