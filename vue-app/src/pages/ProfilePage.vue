<template>
  <div>
    <app-header />
    <v-main style="padding-bottom: 80px;">
      <v-container class="py-8">
        <div class="text-center mb-10">
          <v-avatar size="100" color="primary" class="mb-4">
            <v-icon size="60" color="white">mdi-account</v-icon>
          </v-avatar>
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

const authStore = useAuthStore()
const router = useRouter()

const appointments = ref<Appointment[]>([])
const loadingAppointments = ref(false)

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
