import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../shared/api/axiosInstance";

interface Question {
  order: number;
  question: string;
  answers?: string[]; // для кастомных вариантов
}

interface TestData {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export const TestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState<TestData | null>(null);

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

  if (!test) return <div>Загрузка...</div>;

  const defaultAnswers = ["да", "скорее да", "возможно", "скорее нет", "нет"];

  return (
    <div>
      <h1>{test.name}</h1>
      <p>{test.description}</p>
      {test.questions.map((q) => (
        <div key={q.order}>
          <p>
            {q.order}. {q.question}
          </p>
          <div className="answers">
            {(q.answers || defaultAnswers).map((answer, i) => (
              <label key={i}>
                <input type="radio" name={`q-${q.order}`} value={answer} />
                {answer}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
