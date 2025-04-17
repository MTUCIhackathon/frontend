// src/pages/HomePage.tsx
import React from "react";
import TestList from "../../widgets/test-list/ui/test-list";
import styles from './home.module.css'

export const HomePage: React.FC = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Список тестов</h1>
    <TestList />
    
  </div>
);


