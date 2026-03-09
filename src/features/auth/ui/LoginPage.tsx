import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../model/authStore';
import { useNavigate } from 'react-router-dom';


import InputField from 'src/shared/input/inputLoginPage';
import { CustomCheckbox } from 'src/shared/input/checkbox';
import SubmitButton from 'src/shared/buttons/submitButton';
import sound from '../../../shared/icons/sound.svg';
import line from '../../../shared/icons/line.svg';
import styles from './loginpage.module.css';

enum FieldType {
  LOGIN = 'LOGIN',
  PASSWORD = 'PASSWORD'
}

// Возможные ошибки валидации
enum ValidationErrors {
  EmptyField = 'Заполните поле',
}

// Интерфейс для валидаций
interface FieldValidation {
  valid: boolean;
  errorMsg: string | null;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setloginError] = useState<boolean>(false);
  const [passwordError, setpasswordError] = useState<boolean>(false);

  // Validation
  const validateNonEmpty = (value: string): FieldValidation => {
        if (value.trim() === "") {
            return { valid: false, errorMsg: ValidationErrors.EmptyField };
        } 
        return { valid: true, errorMsg: null };
  };

  useEffect(()=>{
    const storedUserName = localStorage.getItem('username');
    const storedRememberMe = localStorage.getItem('rememberMe');
    if(storedUserName) {
        setUsername(storedUserName);
    }
    if(storedRememberMe === "true") {
        setRemember(true);
    }
  },[])

  useEffect(()=>{
    localStorage.setItem('username', username);
  },[username])

  useEffect(()=>{
    if(remember) {
        localStorage.setItem('rememberMe', "true");
    }
    else {
        localStorage.setItem('rememberMe', "false");
    }
  },[remember])




  // LOGIN handlers
  const handleChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);

    const loginFieldNotEmpty = validateNonEmpty(event.target.value);
    if(!loginFieldNotEmpty.valid) {
        setloginError(true);
    }
    else {
        setloginError(false);
    }
  };
 
  const handleClearLogin = () => {
    setUsername('');
  }

  // PASSWORD handlers 
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

  const passwordFieldNotEmpty = validateNonEmpty(event.target.value);
    if(!passwordFieldNotEmpty.valid) {
        setpasswordError(true);
    }
    else {
        setpasswordError(false);
    }
  };
  // Remember Setter
  const handleCheckboxChange = () => {
    setRemember(!remember);
  };


  const handleSubmit = async() => {
    if(loginError || passwordError) return;
    setError(null);
    setLoading(true);
    try {
      console.log(username,password, remember)  
      await login(username, password, remember);
      navigate('/products', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  return (
   <div className={styles.login_content}>
        <div className={styles.login_frame_2}>
            <div className={styles.login_frame_1}>
                <div className={styles.login_frame_logo}>
                    <div className={styles.login_logo}>
                        <img src={sound} alt="logo"/>
                    </div>
                </div>
            </div>

            <div className={styles.login_frame2_text}>
                <div className={styles.login_frame2_text_main}>
                    <span className={styles.login_frame2_text_main_text}>
                        Добро пожаловать!
                    </span>
                </div>

                <div className={styles.login_frame2_text_gap}>
                </div>
                
                <div className={styles.login_frame2_text_auth}>
                    <span className={styles.login_frame2_text_auth_text}>Пожалуйста, авторизуйтесь</span>
                </div>
            </div>

            <div className={styles.login_frame2_form}>
                <div className={styles.login_frame2_form_frame5}>
                    <div></div>
                    <div className={styles.login_frame2_form_field}>
                        <InputField
                            fieldType={FieldType.LOGIN}
                            label={loginError ? 'Заполните поле' : 'Логин'}
                            labelColor={loginError ? "red" : "#232323"}
                            labelSize={18}
                            labelWeight="medium"
                            labelFamily="Arial"
                            labelSpacing={6}
                            value={username}
                            length={291} // Ширина поля
                            height={55} // Высота поля
                            borderWidth={1} // Толщина рамки
                            borderRadius={12} //скругление
                            borderColor="#EDEDED" // Цвет рамки
                            textColor="#232323" // Цвет текста
                            fontSize="18px" // Размер шрифта
                            fontFamily="'Inter'" // Тип шрифта
                            placeholder="Введите логин"
                            onChange={handleChangeLogin}
                            onClick={handleClearLogin}
                        />
                    </div>
                    
                    <div className={styles.login_frame2_form_gap}/>

                    <div className={styles.login_frame2_form_field}>
                        <InputField
                            fieldType={FieldType.PASSWORD}
                            value={password}
                            label={passwordError ? "Заполните поле" : "Пароль"}
                            labelColor={passwordError ? "red" : "#232323"}
                            labelSize={18}
                            labelWeight="medium"
                            labelFamily="Arial"
                            labelSpacing={6}
                            length={291} // Ширина поля
                            height={55} // Высота поля
                            borderWidth={1} // Толщина рамки
                            borderRadius={12} //скругление
                            borderColor="#EDEDED" // Цвет рамки
                            textColor="#232323" // Цвет текста
                            fontSize="18px" // Размер шрифта
                            fontFamily="'Inter'" // Тип шрифта
                            placeholder="Введите пароль"
                            onChange={handleChangePassword}
                        />
                    </div>
                </div>

                <div className={styles.login_frame2_form_login_keep}>
                    <div className={styles.login_frame2_form_login_keep_check}>
                        <CustomCheckbox
                            size={18}
                            borderColor='#EDEDED'
                            borderWidth={2}
                            bgColor='gray'
                            checked={remember}
                            onChange={handleCheckboxChange}
                        />            
                    </div> 
                    <div className={styles.login_frame2_form_login_keep_text}>
                        <span>Запомнить данные</span>
                    </div>   
                </div>

                <div className={styles.login_frame2_form_frame7}>
                    {error && (
                        <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
                    )}
                    <div>
                        <SubmitButton
                            label= {loading ? 'Загрузка...' : 'Войти'}
                            width='399px'
                            height='54px'
                            color='#FFFFFF'
                            radius={12}
                            fontSize='18px'
                            fontWeight='500'
                            backgroundColor='#242EDB'
                            disabled={loading}
                            onClick={handleSubmit}
                        />
                    </div>
                    
                    <div className={styles.login_frame2_form_frame7_or}>
                        <div>
                            <img src={line}/>
                        </div>
                        <div className={styles.login_frame2_form_frame7_or_text}>
                            <span>или</span>    
                        </div>   
                        <div>
                            <img src={line}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.login_frame2_no_account}>
                <div>
                    <span className={styles.login_frame2_no_account_text}>Нет аккаунта?&nbsp;</span>
                    <span className={styles.login_frame2_no_account_create}>Создать&nbsp;</span>
                </div>
            </div>
        </div>
     </div>   
  );
};