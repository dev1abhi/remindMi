import axios from 'axios';

const API_BASE_URL = 'https://remind-mi-backend.vercel.app';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password
    });
    return response.data;
  }
};