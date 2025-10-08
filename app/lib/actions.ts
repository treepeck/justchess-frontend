'use server';

import { z } from 'zod';
import { SignupState, SignupFormSchema } from '@/app/lib/definitions';

const BASE_URL = process.env.API_BASE_URL;

export async function signup(prevState: SignupState, formData: FormData) {
  const { name, email, password } = Object.fromEntries(formData) as {
    name: string;
    email: string;
    password: string;
  };

  // Validate form using Zod
  const validationResult = SignupFormSchema.safeParse({
    name: name,
    email: email,
    password: password,
  });

  if (!validationResult.success) {
    return {
      defaultValues: { name: name, email: email, password: password },
      errors: z.flattenError(validationResult.error).fieldErrors,
      message: 'Failed to Sign up: Invalid input',
    };
  }

  // Create search params from valid form object
  const params = new URLSearchParams(validationResult.data);

  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      body: params,
    });
  } catch {}
}
