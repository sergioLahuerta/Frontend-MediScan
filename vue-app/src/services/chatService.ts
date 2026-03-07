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
    }
};

export default chatService;
