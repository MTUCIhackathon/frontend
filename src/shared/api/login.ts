// src/features/auth/api/login.ts
import api from "./axiosInstance";
import { API_PATHS } from "./apiConfig";

export const login = async (login: string, password: string) => {
  const response = await api.post(API_PATHS.login, { login, password });
  console.log(response)
  return response.data; // { email, accessToken }
};

// src/features/auth/api/register.ts
export const register = async (login: string, password: string) => {
  const response = await api.post(API_PATHS.register, { login, password });
  return response.data;
};

// src/features/auth/api/getMe.ts
export const getMe = async () => {
  const response = await api.get(API_PATHS.me);
  console.log(response)
  return response.data; // { email, accessToken }
};