<template>
  <div>
    <app-header />

    <v-main style="padding-bottom: 80px;">

      <!-- ==================== HERO SECTION ==================== -->
      <section class="hero-section">
        <v-container class="text-center position-relative" style="z-index: 1;">
          <div class="hero-badge mb-4">
            <v-chip color="primary" variant="tonal" size="small" prepend-icon="mdi-star-four-points">
              Futuristic Medical Technology
            </v-chip>
          </div>
          <h1 class="section-title mb-4" style="font-size: clamp(2rem, 5vw, 3.5rem);">
            <span class="gradient-text">Intelligent</span> Medical Analysis
          </h1>
          <p class="section-subtitle mb-8">
            Improve diagnostic accuracy through 3D visualization of medical images supported by
            artificial intelligence.
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
            Try AI Simulator
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
            Contact Us
          </v-btn>
        </v-container>
      </section>

      <!-- ==================== SERVICES SECTION ==================== -->
      <section class="py-16">
        <v-container>
          <div class="text-center mb-10">
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle mt-2">
              Cutting-edge technology for better medical outcomes
            </p>
          </div>

          <v-row>
            <v-col
              v-for="service in services"
              :key="service.title"
              cols="12" sm="6" lg="4"
            >
              <v-card class="service-card h-100" rounded="lg" elevation="1" border>
                <v-card-text class="pa-6">
                  <div class="card-icon-wrapper" :style="{ background: service.bg }">
                    {{ service.emoji }}
                  </div>
                  <h3 class="service-title mb-2">{{ service.title }}</h3>
                  <p class="service-desc">{{ service.description }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ==================== HOW IT WORKS ==================== -->
      <section class="py-16 bg-primary-light">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="section-title">How It Works</h2>
            <p class="section-subtitle mt-2">Three simple steps to better health insights</p>
          </div>
          <v-row justify="center">
            <v-col
              v-for="(step, i) in steps"
              :key="step.title"
              cols="12" sm="4"
            >
              <div class="step-card text-center px-4">
                <div class="step-number">{{ i + 1 }}</div>
                <div style="font-size: 2rem; margin-bottom: 1rem;">{{ step.emoji }}</div>
                <h3 class="step-title mb-2">{{ step.title }}</h3>
                <p class="step-desc">{{ step.description }}</p>
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
                <div class="stat-icon">{{ stat.icon }}</div>
                <div class="stat-number">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ==================== ROADMAP ==================== -->
      <section class="py-16">
        <v-container>
          <div class="text-center mb-10">
            <h2 class="section-title">Product Roadmap</h2>
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
                    {{ item.statusLabel }}
                  </v-chip>
                  <span class="roadmap-item-title">{{ item.title }}</span>
                </div>
                <p class="roadmap-item-desc">{{ item.description }}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ==================== CTA SECTION ==================== -->
      <section class="py-16 cta-bg">
        <v-container class="text-center">
          <h2 class="section-title mb-4" style="color: white;">
            Ready to Revolutionize Your Health?
          </h2>
          <p class="mb-8" style="color: rgba(255,255,255,0.8); font-size: 1.1rem;">
            Join thousands of users who are already using our technology.
          </p>
          <v-btn
            size="x-large"
            color="white"
            rounded="xl"
            class="mr-3 mb-3"
            style="color: #159a8e; font-weight: 700;"
            @click="$router.push('/services')"
          >
            Start Now
          </v-btn>
          <v-btn
            size="x-large"
            variant="outlined"
            color="white"
            rounded="xl"
            class="mb-3"
            @click="$router.push('/contact')"
          >
            Schedule Appointment
          </v-btn>
        </v-container>
      </section>

    </v-main>

    <app-footer />
    <bottom-nav />
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import BottomNav from '../components/BottomNav.vue'

export default {
  name: 'HomeView',
  components: { AppHeader, AppFooter, BottomNav },
  data() {
    return {
      services: [
        {
          emoji: '🔍',
          title: 'AI Diagnostics',
          description: 'AI trained with thousands of medical images to provide precise diagnostic predictions.',
          bg: '#e8faf7',
        },
        {
          emoji: '🎨',
          title: 'Interactive 3D Models',
          description: 'Explore human anatomy in 3D with clear, interactive models to learn anatomy.',
          bg: '#eff6ff',
        },
        {
          emoji: '📍',
          title: 'Biomarker Compensation',
          description: 'Upload images and compare them against similar cases, clearing valuable biomarker information.',
          bg: '#fef3c7',
        },
        {
          emoji: '👨‍⚕️',
          title: 'Online Medical Assistance',
          description: 'Verified medical professionals provide certified opinions based on your studies.',
          bg: '#f0fdf4',
        },
        {
          emoji: '📚',
          title: 'Training & Courses',
          description: 'Interactive courses and learning resources covering a variety of medical specialties.',
          bg: '#fdf4ff',
        },
        {
          emoji: '🎬',
          title: 'Visualization Kit',
          description: 'Advanced visualization tools to improve the interpretation of medical images.',
          bg: '#fff1f2',
        },
      ],
      steps: [
        { emoji: '📤', title: 'Upload Image', description: 'Upload a photo of the affected area or select a stored image.' },
        { emoji: '🤖', title: 'AI Analysis', description: 'Our AI analyzes and compares it with thousands of clinical cases.' },
        { emoji: '📋', title: 'Receive Report', description: 'Receive an enhanced diagnostic report with recommendations.' },
      ],
      stats: [
        { icon: '👥', value: '3K+', label: 'Active Users' },
        { icon: '🎯', value: '95%', label: 'AI Precision' },
        { icon: '✅', value: '1K+', label: 'Diagnostics Processed' },
      ],
      roadmap: [
        {
          title: 'Q4 2025 — Initial Release',
          description: 'Initial release of AI platform, 3D models, and diagnostic comparison system.',
          status: 'completed',
          statusLabel: '✓ Completed',
          color: 'success',
        },
        {
          title: 'Q1 2026 — Improvements',
          description: 'Improved medical interface, online assistance, and interactive courses.',
          status: 'in-progress',
          statusLabel: '⚙ In Progress',
          color: 'warning',
        },
        {
          title: 'Q2 2026 — Expansion',
          description: 'Expanded AI functionalities and highly accurate 3D anatomical models.',
          status: 'planned',
          statusLabel: '📋 Planned',
          color: 'secondary',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.hero-badge { display: flex; justify-content: center; }

.bg-primary-light { background: #e8faf7; }

.service-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}
.service-desc {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.6;
}

.step-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1f2937;
}
.step-desc {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.6;
}

.roadmap-item-title {
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
}
.roadmap-item-desc {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-top: 0.5rem;
}

.cta-bg {
  background: linear-gradient(135deg, #159a8e 0%, #0f8b81 100%);
}
</style>
