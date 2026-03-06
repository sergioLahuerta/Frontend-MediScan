import { defineStore } from 'pinia'

export const useSimulatorStore = defineStore('simulator', {
    state: () => ({
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
        setImage(file, url) {
            this.uploadedImage = file
            this.uploadedImageUrl = url
            this.results = null
        },
        async analyzeImage() {
            if (!this.uploadedImage) return
            this.isAnalyzing = true
            this.results = null
            // Simulamos análisis de IA con delay
            await new Promise((resolve) => setTimeout(resolve, 2500))
            this.results = {
                confidence: Math.floor(Math.random() * 20) + 75,
                diagnosis: 'Lesión de tejido blando detectada',
                severity: 'Moderado',
                recommendations: [
                    'Consultar con un especialista en los próximos 7 días',
                    'Evitar actividad física intensa durante 2 semanas',
                    'Aplicar hielo 15 min / 3 veces al día',
                ],
                details: [
                    { label: 'Área afectada', value: 'Tejido muscular' },
                    { label: 'Tamaño estimado', value: '2.3 cm²' },
                    { label: 'Comparación con casos', value: '1.247 casos analizados' },
                ],
            }
            this.analysisHistory.unshift({
                id: Date.now(),
                date: new Date().toLocaleDateString('es-ES'),
                imageUrl: this.uploadedImageUrl,
                confidence: this.results.confidence,
                diagnosis: this.results.diagnosis,
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
