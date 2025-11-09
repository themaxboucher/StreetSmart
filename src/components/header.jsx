import { Logo } from "./logo";

export function Header() {
  return (
    <header className="flex items-center justify-between z-10 bg-background px-4 py-2 border-b">
      <Logo />
    </header>
  );
}
