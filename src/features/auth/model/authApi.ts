// API доступ к dummyjson auth
export interface LoginResponse {
  accessToken: string;
  // дополнительные поля можно расширить при необходимости
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? 'Не удалось войти');
  }

  const data = (await res.json()) as LoginResponse;
  console.log('DATA:', data);
  return data;
}
