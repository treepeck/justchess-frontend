export default function SignInForm() {
  return (
    <form action="#" className="space-y-6">
      <div>
        <label className="block text-sm/6 font-medium text-gray-100">Email address</label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm/6 font-medium text-gray-100">Password</label>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
          Sign in
        </button>
      </div>
    </form>
  );
}
