export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-full flex-col justify-center">{children}</main>
  );
}
