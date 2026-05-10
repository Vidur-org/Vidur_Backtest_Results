import Link from "next/link";

const nav = [
  { href: "/scenarios", label: "Scenarios" },
  { href: "/heatmap", label: "Heatmap" },
  { href: "/compare", label: "Compare" },
  { href: "/insights", label: "Insights" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-stone-900">
          Research<span className="text-stone-400">Bench</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
