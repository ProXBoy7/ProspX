import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field } from "../components/auth-shell";
import { setStoredUser } from "../lib/use-theme";
import { UserRole, TEST_ACCOUNTS, switchAccount, loadAppState, saveAppState } from "../lib/store";
import { GraduationCap, Building2, PenTool, ShieldAlert, Sparkles, ArrowRight, ChevronDown } from "lucide-react";
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
  const [showTestSwitch, setShowTestSwitch] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setStoredUser({ name, email });
    const state = loadAppState();
    const updated = {
      ...state,
      activeRole: selectedRole,
      profile: {
        ...state.profile,
        name,
        email,
        subscriptionPlan: "free"  // all new accounts start on free; upgrade via admin or settings
      }
    };
    saveAppState(updated);
    toast.success(`Account created as ${name} (${selectedRole.toUpperCase()})`);
    navigate({ to: "/dashboard" });
  };

  const handleQuickSwitch = (accountEmail: string) => {
    const acc = TEST_ACCOUNTS.find((a) => a.email.toLowerCase() === accountEmail.toLowerCase());
    if (acc) {
      setStoredUser({ name: acc.name, email: acc.email });
      switchAccount(acc.email);
      toast.success(`Switched account to ${acc.name} (${acc.badge})`);
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <AuthShell
      headline="Start your future here."
      accentWord="future"
      sub="Create your verified admissions account or switch testing persona below."
      footer={
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Already registered?</span>
          <Link to="/sign-in" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
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

          {/* Account Role Selector - Public registration allows Student, Counselor, Teacher. Admin is restricted */}
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
              Admin access is restricted. Administrators sign in via <code className="text-foreground">admin@scholarglass.ai</code>.
            </p>
          </div>

          {/* Student Subscription Plan - free only for new sign-ups; premium/elite are admin-granted */}
          {selectedRole === "student" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-foreground">Student Subscription Tier</label>
              <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Free Starter Plan</p>
                  <p className="text-[10px] text-muted-foreground">All new accounts start on Free. Upgrade via Settings after sign-in.</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 active:scale-[0.99] transition"
          >
            Create Account & Launch
          </button>
        </form>

        {/* Collapsible Test Account Switcher on Sign Up Page */}
        <div className="pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={() => setShowTestSwitch(!showTestSwitch)}
            className="w-full flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-primary py-2 px-3 rounded-2xl bg-muted/30 border border-border/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Switch Test Account from Sign-Up ({TEST_ACCOUNTS.length})
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showTestSwitch ? "rotate-180" : ""}`} />
          </button>

          {showTestSwitch && (
            <div className="mt-2.5 p-3 rounded-2xl bg-card border border-border/80 space-y-2 max-h-64 overflow-y-auto">
              <p className="text-[11px] text-muted-foreground mb-2">
                Click any profile to immediately initialize and switch environment:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {TEST_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickSwitch(acc.email)}
                    className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/50 hover:border-primary/40 text-left transition-all group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs text-foreground font-semibold">{acc.name}</strong>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                          {acc.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate block">
                        {acc.title}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthShell>
  );
}

