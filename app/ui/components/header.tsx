import Link from 'next/link';

export default function Header() {
  return (
    <header
      className="
			flex
			flex-row
			h-[50px]
			w-full
			bg-[var(--container-background)]
			text-center
		">
      <Link href="/" className="text-4xl hover:text-sky-700 mr-auto">
        JustChess.org
      </Link>
    </header>
  );
}
