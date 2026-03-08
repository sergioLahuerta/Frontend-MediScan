<template>
  <div class="faq-page">
    <app-header />
    
    <v-main>
      <section class="hero-section py-16">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8" class="text-center">
              <v-chip color="primary" variant="tonal" class="mb-4 font-weight-bold" rounded="lg">{{ $t('faq.badge') }}</v-chip>
              <h1 class="section-title mb-4">{{ $t('faq.title') }}</h1>
              <p class="text-subtitle-1 text-medium-emphasis">{{ $t('faq.subtitle') }}</p>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-expansion-panels variant="accordion" class="rounded-xl overflow-hidden shadow-sm">
              <v-expansion-panel
                v-for="n in 4"
                :key="n"
                class="faq-panel border-b-1"
                elevation="0"
              >
                <v-expansion-panel-title class="py-6 font-weight-bold text-primary">
                  {{ $t(`faq.q${n}`) }}
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pb-6 text-body-1 text-medium-emphasis">
                  {{ $t(`faq.a1`) }}
                  <template v-if="n === 1"> <!-- q1 and a1 are correct -->
                    {{ $t('faq.a1') }}
                  </template>
                  <template v-else-if="n === 2">
                     {{ $t('faq.a2') }}
                  </template>
                  <template v-else-if="n === 3">
                     {{ $t('faq.a3') }}
                  </template>
                  <template v-else-if="n === 4">
                     {{ $t('faq.a4') }}
                  </template>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Support CTA -->
            <v-card variant="flat" border class="mt-12 pa-8 rounded-xl text-center bg-surface-light">
              <h3 class="text-h6 font-weight-bold mb-2">{{ $t('contact.subtitle') }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-6">{{ $t('contact.form.responseTime') }}</p>
              <v-btn to="/contact" color="primary" size="large" rounded="lg" prepend-icon="mdi-message-outline">
                {{ $t('nav.contact') }}
              </v-btn>
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
.faq-panel {
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.02);
  }
}
</style>
