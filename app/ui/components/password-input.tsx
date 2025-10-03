'use client';

import EyeOpen from '@/icons/eye-open';
import EyeClosed from '@/icons/eye-closed';
import { useState } from 'react';

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="relative flex items-center">
      <input
        id="password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        required
        autoComplete="current-password"
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
  );
}
