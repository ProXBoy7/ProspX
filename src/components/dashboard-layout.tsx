import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./theme-toggle";
import { getStoredUser, setStoredUser, useTheme } from "../lib/use-theme";
import { loadAppState, saveAppState, switchAccount, UserRole, TEST_ACCOUNTS } from "../lib/store";
import { 
  GraduationCap, 
  Building2, 
  PenTool, 
  ShieldAlert, 
  Menu, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Award, 
  Settings, 
  User, 
  LogOut,
  ChevronRight
} from "lucide-react";

type TabKey = "/dashboard" | "/universities" | "/evidence-vault" | "/scholar-pass" | "/ai-assistant" | "/admin" | "/profile" | "/settings";

interface NavItem {
  key: TabKey;
  label: string;
  icon: string;
  allowedRoles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { key: "/dashboard", label: "Dashboard Hub", icon: "dashboard" }, // Available for all roles
  { key: "/universities", label: "University Finder", icon: "travel_explore", allowedRoles: ["student", "counselor", "admissions", "admin"] },
  { key: "/evidence-vault", label: "Evidence Vault", icon: "inventory_2", allowedRoles: ["student", "counselor", "admissions", "admin"] },
  { key: "/ai-assistant", label: "AI Essay Lab", icon: "smart_toy", allowedRoles: ["student", "teacher", "admin"] },
  { key: "/scholar-pass", label: "Scholar Pass", icon: "military_tech", allowedRoles: ["student", "counselor", "admissions"] },
  { key: "/admin", label: "Admin Console & DB", icon: "admin_panel_settings", allowedRoles: ["admin"] },
  { key: "/profile", label: "Academic Profile", icon: "person", allowedRoles: ["student"] },
  { key: "/settings", label: "Settings & API", icon: "settings" }, // Available for all roles
];

