import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./theme-toggle";
import { getStoredUser, useTheme } from "../lib/use-theme";

type TabKey = "/dashboard" | "/evidence-vault" | "/scholar-pass" | "/ai-assistant" | "/profile" | "/settings";

interface NavItem {
  key: TabKey;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "/evidence-vault", label: "Evidence Vault", icon: "inventory_2" },
  { key: "/scholar-pass", label: "Scholar Pass", icon: "military_tech" },
  { key: "/ai-assistant", label: "AI Assistant", icon: "smart_toy" },
  { key: "/profile", label: "Profile", icon: "person" },
  { key: "/settings", label: "Settings", icon: "settings" },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [name, setName] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<TabKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse spotlight position tracking
  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          containerRef.current.style.setProperty("--mouse-x", `${x}px`);
          containerRef.current.style.setProperty("--mouse-y", `${y}px`);
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({ to: "/sign-in" });
      return;
    }
    setName(user.name);
  }, [navigate]);

  const activeTab = location.pathname as TabKey;
  const activeNav = NAV_ITEMS.find((t) => t.key === activeTab) || NAV_ITEMS[0];

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen text-foreground transition-colors duration-300 relative overflow-hidden"
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

      {/* SVG Gooey Filter definition for Liquidic Move */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Solid Base Background Color */}
      <div className="absolute inset-0 bg-background -z-30 transition-colors duration-300 pointer-events-none" />

      {/* Mouse Spotlight Glow Ambient Light (Sits between solid background and content) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 opacity-75 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(650px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), var(--spotlight-color, rgba(0,91,191,0.20)), transparent 80%)",
        }}
      />

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        data-side-menu="visible" aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card/85 backdrop-blur-2xl border-r border-border p-4 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:opacity-100 ${
          mobileOpen ? "translate-x-0 opacity-100" : "max-lg:-translate-x-full max-lg:opacity-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-12 items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl text-primary">
              auto_awesome
            </span>
            <span className="text-xl font-bold tracking-tight text-primary">
              ScholarGlass AI
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="my-3 flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3 backdrop-blur-md">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/30">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYWRoBZOFJiYjRL_Tbz_HFK9uuaqxZeqoshKF-Sq_4m5uRRhFiKekzcPBp0Wu2ZkawqzzzNK7on7s4GABgUstkv2h73tG6aat53EtsvMrFqSWxxNw6tACB4HdNdtpoxNvxvRe37n1LU7MhonO0gbtRFff0yW82PkpYV_O5KbdGQ2Mav2kjOsAlXOeUsYH-iSPFnp4m31FENcHcZ8fY_gqCzKMeLhq7bHeXeMneVPCTuLOZrOl51csSGmE04oimXr79m-LCxJa-w2U"
              alt="Julian Academic avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">
              {name || "Julian Academic"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Dean's List '24
            </p>
          </div>
        </div>

        {/* Sidebar Nav Items with Sliding Gooey Liquid Glass Pill */}
        <nav className="relative flex-1 py-2" onMouseLeave={() => setHoveredTab(null)}>
          {/* We apply the goo filter to this container so the sliding layout element blobs when moving */}
          <div className="relative z-10 flex flex-col gap-1" style={{ filter: "url(#goo)" }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              const isHovered = hoveredTab === item.key && !isActive;

              return (
                <Link
                  to={item.key}
                  key={item.key}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={() => setHoveredTab(item.key)}
                  className={`relative flex h-11 w-full items-center gap-3.5 rounded-xl px-4 text-sm font-semibold transition-colors duration-200 active:scale-98 ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Hover Liquid Glass Pill */}
                  {isHovered && (
                    <motion.div
                      layoutId="hoverLiquidGlassPill"
                      className="absolute inset-0 z-0 rounded-xl bg-accent/40 backdrop-blur-md pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}

                  {/* Sliding Liquid Glass Pill from Previous to Current */}
                  {isActive && (
                    <motion.div
                      layoutId="activeLiquidGlassPill"
                      className="liquid-glass-switcher absolute inset-0 z-0 rounded-xl pointer-events-none overflow-hidden"
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 20,
                        mass: 0.8,
                      }}
                    >
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1.5 rounded-r-full bg-primary shadow-[0_0_16px_var(--primary)]" />
                      <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/5 to-transparent opacity-90" />
                    </motion.div>
                  )}

                  <span
                    className="material-symbols-outlined relative z-10"
                    style={{ fontSize: 20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="my-3 mt-auto flex flex-col gap-2 pt-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 active:scale-98">
            Upgrade to Pro
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              help
            </span>
            Help Center
          </button>
        </div>
      </aside>

      {/* Main Content Area with Routing Transitions */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-accent"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-bold text-foreground">{activeNav.label}</span>
          <ThemeToggle />
        </header>

        {/* Desktop Header */}
        <header className="hidden h-16 shrink-0 items-center justify-between px-8 lg:flex border-b border-border/40 bg-card/30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-accent/40 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md border border-border/50">
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              Workspace Active
            </div>
            <h1 className="text-lg font-bold text-foreground">
              {activeNav.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="rounded-full bg-accent/50 p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground backdrop-blur-md border border-border/50">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                notifications
              </span>
            </button>
            <Link
              to="/"
              className="rounded-full border border-border/50 bg-card/60 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent backdrop-blur-md"
            >
              Sign out
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="relative flex-1 flex flex-col min-h-0 bg-transparent p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex-1 flex flex-col min-h-0 w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

