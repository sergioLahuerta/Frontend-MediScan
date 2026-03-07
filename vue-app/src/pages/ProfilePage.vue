<template>
  <div>
    <app-header />
    <v-main style="padding-bottom: 80px;">
      <v-container class="py-8">
        <div class="text-center mb-10">
          <v-avatar size="100" color="primary" class="mb-4">
            <v-icon size="60" color="white">mdi-account</v-icon>
          </v-avatar>
          <h1 class="section-title mb-1">Tu Perfil</h1>
          <p class="section-subtitle">Gestiona tu información y preferencias de salud.</p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2">
              <v-list class="pa-4">
                <v-list-item prepend-icon="mdi-email-outline" title="Email" subtitle="user@example.com" />
                <v-divider class="my-2" />
                <v-list-item prepend-icon="mdi-shield-lock-outline" title="Seguridad" subtitle="Cambiar contraseña" link />
                <v-divider class="my-2" />
                <v-list-item prepend-icon="mdi-bell-outline" title="Notificaciones" subtitle="Configurar avisos" link />
              </v-list>
            </v-card>
            
            <v-btn block color="error" variant="tonal" class="mt-6" rounded="lg" @click="handleLogout">
              Cerrar Sesión
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <app-footer />
    <bottom-nav />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
