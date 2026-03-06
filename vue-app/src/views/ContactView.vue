<template>
  <div>
    <app-header />

    <v-main style="padding-bottom: 80px;">
      <v-container class="contact-container py-8">

        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="section-title mb-3">
            Get in <span class="gradient-text">Touch</span>
          </h1>
          <p class="section-subtitle mb-6">
            Have questions about MediScan? We're here to help you 24/7.
          </p>
          <div class="d-flex justify-center flex-wrap" style="gap: 1rem;">
            <v-btn
              color="primary"
              size="large"
              rounded="lg"
              prepend-icon="mdi-phone"
              href="tel:+34911234567"
            >
              Call Us
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="large"
              rounded="lg"
              prepend-icon="mdi-email"
              href="mailto:info@mediscan.com"
            >
              Send Email
            </v-btn>
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
                    class="d-flex align-start mb-4"
                  >
                    <v-avatar size="40" color="primary" class="mr-3 flex-shrink-0">
                      <v-icon color="white" size="20">{{ info.icon }}</v-icon>
                    </v-avatar>
                    <div>
                      <p class="info-label">{{ info.label }}</p>
                      <p class="info-value">{{ info.value }}</p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Hours Card -->
              <v-card rounded="lg" elevation="1" border>
                <v-card-title class="pa-5 pb-3" style="font-size: 1rem; font-weight: 600;">
                  Business Hours
                </v-card-title>
                <v-card-text class="pa-5 pt-0">
                  <div v-for="hours in businessHours" :key="hours.days" class="d-flex justify-space-between mb-2">
                    <span class="info-label">{{ hours.days }}</span>
                    <span class="info-value">{{ hours.time }}</span>
                  </div>
                </v-card-text>
              </v-card>

            </div>
          </v-col>

          <!-- Contact Form -->
          <v-col cols="12" md="8">
            <v-card rounded="lg" elevation="1" border>
              <v-card-title class="pa-6 pb-2" style="font-size: 1.2rem; font-weight: 600;">
                Send us a Message
              </v-card-title>
              <v-card-text class="pa-6">
                <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">

                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.firstName"
                        label="First Name"
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-account"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.lastName"
                        label="Last Name"
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-account"
                      />
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model="form.email"
                    label="Email Address"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    prepend-inner-icon="mdi-email"
                    class="mb-2"
                  />

                  <v-select
                    v-model="form.subject"
                    label="Subject"
                    :items="subjectOptions"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-tag"
                    class="mb-2"
                  />

                  <v-textarea
                    v-model="form.message"
                    label="Your Message"
                    :rules="[rules.required, rules.minLength]"
                    prepend-inner-icon="mdi-message-text"
                    rows="5"
                    class="mb-4"
                  />

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
                    Send Message
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
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

<script>
import { useAppStore } from '../stores/appStore'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import BottomNav from '../components/BottomNav.vue'

export default {
  name: 'ContactView',
  components: { AppHeader, AppFooter, BottomNav },
  setup() {
    const appStore = useAppStore()
    return { appStore }
  },
  data() {
    return {
      formValid: false,
      isSubmitting: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      },
      rules: {
        required: (v) => !!v || 'This field is required',
        email: (v) => /.+@.+\..+/.test(v) || 'Invalid email address',
        minLength: (v) => v.length >= 20 || 'Message too short (min 20 characters)',
      },
      subjectOptions: [
        'General Enquiry',
        'Technical Support',
        'Medical Consultation',
        'Partnership',
        'Billing & Plans',
        'Other',
      ],
      contactInfo: [
        { icon: 'mdi-email', label: 'Email', value: 'info@mediscan.com' },
        { icon: 'mdi-phone', label: 'Phone', value: '+34 91 123 45 67' },
        { icon: 'mdi-map-marker', label: 'Location', value: 'Zaragoza, Spain' },
      ],
      businessHours: [
        { days: 'Mon – Fri', time: '9:00 – 18:00' },
        { days: 'Saturday', time: '10:00 – 14:00' },
        { days: 'Sunday', time: 'Closed' },
      ],
    }
  },
  methods: {
    async submitForm() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.isSubmitting = true
      // Simula envío de formulario
      await new Promise((r) => setTimeout(r, 1500))
      this.isSubmitting = false

      this.appStore.showSnackbar('Message sent successfully! We\'ll get back to you soon.', 'success')
      this.$refs.form.reset()
    },
  },
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
</style>
