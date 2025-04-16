// src/shared/api/axiosInstance.ts
import axios from "axios";
import { useUserStore } from "../../entities/user";

const api = axios.create({
  baseURL: "http://109.73.203.201:8081",
  withCredentials: true,
});

// Request interceptor: автоматически добавляем Authorization header
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useUserStore.getState();
    console.log(accessToken)
    if (accessToken) {
      // если headers ещё нет, инициализируем пустой объект (каст к any чтобы избежать ошибок типов)
      if (!config.headers) {
        config.headers = {} as any;
      }
      (config.headers as any).Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: обработка 401 и refresh токена
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

        // если в оригинальном запросе нет headers, инициализируем
        if (!originalRequest.headers) {
          originalRequest.headers = {} as any;
        }
        (originalRequest.headers as any).Authorization = `Bearer ${accessToken}`;

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
