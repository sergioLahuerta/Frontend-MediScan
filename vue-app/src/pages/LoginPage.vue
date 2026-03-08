<template>
  <v-container fluid class="login-page fill-height pa-0">
    <!-- Animated background nodes -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Toggles Top Left -->
    <div class="page-toggles pa-4 d-flex align-center ga-3">
      <v-btn 
        icon 
        variant="tonal" 
        color="white" 
        size="small"
        class="glass-toggle"
        @click="toggleTheme"
      >
        <v-icon size="small">{{ theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="tonal"
            color="white"
            size="small"
            class="px-2 font-weight-bold glass-toggle"
            style="min-width: 44px; height: 32px;"
            v-bind="props"
          >
            <v-icon start size="small">mdi-translate</v-icon>
            {{ locale.toUpperCase() }}
          </v-btn>
        </template>
        <v-list density="compact" rounded="lg" class="pa-2">
          <v-list-item
            v-for="lang in [{ code: 'en', label: 'English' }, { code: 'es', label: 'Español' }]"
            :key="lang.code"
            :value="lang.code"
            :active="locale === lang.code"
            color="primary"
            rounded="md"
            @click="locale = lang.code"
          >
            <v-list-item-title class="text-caption font-weight-bold">{{ lang.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-row no-gutters class="fill-height">
      <!-- Left side (Visual/Info) -->
      <v-col cols="12" md="6" class="d-none d-md-flex flex-column justify-center align-center auth-hero pa-12">
        <div class="hero-content">
          <v-chip color="rgba(255,255,255,0.2)" class="mb-4 text-white glass-chip" variant="flat">
            <v-icon start size="small">mdi-shield-check</v-icon>
            {{ $t('auth.featureSecure') }}
          </v-chip>
          <h1 class="text-h2 font-weight-bold text-white mb-6">{{ $t('auth.heroLoginTitle') }} <span class="accent-text">MediScan</span></h1>
          <p class="text-h6 text-white text-opacity-80 mb-8 font-weight-light">
            {{ $t('auth.heroLoginSubtitle') }}
          </p>
          <div class="features-list">
            <div class="feature-item d-flex align-center mb-4">
              <v-icon color="white" class="mr-3">mdi-check-circle-outline</v-icon>
              <span class="text-white">{{ $t('auth.featureEncrypted') }}</span>
            </div>
            <div class="feature-item d-flex align-center mb-4">
              <v-icon color="white" class="mr-3">mdi-check-circle-outline</v-icon>
              <span class="text-white">{{ $t('auth.featureRealTime') }}</span>
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
            <h2 class="text-h4 font-weight-bold mb-2">{{ $t('auth.loginTitle') }}</h2>
            <p class="text-body-1 text-medium-emphasis">{{ $t('auth.loginSubtitle') }}</p>
          </div>

          <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              :label="$t('auth.emailLabel')"
              :placeholder="$t('auth.emailPlaceholder')"
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
              :label="$t('auth.passwordLabel')"
              :placeholder="$t('auth.passwordPlaceholder')"
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
                :label="$t('auth.rememberMe')"
                color="primary"
                hide-details
                density="compact"
              ></v-checkbox>
              <a href="#" @click.prevent="forgotPasswordDialog = true" class="text-caption text-primary font-weight-bold text-decoration-none">{{ $t('auth.forgotPassword') }}</a>
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
              {{ $t('auth.signInBtn') }}
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-form>

          <div class="text-center mt-8">
            <p class="text-body-2 text-medium-emphasis">
              {{ $t('auth.noAccount') }} 
              <v-btn variant="text" color="primary" density="compact" class="font-weight-bold" @click="$router.push('/register')">
                {{ $t('auth.createAccountBtn') }}
              </v-btn>
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="forgotPasswordDialog" max-width="450" persistent>
      <v-card class="glass-card pa-6" rounded="xl">
        <v-card-title class="text-h5 font-weight-bold px-0 d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-lock-reset</v-icon>
          {{ $t('auth.forgotPasswordTitle') }}
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="small" @click="forgotPasswordDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="px-0 pt-2 pb-6">
          <p class="text-body-2 text-medium-emphasis mb-6">
            {{ $t('auth.forgotPasswordSubtitle') }}
          </p>
          
          <v-form v-model="forgotValid" @submit.prevent="handleForgotPassword">
            <v-text-field
              v-model="forgotEmail"
              :label="$t('auth.emailLabel')"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="forgotNewPassword"
              :label="$t('auth.newPasswordLabel')"
              prepend-inner-icon="mdi-lock-outline"
              :type="showForgotPassword ? 'text' : 'password'"
              :append-inner-icon="showForgotPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showForgotPassword = !showForgotPassword"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-2"
              :rules="passwordRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-0 pb-0">
          <v-btn
            color="primary"
            block
            size="large"
            rounded="lg"
            variant="flat"
            :loading="authStore.loading"
            :disabled="!forgotValid"
            @click="handleForgotPassword"
          >
            {{ $t('auth.resetPasswordBtn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const theme = useTheme()
const i18n = useI18n()
const { locale } = i18n

const valid = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loginError = ref('')

// Forgot Password
const forgotPasswordDialog = ref(false)
const forgotEmail = ref('')
const forgotNewPassword = ref('')
const forgotValid = ref(false)
const showForgotPassword = ref(false)

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const emailRules = [
  (v: string) => !!v || i18n.t('validation.required'),
  (v: string) => /.+@.+\..+/.test(v) || i18n.t('validation.email')
]
const passwordRules = [
  (v: string) => !!v || i18n.t('validation.required'),
  (v: string) => v.length >= 6 || i18n.t('validation.passLength', { min: 6 })
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

const handleForgotPassword = async () => {
  if (!forgotValid.value) return
  
  try {
    await authStore.forgotPassword({
      email: forgotEmail.value,
      newPassword: forgotNewPassword.value
    })
    
    appStore.showSnackbar(i18n.t('auth.passwordUpdated'), 'success')
    forgotPasswordDialog.value = false
    // Clear fields
    forgotEmail.value = ''
    forgotNewPassword.value = ''
  } catch (err: any) {
    const errorMsg = err.Message || err.message || i18n.t('auth.userNotFound')
    appStore.showSnackbar(errorMsg, 'error')
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  background-color: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.page-toggles {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}

.glass-toggle {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white !important;
}

.auth-hero {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
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
