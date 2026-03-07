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

              <!-- Chat Interface like the HTML -->
              <div class="chat-container">
                <header class="p-4 border-b bg-primary text-white flex justify-between items-center shadow-sm">
                  <div>
                    <h1 class="text-xl font-bold tracking-tight">Health Assistant Pro</h1>
                    <p class="text-xs opacity-90 font-medium">Soporte al Diagnóstico Temprano</p>
                  </div>
                  <span class="text-xs bg-white/20 px-2 py-1 rounded-full border border-white/30">Sesión #{{ simulatorStore.chatSessionId ? 'Activa' : 'Nueva' }}</span>
                </header>

              <div class="chat-messages" ref="chatBoxRef">
                  <div v-if="simulatorStore.chatMessages.length === 0" class="flex justify-start">
                    <div class="message-ai p-3 max-w-[85%] shadow-sm border border-gray-100">
                      Hola. Estoy listo para asistirle en el análisis clínico. ¿Desea adjuntar una imagen o describir algún síntoma?
                    </div>
                  </div>
                  <div v-for="msg in simulatorStore.chatMessages" :key="msg.id" :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
                    <div :class="['p-3 max-w-[85%] shadow-sm text-sm leading-relaxed', msg.sender === 'user' ? 'message-user' : 'message-ai']">
                      {{ msg.text }}
                    </div>
                  </div>
                </div>

                <div class="p-4 border-t bg-white">
                  <!-- Guest limit banner -->
                  <v-alert
                    v-if="simulatorStore.guestLimitReached"
                    type="warning"
                    variant="tonal"
                    border="start"
                    class="mb-3"
                    rounded="lg"
                    density="compact"
                  >
                    Límite diario alcanzado.
                    <router-link to="/register" class="font-weight-bold">Regístrate gratis</router-link>
                    para continuar sin límites.
                  </v-alert>

                  <div class="flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200" :class="{ 'opacity-50 pointer-events-none': simulatorStore.guestLimitReached }">
                    <label class="cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition-colors group">
                      <input ref="fileInputRef" type="file" class="hidden" accept="image/*" @change="handleFileSelect">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v4m-2-2h4" />
                      </svg>
                    </label>

                    <textarea v-model="simulatorStore.chatInput" placeholder="Escriba su consulta..." class="flex-1 p-2 bg-transparent focus:outline-none resize-none min-h-[40px] max-h-[150px] text-gray-700" rows="1" @keydown.enter.prevent="sendChatWithFile" @input="adjustTextareaHeight"></textarea>

                    <button @click="sendChatWithFile" class="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-all shadow-md active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="simulatorStore.uploadedImageUrl" class="text-[10px] text-primary mt-2 flex items-center gap-1 font-bold italic">
                    <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span> Imagen lista para procesar
                  </div>
                </div>
              </div>
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

const adjustTextareaHeight = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
};

const loadFile = (file: File) => {
  const url = URL.createObjectURL(file)
  simulatorStore.setImage(file, url)
}

const analyze = async () => {
  await simulatorStore.analyzeImage()
  appStore.showSnackbar('Analysis complete! Review your results.', 'success')
}

const sendChatWithFile = async () => {
  const file = fileInputRef.value?.files?.[0] ?? null
  await simulatorStore.sendChat(file)
  // clear the file input after sending
  if (fileInputRef.value) fileInputRef.value.value = ''
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.chat-messages {
  position: relative;
  height: 380px;
  overflow-y: auto;
  padding: 1rem;
}

/* Background logo ONLY inside the messages area */
.chat-messages::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 240px;
  background-image: url('/logo.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.12;
  pointer-events: none;
}

.chat-messages > div {
  position: relative;
  z-index: 1;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(21, 154, 142, 0.3);
  border-radius: 10px;
}

.message-user {
  background-color: #159a8e;
  color: white;
  border-radius: 15px 15px 2px 15px;
}

.message-ai {
  background-color: #f3f4f6;
  color: #1f2937;
  border-radius: 15px 15px 15px 2px;
}
</style>

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
