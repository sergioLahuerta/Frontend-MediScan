<template>
  <div class="privacy-page">
    <app-header />
    
    <v-main>
      <section class="hero-section py-16">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8" class="text-center">
              <v-chip color="primary" variant="tonal" class="mb-4 font-weight-bold" rounded="lg">Privacidad</v-chip>
              <h1 class="section-title mb-4">{{ $t('privacy.title') }}</h1>
              <p class="text-subtitle-1 text-medium-emphasis">{{ $t('privacy.lastUpdated') }}</p>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card variant="flat" class="pa-8 rounded-xl border bg-surface">
              <div v-for="n in 4" :key="n" class="mb-10">
                <h2 class="text-h5 font-weight-bold mb-4 text-primary">
                  {{ $t(`privacy.section${n}Title`) }}
                </h2>
                <p class="text-body-1 text-medium-emphasis leading-relaxed">
                  {{ $t(`privacy.section${n}Content`) }}
                </p>
              </div>
              
              <v-divider class="my-8"></v-divider>
              
              <div class="text-center">
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ $t('privacy.contactPrompt') }}
                </p>
                <v-btn to="/contact" color="primary" variant="text" append-icon="mdi-arrow-right">
                  {{ $t('privacy.contactBtn') }}
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <app-footer />
    <bottom-nav />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'
</script>

<style lang="scss" scoped>
.hero-section {
  background: var(--v-theme-hero-gradient);
}
.leading-relaxed {
  line-height: 1.8;
}
</style>
