import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect } from "react";
import {
  loadAppState,
  saveAppState,
  AppState,
  TEST_ACCOUNTS,
  TestAccount,
  SubscriptionPlan,
  UserRole,
  switchAccount
} from "../lib/store";
import {
  ShieldAlert,
  Users,
  Search,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Crown,
  GraduationCap,
  Building2,
  PenTool,
  Globe,
  LayoutDashboard,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Key,
  RefreshCw,
  TrendingUp,
  FileText
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Console — ScholarGlass ProspX" }] }),
  component: AdminConsolePage,
});

const PLAN_COLORS: Record<SubscriptionPlan, string> = {
  free: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  pro: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  premium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  elite: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const ROLE_COLORS: Record<string, string> = {
  student: "bg-primary/10 text-primary border-primary/20",
  counselor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  teacher: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  admissions: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
};

const ROLE_ICON: Record<string, any> = {
  student: GraduationCap,
  counselor: Building2,
  teacher: PenTool,
  admin: ShieldAlert,
  admissions: Globe,
};

// Admin dashboard stats
const SITE_STATS = [
  { label: "Total Users", value: "10", icon: Users, color: "text-primary" },
  { label: "Active Students", value: "5", icon: GraduationCap, color: "text-emerald-500" },
  { label: "Staff Accounts", value: "4", icon: Building2, color: "text-amber-500" },
  { label: "Elite Subscribers", value: "1", icon: Crown, color: "text-purple-500" },
];

interface EditState {
  userId: string | null;
  name: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  password: string;
  organization: string;
  title: string;
}

export function AdminConsolePage() {
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "homepage" | "settings">("users");
  const [editState, setEditState] = useState<EditState | null>(null);

  // Homepage elements edit state
  const [heroTitle, setHeroTitle] = useState("Turn Your Academic Journey Into Admissions Success");
  const [heroSubtitle, setHeroSubtitle] = useState("ScholarGlass ProspX uses Gemini AI to organize your evidence, craft grounded essays, and navigate every step of your global university application.");
  const [heroCtaText, setHeroCtaText] = useState("Start Your Journey — It's Free");
  const [showHeroSaved, setShowHeroSaved] = useState(false);

  useEffect(() => {
    // Guard: redirect non-admin users
    const state = loadAppState();
    if (state.activeRole !== "admin") {
      toast.error("Access Denied: Admin only area.");
      navigate({ to: "/dashboard" });
      return;
    }
    setAppState(state);

    const handleUpdate = () => {
      const s = loadAppState();
      if (s.activeRole !== "admin") {
        navigate({ to: "/dashboard" });
      }
      setAppState(s);
    };
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const filtered = TEST_ACCOUNTS.filter((acc) => {
    const matchSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || acc.role === roleFilter;
    return matchSearch && matchRole;
  });

  const startEdit = (acc: TestAccount) => {
    setEditState({
      userId: acc.id,
      name: acc.name,
      email: acc.email,
      role: acc.role,
      plan: acc.subscriptionPlan || "free",
      password: acc.password,
      organization: acc.organization,
      title: acc.title,
    });
  };

  const saveEdit = () => {
    if (!editState) return;
    // For this client-only app we show a toast — in a real app this would persist to DB
    toast.success(`User profile updated for ${editState.name}`, {
      description: `Role: ${editState.role} | Plan: ${editState.plan}`,
    });

    // If we're editing the currently active preset, switch to them with updated state
    const match = TEST_ACCOUNTS.find((a) => a.id === editState.userId);
    if (match && match.email === appState.profile.email) {
      const updated = {
        ...appState,
        profile: {
          ...appState.profile,
          name: editState.name,
          subscriptionPlan: editState.plan,
        },
        activeRole: editState.role,
      };
      saveAppState(updated);
      setAppState(updated);
    }
    setEditState(null);
  };

  const handleImpersonate = (acc: TestAccount) => {
    switchAccount(acc.email);
    const { setStoredUser } = require("../lib/use-theme");
    setStoredUser({ name: acc.name, email: acc.email });
    toast.success(`Impersonating ${acc.name} (${acc.badge})`);
    navigate({ to: "/dashboard" });
  };

  const handleSaveHero = () => {
    // Persist hero content to localStorage for landing page
    localStorage.setItem("prospx_hero_title", heroTitle);
    localStorage.setItem("prospx_hero_subtitle", heroSubtitle);
    localStorage.setItem("prospx_hero_cta", heroCtaText);
    setShowHeroSaved(true);
    setTimeout(() => setShowHeroSaved(false), 3000);
    toast.success("Homepage content saved!");
  };

  const RoleIcon = ROLE_ICON[editState?.role || "student"];

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 relative overflow-hidden border border-purple-500/20 shadow-lg">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-500/5 via-primary/5 to-transparent" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shadow-md">
                <ShieldAlert className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground">Admin Console</h1>
                <p className="text-sm text-muted-foreground">
                  ScholarGlass ProspX · System Administration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Admin Access · Sarah Croft
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {SITE_STATS.map((stat) => (
              <div key={stat.label} className="p-3 rounded-2xl bg-card border border-border text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full w-fit shadow-xs">
          {(["users", "homepage", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "users" ? "👥 User Database" : tab === "homepage" ? "🏠 Homepage Editor" : "⚙️ System Settings"}
            </button>
          ))}
        </div>

        {/* ── USER DATABASE TAB ── */}
        {activeTab === "users" && (
          <div className="space-y-5">
            {/* Search & Filter Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition"
                />
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-card border border-border rounded-full">
                {(["all", "student", "counselor", "teacher", "admin", "admissions"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                      roleFilter === r ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold border transition-all ${
                  showPasswords
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPasswords ? "Hide Passwords" : "Show Passwords"}
              </button>
            </div>

            {/* User Table */}
            <div className="glass-panel border border-border/70 shadow-md overflow-hidden rounded-3xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                      <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Plan</th>
                      <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Credentials</th>
                      <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Organization</th>
                      <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filtered.map((acc) => {
                      const RIcon = ROLE_ICON[acc.role] || Users;
                      return (
                        <tr key={acc.id} className="hover:bg-muted/20 transition-colors group">
                          {/* User info */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                                {acc.avatarInitials}
                              </div>
                              <div>
                                <p className="font-bold text-foreground text-sm">{acc.name}</p>
                                <p className="text-xs text-muted-foreground">{acc.email}</p>
                              </div>
                            </div>
                          </td>
                          {/* Role */}
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${ROLE_COLORS[acc.role]}`}>
                              <RIcon className="w-3 h-3" />
                              {acc.role}
                            </span>
                          </td>
                          {/* Plan */}
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-bold uppercase ${PLAN_COLORS[acc.subscriptionPlan || "free"]}`}>
                              {acc.subscriptionPlan || "free"}
                            </span>
                          </td>
                          {/* Credentials */}
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs">
                                <Key className="w-3 h-3 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Pass:</span>
                                <code className={`font-mono text-xs ${showPasswords ? "text-foreground" : "text-muted-foreground select-none"}`}>
                                  {showPasswords ? acc.password : "••••••••••••"}
                                </code>
                              </div>
                              <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">{acc.title}</div>
                            </div>
                          </td>
                          {/* Organization */}
                          <td className="p-4">
                            <p className="text-xs text-foreground font-medium">{acc.organization}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{acc.category || "user"}</p>
                          </td>
                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(acc)}
                                className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all"
                                title="Edit User"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  switchAccount(acc.email);
                                  toast.success(`Switched to ${acc.name} (${acc.badge})`);
                                  navigate({ to: "/dashboard" });
                                }}
                                className="p-2 rounded-xl bg-muted/50 text-muted-foreground border border-border hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/30 transition-all"
                                title="Switch to this account"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="py-16 text-center text-muted-foreground text-sm">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    No users found matching your filter.
                  </div>
                )}
              </div>
            </div>

            {/* Admin credentials callout */}
            <div className="glass-panel p-5 rounded-3xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground mb-1">Admin Login Credentials</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>📧 Email: <code className="font-mono text-foreground">admin@scholarglass.ai</code></p>
                  <p>🔐 Password: <code className="font-mono text-foreground">{showPasswords ? "password123" : "••••••••••••"}</code></p>
                  <p>🛡️ Role: System Admin · Organization: ScholarGlass Institutional Network</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HOMEPAGE EDITOR TAB ── */}
        {activeTab === "homepage" && (
          <div className="space-y-5">
            <div className="glass-panel p-6 rounded-3xl border border-border/80 shadow-md space-y-6">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Landing Page Content Editor</h2>
              </div>
              <p className="text-xs text-muted-foreground -mt-3">
                Edit the homepage hero section content. Changes are saved to localStorage and applied immediately when the homepage loads.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">Hero Headline</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">Hero Subtitle</label>
                  <textarea
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>

                <button
                  onClick={handleSaveHero}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:opacity-90 active:scale-95 transition shadow-md"
                >
                  {showHeroSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {showHeroSaved ? "Saved!" : "Save Homepage Content"}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="glass-panel p-6 rounded-3xl border border-border/80 shadow-md space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-bold text-muted-foreground uppercase">Live Preview</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-sky-500/5 to-transparent border border-border">
                <h2 className="text-2xl font-black text-foreground leading-tight mb-2">{heroTitle}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{heroSubtitle}</p>
                <button className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md">
                  {heroCtaText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SYSTEM SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div className="glass-panel p-6 rounded-3xl border border-border/80 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">System Configuration</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Gemini API</p>
                <p className="text-sm font-bold text-foreground">{appState.geminiApiKey ? "✅ API Key Configured" : "❌ No API Key"}</p>
                <p className="text-[10px] text-muted-foreground">Configure in Settings → API Configuration</p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Active Users</p>
                <p className="text-sm font-bold text-foreground">{TEST_ACCOUNTS.length} Test Accounts</p>
                <p className="text-[10px] text-muted-foreground">All roles covered: student, counselor, teacher, admin, admissions</p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Data Storage</p>
                <p className="text-sm font-bold text-foreground">LocalStorage (Client-Side)</p>
                <p className="text-[10px] text-muted-foreground">Key: scholarglass_prospx_app_state</p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Universities DB</p>
                <p className="text-sm font-bold text-foreground">{appState.universities?.length || "15+"} Universities</p>
                <p className="text-[10px] text-muted-foreground">QS Top 100 dataset included</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("scholarglass_prospx_app_state");
                  toast.success("App state reset. Refresh to apply.");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset All State
              </button>

              <button
                onClick={() => {
                  const state = loadAppState();
                  const json = JSON.stringify(state, null, 2);
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "prospx_state_export.json";
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("State exported as JSON.");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Export State JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── EDIT USER MODAL ── */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                Edit User
              </h3>
              <button onClick={() => setEditState(null)} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Full Name</label>
                <input
                  value={editState.name}
                  onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Email</label>
                <input
                  value={editState.email}
                  onChange={(e) => setEditState({ ...editState, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Password</label>
                <input
                  value={editState.password}
                  onChange={(e) => setEditState({ ...editState, password: e.target.value })}
                  type="text"
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["student", "counselor", "teacher", "admin", "admissions"] as UserRole[]).map((r) => {
                    const RoleIcon2 = ROLE_ICON[r];
                    return (
                      <button
                        key={r}
                        onClick={() => setEditState({ ...editState, role: r })}
                        className={`p-2 rounded-xl border text-xs font-bold capitalize flex items-center gap-1 justify-center transition-all ${
                          editState.role === r
                            ? "bg-primary text-white border-primary"
                            : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <RoleIcon2 className="w-3.5 h-3.5" />
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {editState.role === "student" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Subscription Plan</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["free", "pro", "premium", "elite"] as SubscriptionPlan[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setEditState({ ...editState, plan: p })}
                        className={`py-1.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                          editState.plan === p
                            ? "bg-primary text-white border-primary"
                            : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Organization</label>
                <input
                  value={editState.organization}
                  onChange={(e) => setEditState({ ...editState, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveEdit}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm hover:opacity-90 transition shadow-md"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setEditState(null)}
                className="px-4 py-2.5 rounded-2xl bg-muted/50 text-muted-foreground border border-border text-sm font-bold hover:bg-muted transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
