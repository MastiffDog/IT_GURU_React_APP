import React, { useState, useEffect } from 'react';
import styles from './toast.module.css';

// Определим интерфейс для props компонента
interface ToastProps {
  text: string; // Текст уведомления
  isVisible: boolean; //Видимость уведомления
}

// Основной компонент уведомления
export const ToastNotification: React.FC<ToastProps> = ({ text, isVisible }) => {
  return isVisible ? (
    <div className={styles.toast}>{text}</div>
  ) : null;
};