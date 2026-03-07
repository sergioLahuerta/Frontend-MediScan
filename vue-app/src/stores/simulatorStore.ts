import { defineStore } from 'pinia'
import chatService from '@/services/chatService'

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

interface ChatMessage {
    id: number;
    sender: 'user' | 'ai';
    text: string;
    imageUrl?: string;
}

interface SimulatorState {
    uploadedImage: File | null;
    uploadedImageUrl: string | null;
    isAnalyzing: boolean;
    results: AnalysisResult | null;
    activeTab: string;
    analysisHistory: HistoryItem[];
    // chat support
    chatMessages: ChatMessage[];
    chatInput: string;
    chatSessionId: string | null;
    guestLimitReached: boolean;
}

export const useSimulatorStore = defineStore('simulator', {
    state: (): SimulatorState => ({
        uploadedImage: null,
        uploadedImageUrl: null,
        isAnalyzing: false,
        results: null,
        activeTab: 'upload',
        analysisHistory: [],
        chatMessages: [],
        chatInput: '',
        chatSessionId: null,
        guestLimitReached: false,
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
        // chat actions
        addChatMessage(sender: 'user' | 'ai', text: string, imageUrl?: string) {
            this.chatMessages.push({ id: Date.now(), sender, text, imageUrl })
        },
        async sendChat(file?: File | null) {
            if (!this.chatInput.trim() && !file) return
            if (this.guestLimitReached) return

            const text = this.chatInput.trim()
            const imgUrl = file ? URL.createObjectURL(file) : (this.uploadedImageUrl || undefined);

            this.addChatMessage('user', text || (file ? 'Imagen enviada para análisis clínico' : ''), imgUrl)
            this.chatInput = ''

            // Create session on first message
            if (!this.chatSessionId) {
                try {
                    this.chatSessionId = await chatService.createSession()
                } catch {
                    this.addChatMessage('ai', 'No se pudo iniciar la sesión. Verifica que el servidor esté activo.')
                    return
                }
            }

            try {
                const result = await chatService.sendMessage(
                    this.chatSessionId,
                    text,
                    file ?? this.uploadedImage
                )
                this.addChatMessage('ai', result.aiResponse)
            } catch (err: any) {
                // Handle 429 guest daily limit
                const status = err?.response?.status
                if (status === 429) {
                    const backendMsg = err?.response?.data?.message
                    this.guestLimitReached = true
                    this.addChatMessage(
                        'ai',
                        backendMsg ||
                        'Has alcanzado el límite de 3 mensajes gratuitos al día. Crea una cuenta para continuar sin límites.'
                    )
                } else {
                    this.addChatMessage('ai', err.message || 'Error al contactar con la IA. Comprueba la conexión.')
                }
            }
        }
    },
})
