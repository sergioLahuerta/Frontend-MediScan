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

interface SessionInfo {
    id: string;
    title: string;
    startedAt: string;
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
    sessions: SessionInfo[];
    isLoadingSessions: boolean;
    isThinking: boolean;
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
        sessions: [],
        isLoadingSessions: false,
        isThinking: false,
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
        async createNewSession() {
            try {
                this.chatSessionId = await chatService.createSession();
                this.chatMessages = [];
                await this.fetchSessions(); // Refresh list if logged in
            } catch (err: any) {
                console.error("Error creating session", err);
            }
        },
        async fetchSessions() {
            this.isLoadingSessions = true;
            try {
                this.sessions = await chatService.getUserSessions();
            } catch (err) {
                console.log("Not logged in or error fetching sessions");
            } finally {
                this.isLoadingSessions = false;
            }
        },
        async loadSession(sessionId: string) {
            this.chatSessionId = sessionId;
            try {
                const messages = await chatService.getSessionMessages(sessionId);
                this.chatMessages = messages.map(m => ({
                    id: m.id,
                    sender: m.senderType.toLowerCase() === 'user' ? 'user' : 'ai',
                    text: m.messageText
                }));
            } catch (err) {
                console.error("Error loading messages", err);
            }
        },
        async deleteSession(sessionId: string) {
            try {
                await chatService.deleteSession(sessionId);
                this.sessions = this.sessions.filter(s => s.id !== sessionId);
                if (this.chatSessionId === sessionId) {
                    this.chatSessionId = null;
                    this.chatMessages = [];
                }
            } catch (err) {
                console.error("Error deleting session", err);
            }
        },
        async updateSessionTitle(sessionId: string, title: string) {
            try {
                await chatService.updateSessionTitle(sessionId, title);
                const session = this.sessions.find(s => s.id === sessionId);
                if (session) session.title = title;
            } catch (err) {
                console.error("Error updating session title", err);
            }
        },
        async sendChat(file?: File | null) {
            if (!this.chatInput.trim() && !file) return
            if (this.guestLimitReached) return

            const text = this.chatInput.trim()
            const imgUrl = file ? URL.createObjectURL(file) : (this.uploadedImageUrl || undefined);

            this.addChatMessage('user', text || (file ? 'Imagen enviada para análisis clínico' : ''), imgUrl)
            this.chatInput = ''

            // Create session on first message if none exists
            if (!this.chatSessionId) {
                try {
                    this.chatSessionId = await chatService.createSession()
                    await this.fetchSessions(); // Refresh for logged in users
                } catch {
                    this.addChatMessage('ai', 'No se pudo iniciar la sesión. Verifica que el servidor esté activo.')
                    return
                }
            }

            this.isThinking = true
            try {
                const result = await chatService.sendMessage(
                    this.chatSessionId,
                    text,
                    file ?? this.uploadedImage
                )
                this.addChatMessage('ai', result.aiResponse)
            } catch (err: any) {
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
            } finally {
                this.isThinking = false
            }
        },
        async generateReport() {
            if (!this.chatSessionId) return null;
            this.isThinking = true;
            try {
                const data = await chatService.generateReport(this.chatSessionId);
                return data.report;
            } catch (err) {
                console.error("Error generating report", err);
                throw err;
            } finally {
                this.isThinking = false;
            }
        }
    }
})
