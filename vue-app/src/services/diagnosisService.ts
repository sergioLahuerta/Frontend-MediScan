import apiClient from './axios';

export interface Diagnosis {
  id: string;
  patientId: string;
  doctorId: string;
  description: string;
  severity: string;
  diagnosedAt: string;
  recommendations?: string;
}

export default {
  async getAll(): Promise<Diagnosis[]> {
    const response = await apiClient.get('/Diagnoses');
    return response.data;
  },

  async getById(id: string): Promise<Diagnosis> {
    const response = await apiClient.get(`/Diagnoses/${id}`);
    return response.data;
  },

  async create(diagnosis: Partial<Diagnosis>): Promise<Diagnosis> {
    const response = await apiClient.post('/Diagnoses', diagnosis);
    return response.data;
  },
};
