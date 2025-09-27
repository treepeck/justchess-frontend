import SignInForm from '@/components/sign-in-form';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
        Sign in to your account
      </h2>

      <div className="mt-16 w-full max-w-xs mx-auto">
        <SignInForm />

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-indigo-500 hover:text-indigo-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
