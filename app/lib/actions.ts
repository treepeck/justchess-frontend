'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { User } from '@/app/lib/definitions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';
const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000';

const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Must be at least 2 characters long')
    .max(60, 'Must not exceed 60 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Can only contain letters and numbers'),
  email: z.email(),
  password: z
    .string()
    .min(2, 'Must be at least 5 characters long')
    .max(71, 'Must not exceed 71 characters')
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+-/.<>]+$/,
      'Can only contain letters, numbers, and !@#$%^&*()_+-/.<>'
    ),
});

export async function validateSignup(formData: FormData) {
  // Validate form using Zod
  const validationResult = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: z.flattenError(validationResult.error).fieldErrors, // Input field errors
    };
  }

  // If validation success return data
  return {
    success: true,
    data: validationResult.data,
  };
}

export async function getUser() {
  // Get 'Auth' cookie from browser's request
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('Auth');

  if (!authCookie) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        Cookie: `${authCookie.name}=${authCookie.value}`,
        Origin: APP_ORIGIN, // Add Origin for CORS
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as User;
    return user;
  } catch (error) {
    console.error(error);
  }
}
