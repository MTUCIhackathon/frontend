import { useState } from "react";
import { login } from "../../../../shared/api/login";
import { useUserStore } from "../../../../entities/user";
import { useNavigate } from "react-router-dom";
import styles from "./login-form.module.css"

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(email, password);
      setUser(data.email, data.accessToken);
      // navigate("/dashboard");
    } catch (err) {
      setError("Неверные данные для входа");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button}>
        Войти
      </button>
    </form>
  );
};
