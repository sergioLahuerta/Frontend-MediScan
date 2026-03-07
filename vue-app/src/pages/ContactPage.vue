<template>
  <div>
    <app-header />

    <v-main style="padding-bottom: 80px;">
      <v-container class="contact-container py-8">

        <!-- Tabs Header -->
        <div class="text-center mb-12">
          <h1 class="section-title mb-3 text-on-surface">
            {{ $t('contact.title').split(' ')[0] }} {{ $t('contact.title').split(' ')[1] }} <span class="gradient-text">{{ $t('contact.title').split(' ').slice(2).join(' ') }}</span>
          </h1>
          <p class="section-subtitle mb-8 text-medium-emphasis">
            {{ $t('contact.subtitle') }}
          </p>
          
          <!-- Tab Pills -->
          <div class="tab-pills">
            <button 
              v-for="tab in ['contact', 'appointment']" 
              :key="tab"
              :class="['tab-pill', { active: activeTab === tab }]"
              @click="activeTab = tab"
            >
              <span>{{ $t(`contact.tabs.${tab}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Content Grid -->
        <v-row>
          <!-- Sidebar -->
          <v-col cols="12" md="4">
            <div class="d-flex flex-column" style="gap: 1.5rem;">

              <v-card rounded="lg" elevation="1" border class="bg-surface">
                <v-card-title class="pa-5 pb-3 font-weight-bold text-primary" style="font-size: 1rem;">
                  {{ $t('contact.info.title') }}
                </v-card-title>
                <v-card-text class="pa-5 pt-0">
                  <div
                    v-for="info in contactInfo"
                    :key="info.label"
                    class="d-flex align-start mb-6"
                  >
                    <v-avatar size="44" color="primary" variant="tonal" class="mr-3 flex-shrink-0">
                      <v-icon size="22">{{ info.icon }}</v-icon>
                    </v-avatar>
                    <div>
                      <p class="info-label">{{ $t(info.label) }}</p>
                      <p class="info-value" v-html="info.value"></p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Support Channels Card -->
              <v-card rounded="lg" elevation="1" border class="bg-surface">
                <v-card-title class="pa-5 pb-3 font-weight-bold text-primary" style="font-size: 1rem;">
                  {{ $t('contact.channels') }}
                </v-card-title>
                <v-card-text class="pa-5 pt-0">
                  <v-list density="compact" class="pa-0">
                    <v-list-item prepend-icon="mdi-chat-processing-outline" :title="$t('contact.channel.liveChat')" />
                    <v-list-item prepend-icon="mdi-help-circle-outline" :title="$t('contact.channel.helpCenter')" />
                    <v-list-item prepend-icon="mdi-frequently-asked-questions" :title="$t('contact.channel.faq')" />
                  </v-list>
                </v-card-text>
              </v-card>

              <!-- Social Links -->
              <div class="d-flex justify-center gap-4 py-4">
                <v-btn icon color="green-darken-1" variant="tonal" size="small"><v-icon>mdi-whatsapp</v-icon></v-btn>
                <v-btn icon color="blue" variant="tonal" size="small"><v-icon>mdi-twitter</v-icon></v-btn>
                <v-btn icon color="pink" variant="tonal" size="small"><v-icon>mdi-instagram</v-icon></v-btn>
                <v-btn icon color="blue-darken-3" variant="tonal" size="small"><v-icon>mdi-facebook</v-icon></v-btn>
              </div>

            </div>
          </v-col>

          <!-- Main Content Area -->
          <v-col cols="12" md="8">
            <v-fade-transition mode="out-in">
              <!-- Contact Form -->
              <v-card v-if="activeTab === 'contact'" key="contact" rounded="lg" elevation="1" border class="bg-surface">
                <v-card-title class="pa-6 pb-2 font-weight-bold text-primary" style="font-size: 1.2rem;">
                  {{ $t('contact.form.title') }}
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-form ref="contactForm" v-model="formValid" @submit.prevent="submitForm">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="form.firstName"
                          :label="$t('contact.form.name')"
                          :placeholder="$t('contact.form.placeholderName')"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-account"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="form.email"
                          :label="$t('contact.form.email')"
                          :placeholder="$t('contact.form.placeholderEmail')"
                          type="email"
                          :rules="[rules.required, rules.email]"
                          prepend-inner-icon="mdi-email"
                        />
                      </v-col>
                    </v-row>

                    <v-select
                      v-model="form.subject"
                      :label="$t('contact.form.reason')"
                      :items="translatedSubjectOptions"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-tag"
                      class="mb-2"
                    />

                    <v-textarea
                      v-model="form.message"
                      :label="$t('contact.form.message')"
                      :placeholder="$t('contact.form.placeholderMsg')"
                      :rules="[rules.required, rules.minLength]"
                      prepend-inner-icon="mdi-message-text"
                      rows="5"
                      class="mb-4"
                    />

                    <v-alert type="info" variant="tonal" density="compact" rounded="lg" class="mb-6">
                      {{ $t('contact.form.responseTime') }}
                    </v-alert>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="x-large"
                      rounded="lg"
                      block
                      :loading="isSubmitting"
                      :disabled="!formValid"
                    >
                      <v-icon start>mdi-send</v-icon>
                      {{ $t('contact.form.submit') }}
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>

              <!-- Appointment Form -->
              <v-card v-else-if="activeTab === 'appointment'" key="appointment" rounded="lg" elevation="1" border class="bg-surface">
                <v-card-title class="pa-6 pb-2 font-weight-bold text-primary" style="font-size: 1.2rem;">
                  {{ $t('contact.booking.title') }}
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-alert v-if="!authStore.isAuthenticated" type="info" variant="tonal" rounded="lg" class="mb-6">
                    {{ $t('contact.booking.loginRequired') }}
                    <template v-slot:append>
                      <v-btn color="primary" variant="flat" size="small" to="/login" class="ml-4">{{ $t('nav.login') }}</v-btn>
                    </template>
                  </v-alert>

                   <p class="mb-6 text-medium-emphasis">
                     {{ $t('contact.booking.subtitle') }}
                   </p>
                   
                   <v-form ref="appointmentForm" v-model="appointmentValid" @submit.prevent="confirmAppointment">
                     <v-select
                       v-model="booking.professionalId"
                       :label="$t('contact.booking.selectProfessional')"
                       :items="professionals"
                       item-title="name"
                       item-value="id"
                       prepend-inner-icon="mdi-doctor"
                       :rules="[rules.required]"
                       :loading="loadingProfessionals"
                       :placeholder="$t('contact.booking.placeholderProfessional')"
                       variant="outlined"
                       density="comfortable"
                       class="mb-4"
                     />

                     <v-row>
                       <v-col cols="12" sm="7">
                         <v-menu v-model="dateMenu" :close-on-content-click="false">
                           <template v-slot:activator="{ props }">
                             <v-text-field
                               v-bind="props"
                               :label="$t('contact.booking.date')"
                               v-model="booking.date"
                               prepend-inner-icon="mdi-calendar"
                               readonly
                               variant="outlined"
                               density="comfortable"
                               :rules="[rules.required]"
                             />
                           </template>
                           <v-date-picker
                             v-model="booking.dateObj"
                             color="primary"
                             @update:model-value="onDateSelected"
                             :min="today"
                           />
                         </v-menu>
                       </v-col>
                       <v-col cols="12" sm="5">
                         <v-select
                           v-model="booking.time"
                           :label="$t('contact.booking.time')"
                           :items="timeSlots"
                           prepend-inner-icon="mdi-clock-outline"
                           variant="outlined"
                           density="comfortable"
                           :rules="[rules.required]"
                         />
                       </v-col>
                     </v-row>

                     <v-textarea
                       v-model="booking.notes"
                       :label="$t('contact.booking.notesLabel')"
                       :placeholder="$t('contact.booking.notesPlaceholder')"
                       variant="outlined"
                       rows="2"
                       prepend-inner-icon="mdi-note-text-outline"
                       class="mb-4"
                     />

                     <v-btn 
                       block 
                       color="primary" 
                       size="large" 
                       rounded="lg" 
                       type="submit"
                       :loading="isBooking"
                       :disabled="!appointmentValid"
                     >
                       {{ $t('contact.booking.confirmBtn') }}
                     </v-btn>
                   </v-form>
                </v-card-text>
              </v-card>
            </v-fade-transition>
          </v-col>
        </v-row>

        <!-- Location -->
        <v-card rounded="lg" elevation="1" border class="mt-8 bg-surface">
          <v-card-text class="pa-8 text-center">
            <v-icon size="56" color="primary" class="mb-3">mdi-map-marker</v-icon>
            <h3 class="mb-2 font-weight-bold text-primary" style="font-size: 1.2rem;">{{ $t('contact.locationTitle') }}</h3>
            <p class="text-medium-emphasis">Calle Tecnología 123, Zaragoza — Spain, 50001</p>
            <v-btn
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mt-4"
              prepend-icon="mdi-google-maps"
              href="https://maps.google.com"
              target="_blank"
            >
              {{ $t('contact.mapsBtn') }}
            </v-btn>
          </v-card-text>
        </v-card>

      </v-container>
    </v-main>

    <app-footer />
    <bottom-nav />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'
import appointmentService from '@/services/appointmentService'
import professionalService, { Professional } from '@/services/professionalService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = ref('contact')
const appStore = useAppStore()
const authStore = useAuthStore()
const formValid = ref(false)
const appointmentValid = ref(false)
const isSubmitting = ref(false)
const isBooking = ref(false)
const contactForm = ref<any>(null)
const appointmentForm = ref<any>(null)

const today = new Date().toISOString().split('T')[0]
const dateMenu = ref(false)

const form = reactive({
  firstName: '',
  email: '',
  subject: '',
  message: '',
})

const booking = reactive({
  professionalId: '',
  date: '',
  dateObj: null as Date | null,
  time: '',
  notes: ''
})

const professionals = ref<Professional[]>([])
const loadingProfessionals = ref(false)
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
]

const rules = {
  required: (v: any) => !!v || t('validation.required'),
  email: (v: string) => /.+@.+\..+/.test(v) || t('validation.email'),
  minLength: (v: string) => v.length >= 10 || t('validation.minLength', { min: 10 }),
}

const subjectOptions = [
  'Technical Support',
  'Sales Inquiry',
  'General Question',
  'Feedback',
]

const translatedSubjectOptions = computed(() => {
  return subjectOptions.map(option => t(`contact.form.subjectOptions.${option.replace(/\s/g, '')}`))
})

const contactInfo = [
  { icon: 'mdi-map-marker', label: 'contact.info.direction', value: 'Calle Medicina 123, Piso 4<br>28001 Madrid, España' },
  { icon: 'mdi-phone', label: 'contact.info.phones', value: 'General: +34 91 123 45 67<br>Emergency: +34 600 123 456' },
  { icon: 'mdi-email', label: 'contact.info.emails', value: 'info@mediscan.com<br>soporte@mediscan.com' },
  { icon: 'mdi-clock-outline', label: 'contact.info.schedule', value: 'Mon - Fri: 9:00 - 20:00<br>Sat - Sun: 9:00 - 14:00' },
]

onMounted(async () => {
  // Professionals are loaded via watch when switching to 'appointment' tab
})

watch(activeTab, (newTab) => {
  if (newTab === 'appointment') {
    loadProfessionals()
  }
})

const loadProfessionals = async () => {
  if (professionals.value.length > 0) return
  loadingProfessionals.value = true
  try {
    professionals.value = await professionalService.getAll()
  } catch (err) {
    console.error('Failed to load professionals', err)
    // Fallback if API fails or is empty
    professionals.value = [
      { id: '1', name: 'Dr. Alejandro García', specialty: 'General Medicine', email: '' },
      { id: '2', name: 'Dra. María Lopez', specialty: 'Radiology', email: '' }
    ]
  } finally {
    loadingProfessionals.value = false
  }
}

const onDateSelected = (val: any) => {
  if (val) {
    const d = new Date(val)
    booking.date = d.toLocaleDateString()
    dateMenu.value = false
  }
}

const submitForm = async () => {
  if (!contactForm.value) return
  const { valid } = await contactForm.value.validate()
  if (!valid) return

  isSubmitting.value = true
  await new Promise((r) => setTimeout(r, 1500))
  isSubmitting.value = false

  appStore.showSnackbar('Message sent successfully! We\'ll get back to you soon.', 'success')
  contactForm.value.reset()
}

const confirmAppointment = async () => {
  if (!appointmentForm.value) return
  const { valid } = await appointmentForm.value.validate()
  if (!valid) return

  if (!authStore.user?.id) {
    appStore.showSnackbar('Please login to schedule an appointment', 'error')
    return
  }

  isBooking.value = true
  try {
    const scheduledAt = new Date(booking.dateObj!)
    const [hours, minutes] = booking.time.split(':')
    scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    await appointmentService.create({
      patientId: authStore.user.id,
      professionalId: booking.professionalId,
      scheduledAt: scheduledAt.toISOString(),
      status: 'Scheduled',
      notes: booking.notes
    })

    appStore.showSnackbar('Appointment scheduled successfully!', 'success')
    activeTab.value = 'contact' // Go back
    // Reset booking state
    Object.assign(booking, { professionalId: '', date: '', dateObj: null, time: '', notes: '' })
  } catch (err: any) {
    appStore.showSnackbar(err.message || 'Failed to schedule appointment', 'error')
  } finally {
    isBooking.value = false
  }
}
</script>

<style lang="scss" scoped>
.info-label {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  margin-bottom: 2px;
}
.info-value {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface));
  font-weight: 500;
}

.tab-pills {
  display: inline-flex;
  background: rgb(var(--v-theme-surface-light));
  border-radius: 50px;
  padding: 4px;
  gap: 2px;
}



.tab-pill {
  padding: 10px 24px;
  border-radius: 50px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  transition: all 0.25s ease;
}

.tab-pill.active {
  background: #159a8e;
  color: white;
  box-shadow: 0 4px 12px rgba(21, 154, 142, 0.3);
}

.tab-pill:hover:not(.active) {
  background: rgba(21, 154, 142, 0.1);
  color: #159a8e;
}
</style>
