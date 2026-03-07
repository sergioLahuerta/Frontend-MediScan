<template>
  <div>
    <app-header />
    <v-main style="padding-bottom: 80px;">
      <v-container class="py-8">
        
        <div class="text-center mb-10">
          <v-icon size="52" color="primary" class="mb-4">mdi-file-document-multiple-outline</v-icon>
          <h1 class="section-title mb-2">{{ $t('reports.title') }}</h1>
          <p class="section-subtitle">{{ $t('reports.subtitle') }}</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-16">
          <v-progress-circular indeterminate color="primary" size="56" />
          <p class="mt-4 text-medium-emphasis">{{ $t('reports.loading') }}</p>
        </div>

        <!-- Error state -->
        <v-alert v-else-if="error" type="warning" variant="tonal" rounded="xl" class="mb-6">
          {{ error }}
        </v-alert>

        <!-- Empty state -->
        <v-card v-else-if="diagnoses.length === 0" variant="outlined" class="pa-12 rounded-xl text-center">
          <v-icon size="56" color="grey-lighten-1" class="mb-4">mdi-file-search-outline</v-icon>
          <p class="text-medium-emphasis">{{ $t('reports.noReports') }}</p>
          <v-btn color="primary" class="mt-4" rounded="lg" to="/services">
            {{ $t('reports.startAnalysis') }}
          </v-btn>
        </v-card>

        <!-- Reports list -->
        <v-row v-else>
          <v-col
            v-for="d in diagnoses"
            :key="d.id"
            cols="12" md="6" lg="4"
          >
            <v-card rounded="xl" elevation="2" class="h-100 bg-surface">
              <v-card-text class="pa-5">
                <div class="d-flex align-center justify-space-between mb-4">
                  <v-chip color="warning" variant="tonal" size="small">{{ d.severity }}</v-chip>
                  <span class="text-caption text-medium-emphasis">
                    {{ new Date(d.diagnosedAt).toLocaleDateString('es-ES') }}
                  </span>
                </div>
                <p class="font-weight-bold mb-2">{{ d.description }}</p>
                <p v-if="d.recommendations" class="text-caption text-medium-emphasis">
                  {{ d.recommendations }}
                </p>
              </v-card-text>
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
import { ref, onMounted } from 'vue'
import diagnosisService, { type Diagnosis } from '@/services/diagnosisService'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'

const diagnoses = ref<Diagnosis[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    diagnoses.value = await diagnosisService.getAll()
  } catch (e: any) {
    error.value = e.message || 'No se pudieron cargar los informes.'
  } finally {
    loading.value = false
  }
})
</script>
