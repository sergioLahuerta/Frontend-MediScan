import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: LandingPage,
        meta: { title: 'MediScan - Intelligent Medical Analysis' },
    },
    {
        path: '/services',
        name: 'services',
        component: () => import('@/pages/ServicesPage.vue'),
        meta: { title: 'MediScan - AI Simulator' },
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('@/pages/ContactPage.vue'),
        meta: { title: 'MediScan - Contact Us' },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { title: 'MediScan - Login' },
    },
    {
        path: '/reports',
        name: 'reports',
        component: () => import('@/pages/ReportsPage.vue'),
        meta: { title: 'MediScan - Reports' },
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { title: 'MediScan - Profile' },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/RegisterPage.vue'),
        meta: { title: 'MediScan - Join Us' },
    },
    {
        path: '/terms',
        name: 'terms',
        component: () => import('@/pages/TermsPage.vue'),
        meta: { title: 'MediScan - Terms and Conditions' },
    },
    {
        path: '/privacy',
        name: 'privacy',
        component: () => import('@/pages/PrivacyPage.vue'),
        meta: { title: 'MediScan - Privacy Policy' },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        return { top: 0 }
    },
})

router.beforeEach((to, from, next) => {
    document.title = (to.meta.title as string) || 'MediScan'

    // Simple protection for "services" (simulator)
    const isAuthenticated = !!localStorage.getItem('token')

    if (to.name === 'services' && !isAuthenticated) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
