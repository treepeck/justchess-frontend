'use client';

import PasswordInput from '@/components/form/password-input';
import EmailInput from '@/components/form/email-input';
import { signup } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(signup, null);

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
            required
            autoComplete="name"
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
      </div>
      <EmailInput />
      <PasswordInput />
      <div className='space-y-2'>
        {state?.message && <p className='text-sm text-red-400'>{state.message}</p>}
        <button
          disabled={pending}
          type="submit"
          className="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {pending ? 'Submitting' : 'Create account'}
        </button>
      </div>
    </form>
  );
}
