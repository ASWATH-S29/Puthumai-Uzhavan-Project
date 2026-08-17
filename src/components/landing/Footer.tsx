export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
        <div>
          <a href="/" className="flex items-center gap-3" aria-label="Puthumai Uzhavan home">
            <img src="/assets/image.png" alt="Puthumai Uzhavan agriculture and AI logo" className="h-11 w-11 rounded-full object-contain" />
            <span>
              <span className="block font-display text-base font-bold">புதுமை உழவன்</span>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-brand-300">PUTHUMAI UZHAVAN</span>
            </span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Smarter decisions for every season with weather, crop, finance and AI-powered farm intelligence.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Explore</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/65">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#benefits" className="hover:text-white">Benefits</a>
            <a href="#how-it-works" className="hover:text-white">How it Works</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#about" className="hover:text-white">About Us</a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Get started</h3>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm">
            <a href="/login" className="text-white/65 hover:text-white">Sign in</a>
            <a href="/signup" className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-400">Create account</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-5 pt-6 text-xs text-white/45 sm:px-8 lg:px-12">
        © {new Date().getFullYear()} Puthumai Uzhavan. Built for smarter farming.
      </div>
    </footer>
  );
}
