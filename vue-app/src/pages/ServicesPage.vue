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
            <!-- Chat Row with Sidebar for Sessions -->
            <v-col cols="12" class="px-0">
              <v-row no-gutters class="chat-main-row">
                <!-- Sessions Sidebar (Only for logged in users) -->
                <v-col v-if="authStore.user" cols="12" md="3" class="chat-sidebar border-e">
                  <v-card flat class="h-100 d-flex flex-column rounded-0">
                    <div class="pa-4 d-flex align-center justify-space-between bg-grey-lighten-4">
                      <span class="text-subtitle-2 font-weight-bold text-primary">Tus Consultas</span>
                      <v-btn icon="mdi-plus" size="x-small" variant="flat" color="primary" @click="simulatorStore.createNewSession" title="Nueva Consulta"></v-btn>
                    </div>
                    <v-divider />
                    <v-list class="flex-grow-1 overflow-y-auto pa-2" density="comfortable">
                      <v-list-item 
                        v-for="session in simulatorStore.sessions" 
                        :key="session.id"
                        :active="simulatorStore.chatSessionId === session.id"
                        active-color="primary"
                        rounded="lg"
                        class="mb-2 session-item"
                        @click="simulatorStore.loadSession(session.id)"
                      >
                        <template v-slot:prepend>
                          <v-icon size="small" :color="simulatorStore.chatSessionId === session.id ? 'primary' : 'grey-darken-1'">mdi-chat-processing-outline</v-icon>
                        </template>
                        
                        <v-list-item-title class="text-body-2 font-weight-medium">
                          <template v-if="editingSessionId === session.id">
                            <v-text-field
                              v-model="editingTitle"
                              density="compact"
                              hide-details
                              variant="underlined"
                              autofocus
                              @keyup.enter="saveTitle(session.id)"
                              @blur="saveTitle(session.id)"
                              @click.stop
                            />
                          </template>
                          <template v-else>
                            {{ session.title || 'Consulta' }}
                          </template>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-caption opacity-70">{{ formatDate(session.startedAt) }}</v-list-item-subtitle>
                        
                        <template v-slot:append>
                          <div class="d-flex ga-1 session-actions">
                            <v-btn 
                              icon="mdi-pencil-outline" 
                              size="x-small" 
                              variant="text" 
                              color="grey-darken-1" 
                              @click.stop="startEditing(session)"
                            ></v-btn>
                            <v-btn 
                              icon="mdi-delete-outline" 
                              size="x-small" 
                              variant="text" 
                              color="error" 
                              @click.stop="simulatorStore.deleteSession(session.id)"
                            ></v-btn>
                          </div>
                        </template>
                      </v-list-item>
                      <div v-if="simulatorStore.sessions.length === 0" class="text-center pa-8">
                        <v-icon size="large" color="grey-lighten-1" class="mb-2">mdi-history</v-icon>
                        <div class="text-caption text-medium-emphasis">Historial vacío</div>
                      </div>
                    </v-list>
                  </v-card>
                </v-col>

                <!-- Chat Column -->
                <v-col cols="12" :md="authStore.user ? 9 : 12" class="chat-content-col pa-0">
                  <!-- Chat Interface -->
                  <div class="chat-wrapper d-flex flex-column h-100">
                    <header class="chat-header pa-4 bg-primary text-white d-flex align-center justify-space-between shadow-sm">
                      <div>
                        <div class="text-h6 font-weight-bold leading-tight">Assistant AI Mediscan</div>
                        <div class="text-caption opacity-90">Soporte al Diagnóstico Médico Inteligente</div>
                      </div>
                      <div class="d-flex align-center ga-2">
                        <v-chip v-if="!authStore.user" size="small" color="white" variant="flat" class="text-primary font-weight-bold" to="/register">
                          Guardar Historial
                        </v-chip>
                        <v-chip size="small" variant="outlined" color="white" class="session-badge">
                          {{ simulatorStore.chatSessionId ? 'Sesión Activa' : 'Nueva Consulta' }}
                        </v-chip>
                      </div>
                    </header>

                    <div class="chat-messages flex-grow-1 overflow-y-auto pa-4" ref="chatBoxRef">
                      <div v-if="simulatorStore.chatMessages.length === 0" class="d-flex justify-start mb-4">
                        <div class="message-bubble ai-bubble message-fade-in shadow-sm">
                          <v-avatar size="32" color="primary-lighten-5" class="mr-3 avatar-ai border">
                            <v-icon size="18" color="primary">mdi-robot-outline</v-icon>
                          </v-avatar>
                          <div>¡Hola! Soy tu asistente médico AI. Puedo analizar imágenes o responder dudas sobre síntomas. ¿En qué puedo ayudarte hoy?</div>
                        </div>
                      </div>
                      <div v-for="msg in simulatorStore.chatMessages" :key="msg.id" :class="['d-flex mb-4', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
                        <div :class="['message-bubble shadow-sm', msg.sender === 'user' ? 'user-bubble' : 'ai-bubble message-fade-in']">
                          <div class="d-flex align-start">
                            <v-avatar v-if="msg.sender === 'ai'" size="32" color="primary-lighten-5" class="mr-3 avatar-ai border">
                              <v-icon size="18" color="primary">mdi-robot-outline</v-icon>
                            </v-avatar>
                            <div class="message-text">
                              {{ msg.text }}
                              <v-img v-if="msg.imageUrl" :src="msg.imageUrl" rounded="lg" class="mt-3 chat-image" max-width="320">
                                <template v-slot:placeholder>
                                  <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="primary-lighten-4"></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Input Area (Fixed at the bottom) -->
                    <div class="chat-input-area pa-4 pt-0">
                      <!-- Guest Warning -->
                      <v-fade-transition>
                        <v-alert v-if="simulatorStore.guestLimitReached" type="warning" variant="tonal" density="compact" rounded="lg" class="mb-3 text-caption">
                          Has alcanzado el límite gratuito. 
                          <router-link to="/register" class="font-weight-bold">Regístrate</router-link> para seguir.
                        </v-alert>
                      </v-fade-transition>

                      <div class="input-card rounded-pill border shadow-sm px-2 py-1 bg-grey-lighten-5" :class="{ 'opacity-50 pointer-events-none': simulatorStore.guestLimitReached }">
                        <v-row no-gutters align="center">
                          <v-col cols="auto" class="pl-2">
                            <v-btn 
                              icon="mdi-camera" 
                              variant="flat" 
                              color="primary-lighten-4" 
                              class="camera-btn"
                              size="44"
                              @click="fileInputRef?.click()"
                            >
                              <v-icon color="primary" size="24">mdi-camera</v-icon>
                              <v-tooltip activator="parent" location="top">Adjuntar Imagen</v-tooltip>
                            </v-btn>
                            <input ref="fileInputRef" type="file" class="d-none" accept="image/*" @change="handleFileSelect">
                          </v-col>
                          
                          <v-col class="mx-2">
                            <v-textarea
                              v-model="simulatorStore.chatInput"
                              placeholder="Escribe tu consulta médica..."
                              rows="1"
                              auto-grow
                              hide-details
                              variant="plain"
                              density="compact"
                              class="chat-textarea"
                              @keydown.enter.prevent="sendChatWithFile"
                            />
                          </v-col>

                          <v-col cols="auto">
                            <v-btn
                              :loading="simulatorStore.isAnalyzing"
                              icon="mdi-send-variant"
                              color="primary"
                              elevation="2"
                              class="send-btn"
                              size="small"
                              @click="sendChatWithFile"
                            />
                          </v-col>
                        </v-row>
                      </div>
                      
                      <v-expand-transition>
                        <div v-if="simulatorStore.uploadedImageUrl" class="image-indicator d-flex align-center mt-2 px-4 py-1 rounded-pill bg-primary-lighten-5 text-primary text-caption font-weight-bold">
                          <v-icon size="16" class="mr-2 animate-pulse">mdi-image-check</v-icon>
                          <span>Imagen lista para analizar</span>
                          <v-spacer />
                          <v-btn icon="mdi-close" size="x-small" variant="text" color="primary" @click="simulatorStore.resetAnalysis()"></v-btn>
                        </div>
                      </v-expand-transition>
                    </div>
                  </div>
                </v-col>
              </v-row>
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
import { ref, onMounted, watch, nextTick } from 'vue'
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

