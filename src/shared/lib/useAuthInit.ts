// src/features/auth/lib/useAuthInit.ts
import { useEffect, useState } from "react";
import { getMe } from "../api/login";
import { useUserStore } from "../../entities/user";

export const useAuthInit = () => {
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      try {
        const { email, accessToken } = await getMe();
        if (!ignore) setUser(email, accessToken);
      } catch (e) {
        console.log("Пользователь не авторизован");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, [setUser]);

  return { loading };
};
