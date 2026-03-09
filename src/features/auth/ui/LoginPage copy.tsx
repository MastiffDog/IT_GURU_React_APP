import React, { useState } from 'react';
import { useAuthStore } from '../model/authStore';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password, remember);
      navigate('/products', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '1rem' }}>
      <h2>Вход</h2>
      <form onSubmit={onSubmit} noValidate>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Логин"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Пароль"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> запомнить
          </label>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
        )}
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
      {/* <p style={{ marginTop: 8, color: '#555' }}>
        Пример тестовых учетных данных зависит от API. Для теста используйте документацию dummyjson/auth.
      </p> */}
    </div>
  );
};
