import PasswordInput from '@/app/ui/components/form/password-input';
import EmailInput from '@/components/form/email-input';

export default function SignInForm() {
  return (
    <form action="#" className="space-y-6">
      <EmailInput />
      <PasswordInput />
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
