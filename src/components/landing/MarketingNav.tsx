import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About Us', href: '#about' },
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12" aria-label="Primary">
        <a href="#" className="flex items-center gap-3" aria-label="Puthumai Uzhavan home">
          <img src="/assets/image.png" alt="Puthumai Uzhavan agriculture and AI logo" className="h-10 w-10 rounded-full object-contain" />
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-brand-900">புதுமை உழவன்</span>
            <span className="block text-[10px] font-semibold tracking-[0.2em] text-brand-600">PUTHUMAI UZHAVAN</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brand-800/70 transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/login" className="text-sm font-semibold text-brand-700 transition hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded">
            Sign in
          </a>
          <a href="/signup" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
            Get started
          </a>
        </div>

        <button
          className="md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6 text-brand-800" /> : <Menu className="h-6 w-6 text-brand-800" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-brand-100 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-brand-800/80 transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
              >
                {l.label}
              </a>
            ))}
            <a href="/signup" onClick={() => setOpen(false)} className="mt-1 rounded-xl bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white">
              Get started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
