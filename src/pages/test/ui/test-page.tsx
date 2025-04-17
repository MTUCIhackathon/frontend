import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
        test_type: "second_order_test",
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
        test_type: "second_order_test",
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

  if (!test) return <div>Загрузка...</div>;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{test.name}</h1>
      <p className={styles.description}>{test.description}</p>

      {test.questions.map((q) => (
        <div key={q.order} className={styles.questionBlock}>
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
        </div>
      ))}

      {!isCompleted ? (
        <button className={styles.submitButton} onClick={handleSubmit} disabled={loading}>
          {loading ? "Загрузка результатов тестирования..." : "Завершить"}
        </button>
      ) : (
        <div className={styles.resultBlock}>
          <h2 className={styles.resultTitle}>Ваши результаты</h2>
          {imageUrl && (
            <img src={imageUrl} alt="Результаты" className={styles.resultImage} />
          )}
          {professions.length > 0 && (
            <ul className={styles.professionList}>
              {professions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
