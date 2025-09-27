import Link from 'next/link';

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

export default function Header() {
  return (
    <header className="h-16 w-full fixed border-gray-600 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="mx-auto max-w-screen-xl h-full flex justify-between">
        <div className="flex">
          <Link href="/" className="group flex items-center text-3xl px-4 me-1 hover:text-indigo-500">
            JustChess<span className="text-gray-400 group-hover:text-indigo-400">.org</span>
          </Link>
          <nav className="flex items-center h-full gap-x-1">
            {navItems.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-4 py-1 hover:bg-slate-800 transition-colors rounded-md">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center me-4">
          <Link href="/login" className=" py-1 px-4 border rounded-lg">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
