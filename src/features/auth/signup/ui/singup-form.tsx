import { useState } from "react";
import { register } from "../../../../shared/api/login";
import { useUserStore } from "../../../../entities/user";
import { useNavigate } from "react-router-dom";
import styles from './signup-form.module.css'

export const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const data = await register(username, password);
      setUser(data.username, data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError("Ошибка при регистрации. Попробуйте снова.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
      <input
        type="password"
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button}>
        Зарегистрироваться
      </button>
    </form>
  );
};
