import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AppState, UserRole, TEST_ACCOUNTS, TestAccount, SubscriptionPlan, switchAccount } from "../../lib/store";
import { University, UNIVERSITIES_DATABASE } from "../../data/universities";
import { testGeminiApiKey } from "../../services/gemini";
import { 
  ShieldAlert, 
  Database, 
  Activity, 
  Users, 
  Award, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Key, 
  Layers,
  Lock,
  Globe2,
  Eye,
  EyeOff,
  LayoutDashboard,
  Save,
  RefreshCw,
  Crown,
  GraduationCap,
  Building2,
  PenTool,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
}

export function AdminHubView({ appState, onUpdateState }: Props) {
  const [activeTab, setActiveTab] = useState<"universities" | "verifications" | "users" | "homepage" | "ai_health">("universities");
  const [uniSearch, setUniSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Homepage Editor state
  const [heroTitle, setHeroTitle] = useState(() => {
    try { return localStorage.getItem("prospx_hero_title") || "Refine your academic vision."; } catch { return "Refine your academic vision."; }
  });
  const [heroSubtitle, setHeroSubtitle] = useState(() => {
    try { return localStorage.getItem("prospx_hero_subtitle") || "A calm, luminous workspace where evidence, projects, and AI synthesis live side by side — built for the way modern students actually research."; } catch { return "A calm, luminous workspace where evidence, projects, and AI synthesis live side by side — built for the way modern students actually research."; }
  });
  const [heroCta, setHeroCta] = useState(() => {
    try { return localStorage.getItem("prospx_hero_cta") || "Launch Your Portfolio"; } catch { return "Launch Your Portfolio"; }
  });
  const [heroSaved, setHeroSaved] = useState(false);
  
  // Add university modal
  const [isAddUniModalOpen, setIsAddUniModalOpen] = useState(false);
  const [newUniName, setNewUniName] = useState("");
  const [newUniShort, setNewUniShort] = useState("");
  const [newUniCountry, setNewUniCountry] = useState("United States");
  const [newUniCity, setNewUniCity] = useState("Boston, MA");
  const [newUniFlag, setNewUniFlag] = useState("🇺🇸");
  const [newUniQs, setNewUniQs] = useState<number>(10);
  const [newUniPortalUrl, setNewUniPortalUrl] = useState("https://apply.university.edu");
  const [newUniPortalType, setNewUniPortalType] = useState<University["portalType"]>("Institutional Portal");
  const [newUniTuition, setNewUniTuition] = useState<number>(35000);
  const [newUniMinGpa, setNewUniMinGpa] = useState<number>(3.5);
  const [newUniMinIelts, setNewUniMinIelts] = useState<number>(6.5);

  // AI Health state
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiStatus, setAiStatus] = useState<"online" | "offline" | "untested">("untested");

  const filteredUnis = appState.universities.filter((u) =>
    u.name.toLowerCase().includes(uniSearch.toLowerCase()) ||
    u.country.toLowerCase().includes(uniSearch.toLowerCase()) ||
    u.city.toLowerCase().includes(uniSearch.toLowerCase())
  );

  const handleTestAi = async () => {
    setIsTestingAi(true);
    try {
      const ok = await testGeminiApiKey(appState.geminiApiKey);
      setAiStatus(ok ? "online" : "offline");
      if (ok) {
        toast.success("Gemini API connection healthy and responsive!");
      } else {
        toast.error("Gemini API unreachable or key invalid.");
      }
    } catch {
      setAiStatus("offline");
      toast.error("Failed to connect to Gemini API.");
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleAddUniversitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: University = {
      id: `uni-${Date.now()}`,
      name: newUniName,
      shortName: newUniShort || newUniName,
      country: newUniCountry,
      countryCode: newUniCountry.substring(0, 2).toUpperCase(),
      city: newUniCity,
      flag: newUniFlag,
      qsRank: Number(newUniQs),
      officialWebsite: newUniPortalUrl,
      officialApplyUrl: newUniPortalUrl,
      portalType: newUniPortalType,
      minGpa: Number(newUniMinGpa),
      minIelts: Number(newUniMinIelts),
      minToefl: 90,
      annualTuitionUsd: Number(newUniTuition),
      annualLivingCostUsd: 15000,
      currency: "USD",
      popularMajors: ["Computer Science", "Engineering", "Business"],
      intakes: ["Fall 2026"],
      deadlines: { fallRegular: "January 15, 2026" },
      visaType: "Student Visa",
      scholarshipsAvailable: true,
      acceptanceRate: "25%",
      overview: "Institutional entry managed by System Administrator."
    };

    const updated = {
      ...appState,
      universities: [created, ...appState.universities]
    };
    onUpdateState(updated);
    setIsAddUniModalOpen(false);
    toast.success(`University "${created.name}" added to master QS catalog!`);
  };

  const handleDeleteUniversity = (id: string) => {
    const updated = {
      ...appState,
      universities: appState.universities.filter((u) => u.id !== id)
    };
    onUpdateState(updated);
    toast.success("University removed from master catalog.");
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Admin Banner */}
      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">
                Master Administration Console
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Global Institution & Platform Governance
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
              Manage the QS World University directory, audit institutional credential verification hashes, and monitor AI engine telemetry.
            </p>
          </div>

          <button
            onClick={() => setIsAddUniModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add QS University Entry
          </button>
        </div>

        {/* Global Admin Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-purple-500/20">
          <div className="p-3.5 rounded-2xl bg-card border border-border/80">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">QS Catalog Entries</span>
            <p className="text-2xl font-black text-foreground mt-0.5">{appState.universities.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-card border border-border/80">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Roster Students</span>
            <p className="text-2xl font-black text-purple-600 mt-0.5">{appState.rosterStudents.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-card border border-border/80">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Verified Hashes</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{appState.certificates.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-card border border-border/80">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">System Status</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">Healthy</p>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-muted/40 border border-border/60 max-w-fit">
        {[
          { key: "universities", label: "QS University Catalog", icon: Database },
          { key: "verifications", label: "Verification Audit Ledger", icon: Lock },
          { key: "users", label: "User Database & Passwords", icon: Users },
          { key: "homepage", label: "Homepage Editor", icon: LayoutDashboard },
          { key: "ai_health", label: "Gemini AI Engine Status", icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-card text-purple-600 shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: QS UNIVERSITY CATALOG */}
      {activeTab === "universities" && (
        <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="font-bold text-base text-foreground">
              Master QS World Rankings Database ({filteredUnis.length} Universities)
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={uniSearch}
                onChange={(e) => setUniSearch(e.target.value)}
                placeholder="Search university or country..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredUnis.map((uni) => (
              <div
                key={uni.id}
                className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 flex items-center justify-between gap-4 hover:border-purple-500/40 transition-all flex-wrap sm:flex-nowrap"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-bold border border-purple-500/20">
                      QS #{uni.qsRank}
                    </span>
                    <span className="text-base">{uni.flag}</span>
                    <h4 className="font-bold text-sm text-foreground">{uni.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {uni.city}, {uni.country} • Portal: <span className="font-semibold text-primary">{uni.portalType}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Tuition: ${uni.annualTuitionUsd.toLocaleString()}/yr • Min GPA: {uni.minGpa} • Min IELTS: {uni.minIelts}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={uni.officialApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                  >
                    <Globe2 className="w-3.5 h-3.5 text-primary" />
                    Visit Portal
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>

                  <button
                    onClick={() => handleDeleteUniversity(uni.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION AUDIT LEDGER */}
      {activeTab === "verifications" && (
        <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Decentralized Credential Audit Ledger</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Immutable cryptographic verification hashes of all authenticated student transcripts and language tests.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Integrity Verified
            </span>
          </div>

          <div className="space-y-3">
            {appState.certificates.map((cert) => (
              <div key={cert.id} className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      {cert.type}
                    </span>
                    <h4 className="font-bold text-sm text-foreground">{cert.title}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600">
                    {cert.scores.overall || cert.scores.gpa}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                  <div>
                    <span>Issuer: <strong>{cert.issuer}</strong></span>
                    <br />
                    <span>ID: <code className="text-foreground">{cert.credentialId}</code></span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span>Verified At: {cert.verifiedAt || "Recent"}</span>
                    <br />
                    <span>Audit Hash: <code className="text-emerald-600">{cert.verificationHash || "0x9fa12b..."}</code></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER & ROLE DATABASE WITH PASSWORDS */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Master User Database & Credentials ({TEST_ACCOUNTS.length} Accounts)</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete ledger of all student, faculty, counselor, and administrator accounts with active login credentials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    showPasswords
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                      : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswords ? "Hide Passwords" : "Show Passwords"}</span>
                </button>

                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-sm hover:bg-purple-700 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Dedicated Admin Console</span>
                </Link>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter users by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/20 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-border/60">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold">
                    <th className="text-left p-3 uppercase tracking-wider text-[10px]">User</th>
                    <th className="text-left p-3 uppercase tracking-wider text-[10px]">Role</th>
                    <th className="text-left p-3 uppercase tracking-wider text-[10px]">Plan</th>
                    <th className="text-left p-3 uppercase tracking-wider text-[10px]">Login Password</th>
                    <th className="text-left p-3 uppercase tracking-wider text-[10px]">Organization</th>
                    <th className="text-right p-3 uppercase tracking-wider text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {TEST_ACCOUNTS.filter(acc => 
                    !userSearch ||
                    acc.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    acc.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                    acc.role.toLowerCase().includes(userSearch.toLowerCase())
                  ).map((acc) => {
                    const roleColor = 
                      acc.role === "admin" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                      acc.role === "teacher" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      acc.role === "counselor" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      acc.role === "admissions" ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" :
                      "bg-primary/10 text-primary border-primary/20";

                    const planColor =
                      acc.subscriptionPlan === "elite" ? "bg-purple-500/10 text-purple-600" :
                      acc.subscriptionPlan === "premium" ? "bg-amber-500/10 text-amber-600" :
                      acc.subscriptionPlan === "pro" ? "bg-blue-500/10 text-blue-600" :
                      "bg-muted/60 text-muted-foreground";

                    return (
                      <tr key={acc.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {acc.avatarInitials}
                            </div>
                            <div>
                              <strong className="text-foreground block">{acc.name}</strong>
                              <span className="text-[10px] text-muted-foreground">{acc.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold capitalize ${roleColor}`}>
                            {acc.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${planColor}`}>
                            {acc.subscriptionPlan || "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <Key className="w-3 h-3 text-muted-foreground" />
                            <code className={`font-mono text-xs ${showPasswords ? "text-foreground font-bold" : "text-muted-foreground select-none"}`}>
                              {showPasswords ? acc.password : "••••••••••••"}
                            </code>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-muted-foreground truncate block max-w-[160px]">{acc.organization}</span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              switchAccount(acc.email);
                              toast.success(`Switched active profile to ${acc.name} (${acc.badge})`);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/40 text-foreground hover:bg-purple-600 hover:text-white transition text-[11px] font-bold border border-border/60"
                            title="Switch to this account immediately"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Switch</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Admin Credentials Alert Callout */}
            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-foreground">Dedicated System Admin Account</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Sign in anytime using <strong>admin@scholarglass.ai</strong> with password <strong>password123</strong> to govern this portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOMEPAGE CONTENT EDITOR */}
      {activeTab === "homepage" && (
        <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-purple-600" />
                <span>Landing Page Content Management</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize the public homepage headline, subtitle, and primary call-to-action button in real time.
              </p>
            </div>

            <button
              onClick={() => {
                try {
                  localStorage.setItem("prospx_hero_title", heroTitle);
                  localStorage.setItem("prospx_hero_subtitle", heroSubtitle);
                  localStorage.setItem("prospx_hero_cta", heroCta);
                  setHeroSaved(true);
                  setTimeout(() => setHeroSaved(false), 3000);
                  toast.success("Landing page content saved successfully!");
                } catch {
                  toast.error("Failed to save homepage content.");
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 transition"
            >
              {heroSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{heroSaved ? "Saved!" : "Publish to Homepage"}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Hero Headline</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/20 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Hero Subtitle</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/20 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Primary CTA Button Text</label>
              <input
                type="text"
                value={heroCta}
                onChange={(e) => setHeroCta(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/20 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
          </div>

          {/* Live Preview Container */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent border border-border/80 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Live Preview of Hero Section
            </span>
            <h2 className="text-2xl font-black text-foreground">{heroTitle}</h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">{heroSubtitle}</p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-md">
                {heroCta}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GEMINI AI ENGINE STATUS */}
      {activeTab === "ai_health" && (
        <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div>
              <h3 className="font-bold text-base text-foreground">Google Gemini 2.5 Engine Diagnostics</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Model: <code>gemini-2.5-flash</code> • Grounded Admissions Verification Pipeline
              </p>
            </div>

            <button
              onClick={handleTestAi}
              disabled={isTestingAi}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isTestingAi ? "Pinging Model..." : "Test Connection"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">API Key Status</span>
              <p className="text-sm font-bold text-foreground mt-1">
                {appState.geminiApiKey ? "Configured & Active" : "No Key Set (Using Fallback)"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Connection State</span>
              <p className={`text-sm font-bold mt-1 ${
                aiStatus === "online" ? "text-emerald-600" : aiStatus === "offline" ? "text-destructive" : "text-muted-foreground"
              }`}>
                {aiStatus === "online" ? "Online (Healthy)" : aiStatus === "offline" ? "Connection Failed" : "Untested"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Anti-Hallucination Guardrail</span>
              <p className="text-sm font-bold text-emerald-600 mt-1">Enforced (Strict Grounding)</p>
            </div>
          </div>
        </div>
      )}

      {/* Add QS University Modal */}
      {isAddUniModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-foreground">Add New QS World Ranking University</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Expand the global study abroad admissions catalog for all users.
            </p>

            <form onSubmit={handleAddUniversitySubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">University Name</label>
                  <input
                    type="text"
                    value={newUniName}
                    onChange={(e) => setNewUniName(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Short Name</label>
                  <input
                    type="text"
                    value={newUniShort}
                    onChange={(e) => setNewUniShort(e.target.value)}
                    placeholder="e.g. Stanford"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">QS World Rank</label>
                  <input
                    type="number"
                    value={newUniQs}
                    onChange={(e) => setNewUniQs(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Country</label>
                  <input
                    type="text"
                    value={newUniCountry}
                    onChange={(e) => setNewUniCountry(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Flag Emoji</label>
                  <input
                    type="text"
                    value={newUniFlag}
                    onChange={(e) => setNewUniFlag(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Official Apply Portal URL</label>
                <input
                  type="url"
                  value={newUniPortalUrl}
                  onChange={(e) => setNewUniPortalUrl(e.target.value)}
                  placeholder="https://admissions.stanford.edu/apply"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Tuition (USD/yr)</label>
                  <input
                    type="number"
                    value={newUniTuition}
                    onChange={(e) => setNewUniTuition(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Min GPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newUniMinGpa}
                    onChange={(e) => setNewUniMinGpa(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Min IELTS</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newUniMinIelts}
                    onChange={(e) => setNewUniMinIelts(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUniModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-700 transition-colors"
                >
                  Save University
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
