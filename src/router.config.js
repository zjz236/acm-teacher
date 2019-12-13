import Home from '@/pages/Home'
import Login from '@/pages/Login'
export default {
    routes: [
        {
            path: '/',
            name: 'index',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
}