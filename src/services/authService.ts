import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password
    });
    return response.data;
  }
};