const ROLES: { id: UserRole; label: string; badge: string; icon: any; color: string }[] = [
  { id: "student", label: "Student", badge: "All Users", icon: GraduationCap, color: "text-primary border-primary bg-primary/10" },
  { id: "counselor", label: "Counselor", badge: "School Office", icon: Building2, color: "text-amber-600 border-amber-500 bg-amber-500/10" },
  { id: "teacher", label: "Teacher", badge: "Faculty LOR", icon: PenTool, color: "text-blue-600 border-blue-500 bg-blue-500/10" },
  { id: "admin", label: "Admin", badge: "Governance", icon: ShieldAlert, color: "text-purple-600 border-purple-500 bg-purple-500/10" },
  { id: "admissions", label: "Admissions", badge: "University Reviewer", icon: Building2, color: "text-cyan-600 border-cyan-500 bg-cyan-500/10" }
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [userName, setUserName] = useState<string>("Alex Mercer");
  const [userEmail, setUserEmail] = useState<string>("student-free@scholarglass.ai");
  const [activeRole, setActiveRole] = useState<UserRole>("student");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("free");
  const [hoveredTab, setHoveredTab] = useState<TabKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure active user exists without bouncing
    let user = getStoredUser();
    if (!user) {
      user = { name: "Alex Mercer", email: "student-free@scholarglass.ai" };
      setStoredUser(user);
    }
    setUserName(user.name);
    setUserEmail(user.email);

    // Sync active role and profile from app state
    const state = loadAppState();
    setActiveRole(state.activeRole || "student");
    setSubscriptionPlan(state.profile.subscriptionPlan || "free");

    const handleUpdate = () => {
      const s = loadAppState();
      setActiveRole(s.activeRole || "student");
      setSubscriptionPlan(s.profile.subscriptionPlan || "free");
      const currentStored = getStoredUser();
      if (currentStored) {
        setUserName(currentStored.name);
        setUserEmail(currentStored.email);
      }
    };

    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const handleSignOut = () => {
    navigate({ to: "/sign-in" });
  };

  const activeTab = location.pathname as TabKey;
  const activeNav = NAV_ITEMS.find((t) => t.key === activeTab) || NAV_ITEMS[0];
  const currentRoleConfig = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "elite":
        return { label: "Elite Plan", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "premium":
        return { label: "Premium Plan", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "pro":
        return { label: "Pro Plan", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      default:
        return { label: "Free Plan", color: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30" };
    }
  };

  const planBadge = getPlanBadge(subscriptionPlan);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen text-foreground transition-colors duration-300 relative overflow-hidden bg-background"
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

      {/* Solid Base Background Color */}
      <div className="absolute inset-0 bg-background -z-30 transition-colors duration-300 pointer-events-none" />

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        data-side-menu="visible"
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card/90 backdrop-blur-2xl border-r border-border p-4 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-12 items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl text-primary">
              auto_awesome
            </span>
            <span className="text-xl font-black tracking-tight text-foreground">
              Prosp<span className="text-primary">X</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ASSIGNED ROLE BADGE (Strict: 1 Role Per User) */}
        <div className="my-3 p-3 rounded-2xl bg-muted/50 border border-border/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Assigned Security Role
            </span>
            <span className="text-[10px] font-extrabold text-primary">
              Strict 1-Role Policy
            </span>
          </div>

          <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${currentRoleConfig.color}`}>
            <currentRoleConfig.icon className="w-4 h-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold block truncate">{currentRoleConfig.label} Access</span>
              <span className="text-[10px] opacity-80 block truncate">{currentRoleConfig.badge}</span>
            </div>
          </div>
        </div>

        {/* Active Profile Info & Switcher */}
        <div className="my-1 rounded-2xl border border-border/60 bg-muted/30 p-2.5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {userName.split(" ").map((n) => n[0]).join("") || "SG"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">
                {activeRole === "student" 
                  ? userName 
                  : activeRole === "counselor" 
                  ? "Dr. Eleanor Vance (Counselor)" 
                  : activeRole === "teacher" 
                  ? "Dr. Marcus Smith (Teacher)" 
                  : "System Administrator"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {currentRoleConfig.badge}
                </span>
                {activeRole === "student" && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold border ${planBadge.color}`}>
                    {planBadge.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground truncate max-w-[130px]">{userEmail}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-primary hover:text-primary/80 font-bold flex items-center gap-1 transition-colors"
              title="Sign out or switch via Sign-up"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="relative flex-1 py-3" onMouseLeave={() => setHoveredTab(null)}>
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.filter((item) => !item.allowedRoles || item.allowedRoles.includes(activeRole)).map((item) => {
              const isActive = activeTab === item.key;
              const isHovered = hoveredTab === item.key && !isActive;

              // Customize label based on role for clarity
              let displayLabel = item.label;
              if (item.key === "/dashboard") {
                if (activeRole === "counselor") displayLabel = "Counselor Hub";
                else if (activeRole === "teacher") displayLabel = "Teacher LOR Desk";
                else if (activeRole === "admin") displayLabel = "Admin Console";
                else if (activeRole === "admissions") displayLabel = "Committee Dossier";
                else displayLabel = "Admissions Kanban";
              }

              return (
                <Link
                  to={item.key}
                  key={item.key}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={() => setHoveredTab(item.key)}
                  className={`relative flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-xs font-bold transition-all ${
                    isActive
                      ? "text-primary bg-primary/10 border border-primary/20 shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: 20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{displayLabel}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Help / Logout */}
        <div className="my-2 mt-auto flex flex-col gap-2 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span>ScholarGlass v2.4</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header Bar - Always Visible */}
        <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-card/60 backdrop-blur-xl z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-foreground hover:bg-accent border border-border/60 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${currentRoleConfig.color}`}>
                {currentRoleConfig.label} Mode
              </span>
              <h1 className="text-sm sm:text-base font-bold text-foreground hidden sm:inline-block">
                {activeNav.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Authenticated User Identity */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground font-semibold">User:</span>
              <strong className="text-foreground">{userName}</strong>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleConfig.color}`}>
                {currentRoleConfig.label}
              </span>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="relative flex-1 flex flex-col min-h-0 bg-transparent overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
