<template>
  <div>
    <app-header />
    <v-main style="padding-bottom: 80px;">
      <v-container class="py-8">
        <div class="text-center mb-10">
          <div class="avatar-container mb-4">
            <v-avatar size="120" color="primary-lighten-5" class="profile-avatar shadow-lg border">
              <v-img v-if="authStore.user?.profileImageUrl" :src="getFullImageUrl(authStore.user.profileImageUrl)" alt="Profile">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary-lighten-4"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-icon v-else size="64" color="primary">mdi-account</v-icon>
              
              <!-- Hover Overlay -->
              <div class="avatar-overlay d-flex align-center justify-center" @click="triggerFileInput">
                <v-icon color="white" size="32">mdi-camera-plus</v-icon>
                <div class="upload-text text-white font-weight-bold">Cambiar foto</div>
              </div>
              
              <!-- Loading Overlay -->
              <div v-if="isUploading" class="upload-loading d-flex align-center justify-center">
                <v-progress-circular indeterminate color="white" size="32"></v-progress-circular>
              </div>
            </v-avatar>
            <input
              ref="fileInput"
              type="file"
              class="d-none"
              accept="image/*"
              @change="onFileSelected"
            >
          </div>
          <h1 class="section-title mb-1 text-on-surface">{{ $t('profile.title') }}</h1>
          <p class="section-subtitle">{{ $t('profile.subtitle') }}</p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" class="mb-6 bg-surface">
              <v-card-title class="pa-4 pb-0 font-weight-bold text-on-surface">{{ $t('profile.accountInfo') }}</v-card-title>
              <v-list class="pa-4">
                <v-list-item prepend-icon="mdi-email-outline" title="Email" :subtitle="authStore.user?.email" />
                <v-divider class="my-2" />
                <v-list-item prepend-icon="mdi-shield-lock-outline" :title="$t('profile.security')" :subtitle="$t('profile.changePass')" link />
                <v-divider class="my-2" />
                <v-list-item prepend-icon="mdi-bell-outline" :title="$t('profile.notifications')" subtitle="Configurar avisos" link />
              </v-list>
            </v-card>

            <!-- Appointments Section -->
            <h2 class="text-h5 font-weight-bold mb-4 px-2 text-on-surface">{{ $t('profile.myAppointments') }}</h2>
            <v-card rounded="xl" elevation="2" class="mb-6 bg-surface">
              <v-list v-if="loadingAppointments" class="pa-4">
                <v-list-item>
                  <v-progress-circular indeterminate color="primary" size="24" class="mr-3" />
                  {{ $t('profile.loadingApts') }}
                </v-list-item>
              </v-list>
              <v-list v-else-if="appointments.length === 0" class="pa-4">
                <v-list-item :title="$t('profile.noApts')" :subtitle="$t('profile.noAptsSub')" />
              </v-list>
              <v-list v-else class="pa-4">
                <template v-for="(apt, index) in appointments" :key="apt.id">
                  <v-list-item
                    :title="formatDate(apt.scheduledAt)"
                    :subtitle="'Estado: ' + apt.status"
                    prepend-icon="mdi-calendar-check"
                  >
                    <template v-slot:append>
                      <v-chip size="small" :color="getStatusColor(apt.status)" variant="flat">
                        {{ apt.status }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  <v-divider v-if="index < appointments.length - 1" class="my-2" />
                </template>
              </v-list>
            </v-card>
            
            <v-btn block color="error" variant="tonal" class="mt-6" rounded="lg" @click="handleLogout">
              {{ $t('profile.logoutBtn') }}
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'
import appointmentService, { Appointment } from '@/services/appointmentService'
import userService from '@/services/userService'
import { useAppStore } from '@/stores/appStore'

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()

const appointments = ref<Appointment[]>([])
const loadingAppointments = ref(false)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const getFullImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5073/api').replace('/api', '')
  return `${baseUrl}${path}`
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    appStore.showSnackbar('Por favor selecciona una imagen válida', 'error')
    return
  }

  isUploading.value = true
  try {
    const result = await userService.uploadProfileImage(file)
    if (authStore.user) {
      authStore.user.profileImageUrl = result.profileImageUrl
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
    appStore.showSnackbar('Foto de perfil actualizada correctamente', 'success')
  } catch (err) {
    console.error('Error uploading profile image', err)
    appStore.showSnackbar('Error al subir la imagen', 'error')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

onMounted(async () => {
  fetchAppointments()
})

const fetchAppointments = async () => {
  if (!authStore.user?.id) return
  loadingAppointments.value = true
  try {
    const all = await appointmentService.getAll()
    // Filter for current user (this might be handled by backend usually, but for now we filter)
    appointments.value = all.filter(a => a.patientId === authStore.user?.id)
  } catch (err) {
    console.error('Error fetching appointments', err)
  } finally {
    loadingAppointments.value = false
  }
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled': return 'primary'
    case 'confirmed': return 'success'
    case 'cancelled': return 'error'
    default: return 'grey'
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.avatar-container {
  display: flex;
  justify-content: center;
  position: relative;
}

.profile-avatar {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(var(--v-theme-primary), 0.6);
  backdrop-filter: blur(2px);
  opacity: 0;
  flex-direction: column;
  transition: opacity 0.3s ease;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.upload-text {
  font-size: 0.75rem;
  margin-top: 4px;
}

.upload-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.shadow-lg {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}
</style>
