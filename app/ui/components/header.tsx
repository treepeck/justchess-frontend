import Link from 'next/link';
import { getUser } from '@/app/lib/actions';

const navItems: { name: string; href: string }[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Play',
    href: '/play',
  },
  {
    name: 'AI Assistant',
    href: '/assistant',
  },
  {
    name: 'Lorem',
    href: '#',
  },
  {
    name: 'Lorem',
    href: '#',
  },
];

export default async function Header() {
  const user = await getUser();

  return (
    <header className="bg-re h-16 w-full fixed border-b border-gray-700">
      <div className="mx-auto max-w-7xl h-full flex justify-between">
        <div className="flex">
          <Link
            href="/"
            className="group flex items-center text-3xl px-4 me-1 transition hover:text-indigo-500"
          >
            JustChess
            <span className="text-gray-400 transition group-hover:text-indigo-400">
              .org
            </span>
          </Link>
          <nav className="flex items-center h-full gap-x-1">
            {navItems.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-4 py-1 hover:bg-neutral-700 transition-colors rounded-md"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center me-4">
          {user ? (
            <strong> {user.name}</strong>
          ) : (
            <Link
              href="/login"
              className=" py-1 px-4 border rounded-lg transition hover:opacity-75"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
