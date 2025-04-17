import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchNextQuestion({});
  }, []);

  const fetchNextQuestion = async (questions: QuestionAnswerMap) => {
    setLoading(true);
    try {
      const res = await api.post("/api/ai/send_questions", {
        questions,
      });

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
      const res = await api.post("/api/ai/get_result", {
        questions,
      });

      const resultData: AIResultResponse = res.data;
      setResult(resultData || null);
      setIsCompleted(true);
    } catch (err) {
      console.error("Ошибка при получении результата", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>AI Тест</h1>

      {!isCompleted ? (
        loading ? (
          <p>Загрузка...</p>
        ) : currentData ? (
          <div className={styles.questionBlock}>
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
                    onChange={() => handleAnswer(answer)}
                  />
                  {answer}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <p>Нет текущего вопроса</p>
        )
      ) : (
        <div className={styles.resultBlock}>
          <h2 className={styles.resultTitle}>Ваши результаты</h2>

          {result && (
            <>
              <h3>Ваши профессии:</h3>
              <ul className={styles.professionList}>
                {result.profession.map((profession, i) => (
                  <li key={i}>{profession}</li>
                ))}
              </ul>

              <h3>Изображение:</h3>
              <img
                src={result.image_location}
                alt="Результаты"
                className={styles.resultImage}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
