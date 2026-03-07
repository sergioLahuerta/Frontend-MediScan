import apiClient from './axios';

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  scheduledAt: string;
  status: string;
  notes?: string;
}

export default {
  async getAll(): Promise<Appointment[]> {
    const response = await apiClient.get('/Appointments');
    return response.data;
  },

  async getById(id: string): Promise<Appointment> {
    const response = await apiClient.get(`/Appointments/${id}`);
    return response.data;
  },

  async create(appointment: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.post('/Appointments', appointment);
    return response.data;
  },

  async update(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.put(`/Appointments/${id}`, appointment);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/Appointments/${id}`);
  }
};
