import * as React from 'react';
import { useState, useEffect } from 'react';

import user from '../../icons/user.svg'
import lock from '../../icons/lock.svg';
import close from '../../icons/close.svg';
import eye from '../../icons/eye-off.svg';

import styles from './inputstyles.module.css';

// Перечисление типов полей
enum FieldType {
  LOGIN = 'LOGIN',
  PASSWORD = 'PASSWORD'
}

// Интерфейс для конфигурирования поля ввода
interface InputFieldProps {
  fieldType: FieldType; // Текущий тип поля (логин или пароль) 
  length?: number; // Длина поля (ширина) - для пропсов нужно вычесть из значения макета 108 = величина отступов для иконок
  height?: number; // Высота поля
  borderWidth?: number; // Толщина границы
  borderRadius?: number; // Радиус скругления рамки
  borderColor?: string; // Цвет границы
  textColor?: string; // Цвет текста
  fontSize?: string; // Размер шрифта
  fontFamily?: string; // Тип шрифта
  placeholder?: string; // Заполнитель
  value?: string; // Текущее значение
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Обработчик изменения
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Обработчик по клику (очистка текста/видимость пароля)
  label?: string; // Заголовок поля
  labelColor?: string; // Цвет текста заголовка
  labelSize?: number; // Размер шрифта заголовка
  labelWeight?: string; // Вес шрифта заголовка
  labelFamily?: string; // Семья шрифта заголовка
  labelSpacing?: number; // Расстояние между заголовком и полем
}

// Компонент поля ввода
const InputField: React.FunctionComponent<InputFieldProps> = ({
  fieldType,  
  length = 200, // Ширина по умолчанию
  height = 30, // Высота по умолчанию
  borderWidth = 1, // Толщина рамки по умолчанию
  borderColor = "#ccc", // Цвет рамки по умолчанию
  borderRadius = 0,
  textColor = "#333", // Цвет текста по умолчанию
  fontSize = "16px", // Размер шрифта по умолчанию
  fontFamily = "Arial", // Тип шрифта по умолчанию
  placeholder = "",
  value,
  onChange,
  onClick,
  label, // Заголовок поля
  labelColor = "#333", // Цвет текста заголовка по умолчанию
  labelSize = "14px", // Размер шрифта заголовка по умолчанию
  labelWeight = "normal", // Вес шрифта заголовка по умолчанию
  labelFamily = "Arial", // Семья шрифта заголовка по умолчанию
  labelSpacing = "40px", // Расстояние между заголовком и полем по умолчанию
}) => {
  // Формирование стиля поля ввода
  const inputStyles = {
    width: `${length}px`,
    height: `${height}px`,
    border: `${borderWidth}px solid ${borderColor}`,
    borderRadius: `${borderRadius}px`,
    color: textColor,
    fontSize,
    fontFamily,
  };

  // Формирование стиля заголовка
  const labelStyles = {
    fontSize: `${labelSize}px`,
    fontWeight: labelWeight,
    fontFamily: labelFamily,
    color: labelColor,
    marginBottom: `${labelSpacing}px`, // Расстояние между заголовком и полем
    display: 'block',
  };

  //обработчики событий

  const [showPassword, setVisibility] = useState(false);

  useEffect(()=>{
    if(fieldType === FieldType.LOGIN) {
        setVisibility(true);
    }
  },[]);
 
  return (
    <div className={styles.input_group}>
      {label && (
        <label style={labelStyles}>
          {label}
        </label>
      )}
      
        { fieldType === FieldType.LOGIN && 
            <img
              src={user}
              alt=""
              className={styles.input_icon_left}
            />
        }

        { fieldType === FieldType.PASSWORD && 
            <img
              src={lock}
              alt=""
              className={styles.input_icon_left}
            />
        }      

        { fieldType === FieldType.LOGIN && 
            <button 
                onClick={onClick}
                className={styles.input_icon_btn_close}
            >
                <img
                    src={close}
                    alt=""
                />    
            </button>
        }

        { fieldType === FieldType.PASSWORD && 
            <button 
                onClick={()=>setVisibility(!showPassword)}
                className={styles.input_icon_btn_eye}
            >
                <img
                    src={eye}
                    alt=""
                />    
            </button>
        }

        <input
            type={ showPassword ? 'text' : 'password'}
            className={styles.input_with_icons}
            style={inputStyles}
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange?.(event)}
        />
    </div>
  );
};

export default InputField;