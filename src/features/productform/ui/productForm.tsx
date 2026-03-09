import React, { useState } from 'react';
import styles from './productform.module.css';

// Типизация полей формы
interface FormValues {
  name: string;
  price: string;
  vendor: string;
  sku: string;
}

// Возможные ошибки валидации
enum ValidationErrors {
  EmptyField = 'Заполните поле',
  InvalidPriceFormat = 'Цена должна быть числом'
}

// Интерфейс для валидаций
interface FieldValidation {
  valid: boolean;
  errorMsg: string | null;
}

// Интерфейс для статуса формы
interface FormStatus {
  fieldsValid: Record<string, FieldValidation>; // Состояние отдельных полей
  formIsValid: boolean; // Общая валидация всей формы
}

interface IProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

// Главная форма добавления товара
export const AddProductForm: React.FC<IProps> = ({ onSubmit, onCancel }) => {
  const initialFormValues: FormValues = {
    name: "",
    price: "",
    vendor: "",
    sku: ""
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formStatus, setFormStatus] = useState<FormStatus>({
    fieldsValid: {},
    formIsValid: false
  });

  // Хэндлер отправки формы
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    validateAllFields();

    if (formStatus.formIsValid) {
      //alert('Форма успешно отправлена!');
      onSubmit();
      resetForm();
    }
  };

  // Сброс формы
  const resetForm = () => {
    setFormValues(initialFormValues);
    setFormStatus({
      fieldsValid: {},
      formIsValid: false
    });
  };

  // Хэндлер отмены
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  // Валидация цены (число)
  const validatePrice = (value: string): FieldValidation => {
    const numericValue = parseFloat(value);
    if (Number.isNaN(numericValue)) {
      return { valid: false, errorMsg: ValidationErrors.InvalidPriceFormat };
    }
    return { valid: true, errorMsg: null };
  };

  // Валидация заполнения поля
  const validateNonEmpty = (value: string): FieldValidation => {
    if (value.trim() === "") {
      return { valid: false, errorMsg: ValidationErrors.EmptyField };
    }
    return { valid: true, errorMsg: null };
  };

  // Генеральная валидация всех полей
  const validateAllFields = () => {
    const validations: Record<string, FieldValidation> = {};

    validations['name'] = validateNonEmpty(formValues.name);
    validations['vendor'] = validateNonEmpty(formValues.vendor);
    validations['sku'] = validateNonEmpty(formValues.sku);
    validations['price'] = validatePrice(formValues.price);

    const formIsValid = Object.values(validations).every(field => field.valid);

    setFormStatus({
      fieldsValid: validations,
      formIsValid
    });
  };

  // Обработка изменения значений полей
  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues(prev => ({...prev, [fieldName]: value}));
  };

  // Хэндлер потери фокуса поля
  const handleBlur = (fieldName: string) => {
    switch (fieldName) {
      case 'name':
      case 'vendor':
      case 'sku': {
        const validationResult = validateNonEmpty(formValues[fieldName]);
        setFormStatus(prev => ({
          ...prev,
          fieldsValid: {...prev.fieldsValid, [fieldName]: validationResult},
        }));
        break;
      }
      case 'price': {
        const validationResult = validatePrice(formValues[fieldName]);
        setFormStatus(prev => ({
          ...prev,
          fieldsValid: {...prev.fieldsValid, [fieldName]: validationResult},
        }));
        break;
      }
    }
  };

  return (
    <form
      className={styles.main} 
      onSubmit={handleSubmit}
    >
      <div className={styles.content}>
      <label htmlFor="name">Наименование:</label><br/>
      <input 
        className={styles.form_input}
        type="text"
        id="name"
        value={formValues.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      /><br/>
      {formStatus.fieldsValid['name']?.errorMsg &&
        <p style={{color: 'red'}}>{formStatus.fieldsValid['name'].errorMsg}</p>}

      <label htmlFor="price">Цена:</label><br/>
      <input
        className={styles.form_input}
        type="text"
        id="price"
        value={formValues.price}
        onChange={(e) => handleInputChange('price', e.target.value)}
        onBlur={() => handleBlur('price')}
      /><br/>
      {formStatus.fieldsValid['price']?.errorMsg &&
        <p style={{color: 'red'}}>{formStatus.fieldsValid['price'].errorMsg}</p>}

      <label htmlFor="vendor">Вендор:</label><br/>
      <input
        className={styles.form_input}
        type="text"
        id="vendor"
        value={formValues.vendor}
        onChange={(e) => handleInputChange('vendor', e.target.value)}
        onBlur={() => handleBlur('vendor')}
      /><br/>
      {formStatus.fieldsValid['vendor']?.errorMsg &&
        <p style={{color: 'red'}}>{formStatus.fieldsValid['vendor'].errorMsg}</p>}

      <label htmlFor="sku">Артикул:</label><br/>
      <input
        className={styles.form_input}
        type="text"
        id="sku"
        value={formValues.sku}
        onChange={(e) => handleInputChange('sku', e.target.value)}
        onBlur={() => handleBlur('sku')}
      /><br/>
      {formStatus.fieldsValid['sku']?.errorMsg &&
        <p style={{color: 'red'}}>{formStatus.fieldsValid['sku'].errorMsg}</p>}

      <div>
        <button className={styles.form_btn} type="submit">Добавить</button>&nbsp;&nbsp;
        <button className={styles.form_btn} type="button" onClick={handleCancel}>Отмена</button>
      </div>  
      </div>  
    </form>
  );
};