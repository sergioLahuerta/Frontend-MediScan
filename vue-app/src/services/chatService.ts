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

    async createSession(): Promise<string> {
        const res = await apiClient.post<{ sessionId: string }>(`${BASE}/session`);
        return res.data.sessionId;
    },


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
    },

    async generateReport(sessionId: string): Promise<{ report: string }> {
        const res = await apiClient.post<{ report: string }>(`${BASE}/${sessionId}/report`);
        return res.data;
    }
};

export default chatService;
