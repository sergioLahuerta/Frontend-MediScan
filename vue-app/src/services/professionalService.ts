import apiClient from './axios';

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

export default {
  async getAll(): Promise<Professional[]> {
    const response = await apiClient.get('/Professionals');
    return response.data;
  },

  async getById(id: string): Promise<Professional> {
    const response = await apiClient.get(`/Professionals/${id}`);
    return response.data;
  }
};
