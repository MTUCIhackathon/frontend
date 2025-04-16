import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (accessToken: string, refreshToken: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setUser: (accessToken, refreshToken) => {
        console.log("🟢 Setting token:", accessToken);
        set({ accessToken, refreshToken });
      },
      clearUser: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): Partial<UserState> => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
