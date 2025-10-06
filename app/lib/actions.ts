'use server';

import { SignupFormSchema } from '@/app/lib/definitions';

const BASE_URL = process.env.API_BASE_URL;

export async function signup(currentState: any, formData: FormData) {
  const validationResult = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Failed to Sign up',
    };
  }

  // create search params from valid form object
  const params = new URLSearchParams(validationResult.data);

  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    body: params,
  });
  console.log('response:', response);
}
