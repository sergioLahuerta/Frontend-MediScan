<template>
  <div>
    <app-header />

    <v-main style="padding-bottom: 80px;">
      <v-container class="contact-container py-8">

        <!-- Tabs Header -->
        <div class="text-center mb-12">
          <h1 class="section-title mb-3">
            Get in <span class="gradient-text">Touch</span>
          </h1>
          <p class="section-subtitle mb-8">
            Do you have any questions or suggestions? We are here to help you.
          </p>
          
          <!-- Tab Pills -->
          <div class="tab-pills">
            <button
              class="tab-pill"
              :class="{ active: activeTab === 'contact' }"
              @click="activeTab = 'contact'"
            >
              <span>✉ Contact</span>
            </button>
            <button
              class="tab-pill"
              :class="{ active: activeTab === 'appointment' }"
              @click="activeTab = 'appointment'"
            >
              <span>📅 Schedule Appointment</span>
            </button>
          </div>
        </div>

        <!-- Content Grid -->
        <v-row>
          <!-- Sidebar -->
          <v-col cols="12" md="4">
            <div class="d-flex flex-column" style="gap: 1.5rem;">

              <!-- Contact Info Card -->
              <v-card rounded="lg" elevation="1" border>
                <v-card-title class="pa-5 pb-3" style="font-size: 1rem; font-weight: 600;">
                  Contact Information
                </v-card-title>
                <v-card-text class="pa-5 pt-0">
                  <div
                    v-for="info in contactInfo"
                    :key="info.label"
                    class="d-flex align-start mb-6"
                  >
                    <v-avatar size="44" color="primary-lighten-5" class="mr-3 flex-shrink-0">
                      <v-icon color="primary" size="22">{{ info.icon }}</v-icon>
                    </v-avatar>
                    <div>
                      <p class="info-label">{{ info.label }}</p>
                      <p class="info-value" v-html="info.value"></p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Support Channels Card -->
              <v-card rounded="lg" elevation="1" border>
                <v-card-title class="pa-5 pb-3" style="font-size: 1rem; font-weight: 600;">
                  Support Channels
                </v-card-title>
                <v-card-text class="pa-5 pt-0">
                  <v-list density="compact" class="pa-0">
                    <v-list-item prepend-icon="mdi-chat-processing-outline" title="Live Chat" />
                    <v-list-item prepend-icon="mdi-help-circle-outline" title="Help Center" />
                    <v-list-item prepend-icon="mdi-frequently-asked-questions" title="FAQ" />
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
              <v-card v-if="activeTab === 'contact'" key="contact" rounded="lg" elevation="1" border>
                <v-card-title class="pa-6 pb-2" style="font-size: 1.2rem; font-weight: 600;">
                  Send us a Message
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-form ref="contactForm" v-model="formValid" @submit.prevent="submitForm">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="form.firstName"
                          label="Full Name"
                          placeholder="Your full name"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-account"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="form.email"
                          label="Email Address"
                          placeholder="your@email.com"
                          type="email"
                          :rules="[rules.required, rules.email]"
                          prepend-inner-icon="mdi-email"
                        />
                      </v-col>
                    </v-row>

                    <v-select
                      v-model="form.subject"
                      label="Reason"
                      :items="subjectOptions"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-tag"
                      class="mb-2"
                    />

                    <v-textarea
                      v-model="form.message"
                      label="Your Message"
                      placeholder="How can we help you?"
                      :rules="[rules.required, rules.minLength]"
                      prepend-inner-icon="mdi-message-text"
                      rows="5"
                      class="mb-4"
                    />

                    <v-alert type="info" variant="tonal" density="compact" rounded="lg" class="mb-6">
                      Estimated response time: 24-48 business hours.
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
                      Submit
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>

              <!-- Appointment Form -->
              <v-card v-else-if="activeTab === 'appointment'" key="appointment" rounded="lg" elevation="1" border>
                <v-card-title class="pa-6 pb-2" style="font-size: 1.2rem; font-weight: 600;">
                  Schedule an Appointment
                </v-card-title>
                <v-card-text class="pa-6">
                   <p class="mb-6 text-medium-emphasis">Select a professional, date and time for your medical consultation.</p>
                   
                   <v-form ref="appointmentForm" v-model="appointmentValid" @submit.prevent="confirmAppointment">
                     <v-select
                       v-model="booking.professionalId"
                       label="Select Professional"
                       :items="professionals"
                       item-title="name"
                       item-value="id"
                       prepend-inner-icon="mdi-doctor"
                       :rules="[rules.required]"
                       :loading="loadingProfessionals"
                       placeholder="Choose a doctor"
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
                               label="Date"
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
                           label="Time"
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
                       label="Notes (Optional)"
                       placeholder="Symptoms or reason for visit"
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
                       Confirm Appointment
                     </v-btn>
                   </v-form>
                </v-card-text>
              </v-card>
            </v-fade-transition>
          </v-col>
        </v-row>

        <!-- Location -->
        <v-card rounded="lg" elevation="1" border class="mt-8">
          <v-card-text class="pa-8 text-center">
            <v-icon size="56" color="primary" class="mb-3">mdi-map-marker</v-icon>
            <h3 class="mb-2" style="font-size: 1.2rem; font-weight: 600;">Our Location</h3>
            <p style="color: #6b7280;">Calle Tecnología 123, Zaragoza — Spain, 50001</p>
            <v-btn
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mt-4"
              prepend-icon="mdi-google-maps"
              href="https://maps.google.com"
              target="_blank"
            >
              Open in Google Maps
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'
import appointmentService from '@/services/appointmentService'
import professionalService, { Professional } from '@/services/professionalService'

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
  required: (v: any) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email address',
  minLength: (v: string) => v.length >= 10 || 'Message too short (min 10 characters)',
}

const subjectOptions = [
  'Technical Support',
  'Sales Inquiry',
  'General Question',
  'Feedback',
]

const contactInfo = [
  { icon: 'mdi-map-marker', label: 'Direction', value: 'Calle Medicina 123, Piso 4<br>28001 Madrid, España' },
  { icon: 'mdi-phone', label: 'Phones', value: 'General: +34 91 123 45 67<br>Emergency: +34 600 123 456' },
  { icon: 'mdi-email', label: 'Emails', value: 'info@mediscan.com<br>soporte@mediscan.com' },
  { icon: 'mdi-clock-outline', label: 'Schedule', value: 'Mon - Fri: 9:00 - 20:00<br>Sat - Sun: 9:00 - 14:00' },
]

onMounted(async () => {
  loadProfessionals()
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
  color: #9ca3af;
  margin-bottom: 2px;
}
.info-value {
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 500;
}

/* Tab Pills */
.tab-pills {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50px;
  padding: 4px;
  gap: 2px;
}

:global(.v-theme--dark) .tab-pills {
  background: rgba(255, 255, 255, 0.08);
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
  color: #6b7280;
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
