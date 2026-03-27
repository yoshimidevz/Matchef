const BASE_URL = 'http://10.20.16.219:3001';

export const createUser = async (name: string, email: string) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  return response.json();
};

export const getUserByEmail = async (email: string) => {
  const response = await fetch(`${BASE_URL}/users/${email}`);
  return response.json();
};