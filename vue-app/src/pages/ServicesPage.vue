<template>
  <div>
    <app-header />

    <v-main style="padding-bottom: 80px;">
      <v-container class="services-container py-8">

        <!-- Dashboard Summary Row -->
        <v-row class="mb-8" justify="center">
          <!-- Next Appointment Card -->
          <v-col cols="12" sm="6" md="4">
            <v-card rounded="xl" elevation="2" border variant="flat" class="dashboard-card h-100">
              <v-card-text class="pa-4 d-flex align-center">
                <v-avatar color="primary-lighten-5" size="48" class="mr-4">
                  <v-icon color="primary">mdi-calendar-clock</v-icon>
                </v-avatar>
                <div>
                  <div class="text-caption text-medium-emphasis font-weight-bold">NEXT APPOINTMENT</div>
                  <div v-if="loadingDashboard" class="text-body-2 mt-1">
                    <v-skeleton-loader type="text" width="100" />
                  </div>
                  <div v-else-if="nextAppointment" class="text-body-2 font-weight-bold mt-1">
                    {{ formatDate(nextAppointment.scheduledAt) }}
                  </div>
                  <div v-else class="text-body-2 text-medium-emphasis mt-1">No scheduled visits</div>
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="pa-2 px-4">
                <v-btn variant="text" size="small" color="primary" block @click="$router.push('/profile')">
                  View all
                  <v-icon end size="x-small">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Latest Report Card -->
          <v-col cols="12" sm="6" md="4">
            <v-card rounded="xl" elevation="2" border variant="flat" class="dashboard-card h-100">
              <v-card-text class="pa-4 d-flex align-center">
                <v-avatar color="warning-lighten-5" size="48" class="mr-4">
                  <v-icon color="warning">mdi-file-chart-outline</v-icon>
                </v-avatar>
                <div>
                  <div class="text-caption text-medium-emphasis font-weight-bold">LATEST REPORT</div>
                  <div v-if="loadingDashboard" class="text-body-2 mt-1">
                    <v-skeleton-loader type="text" width="100" />
                  </div>
                  <div v-else-if="latestReport" class="text-body-2 font-weight-bold mt-1">
                    {{ latestReport.description }}
                  </div>
                  <div v-else class="text-body-2 text-medium-emphasis mt-1">No reports yet</div>
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="pa-2 px-4">
                <v-btn variant="text" size="small" color="warning" block @click="$router.push('/reports')">
                  Go to records
                  <v-icon end size="x-small">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Page Header -->
        <div class="text-center mb-10">
          <h1 class="section-title mb-3">
            <span class="gradient-text">AI</span> Simulator
          </h1>
          <p class="section-subtitle">
            Upload a medical image and let our AI analyze it in seconds.
          </p>
          <!-- Tabs -->
          <v-btn-group class="mt-4" rounded="xl" density="comfortable">
            <v-btn
              :variant="activeTab === 'upload' ? 'flat' : 'outlined'"
              color="primary"
              @click="activeTab = 'upload'"
            >
              <v-icon start>mdi-upload</v-icon>
              Simulador AI
            </v-btn>
            <v-btn
              :variant="activeTab === 'models' ? 'flat' : 'outlined'"
              color="primary"
              @click="activeTab = 'models'"
            >
              <v-icon start>mdi-cube-outline</v-icon>
              Modelos 3D
            </v-btn>
            <v-btn
              :variant="activeTab === 'compare' ? 'flat' : 'outlined'"
              color="primary"
              @click="activeTab = 'compare'"
            >
              <v-icon start>mdi-compare-horizontal</v-icon>
              Comparar
            </v-btn>
          </v-btn-group>
        </div>

        <!-- TAB: Upload & Analyze -->
        <div v-if="activeTab === 'upload'">
          <v-row>
            <!-- Left: Upload Column -->
            <v-col cols="12" md="6">
              <!-- Warning Info -->
              <v-alert
                type="info"
                variant="tonal"
                border="start"
                class="mb-5"
                rounded="lg"
                density="compact"
              >
                <strong>Important:</strong> This tool is for educational purposes only.
                Always consult a medical professional for official diagnosis.
              </v-alert>

              <!-- Upload Area -->
              <div
                class="upload-area mb-4"
                :class="{ 'upload-area--active': isDragOver || simulatorStore.hasImage }"
                @dragover.prevent="isDragOver = true"
                @dragleave="isDragOver = false"
                @drop.prevent="handleDrop"
                @click="(fileInputRef as any).click()"
              >
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  style="display:none"
                  @change="handleFileSelect"
                />
                <!-- Preview Image -->
                <template v-if="simulatorStore.uploadedImageUrl">
                  <v-img
                    :src="simulatorStore.uploadedImageUrl"
                    max-height="200"
                    contain
                    class="mb-3 rounded-lg"
                  />
                  <p style="color: #159a8e; font-weight: 500;">
                    <v-icon>mdi-check-circle</v-icon>
                    Image ready for analysis
                  </p>
                </template>
                <!-- Placeholder -->
                <template v-else>
                  <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-cloud-upload-outline</v-icon>
                  <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Drop image here</h4>
                  <p style="color: #6b7280; font-size: 0.85rem;">
                    or click to browse — JPG, PNG, DICOM up to 10MB
                  </p>
                </template>
              </div>

              <!-- Analyze Button -->
              <v-btn
                block
                size="x-large"
                color="primary"
                rounded="lg"
                :loading="simulatorStore.isAnalyzing"
                :disabled="!simulatorStore.hasImage"
                @click="analyze"
              >
                <v-icon start>mdi-robot-happy</v-icon>
                Analyze with AI
              </v-btn>

              <!-- Reset -->
              <v-btn
                v-if="simulatorStore.hasImage"
                block
                variant="text"
                class="mt-2"
                color="grey"
                @click="simulatorStore.resetAnalysis()"
              >
                <v-icon start>mdi-refresh</v-icon>
                Reset
              </v-btn>
            </v-col>

            <!-- Right: Results Column -->
            <v-col cols="12" md="6">
              <!-- Loading State -->
              <div v-if="simulatorStore.isAnalyzing" class="results-placeholder text-center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="72"
                  width="6"
                  class="mb-6"
                />
                <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Analyzing image...</h3>
                <p style="color: #6b7280;">Our AI is processing your medical image</p>
              </div>

              <!-- Results -->
              <div v-else-if="simulatorStore.hasResults && simulatorStore.results">
                <v-card rounded="lg" elevation="2" class="mb-4">
                  <v-card-text class="pa-5">
                    <!-- Confidence bar -->
                    <div class="d-flex justify-space-between mb-2">
                      <span style="font-weight: 600;">AI Confidence</span>
                      <span style="color: #159a8e; font-weight: 700;">
                        {{ simulatorStore.results?.confidence }}%
                      </span>
                    </div>
                    <v-progress-linear
                      :model-value="simulatorStore.results?.confidence"
                      color="primary"
                      rounded
                      height="10"
                      class="mb-5"
                    />

                    <!-- Diagnosis -->
                    <v-alert
                      type="warning"
                      variant="tonal"
                      rounded="lg"
                      class="mb-4"
                    >
                      <strong>Diagnosis:</strong> {{ simulatorStore.results?.diagnosis }}
                      <br>
                      <small>Severity: {{ simulatorStore.results?.severity }}</small>
                    </v-alert>

                    <!-- Details -->
                    <v-list density="compact" lines="one" class="mb-4">
                      <v-list-item
                        v-for="detail in simulatorStore.results?.details"
                        :key="detail.label"
                        :title="detail.label"
                        :subtitle="detail.value"
                        prepend-icon="mdi-information-outline"
                      />
                    </v-list>

                    <!-- Recommendations -->
                    <h4 class="mb-3" style="font-weight: 600;">Recommendations</h4>
                    <v-list density="compact">
                      <v-list-item
                        v-for="rec in simulatorStore.results?.recommendations"
                        :key="rec"
                        :title="rec"
                        prepend-icon="mdi-check-circle-outline"
                        base-color="primary"
                      />
                    </v-list>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Empty State -->
              <div v-else class="results-placeholder text-center">
                <span style="font-size: 4rem;">🧠</span>
                <h3 class="mt-4 mb-2" style="font-weight: 600;">No analysis yet</h3>
                <p style="color: #6b7280;">Upload an image and click "Analyze with AI" to get started.</p>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- TAB: History (now hidden but kept) -->
        <div v-if="activeTab === 'history'">
          <!-- ... existing history logic ... -->
        </div>

        <!-- TAB: 3D Models -->
        <div v-else-if="activeTab === 'models'" class="py-10 text-center">
          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-img src="https://cdn.pixabay.com/photo/2014/04/03/10/32/skeleton-310860_1280.png" height="300" contain class="mb-6" />
              <h2 class="text-h4 font-weight-bold mb-4">Atlas Anatómico 3D</h2>
              <p class="section-subtitle mb-8">
                Visualiza y rota modelos de alta precisión para entender mejor tu diagnóstico. 
                Soporta archivos DICOM y reconstrucciones volumétricas.
              </p>
              <v-btn color="primary" size="x-large" rounded="lg">Abrir Visualizador</v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- TAB: Compare -->
        <div v-else-if="activeTab === 'compare'" class="py-10">
          <v-row>
            <v-col cols="12" md="6" class="text-center">
              <v-card variant="outlined" class="pa-8 border-dashed rounded-xl">
                <v-icon size="48" color="primary" class="mb-4">mdi-image-multiple</v-icon>
                <h3>Imagen Base</h3>
                <p>Tu estudio actual</p>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="text-center">
              <v-card variant="outlined" class="pa-8 border-dashed rounded-xl">
                <v-icon size="48" color="primary" class="mb-4">mdi-database-search</v-icon>
                <h3>Casos Similares</h3>
                <p>Base de datos MediScan</p>
              </v-card>
            </v-col>
          </v-row>
          <div class="text-center mt-10">
            <h2 class="mb-2">Comparativa de Biomarcadores</h2>
            <p class="section-subtitle">Identifica patrones comunes con miles de diagnósticos certificados.</p>
          </div>
        </div>

      </v-container>
    </v-main>

    <app-footer />
    <bottom-nav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSimulatorStore } from '@/stores/simulatorStore'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BottomNav from '@/components/BottomNav.vue'
