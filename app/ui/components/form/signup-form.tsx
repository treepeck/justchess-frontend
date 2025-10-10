'use client';

import PasswordInput from '@/components/form/password-input';
import EmailInput from '@/components/form/email-input';
import { signup } from '@/app/lib/actions';
import { useActionState } from 'react';
import { SignupState } from '@/app/lib/definitions';

export default function SignupForm() {
  const [state, formAction, pending] = useActionState<SignupState, FormData>(
    signup,
    undefined
  );

  return (
    <form action={formAction} className="space-y-6">
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
            defaultValue={state?.defaultValues?.name}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
        {state?.errors?.name &&
          state.errors.name.map((error, index) => (
            <p key={index} className="text-sm mt-1 text-red-400">
              {error}
            </p>
          ))}
      </div>

      <EmailInput
        defaultValue={state?.defaultValues?.email}
        errorMessage={state?.errors?.email}
      />

      <PasswordInput
        defaultValue={state?.defaultValues?.password}
        errorMessage={state?.errors?.password}
      />

      <div>
        {state?.message && (
          <p className="text-sm mb-1 text-red-400">{state.message}</p>
        )}
        <button
          disabled={pending}
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white cursor-pointer hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-800"
        >
          Create account
        </button>
      </div>
    </form>
  );
}
