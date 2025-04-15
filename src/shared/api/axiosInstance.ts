// src/shared/api/axiosInstance.ts
import axios from "axios";
import { useUserStore } from "../../entities/user";
const api = axios.create({
  baseURL: "http://109.73.203.201:8081",
  withCredentials: true, 
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/api/consumers/refresh-token");
        const { accessToken, refreshToken } = res.data;

        const { setUser } = useUserStore.getState();
        setUser(accessToken, refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        const { clearUser } = useUserStore.getState();
        clearUser();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
