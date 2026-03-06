<template>
  <div>
    <app-header />

    <v-main style="padding-bottom: 80px;">
      <v-container class="services-container py-8">

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
              Upload & Analyze
            </v-btn>
            <v-btn
              :variant="activeTab === 'history' ? 'flat' : 'outlined'"
              color="primary"
              @click="activeTab = 'history'"
            >
              <v-icon start>mdi-history</v-icon>
              History
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
                @click="$refs.fileInput.click()"
              >
                <input
                  ref="fileInput"
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
              <div v-else-if="simulatorStore.hasResults">
                <v-card rounded="lg" elevation="2" class="mb-4">
                  <v-card-text class="pa-5">
                    <!-- Confidence bar -->
                    <div class="d-flex justify-space-between mb-2">
                      <span style="font-weight: 600;">AI Confidence</span>
                      <span style="color: #159a8e; font-weight: 700;">
                        {{ simulatorStore.results.confidence }}%
                      </span>
                    </div>
                    <v-progress-linear
                      :model-value="simulatorStore.results.confidence"
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
                      <strong>Diagnosis:</strong> {{ simulatorStore.results.diagnosis }}
                      <br>
                      <small>Severity: {{ simulatorStore.results.severity }}</small>
                    </v-alert>

                    <!-- Details -->
                    <v-list density="compact" lines="one" class="mb-4">
                      <v-list-item
                        v-for="detail in simulatorStore.results.details"
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
                        v-for="rec in simulatorStore.results.recommendations"
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

        <!-- TAB: History -->
        <div v-else-if="activeTab === 'history'">
          <div v-if="simulatorStore.analysisHistory.length === 0" class="text-center py-16">
            <v-icon size="64" color="grey-lighten-2">mdi-history</v-icon>
            <h3 class="mt-4" style="color: #9ca3af;">No analysis history yet</h3>
            <p style="color: #9ca3af;">Your completed analyses will appear here</p>
          </div>
          <v-row v-else>
            <v-col
              v-for="item in simulatorStore.analysisHistory"
              :key="item.id"
              cols="12" sm="6" md="4"
            >
              <v-card rounded="lg" elevation="1" border>
                <v-img :src="item.imageUrl" height="160" cover />
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span style="font-size: 0.8rem; color: #6b7280;">{{ item.date }}</span>
                    <v-chip color="primary" size="x-small" variant="tonal">
                      {{ item.confidence }}% confidence
                    </v-chip>
                  </div>
                  <p style="font-size: 0.9rem; font-weight: 500;">{{ item.diagnosis }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

      </v-container>
    </v-main>

    <app-footer />
    <bottom-nav />
  </div>
</template>

<script>
import { useSimulatorStore } from '../stores/simulatorStore'
import { useAppStore } from '../stores/appStore'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import BottomNav from '../components/BottomNav.vue'

export default {
  name: 'ServicesView',
  components: { AppHeader, AppFooter, BottomNav },
  setup() {
    const simulatorStore = useSimulatorStore()
    const appStore = useAppStore()
    return { simulatorStore, appStore }
  },
  data() {
    return {
      activeTab: 'upload',
      isDragOver: false,
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) this.loadFile(file)
    },
    handleDrop(event) {
      this.isDragOver = false
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        this.loadFile(file)
      }
    },
    loadFile(file) {
      const url = URL.createObjectURL(file)
      this.simulatorStore.setImage(file, url)
    },
    async analyze() {
      await this.simulatorStore.analyzeImage()
      this.appStore.showSnackbar('Analysis complete! Review your results.', 'success')
    },
  },
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
