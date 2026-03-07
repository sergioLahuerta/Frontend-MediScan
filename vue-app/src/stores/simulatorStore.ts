import { defineStore } from 'pinia'

interface AnalysisResult {
  confidence: number;
  diagnosis: string;
  severity: string;
  recommendations: string[];
  details: { label: string; value: string }[];
}

interface HistoryItem {
  id: number;
  date: string;
  imageUrl: string | null;
  confidence: number;
  diagnosis: string;
}

interface SimulatorState {
  uploadedImage: File | null;
  uploadedImageUrl: string | null;
  isAnalyzing: boolean;
  results: AnalysisResult | null;
  activeTab: string;
  analysisHistory: HistoryItem[];
}

export const useSimulatorStore = defineStore('simulator', {
    state: (): SimulatorState => ({
        uploadedImage: null,
        uploadedImageUrl: null,
        isAnalyzing: false,
        results: null,
        activeTab: 'upload',
        analysisHistory: [],
    }),
    getters: {
        hasResults: (state) => state.results !== null,
        hasImage: (state) => state.uploadedImage !== null,
    },
    actions: {
        setImage(file: File, url: string) {
            this.uploadedImage = file
            this.uploadedImageUrl = url
            this.results = null
        },
        async analyzeImage() {
            if (!this.uploadedImage) return
            this.isAnalyzing = true
            this.results = null
            
            // Artificial delay to simulate AI processing
            await new Promise((resolve) => setTimeout(resolve, 2500))
            
            this.results = {
                confidence: Math.floor(Math.random() * 20) + 75,
                diagnosis: 'Soft tissue lesion detected',
                severity: 'Moderate',
                recommendations: [
                    'Consult a specialist within the next 7 days',
                    'Avoid intense physical activity for 2 weeks',
                    'Apply ice 15 min / 3 times a day',
                ],
                details: [
                    { label: 'Affected area', value: 'Muscle tissue' },
                    { label: 'Estimated size', value: '2.3 cm²' },
                    { label: 'Case comparison', value: '1,247 cases analyzed' },
                ],
            }
            
            this.analysisHistory.unshift({
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                imageUrl: this.uploadedImageUrl,
                confidence: this.results!.confidence,
                diagnosis: this.results!.diagnosis,
            })
            
            this.isAnalyzing = false
        },
        resetAnalysis() {
            this.uploadedImage = null
            this.uploadedImageUrl = null
            this.results = null
            this.isAnalyzing = false
        },
    },
})
