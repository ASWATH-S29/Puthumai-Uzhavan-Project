import { useCallback } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { login as loginSvc, register as registerSvc } from '@/services/authService';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/services/types';

export function useLogin() {
  return useApiMutation<AuthResponse, LoginRequest>(useCallback(loginSvc, []));
}

export function useRegister() {
  return useApiMutation<AuthResponse, RegisterRequest>(useCallback(registerSvc, []));
}