// Session Renaming
const editingSessionId = ref<string | null>(null)
const editingTitle = ref('')

const startEditing = (session: any) => {
  editingSessionId.value = session.id
  editingTitle.value = session.title || 'Consulta'
}

const saveTitle = async (sessionId: string) => {
  if (editingSessionId.value === sessionId) {
    if (editingTitle.value.trim()) {
      await simulatorStore.updateSessionTitle(sessionId, editingTitle.value.trim())
    }
    editingSessionId.value = null
  }
}

const chatBoxRef = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTo({
      top: chatBoxRef.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

watch(() => simulatorStore.chatMessages, scrollToBottom, { deep: true })

onMounted(() => {
  fetchDashboardData()
  simulatorStore.fetchSessions()
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
  // Try to get from input, fallback to the one saved in store by handleFileSelect
  const file = fileInputRef.value?.files?.[0] || simulatorStore.uploadedImage || null
  await simulatorStore.sendChat(file)
  
  // clear the file inputs after sending
  if (fileInputRef.value) fileInputRef.value.value = ''
  simulatorStore.uploadedImage = null
  simulatorStore.uploadedImageUrl = null
}
</script>

<style scoped>
.chat-main-row {
  height: 700px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #eef2f6;
  margin-bottom: 2rem;
}

.chat-sidebar {
  background: #fcfdfe;
  height: 100%;
}

.session-item {
  transition: all 0.2s ease;
}

.session-item:hover {
  background-color: #f1f5f9;
}

.session-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.session-item:hover .session-actions {
  opacity: 1;
}

.chat-wrapper {
  background-color: #ffffff;
  height: 100%;
}

.chat-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  z-index: 10;
}

.chat-messages {
  padding: 2rem;
  overflow-y: auto;
  min-height: 0; /* Important for flex children to scroll */
  height: 500px; /* Fixed height to force overflow */
  background-image: radial-gradient(#159a8e0a 1px, transparent 1px);
  background-size: 24px 24px;
  display: flex;
  flex-direction: column;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}

.message-bubble {
  max-width: 85%;
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  line-height: 1.6;
  border-radius: 20px;
  position: relative;
}

.user-bubble {
  background: linear-gradient(135deg, #159a8e 0%, #117d74 100%);
  color: white;
  border-bottom-right-radius: 4px;
  margin-left: auto;
  box-shadow: 0 4px 12px rgba(21, 154, 142, 0.2);
}

.ai-bubble {
  background-color: #f8fafc;
  color: #334155;
  border-bottom-left-radius: 4px;
  border: 1px solid #edf2f7;
  display: flex;
}

.avatar-ai {
  flex-shrink: 0;
}

.message-fade-in {
  animation: fadeInSoft 0.4s ease-out forwards;
}

@keyframes fadeInSoft {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-image {
  border: 3px solid white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-image:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

.chat-input-area {
  background: white;
  flex-shrink: 0;
  padding-bottom: 1.25rem !important;
  border-top: 1px solid #f1f5f9;
}

.input-card {
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0 !important;
  background-color: white !important; /* Ensure visibility */
}

.input-card:focus-within {
  border-color: #159a8e !important;
  box-shadow: 0 0 0 4px rgba(21, 154, 142, 0.1), 0 4px 12px rgba(0,0,0,0.05) !important;
}

.chat-textarea :deep(textarea) {
  font-size: 1rem;
  color: #334155;
  line-height: 1.4;
  padding: 8px 0;
}

.send-btn {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  transition: all 0.2s ease;
}

.send-btn:hover {
  transform: scale(1.1);
  background-color: #117d74 !important;
}

.camera-btn {
  transition: all 0.2s ease;
  color: #159a8e !important; /* Force visible primary color */
  background-color: #eff6f5 !important;
  margin-left: 4px;
}

.camera-btn:hover {
  background-color: #eff6f5 !important;
  color: #159a8e !important;
  transform: translateY(-1px);
}

.image-indicator {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

@media (max-width: 960px) {
  .chat-main-row {
    height: calc(100vh - 200px);
    min-height: 600px;
  }
}
</style>
