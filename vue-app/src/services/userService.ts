import axios from './axios';

export interface UserProfile {
    id: string;
    email: string;
    roleId: number | null;
    isActive: boolean;
    createdAt: string;
    profileImageUrl: string | null;
}

const userService = {
    async getProfile(id: string): Promise<UserProfile> {
        const response = await axios.get(`/Users/${id}`);
        return response.data;
    },

    async uploadProfileImage(file: File): Promise<{ profileImageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/Users/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default userService;
