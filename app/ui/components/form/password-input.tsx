'use client';

import EyeOpen from '@/icons/eye-open';
import EyeClosed from '@/icons/eye-closed';
import { useState } from 'react';

export default function PasswordInput({
  defaultValue,
  errorMessage,
}: {
  defaultValue?: string;
  errorMessage?: string[];
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div>
      <label className="block text-sm/6 font-medium text-gray-100">
        Password
      </label>
      <div className="mt-2">
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            defaultValue={defaultValue}
            className="w-full rounded-md bg-white/5 ps-3 pe-10 py-1.5  text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 cursor-pointer transition hover:opacity-75"
          >
            {showPassword ? <EyeClosed /> : <EyeOpen />}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm mt-1 text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
