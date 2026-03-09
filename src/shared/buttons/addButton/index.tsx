import React from 'react';
import styles from './addbutton.module.css';
import add from '../../icons/add.svg';

interface ButtonProps {
  onClick?: () => void; // Коллбэк-обработчик нажатия
}

export const AddButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.main} onClick={onClick}>  
      <img className={styles.icon} src={add} alt="Icon" />
      <span className={styles.label}>Добавить</span>
    </button>
  );
};