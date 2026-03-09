import React from 'react';
import styles from './iconbutton.module.css';

interface ButtonProps {
  iconSrc: string;   // Источник иконки
  onClick?: () => void; // Коллбэк-обработчик нажатия
}

export const ButtonWithIcon: React.FC<ButtonProps> = ({ iconSrc, onClick }) => {
  return (
    <button className={styles.main} onClick={onClick}>
      <img className={styles.icon} src={iconSrc} alt="Icon" />
    </button>
  );
};