import React from "react";

type Props = {
  size?: number | string, // Размер чекбокса (по умолчанию 20px)
  borderColor?: string, // Цвет рамки (по умолчанию черный)
  borderWidth?: number | string, // Толщина рамки (по умолчанию 2px)
  bgColor?: string, // Фон чекбокса при выбранном состоянии (по умолчанию зеленый)
  label?: string, // Метка около чекбокса
  checked?: boolean, // Изначальное состояние чекбокса
  onChange?: (value: boolean) => void, // Обработчик события change
};

export const CustomCheckbox: React.FunctionComponent<Props> = ({
  size = 20,
  borderColor = '#000',
  borderWidth = 2,
  bgColor = '#4CAF50', // Цвет чекбокса при выбранной опции
  label,
  checked = false,
  onChange,
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {/* Контейнер для визуальной рамки */}
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '4px',
          border: `${borderWidth}px solid ${borderColor}`,
          backgroundColor: checked ? bgColor : 'transparent',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => onChange && onChange(!checked)} // Перехватываем клик и вызываем обработчик
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" stroke="#fff" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5 L5 9 L11 1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && <span>{label}</span>}
    </div>
  );
};