import appointmentService, { Appointment } from '@/services/appointmentService'
import diagnosisService, { Diagnosis } from '@/services/diagnosisService'

const simulatorStore = useSimulatorStore()
const appStore = useAppStore()
const authStore = useAuthStore()

const activeTab = ref('upload')
const isDragOver = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Dashboard data
const loadingDashboard = ref(false)
const nextAppointment = ref<Appointment | null>(null)
const latestReport = ref<Diagnosis | null>(null)

onMounted(() => {
  fetchDashboardData()
})

const fetchDashboardData = async () => {
  if (!authStore.user?.id) return
  loadingDashboard.value = true
  try {
    const [apts, diags] = await Promise.all([
      appointmentService.getAll(),
      diagnosisService.getAll()
    ])

    // Find next upcoming appointment
    const userApts = apts
      .filter(a => a.patientId === authStore.user?.id && new Date(a.scheduledAt) > new Date())
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    
    nextAppointment.value = userApts[0] || null

    // Find latest report
    const userDiags = diags
      .filter(d => d.patientId === authStore.user?.id)
      .sort((a, b) => new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime())
    
    latestReport.value = userDiags[0] || null
  } catch (err) {
    console.error('Failed to load dashboard data', err)
  } finally {
    loadingDashboard.value = false
  }
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) loadFile(file)
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    loadFile(file)
  }
}

const loadFile = (file: File) => {
  const url = URL.createObjectURL(file)
  simulatorStore.setImage(file, url)
}

const analyze = async () => {
  await simulatorStore.analyzeImage()
  appStore.showSnackbar('Analysis complete! Review your results.', 'success')
}
</script>

<style lang="scss" scoped>
.results-placeholder {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 12px;
  padding: 2rem;
}
</style>
