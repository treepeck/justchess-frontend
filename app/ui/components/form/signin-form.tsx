'use client';

import PasswordInput from '@/components/form/password-input';
import EmailInput from '@/components/form/email-input';
import { validateSignin } from '@/app/lib/actions';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SigninForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Set loading to true when the request starts
    setIsLoading(true);
    // Clear previous errors when a new request starts
    setErrors(undefined);
    setErrorMessage(undefined);

    try {
      const formData = new FormData(event.currentTarget);
      const validationResult = await validateSignin(formData);

      if (!validationResult.success) {
        setErrors(validationResult.errors);
        return;
      }

      // Create search params from valid form object
      const params = new URLSearchParams(validationResult.data);
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
        credentials: 'include',
      });

      if (!response.ok) {
        const msg: string = await response.text();
        setErrorMessage(`Failed to Sign in: ${msg}`);
        return;
      }

      // Redirect to home page on success
      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to Sign ip: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <EmailInput errorMessages={errors?.email} />
      <PasswordInput errorMessages={errors?.password} />
      <div>
        {errorMessage && (
          <p className="text-sm mb-1 text-red-400">{errorMessage}</p>
        )}
        <button
          disabled={isLoading}
          type="submit"
          className="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-800"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
