import apiClient from './axios';

const BASE = '/Chat';

export interface SendMessageResponse {
    userMessage: string;
    aiResponse: string;
}

export interface GuestLimitError {
    error: 'guest_limit_reached';
    message: string;
}

const chatService = {
    /**
     * Creates a new chat session on the backend (anonymous allowed).
     * Returns the session Guid as a string.
     */
    async createSession(): Promise<string> {
        const res = await apiClient.post<{ sessionId: string }>(`${BASE}/session`);
        return res.data.sessionId;
    },

    /**
     * Sends a message (and optional image file) to the AI.
     * Uses multipart/form-data so the backend can receive the raw file.
     */
    async sendMessage(
        sessionId: string,
        message: string,
        file?: File | null
    ): Promise<SendMessageResponse> {
        const formData = new FormData();
        formData.append('message', message || 'Analiza el contenido de esta imagen clínica.');
        if (file) {
            formData.append('file', file);
        }

        const res = await apiClient.post<SendMessageResponse>(
            `${BASE}/${sessionId}/send`,
            formData
        );
        return res.data;
    },

    async getUserSessions(): Promise<any[]> {
        const res = await apiClient.get<any[]>(`${BASE}/sessions`);
        return res.data;
    },

    async deleteSession(sessionId: string): Promise<void> {
        await apiClient.delete(`${BASE}/${sessionId}`);
    },

    async getSessionMessages(sessionId: string): Promise<any[]> {
        const res = await apiClient.get<any[]>(`${BASE}/${sessionId}/messages`);
        return res.data;
    },

    async updateSessionTitle(sessionId: string, title: string): Promise<void> {
        await apiClient.patch(`${BASE}/${sessionId}/title`, JSON.stringify(title), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export default chatService;
