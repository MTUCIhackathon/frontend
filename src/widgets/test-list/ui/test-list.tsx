// src/widgets/test-list/ui/TestList.tsx
import React, { useEffect, useState } from "react";
import { Test } from "../../../entities/test/card-test/model";
import { TestCard } from "../../../entities/test/card-test/card-test";
import { fetchAllTests } from "../model/api/api";
import styles from './test-list.module.css'

const TestList: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllTests();
        setTests(data);
      } catch (err) {
        console.error("Ошибка при получении тестов", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className={styles.loading}>Загрузка тестов...</div>;

  return (
    <div className={styles.list}>
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  );
};

export default TestList;
