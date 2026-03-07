<template>
  <v-container fluid class="register-page fill-height pa-0">
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <v-row no-gutters class="fill-height">
      <!-- Right side (Form) -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6 order-md-2">
        <v-card class="glass-card pa-8" width="100%" max-width="480" rounded="xl" elevation="0">
          <div class="text-center mb-8">
            <div class="logo-wrapper mb-4 d-inline-flex pa-3 bg-white rounded-xl shadow-sm">
              <v-img
                src="/logo.png"
                alt="MediScan Branding"
                width="64"
                height="64"
                contain
              />
            </div>
            <h2 class="text-h4 font-weight-bold mb-2">Create Account</h2>
            <p class="text-body-1 text-medium-emphasis">Join the MediScan community</p>
          </div>

          <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
            <v-text-field
              v-model="email"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Contraseña"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-1"
              :rules="passwordRules"
              @click:append-inner="showPassword = !showPassword"
              required
            ></v-text-field>

            <!-- Password strength indicator -->
            <div v-if="password" class="mb-4 px-1">
              <div class="d-flex gap-1 mb-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="strength-bar"
                  :class="{
                    'weak':   i <= passwordStrength && passwordStrength === 1,
                    'fair':   i <= passwordStrength && passwordStrength === 2,
                    'good':   i <= passwordStrength && passwordStrength === 3,
                    'strong': i <= passwordStrength && passwordStrength === 4,
                  }"
                />
              </div>
              <span class="text-caption" :class="strengthColor">
                {{ strengthLabel }}
              </span>
            </div>

            <v-text-field
              v-model="confirmPassword"
              label="Confirmar contraseña"
              prepend-inner-icon="mdi-lock-check-outline"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-6"
              :rules="confirmPasswordRules"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              block
              size="x-large"
              rounded="lg"
              elevation="4"
              :loading="authStore.loading"
              :disabled="!valid"
              class="register-btn py-4"
            >
              Get Started
              <v-icon end>mdi-account-plus</v-icon>
            </v-btn>
          </v-form>

          <div class="text-center mt-8">
            <p class="text-body-2 text-medium-emphasis">
              Already have an account? 
              <v-btn variant="text" color="primary" density="compact" class="font-weight-bold" @click="$router.push('/login')">
                Sign In
              </v-btn>
            </p>
          </div>
        </v-card>
      </v-col>

      <!-- Left side (Info) -->
      <v-col cols="12" md="6" class="d-none d-md-flex flex-column justify-center align-center auth-hero pa-12 order-md-1">
        <div class="hero-content">
          <h1 class="text-h2 font-weight-bold text-white mb-6 text-right">Start Your <span class="accent-text">Journey</span></h1>
          <p class="text-h6 text-white text-opacity-80 mb-8 font-weight-light text-right">
            Join thousands of health professionals and patients using AI to improve outcomes and monitor health status accurately.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const valid = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const emailRules = [
  (v: string) => !!v || 'Email es obligatorio',
  (v: string) => /.+@.+\..+/.test(v) || 'El email no es válido',
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es obligatoria',
  (v: string) => v.length >= 8 || 'Mínimo 8 caracteres',
  (v: string) => /[A-Z]/.test(v) || 'Debe contener al menos una letra mayúscula',
  (v: string) => /[0-9]/.test(v) || 'Debe contener al menos un número',
  (v: string) => /[^A-Za-z0-9]/.test(v) || 'Debe contener al menos un carácter especial (!@#$...)',
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Por favor confirma tu contraseña',
  (v: string) => v === password.value || 'Las contraseñas no coinciden',
]

// Password strength score 1-4
const passwordStrength = computed(() => {
  if (!password.value) return 0
  let score = 0
  if (password.value.length >= 8) score++
  if (/[A-Z]/.test(password.value)) score++
  if (/[0-9]/.test(password.value)) score++
  if (/[^A-Za-z0-9]/.test(password.value)) score++
  return score
})

const strengthLabel = computed(() => {
  const labels = ['', 'Muy débil', 'Débil', 'Aceptable', 'Segura ✓']
  return labels[passwordStrength.value]
})

const strengthColor = computed(() => {
  const colors = ['', 'text-red', 'text-orange', 'text-amber-darken-2', 'text-success']
  return colors[passwordStrength.value]
})

const handleRegister = async () => {
  try {
    const success = await authStore.register({
      email: email.value,
      password: password.value
    })
    if (success) {
      appStore.showSnackbar('Account created! You can now login.', 'success')
      router.push('/login')
    }
  } catch (err: any) {
    appStore.showSnackbar(err.message || 'Registration failed', 'error')
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  background-color: rgb(var(--v-theme-background));
}

.auth-hero {
  background: linear-gradient(225deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
}

.glass-card {
  background: rgba(var(--v-theme-surface), 0.8) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.accent-text {
  color: rgb(var(--v-theme-accent));
}

.strength-bar {
  height: 4px;
  flex: 1;
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  transition: background 0.3s ease;

  &.weak   { background: #ef4444; }
  &.fair   { background: #f97316; }
  &.good   { background: #f59e0b; }
  &.strong { background: #22c55e; }
}
</style>
