import Link from 'next/link';
import SignUpForm from '@/components/form/sign-up-form';

export default function Page() {
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
        Sign up for JustChess
      </h2>

      <div className="mt-10 w-full max-w-xs mx-auto">
        <SignUpForm />

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-indigo-500 hover:text-indigo-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
