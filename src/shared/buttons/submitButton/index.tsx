import React from 'react';

interface ButtonProps {
  width?: string; // Ширина кнопки
  height?: string; // Высота кнопки
  radius?: number; // Радиус угла кнопки
  backgroundColor?: string; // Цвет фона
  fontFamily?: string; // Семейство шрифта
  fontSize?: string; // Размер текста
  fontWeight?: string; // Толщина шрифта
  color?: string; // Цвет текста
  label?: string; // Надпись на кнопке
  onClick?: () => void; // Обработчик клика
  disabled?: boolean
}

const StyledButton: React.FC<ButtonProps> = ({
  width = 'auto',
  height = '40px',
  radius = 4,
  backgroundColor = '#007bff',
  fontFamily = 'Arial',
  fontSize = '16px',
  fontWeight = 'bold',
  color = '#fff',
  label = '',
  onClick,
  disabled
}) => {
  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: `${radius}px`,
    backgroundColor,
    fontFamily,
    fontSize,
    fontWeight,
    color,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    width,
    height,
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default StyledButton;