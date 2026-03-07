<template>
  <v-container fluid class="login-page fill-height pa-0">
    <!-- Animated background nodes -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <v-row no-gutters class="fill-height">
      <!-- Left side (Visual/Info) -->
      <v-col cols="12" md="6" class="d-none d-md-flex flex-column justify-center align-center auth-hero pa-12">
        <div class="hero-content">
          <v-chip color="rgba(255,255,255,0.2)" class="mb-4 text-white glass-chip" variant="flat">
            <v-icon start size="small">mdi-shield-check</v-icon>
            Secure Medical Gateway
          </v-chip>
          <h1 class="text-h2 font-weight-bold text-white mb-6">Welcome Back to <span class="accent-text">MediScan</span></h1>
          <p class="text-h6 text-white text-opacity-80 mb-8 font-weight-light">
            Access your intelligent diagnostic reports and medical history with the most advanced AI technology.
          </p>
          <div class="features-list">
            <div class="feature-item d-flex align-center mb-4">
              <v-icon color="white" class="mr-3">mdi-check-circle-outline</v-icon>
              <span class="text-white">Encrypted sensitive data protection</span>
            </div>
            <div class="feature-item d-flex align-center mb-4">
              <v-icon color="white" class="mr-3">mdi-check-circle-outline</v-icon>
              <span class="text-white">Real-time AI diagnostic assistance</span>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right side (Form) -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6">
        <v-card class="glass-card pa-8" width="100%" max-width="480" rounded="xl" elevation="0">
          <div class="text-center mb-8">
            <div class="logo-wrapper mb-4">
              <v-img
                src="/logo.png"
                alt="MediScan Branding"
                width="64"
                height="64"
                contain
              />
            </div>
            <h2 class="text-h4 font-weight-bold mb-2">Member Login</h2>
            <p class="text-body-1 text-medium-emphasis">Enter your credentials to continue</p>
          </div>

          <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email Address"
              placeholder="admin@mediscan.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              :rules="emailRules"
              :error="!!loginError"
              @update:model-value="loginError = ''"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              placeholder="••••••••"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              :rules="passwordRules"
              :error="!!loginError"
              @update:model-value="loginError = ''"
              @click:append-inner="showPassword = !showPassword"
              required
            ></v-text-field>

            <!-- Error message inline -->
            <v-alert
              v-if="loginError"
              type="error"
              variant="tonal"
              rounded="lg"
              density="compact"
              class="mb-4"
              :text="loginError"
              prepend-icon="mdi-alert-circle-outline"
            />

            <div class="d-flex align-center justify-space-between mb-6">
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                color="primary"
                hide-details
                density="compact"
              ></v-checkbox>
              <a href="#" class="text-caption text-primary font-weight-bold text-decoration-none">Forgot Password?</a>
            </div>

            <v-btn
              type="submit"
              color="primary"
              block
              size="x-large"
              rounded="lg"
              elevation="4"
              :loading="authStore.loading"
              :disabled="!valid"
              class="login-btn py-4"
            >
              Sign In
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-form>

          <div class="text-center mt-8">
            <p class="text-body-2 text-medium-emphasis">
              Don't have an account? 
              <v-btn variant="text" color="primary" density="compact" class="font-weight-bold" @click="$router.push('/register')">
                Create Account
              </v-btn>
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const valid = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loginError = ref('')

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]
const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters'
]

const handleLogin = async () => {
  loginError.value = ''
  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value
    })
    if (success) {
      appStore.showSnackbar('¡Bienvenido de nuevo!', 'success')
      router.push('/services')
    }
  } catch (err: any) {
    loginError.value = 'El email o la contraseña no son correctos.'
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  background-color: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.auth-hero {
  background: linear-gradient(135deg, #159a8e 0%, #0f8b81 100%);
  position: relative;
  color: white;

  .hero-content {
    max-width: 500px;
    z-index: 2;
  }

  .accent-text {
    color: #ffd166;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://www.transparenttextures.com/patterns/cubes.png');
    opacity: 0.1;
  }
}

.glass-card {
  background: rgba(var(--v-theme-surface), 0.8) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    transition: all 5s ease;
  }

  .blob-1 {
    width: 400px;
    height: 400px;
    background: rgb(var(--v-theme-primary));
    opacity: 0.15;
    top: -100px;
    right: -100px;
  }

  .blob-2 {
    width: 300px;
    height: 300px;
    background: rgb(var(--v-theme-secondary));
    opacity: 0.1;
    bottom: -50px;
    left: -50px;
  }
}

.logo-wrapper {
  display: inline-flex;
  padding: 12px;
  background: white; /* Logo usually needs white bg to pop if it's not transparent */
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(var(--v-theme-primary), 0.2);
}

.login-btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.glass-chip {
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
