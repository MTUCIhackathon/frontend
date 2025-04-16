// src/entities/test/ui/TestCard.tsx
import React from "react";
import { Test } from "./model";
import styles from './card-test.module.css'

interface TestCardProps {
  test: Test;
}

export const TestCard: React.FC<TestCardProps> = ({ test }) => {

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{test.name}</h3>
      <p className={styles.description}>{test.description}</p>
      <p className={styles.questionsCount}>
        Количество вопросов: {test.questions.length}
      </p>
    </div>
  );
};

