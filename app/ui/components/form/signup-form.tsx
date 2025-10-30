'use client';

import PasswordInput from '@/components/form/password-input';
import EmailInput from '@/components/form/email-input';
import { validateSignup } from '@/app/lib/actions';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    name?: string[] | undefined;
    email?: string[] | undefined;
    password?: string[] | undefined;
  }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true); // Set loading to true when the request starts

    try {
      const formData = new FormData(event.currentTarget);
      const validationResult = await validateSignup(formData); // Validate form

      if (!validationResult.success) {
        setErrors(validationResult.errors);
        setErrorMessage('Failed to Sign up: Invalid input');
        return;
      }

      // Create search params from valid form object
      const params = new URLSearchParams(validationResult.data);
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
        credentials: 'include',
      });

      // Handle API response errors
      if (!response.ok) {
        const statusErrorMessages: Record<number, string> = {
          406: 'Invalid input',
          409: 'Not unique name or email',
          500: 'Server error',
        };
        const statusErrorMessage: string =
          statusErrorMessages[response.status] || 'Unexpected error';
        setErrorMessage(`Failed to Sign up: ${statusErrorMessage}`);
        return;
      }

      // Redirect to home page on success
      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to Sign up: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm/6 font-medium text-gray-100">
          Username
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="MagnusCarlsen"
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
        {errors?.name &&
          errors.name.map((error, index) => (
            <p key={index} className="text-sm mt-1 text-red-400">
              {error}
            </p>
          ))}
      </div>
      <EmailInput errorMessages={errors?.email} />
      <PasswordInput errorMessages={errors?.password} />

      <div>
        {errorMessage && (
          <p className="text-sm mb-1 text-red-400">{errorMessage}</p>
        )}
        <button
          disabled={isLoading}
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white cursor-pointer hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-800"
        >
          Create account
        </button>
      </div>
    </form>
  );
}
