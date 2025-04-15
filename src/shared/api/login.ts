// src/features/auth/api/login.ts
import api from "./axiosInstance";
import { API_PATHS } from "./apiConfig";

export const login = async (email: string, password: string) => {
  const response = await api.post(API_PATHS.login, { email, password });
  return response.data; // { email, accessToken }
};

// src/features/auth/api/register.ts
export const register = async (email: string, password: string) => {
  const response = await api.post(API_PATHS.register, { email, password });
  return response.data;
};

// src/features/auth/api/getMe.ts
export const getMe = async () => {
  const response = await api.get(API_PATHS.me);
  return response.data; // { email, accessToken }
};