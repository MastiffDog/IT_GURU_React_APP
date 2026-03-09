import React from 'react';
import styles from './paginationbutton.module.css';

import careLeft from '../../icons/careleft.svg';
import careRight from '../../icons/careright.svg';

interface ButtonProps {
  buttonType: string;   // Источник иконки
  label?: string;
  onClick?: () => void; // Коллбэк-обработчик нажатия
  disabled?: boolean,
}

export const PaginationButton: React.FC<ButtonProps> = ({ buttonType, label, disabled, onClick}) => {
  return (
    <button className={ disabled ? styles.disabled : styles.main} onClick={onClick} disabled={disabled}>
      { buttonType ==='FIRST' ? <img className={styles.icon} src={careLeft} alt="Icon" /> : null}          
      { buttonType ==='LAST' ? <img className={styles.icon} src={careRight} alt="Icon" /> : null}          
      { buttonType ==='PAGE' ? label : null}  
    </button>
  );
};