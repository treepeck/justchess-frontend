'use client';

import { SignupState, SignupFormSchema } from '@/app/lib/definitions';
import { fetchSignup } from './api';
import { redirect } from 'next/navigation';

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
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Failed to Sign up: Invalid input',
    };
  }

  // Create search params from valid form object
  const params = new URLSearchParams(validationResult.data);
  try {
    const response = await fetchSignup(params);

    // Handle API response errors
    if (!response.ok) {
      const statusMessages: Record<number, string> = {
        406: 'Invalid input',
        409: 'Not unique name or email',
        500: 'Server error',
      };

      const message: string =
        statusMessages[response.status] || 'Unexpected error';

      return {
        defaultValues: { name: name, email: email, password: password },
        message: `Failed to Sign up: ${message}`,
      };
    }

    // If successful, redirect to main page
    redirect('/');
  } catch (error) {
    if (error instanceof Error) {
      return {
        defaultValues: { name: name, email: email, password: password },
        message: `Failed to Sign up: ${error.message}`,
      };
    }
  }
}
