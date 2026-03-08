<template>
  <div>
    <app-header />

    <v-main style="padding-bottom: 80px;">

      <!-- ==================== HERO SECTION ==================== -->
      <section class="hero-section">
        <v-container class="text-center position-relative" style="z-index: 1;">
          <div class="hero-badge mb-4">
            <v-chip color="primary" variant="flat" size="small" prepend-icon="mdi-star-four-points" class="px-4">
              {{ $t('home.heroBadge') }}
            </v-chip>
          </div>
          <h1 class="section-title mb-4" style="font-size: clamp(2rem, 5vw, 3.5rem);">
            <span class="gradient-text">{{ $t('home.heroTitle').split(' ')[0] }}</span> {{ $t('home.heroTitle').split(' ').slice(1).join(' ') }}
          </h1>
          <p class="section-subtitle mb-8">
            {{ $t('home.heroSubtitle') }}
          </p>
          <v-btn
            color="primary"
            size="x-large"
            rounded="xl"
            class="mr-3 mb-3"
            elevation="4"
            @click="$router.push('/services')"
          >
            <v-icon start>mdi-robot-happy</v-icon>
            {{ $t('home.heroCTA') }}
          </v-btn>
          <v-btn
            size="x-large"
            rounded="xl"
            variant="outlined"
            color="primary"
            class="mb-3"
            @click="$router.push('/contact')"
          >
            <v-icon start>mdi-phone</v-icon>
            {{ $t('home.contactCTA') }}
          </v-btn>
        </v-container>
      </section>

      <!-- ==================== SERVICES SECTION ==================== -->
      <section id="services" class="py-16">
        <v-container>
          <div class="text-center mb-10">
            <h2 class="section-title">{{ $t('home.servicesTitle') }}</h2>
            <p class="section-subtitle mt-2">
              {{ $t('home.servicesSubtitle') }}
            </p>
          </div>

          <v-row>
            <v-col
              v-for="service in services"
              :key="service.title"
              cols="12" sm="6" lg="4"
            >
              <v-card class="service-card h-100" rounded="xl" elevation="2">
                <v-card-text class="pa-6">
                  <div class="card-icon-wrapper" :style="{ background: service.bg }">
                    <v-icon :icon="service.icon" color="primary" size="32"></v-icon>
                  </div>
                  <h3 class="service-title mb-2">{{ $t(service.title) }}</h3>
                  <p class="service-desc">{{ $t(service.description) }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ==================== HOW IT WORKS ==================== -->
      <section class="py-16 bg-surface-light">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="section-title">{{ $t('home.howTitle') }}</h2>
            <p class="section-subtitle mt-2">{{ $t('home.howSubtitle') }}</p>
          </div>
          <v-row justify="center">
            <v-col
              v-for="(step, i) in steps"
              :key="step.title"
              cols="12" sm="4"
            >
              <div class="step-card text-center px-4">
                <div class="step-number">{{ i + 1 }}</div>
                <v-icon :icon="step.icon" size="48" color="primary" class="mb-4"></v-icon>
                <h3 class="step-title mb-2">{{ $t(step.title) }}</h3>
                <p class="step-desc">{{ $t(step.description) }}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ==================== STATS ==================== -->
      <section class="stats-section">
        <v-container>
          <v-row justify="center">
            <v-col
              v-for="stat in stats"
              :key="stat.label"
              cols="12" sm="4"
              class="text-center"
            >
              <div class="stat-item">
                <v-icon :icon="stat.icon" size="48" class="mb-2"></v-icon>
                <div class="stat-number">{{ stat.value }}</div>
                <div class="stat-label">{{ $t(stat.label) }}</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ==================== ROADMAP ==================== -->
      <section class="py-16">
        <v-container>
          <div class="text-center mb-10">
            <h2 class="section-title">{{ $t('home.roadmapTitle') }}</h2>
          </div>
          <v-row justify="center">
            <v-col cols="12" md="8">
              <div
                v-for="item in roadmap"
                :key="item.title"
                class="roadmap-item mb-8"
                :class="`roadmap-item--${item.status}`"
              >
                <div class="d-flex align-center gap-3 mb-2">
                  <v-chip :color="item.color" size="small" variant="tonal">
                    {{ $t(item.statusLabel) }}
                  </v-chip>
                  <span class="roadmap-item-title">{{ $t(item.title) }}</span>
                </div>
                <p class="roadmap-item-desc">{{ $t(item.description) }}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ==================== CTA SECTION ==================== -->
      <section class="py-16 cta-bg mt-16">
        <v-container class="text-center">
          <h2 class="section-title mb-4" style="color: white;">
            {{ $t('home.ctaTitle') }}
          </h2>
          <p class="mb-8" style="color: rgba(255,255,255,0.8); font-size: 1.1rem;">
            {{ $t('home.ctaSubtitle') }}
          </p>
          <v-btn
            size="x-large"
            color="white"
            rounded="xl"
            class="mr-3 mb-3"
            style="color: #159a8e; font-weight: 700;"
            @click="$router.push('/services')"
          >
            {{ $t('home.ctaBtnStart') }}
          </v-btn>
          <v-btn
            size="x-large"
            variant="outlined"
            color="white"
            rounded="xl"
            class="mb-3"
            @click="$router.push('/contact')"
          >
            {{ $t('home.ctaBtnSchedule') }}
          </v-btn>
        </v-container>
      </section>

    </v-main>

    <app-footer />
    <bottom-nav />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'

const services = [
  { icon: 'mdi-file-find-outline', title: 'home.services.aiAnalysis.title', description: 'home.services.aiAnalysis.desc', bg: 'rgba(21, 154, 142, 0.1)' },
  { icon: 'mdi-cube-outline', title: 'home.services.models3d.title', description: 'home.services.models3d.desc', bg: 'rgba(21, 154, 142, 0.1)' },
  { icon: 'mdi-chart-bell-curve-cumulative', title: 'home.services.reports.title', description: 'home.services.reports.desc', bg: 'rgba(21, 154, 142, 0.1)' },
  { icon: 'mdi-doctor', title: 'home.services.telemedicine.title', description: 'home.services.telemedicine.desc', bg: 'rgba(21, 154, 142, 0.1)' },
  { icon: 'mdi-book-open-variant', title: 'home.services.tracking.title', description: 'home.services.tracking.desc', bg: 'rgba(21, 154, 142, 0.1)' },
  { icon: 'mdi-folder-eye-outline', title: 'home.services.security.title', description: 'home.services.security.desc', bg: 'rgba(21, 154, 142, 0.1)' },
]

const steps = [
  { icon: 'mdi-cloud-upload-outline', title: 'home.steps.uploadTitle', description: 'home.steps.uploadDesc' },
  { icon: 'mdi-brain', title: 'home.steps.analysisTitle', description: 'home.steps.analysisDesc' },
  { icon: 'mdi-clipboard-text-outline', title: 'home.steps.reportTitle', description: 'home.steps.reportDesc' },
]

const stats = [
  { icon: 'mdi-account-group-outline', value: '3K+', label: 'home.stats.users' },
  { icon: 'mdi-target', value: '95%', label: 'home.stats.precision' },
  { icon: 'mdi-check-decagram-outline', value: '1K+', label: 'home.stats.processed' },
]

const roadmap = [
  {
    title: 'home.roadmapTitle',
    description: 'home.ctaSubtitle',
    status: 'completed',
    statusLabel: '✓ Completed',
    color: 'success',
  },
]
</script>

<style lang="scss" scoped>
.hero-badge { display: flex; justify-content: center; }

.service-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
.service-desc {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  font-size: 0.9rem;
  line-height: 1.6;
}

.step-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
.step-desc {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  font-size: 0.9rem;
  line-height: 1.6;
}

.roadmap-item-title {
  font-weight: 600;
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
}
.roadmap-item-desc {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-top: 0.5rem;
}

.cta-bg {
  background: linear-gradient(135deg, #159a8e 0%, #0f8b81 100%);
}
</style>
