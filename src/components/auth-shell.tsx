import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

export function AuthShell({
  headline,
  accentWord,
  sub,
  children,
  footer,
}: {
  headline: string;
  accentWord: string;
  sub: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  // Split headline around the accent word for pill styling.
  const parts = headline.split(accentWord);
  return (
    <div
      className="relative min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* Ambient blobs */}
      <div
        aria-hidden
        className="blob-a pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, var(--blob-a) 0%, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="blob-b pointer-events-none fixed -bottom-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, var(--blob-b) 0%, transparent 70%)` }}
      />

      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-[clamp(1rem,4vw,2rem)] py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary shadow-lg">
              <span className="material-symbols-outlined text-primary-foreground" style={{ fontSize: 20 }}>
                school
              </span>
            </div>
            <span className="truncate text-lg font-bold tracking-tight text-primary">
              ScholarGlass AI
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-[clamp(1rem,4vw,2rem)] pt-10 sm:pt-14 pb-16">
        <div className="w-full max-w-lg text-center">
          <h1 className="font-black leading-snug tracking-tight text-foreground flex flex-wrap items-center justify-center gap-2 text-3xl sm:text-4xl md:text-5xl">
            <span>{parts[0]?.trim()}</span>
            <span className="inline-flex items-center rounded-2xl bg-primary px-3.5 py-1 text-primary-foreground shadow-md shadow-primary/20">
              {accentWord}
            </span>
            <span>{parts[1]?.trim()}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground">
            {sub}
          </p>
        </div>

        <div className="auth-card mt-10 w-full max-w-md rounded-3xl border border-border p-[clamp(1.25rem,4vw,2rem)] shadow-xl">
          {children}
        </div>

        <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
      </main>
    </div>
  );
}

export function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      />
    </label>
  );
}
