// src/entities/test/ui/TestPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../shared/api/axiosInstance";
import styles from './test-page.module.css';

interface Question {
  order: number;
  question: string;
  answers?: string[];
}

interface TestData {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface AnswerMap {
  [questionOrder: number]: string;
}

export const TestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [professions, setProfessions] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/api/tests/${id}`);
        setTest(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке теста", err);
      }
    };

    fetchTest();
  }, [id]);

  const defaultAnswers = ["да", "скорее да", "возможно", "скорее нет", "нет"];

  const handleAnswerChange = (questionOrder: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionOrder]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!test) return;
    setLoading(true);

    try {
      const resolvedResponse = await api.post("/api/resolved/create", {
        test_type: test.name === "Тип личности" ? "second_order_test" : "first_order_test",
        questions: test.questions.map((q) => ({
          question_order: q.order,
          question: q.question,
          question_answer: answers[q.order] || "",
        })),
      });

      const resolvedId = resolvedResponse.data.id;
      const scoredQuestions = resolvedResponse.data.questions;

      const resultResponse = await api.post("/api/results/create", {
        resolved_id: resolvedId,
        test_type: test.name === "Тип личности" ? "second_order_test" : "first_order_test",
        questions: scoredQuestions.map((q: any) => ({
          question_order: q.question_order,
          mark: q.mark,
        })),
      });

      setImageUrl(resultResponse.data.image_location);
      setProfessions(resultResponse.data.professions || []);
      setIsCompleted(true);
    } catch (err) {
      console.error("Ошибка при отправке результатов", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    if (!email) return;

    try {
      await api.post("/api/send-email", { email, imageUrl, professions });
      setIsEmailSent(true);
    } catch (err) {
      console.error("Ошибка при отправке email", err);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setIsEmailSent(false);
  };

  if (!test) {
    return (
      <div className={styles.spinnerWrapper}>
        <motion.div
          className={styles.spinner}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.title}>{test.name}</h1>
      <p className={styles.description}>{test.description}</p>

      {test.questions.map((q, index) => (
        <motion.div
          key={q.order}
          className={styles.questionBlock}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <p className={styles.questionText}>
            {q.order}. {q.question}
          </p>
          <div className={styles.answers}>
            {(q.answers || defaultAnswers).map((answer, i) => (
              <label key={i} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`q-${q.order}`}
                  value={answer}
                  onChange={() => handleAnswerChange(q.order, answer)}
                  checked={answers[q.order] === answer}
                />
                {answer}
              </label>
            ))}
          </div>
        </motion.div>
      ))}

      {!isCompleted ? (
        <motion.button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? "Загрузка результатов тестирования..." : "Завершить"}
        </motion.button>
      ) : (
        <motion.div
          className={styles.resultBlock}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.resultTitle}>Ваши результаты</h2>
          {imageUrl && (
            <motion.img
              src={imageUrl}
              alt="Результаты"
              className={styles.resultImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {professions.length > 0 && (
            <ul className={styles.professionList}>
              {professions.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {p}
                </motion.li>
              ))}
            </ul>
          )}

        </motion.div>
      )}

    </motion.div>
  );
};
