export default function EmailInput() {
  return (
    <div>
      <label className="block text-sm/6 font-medium text-gray-100">
        Email address
      </label>
      <div className="mt-2">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        />
      </div>
    </div>
  );
}
