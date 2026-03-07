<template>
  <v-bottom-navigation
    v-model="activeNav"
    grow
    color="primary"
    class="d-md-none"
    border="t"
    height="70"
  >
    <v-btn value="home" to="/">
      <v-icon>mdi-home</v-icon>
      <span>{{ $t('nav.home') }}</span>
    </v-btn>

    <v-btn value="services" to="/services">
      <v-icon>mdi-format-list-bulleted</v-icon>
      <span>{{ $t('nav.services') }}</span>
    </v-btn>

    <v-btn value="simulator" to="/services" class="bottom-nav-main">
      <div class="nav-circle">
        <v-icon color="white" size="28">mdi-shield-check</v-icon>
      </div>
    </v-btn>

    <v-btn value="reports" to="/reports">
      <v-icon>mdi-file-document-outline</v-icon>
      <span>{{ $t('nav.reports') }}</span>
    </v-btn>

    <v-btn value="profile" to="/profile">
      <v-icon>mdi-account-circle-outline</v-icon>
      <span>{{ $t('nav.profile') }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const activeNav = ref('home')
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.v-bottom-navigation {
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
}

.bottom-nav-main {
  position: relative;
  overflow: visible !important;
  
  .nav-circle {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #159a8e 0%, #0f8b81 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(21, 154, 142, 0.3);
    border: 4px solid white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:active {
      transform: translateX(-50%) scale(0.9);
    }
  }
}

:deep(.v-btn--active) {
  .v-icon {
    color: #159a8e !important;
  }
}
</style>
