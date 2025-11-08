import { Logo } from "./logo";

export function Header() {
  return (
    <header className="flex items-center justify-between absolute top-0 left-0 right-0 z-10 bg-background p-2 border-b shadow-sm">
      <Logo />
    </header>
  );
}
