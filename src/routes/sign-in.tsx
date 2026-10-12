import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field } from "../components/auth-shell";
import { setStoredUser } from "../lib/use-theme";
import { 
  TEST_ACCOUNTS, 
  loadAppState, 
  saveAppState, 
  switchAccount,
  findRegisteredUser 
} from "../lib/store";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check known institutional test accounts
    const match = TEST_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail);
    if (match) {
      if (password !== match.password) {
        setIsLoading(false);
        toast.error("Invalid password. Please check your credentials.");
        return;
      }
      setStoredUser({ name: match.name, email: match.email });
      switchAccount(match.email);
      setIsLoading(false);
      toast.success(`Welcome back, ${match.name}! (${match.badge})`);
      navigate({ to: "/dashboard" });
      return;
    }

    // 2. Check registered accounts
    const registered = findRegisteredUser(cleanEmail);
    if (registered) {
      if (password !== registered.password) {
        setIsLoading(false);
        toast.error("Invalid password. Please check your credentials.");
        return;
      }
      setStoredUser({ name: registered.name, email: registered.email });
      const state = loadAppState();
      const updated = {
        ...state,
        activeRole: registered.role,
        profile: {
          ...state.profile,
          name: registered.name,
          email: registered.email,
          subscriptionPlan: registered.subscriptionPlan
        }
      };
      saveAppState(updated);
      setIsLoading(false);
      toast.success(`Welcome back, ${registered.name}!`);
      navigate({ to: "/dashboard" });
      return;
    }

    // 3. Account not found
    setIsLoading(false);
    toast.error("No account found with this email. Please sign up to create a new profile.");
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
