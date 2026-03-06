import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        snackbar: {
            show: false,
            message: '',
            color: 'primary',
        },
        mobileDrawer: false,
    }),
    actions: {
        showSnackbar(message, color = 'primary') {
            this.snackbar = { show: true, message, color }
        },
        hideSnackbar() {
            this.snackbar.show = false
        },
        toggleMobileDrawer() {
            this.mobileDrawer = !this.mobileDrawer
        },
    },
})
