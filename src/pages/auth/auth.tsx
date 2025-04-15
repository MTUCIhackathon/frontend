import { useState } from "react";
import { LoginForm } from "../../features/auth/login";
import { SignupForm } from "../../features/auth/signup";
import styles from './auth.module.css'

export function Auth() {
  const [type, setType] = useState<"login" | "signup">("login");

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>


        {type === "login" ? (
          <>
            <h2 className={styles.title}>Вход</h2>
            <LoginForm />
            <p className={styles.switchText}>
              Нет аккаунта?
              <span
                className={styles.switchLink}
                onClick={() => setType("signup")}
              >
                Зарегистрируйтесь
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Регистрация</h2>
            <SignupForm />
            <p className={styles.switchText}>
              Уже есть аккаунт?
              <span
                className={styles.switchLink}
                onClick={() => setType("login")}
              >
                Войти
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
