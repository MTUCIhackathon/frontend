import React, { useState } from "react";
import TestList from "../../widgets/test-list/ui/test-list";
import api from "../../shared/api/axiosInstance";
import styles from './home.module.css';
import { motion } from "framer-motion";

export const HomePage: React.FC = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/ai/summary", {});
      setSummary(res.data.professions.join(", "));
    } catch (err) {
      console.error("Ошибка при получении описания", err);
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Список тестов</h1>
      <TestList />

      <motion.div
        className={styles.summaryBlock}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className={styles.summaryText}>
          Если вы проходили более одного теста, вы можете узнать более подходящие профессии. Мы сравним результаты прохождения тестов и подберем лучшие рекомендации!
        </p>
        <motion.button
          className={styles.summaryButton}
          onClick={handleGetSummary}
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? "Загрузка..." : "Получить подробный анализ"}
        </motion.button>
        {error && <p className={styles.errorText}>{error}</p>}
        {summary && (
          <motion.div
            className={styles.summaryResult}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Подходящие профессии:</h3>
            <p>{summary}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
