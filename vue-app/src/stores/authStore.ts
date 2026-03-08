import { defineStore } from 'pinia';
import authService from '@/services/authService';

interface UserInfo {
  id: string;
  email: string;
  roleId: string;
  profileImageUrl?: string;
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

function decodeJwt(token: string): Record<string, string> {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return {};
  }
}

function tokenToUser(token: string): UserInfo {
  const claims = decodeJwt(token);
  return {
    id: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
    email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
    roleId: claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
  };
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })(),
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roleId === '1',
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        const data = await authService.login(credentials);
        const token: string = data.token ?? data.Token;
        this.token = token;
        this.user = tokenToUser(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(this.user));
        await this.fetchUserProfile();
        return true;
      } catch (err: any) {
        this.error = err.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(userData: { email: string; password: string; roleId?: number }) {
      this.loading = true;
      this.error = null;
      try {
        const data = await authService.register(userData);
        if (data?.token || data?.Token) {
          const token: string = data.token ?? data.Token;
          this.token = token;
          this.user = tokenToUser(token);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(this.user));
          await this.fetchUserProfile();
        }
        return true;
      } catch (err: any) {
        this.error = err.message || 'Registration failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(data: { email: string; newPassword: string }) {
      this.loading = true;
      this.error = null;
      try {
        await authService.forgotPassword({
          email: data.email,
          newPassword: data.newPassword
        });
        return true;
      } catch (err: any) {
        this.error = err.message || 'Failed to update password';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    async fetchUserProfile() {
      if (!this.user?.id) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5073/api'}/Users/${this.user.id}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          if (this.user) {
            this.user.profileImageUrl = userData.profileImageUrl;
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        }
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    }
  }
});
