import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field } from "../components/auth-shell";
import { getStoredUser, setStoredUser } from "../lib/use-theme";
import { TEST_ACCOUNTS, TestAccount, loadAppState, saveAppState, switchAccount } from "../lib/store";
import { 
  GraduationCap, 
  Building2, 
  PenTool, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — ScholarGlass ProspX" },
      { name: "description", content: "Sign in to ScholarGlass ProspX." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const stored = typeof window !== "undefined" ? getStoredUser() : null;
  const [email, setEmail] = useState(stored?.email ?? "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Check if entered email matches one of known accounts
    const match = TEST_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (match) {
      // Validate password for known accounts
      if (password && match.password && password !== match.password) {
        setIsLoading(false);
        toast.error("Invalid password. Please try again.");
        return;
      }
      setStoredUser({ name: match.name, email: match.email });
      switchAccount(match.email);
      toast.success(`Welcome back, ${match.name}! (${match.badge})`);
      navigate({ to: "/dashboard" });
      return;
    }

    // Default student user for new/custom email
    const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    setStoredUser({ name, email });
    const state = loadAppState();
    const updated = {
      ...state,
      profile: {
        ...state.profile,
        name,
        email
      }
    };
    saveAppState(updated);
    toast.success(`Signed in as ${name}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      headline="Welcome to ProspX."
      accentWord="ProspX"
      sub="Sign in to your academic admissions dossier and portfolio."
      footer={
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Don't have an account?</span>
          <Link to="/sign-up" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          placeholder="your.email@university.edu"
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

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
            <span>Remember this device</span>
          </label>
          <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Password reset link dispatched."); }} className="text-primary hover:underline font-semibold">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 active:scale-[0.99] transition"
        >
          {isLoading ? "Signing in..." : "Sign In to ProspX"}
        </button>
      </form>
    </AuthShell>
  );
}
