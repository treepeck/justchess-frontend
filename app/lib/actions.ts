'use client';

import { z } from 'zod';
import { SignupState, SignupFormSchema } from '@/app/lib/definitions';
import { fetchSignup } from './api';

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
    const response = await fetchSignup(params);
    // console.log('response:', response);
  } catch (error) {
    if (error instanceof Error) {
      return {
        defaultValues: { name: name, email: email, password: password },
        message: `Failed to Sign up: ${error.message}`,
      };
    }
  }
}
