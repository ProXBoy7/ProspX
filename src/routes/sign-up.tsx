import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field } from "../components/auth-shell";
import { setStoredUser } from "../lib/use-theme";
import { 
  UserRole, 
  saveAppState, 
  createNewUserAppState, 
  saveRegisteredUser 
} from "../lib/store";
import { 
  GraduationCap, 
  Building2, 
  PenTool, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Create your account — ScholarGlass ProspX" },
      { name: "description", content: "Start your academic admissions future with ScholarGlass ProspX." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    // 1. Save user credentials in registered users database
    const regUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: selectedRole,
      createdAt: new Date().toISOString(),
      subscriptionPlan: "free" as const
    };
    saveRegisteredUser(regUser);

    // 2. Initialize 100% clean, empty-paged state for this brand new user
    const cleanState = createNewUserAppState(name.trim(), email.trim().toLowerCase(), selectedRole);
    saveAppState(cleanState);

    // 3. Set active user session
    setStoredUser({ name: regUser.name, email: regUser.email });

    setIsLoading(false);
    toast.success(`Welcome to ProspX, ${regUser.name}!`, {
      description: "Your academic portfolio is initialized and ready for onboarding."
    });
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      headline="Start your future here."
      accentWord="future"
      sub="Create your verified admissions account to build your academic dossier."
      footer={
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Already registered?</span>
          <Link to="/sign-in" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Section 1: Account Information */}
        <div className="space-y-3">
          <Field
            label="Full Name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Maya Lin"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Field
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            minLength={6}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Section 2: Account Role Selection */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-foreground">Select Primary Role</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                selectedRole === "student"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted/30 border-border text-foreground hover:bg-muted/50"
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <strong className="text-xs block leading-tight">Student</strong>
                <span className="text-[10px] opacity-80 block truncate">Portfolio & Apps</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("counselor")}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                selectedRole === "counselor"
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-muted/30 border-border text-foreground hover:bg-muted/50"
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <strong className="text-xs block leading-tight">Counselor</strong>
                <span className="text-[10px] opacity-80 block truncate">School Roster</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                selectedRole === "teacher"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-muted/30 border-border text-foreground hover:bg-muted/50"
              }`}
            >
              <PenTool className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <strong className="text-xs block leading-tight">Teacher</strong>
                <span className="text-[10px] opacity-80 block truncate">Write LORs</span>
              </div>
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground pt-0.5">
            Admin access is restricted. Administrators sign in with system credentials.
          </p>
        </div>

        {/* Section 3: Subscription Tier Badge */}
        {selectedRole === "student" && (
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-foreground">Starter Subscription Tier</label>
            <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-foreground">Free Starter Tier</p>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                    Always Free
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Includes full QS University Finder, AI Essay Lab drafting, and Evidence Vault.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 active:scale-[0.99] transition gap-1.5"
        >
          <span>{isLoading ? "Creating Account..." : "Create Account & Launch Onboarding"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </AuthShell>
  );
}

