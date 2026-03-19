import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export const registerUser = (data: RegisterPayload) =>
  api.post<UserResponse>('/users/register', data);

export const getUsers = () =>
  api.get<UserResponse[]>('/users');

export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`);

export default api;
