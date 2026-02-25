"use client";

export function Header() {
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 lg:px-10 py-5 sm:py-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-gold-400 tracking-tight">
          Starbook
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-0.5">
          Auspicious Day Calendar
        </p>
      </div>
      <button
        className="px-5 py-2.5 text-sm sm:text-base rounded-lg bg-navy-700/60 text-slate-300 hover:text-gold-300 hover:bg-navy-600/80 transition-colors border border-navy-600"
        disabled
        title="Coming soon"
      >
        Sign In
      </button>
    </header>
  );
}
