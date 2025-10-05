import SignInForm from '@/components/form/sign-in-form';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-full flex-col justify-center">
      <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
        Sign in to your account
      </h2>

      <div className="mt-10 w-full max-w-xs mx-auto">
        <SignInForm />

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-indigo-500 hover:text-indigo-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
