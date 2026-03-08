<template>
  <v-fade-transition>
    <div v-if="isVisible" class="cookie-consent-wrapper">
      <v-card class="cookie-card pa-6 rounded-xl shadow-lg border bg-surface" max-width="500">
        <div class="d-flex align-start ga-4">
          <v-avatar color="primary-lighten-5" size="48">
            <v-icon color="primary" size="24">mdi-cookie-outline</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <h3 class="text-subtitle-1 font-weight-bold mb-1 text-primary">Cookies & Privacy</h3>
            <p class="text-body-2 text-medium-emphasis leading-snug mb-4">
              {{ $t('cookies.message') }}
            </p>
            <div class="d-flex ga-2 justify-end">
              <v-btn
                variant="text"
                size="small"
                color="medium-emphasis"
                class="text-none"
                @click="declineCookies"
              >
                {{ $t('cookies.decline') }}
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                class="px-6 rounded-lg text-none"
                elevation="0"
                @click="acceptCookies"
              >
                {{ $t('cookies.accept') }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </v-fade-transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  const consent = localStorage.getItem('mediscan_cookie_consent')
  if (!consent) {
    setTimeout(() => {
      isVisible.value = true
    }, 1500)
  }
})

const acceptCookies = () => {
  localStorage.setItem('mediscan_cookie_consent', 'accepted')
  isVisible.value = false
}

const declineCookies = () => {
  localStorage.setItem('mediscan_cookie_consent', 'declined')
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
.cookie-consent-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  width: calc(100% - 48px);
  max-width: 500px;
}

.cookie-card {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.9) !important;
  animation: slideUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 600px) {
  .cookie-consent-wrapper {
    bottom: 80px;
    left: 12px;
    right: 12px;
    width: auto;
  }
}
</style>
