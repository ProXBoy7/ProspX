import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field } from "../components/auth-shell";
import { getStoredUser, setStoredUser } from "../lib/use-theme";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — ScholarGlass AI" },
      { name: "description", content: "Welcome back to ScholarGlass AI. Sign in to continue your research." },
      { property: "og:title", content: "Sign in — ScholarGlass AI" },
      { property: "og:description", content: "Welcome back to ScholarGlass AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const stored = typeof window !== "undefined" ? getStoredUser() : null;
  const [email, setEmail] = useState(stored?.email ?? "");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const existing = getStoredUser();
    const name = existing?.name ?? email.split("@")[0];
    setStoredUser({ name, email });
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      headline="Welcome back."
      accentWord="back"
      sub="Sign in to pick up right where you left off in your academic workspace."
      footer={
        <>
          New here?{" "}
          <Link to="/sign-up" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition"
        >
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}
