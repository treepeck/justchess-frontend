'use server';

const BASE_URL = process.env.API_BASE_URL;

export async function signup(formData: FormData) {
  console.log('form data:', formData);

  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencod',
    },
    body: formData,
  });

  console.log('response:', response);
}
