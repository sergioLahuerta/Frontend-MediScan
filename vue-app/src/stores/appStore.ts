import { defineStore } from 'pinia'

interface AppState {
  snackbar: {
    show: boolean;
    message: string;
    color: string;
  };
  mobileDrawer: boolean;
}

export const useAppStore = defineStore('app', {
    state: (): AppState => ({
        snackbar: {
            show: false,
            message: '',
            color: 'primary',
        },
        mobileDrawer: false,
    }),
    actions: {
        showSnackbar(message: string, color: string = 'primary') {
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
