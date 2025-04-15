// src/entities/user/model/userStore.ts
import { create } from "zustand";

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (email: string, accessToken: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: null,
  refreshToken: null,
  setUser: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clearUser: () => set({ accessToken: null, refreshToken: null }),
}));