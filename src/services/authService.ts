import apiClient, { USE_MOCK, setToken } from '@/services/apiClient';
import { mockLogin, mockRegister } from '@/services/mockData';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/services/types';

const MOCK_DELAY = 600;

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    const res = mockLogin();
    setToken(res.token);
    return res;
  }
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  setToken(data.token);
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    const res = mockRegister();
    setToken(res.token);
    return res;
  }
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  setToken(data.token);
  return data;
}
