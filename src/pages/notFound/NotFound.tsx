import React from 'react';
import styles from './notFound.module.css';

export const NotFound: React.FC = () => (
  <div className={styles.main}>
    <div className={styles.content}>
        <div className={styles.text}><span>404</span></div>
        <div className={styles.text}><span>Страница не найдена.</span></div>
    </div>
  </div>
);