import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../shared/api/axiosInstance";
import styles from "./ai-test.module.css";

interface QuestionAnswerMap {
  [question: string]: string;
}

interface AIQuestionResponse {
  questions: string;
  answers: string[];
}

interface AIResultResponse {
  image_location: string;
  profession: string[];
}

export const AITestPage = () => {
  const [qaMap, setQaMap] = useState<QuestionAnswerMap>({});
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<AIResultResponse | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentData, setCurrentData] = useState<AIQuestionResponse | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    fetchNextQuestion({});
  }, []);

  const fetchNextQuestion = async (questions: QuestionAnswerMap) => {
    setLoading(true);
    setSelectedAnswer(null);
    try {
      const res = await api.post("/api/ai/send_questions", { questions });

      if (res.data && res.data.questions && res.data.answers) {
        setCurrentData({
          questions: res.data.questions,
          answers: res.data.answers,
        });
      } else {
        setCurrentData(null);
      }
    } catch (err) {
      console.error("Ошибка при получении вопроса", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!currentData) return;

    const updatedMap: QuestionAnswerMap = {
      ...qaMap,
      [currentData.questions]: answer,
    };

    setQaMap(updatedMap);
    setQuestionCount((prev) => prev + 1);

    if (questionCount + 1 >= 10) {
      getResult(updatedMap);
    } else {
      fetchNextQuestion(updatedMap);
    }
  };

  const getResult = async (questions: QuestionAnswerMap) => {
    setLoading(true);
    try {
      const res = await api.post("/api/ai/get_result", { questions });

      const resultData: AIResultResponse = res.data;
      setResult(resultData || null);
      setIsCompleted(true);
    } catch (err) {
      console.error("Ошибка при получении результата", err);
    } finally {
      setLoading(false);
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    if (!email || !result) return;

    try {
      await api.post("/api/send-email", {
        email,
        imageUrl: result.image_location,
        professions: result.profession,
      });
      setIsEmailSent(true);
    } catch (err) {
      console.error("Ошибка при отправке email", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>AI Тест</h1>
      <p className={styles.description}>Наш AI тест генерирует вопросы на основе ваших предыдущих ответов, таким образом тест автоматически подстраивается под вас!</p>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            className={styles.loader}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : !isCompleted ? (
          currentData && (
            <motion.div
              key={currentData.questions}
              className={styles.questionBlock}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className={styles.questionText}>
                Вопрос {questionCount + 1}: {currentData.questions}
              </p>
              <div className={styles.answers}>
                {currentData.answers.map((answer, i) => (
                  <label key={i} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="answer"
                      value={answer}
                      checked={selectedAnswer === answer}
                      onChange={() => setSelectedAnswer(answer)}
                    />
                    {answer}
                  </label>
                ))}
              </div>
              <button
                className={styles.submitButton}
                onClick={() => selectedAnswer && handleAnswer(selectedAnswer)}
                disabled={!selectedAnswer}
              >
                Ответить
              </button>
            </motion.div>
          )
        ) : (
          <motion.div
            key="result"
            className={styles.resultBlock}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={styles.resultTitle}>Ваши результаты</h2>

            {result && (
              <>
                <ul className={styles.professionList}>
                  {result.profession.map((profession, i) => (
                    <li key={i}>{profession}</li>
                  ))}
                </ul>

                <img
                  src={result.image_location}
                  alt="Результаты"
                  className={styles.resultImage}
                />

              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
