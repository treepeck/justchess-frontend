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
    href: '#',
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
    <header className="h-16 w-full border-b border-gray-600">
      <div className="mx-auto max-w-screen-xl h-full flex justify-between">
        <div className="flex">
          <Link href="/" className="group flex items-center text-3xl px-4 hover:text-blue-500">
            JustChess<span className="text-gray-400 group-hover:text-sky-500">.org</span>
          </Link>
          <nav className="flex items-center h-full">
            {navItems.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="h-full flex items-center px-3 uppercase hover:bg-gray-800 transition-colors rounded-xs">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center mr-4">
          <Link href="/signin" className=" py-1 px-4 border rounded-lg">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
