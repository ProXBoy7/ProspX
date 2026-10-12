import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect } from "react";
import { 
  loadAppState, 
  AppState, 
  completeQuest, 
  claimPassTier,
  ScholarQuest 
} from "../lib/store";
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Lock, 
  Sparkles, 
  Zap, 
  MapPin, 
  Flame, 
  Palette, 
  Download, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  QrCode,
  Share2
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/scholar-pass")({
  head: () => ({ meta: [{ title: "Scholar Pass — ScholarGlass ProspX" }] }),
  component: ScholarPassPage,
});

export function ScholarPassPage() {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [questCategory, setQuestCategory] = useState<"all" | "daily" | "weekly" | "milestone">("all");
  const [showPassportCard, setShowPassportCard] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setAppState(loadAppState());
    };
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const { profile, certificates = [], applications = [] } = appState;
  const scholarPass = appState.scholarPass || {
    seasonName: "Season '26: Ivy & Global Cohort",
    seasonDescription: "Global Fall 2026 Admissions Campaign",
    level: 42,
    currentXp: 8450,
    targetXp: 10000,
    streakDays: 14,
    claimedTierIds: [40, 41],
    quests: []
  };
  const claimedTierIds = Array.isArray(scholarPass.claimedTierIds) ? scholarPass.claimedTierIds : [40, 41];
  const quests = Array.isArray(scholarPass.quests) ? scholarPass.quests : [];
  const verifiedCerts = certificates.filter((c) => c.verificationStatus === "verified");

  const currentXp = typeof scholarPass.currentXp === "number" ? scholarPass.currentXp : 8450;
  const targetXp = typeof scholarPass.targetXp === "number" && scholarPass.targetXp > 0 ? scholarPass.targetXp : 10000;

  const progressPercent = Math.min(
    100,
    Math.round((currentXp / targetXp) * 100)
  );

  const xpRemaining = Math.max(0, targetXp - currentXp);

  const handleCompleteMission = (quest: ScholarQuest) => {
    if (quest.completed) {
      toast.info("This quest is already completed for the season!");
      return;
    }
    const updated = completeQuest(quest.id);
    setAppState(updated);
    toast.success(`Quest Completed! +${quest.xpReward} XP awarded.`, {
      description: `Current Level: ${updated.scholarPass?.level ?? 42} (${updated.scholarPass?.currentXp ?? 0}/${updated.scholarPass?.targetXp ?? 10000} XP)`
    });
  };

  const handleClaimTier = (tierId: number, rewardName: string) => {
    if (claimedTierIds.includes(tierId)) {
      toast.info(`Already claimed ${rewardName}!`);
      return;
    }
    const updated = claimPassTier(tierId);
    setAppState(updated);
    toast.success(`Reward Unlocked: ${rewardName}! Added to your Vault Gallery.`);
  };

  const filteredQuests = quests.filter((q) => {
    if (questCategory === "all") return true;
    return q.category === questCategory;
  });

  const TIERS = [
    { id: 40, label: "Tier 40", name: "Oceanic UI Theme", icon: "palette", xpRequired: 6000, unlocked: true },
    { id: 41, label: "Tier 41", name: "500 AI Credits", icon: "generating_tokens", xpRequired: 7200, unlocked: true },
    { id: 42, label: "Tier 42", name: "Obsidian Theme", icon: "dark_mode", xpRequired: 8400, unlocked: true, current: true },
    { id: 43, label: "Tier 43", name: "Sparkle AI Avatar", icon: "auto_awesome", xpRequired: 10000, unlocked: false },
    { id: 44, label: "Tier 44", name: "Scholar Pass Seal", icon: "verified", xpRequired: 11500, unlocked: false },
    { id: 45, label: "Tier 45", name: "Consortia Honors Pass", icon: "military_tech", xpRequired: 13000, unlocked: false }
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
        {/* Season Hero Banner (Restored from page7.html & user reference images) */}
        <div className="glass-panel p-6 sm:p-8 relative overflow-hidden group min-h-[260px] flex flex-col justify-end border border-white/60 dark:border-white/10 shadow-lg">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-sky-500/10 to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white font-bold rounded-full text-xs uppercase tracking-widest shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                Active Season
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                {scholarPass.seasonName}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {scholarPass.seasonDescription} Complete active admissions missions below to earn XP and unlock premium rewards.
              </p>
            </div>

            {/* Level & XP Gauge Card */}
            <div className="glass-panel bg-card/80 p-5 rounded-3xl min-w-[320px] w-full lg:w-auto border border-border shadow-md">
              <div className="flex justify-between items-baseline mb-3">
                <span className="font-black text-primary text-2xl tracking-tight">
                  Level {scholarPass.level}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  XP {scholarPass.currentXp.toLocaleString()} / {scholarPass.targetXp.toLocaleString()}
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-700 ease-out shadow-sm rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                <span className="font-semibold">{progressPercent}% Completed</span>
                <span className="italic">{xpRemaining.toLocaleString()} XP to Next Tier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scholar Pass Map Track */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-2xl">map</span>
              <span>Scholar Pass Quest Map</span>
            </h2>

            <button
              onClick={() => {
                TIERS.filter((t) => t.unlocked && !claimedTierIds.includes(t.id)).forEach((t) => {
                  handleClaimTier(t.id, t.name);
                });
              }}
              className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-2xl text-xs border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-xs"
            >
              Claim All Available
            </button>
          </div>

          <div className="glass-panel p-4 overflow-x-auto scrollbar-hide border border-border/70 shadow-md">
            <div className="flex p-4 gap-6 min-w-max items-center h-44 relative">
              {TIERS.map((tier, idx) => {
                const isClaimed = claimedTierIds.includes(tier.id);
                const isCurrent = tier.current;
                const isUnlocked = tier.unlocked;

                return (
                  <React.Fragment key={tier.id}>
                    {idx > 0 && (
                      <div className={`w-12 h-1 rounded-full ${isUnlocked ? "bg-primary/80" : "bg-muted"}`} />
                    )}

                    <div className={`flex flex-col items-center gap-3 relative transition-transform ${isCurrent ? "scale-110" : ""}`}>
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-md transition-all ${
                          isClaimed
                            ? "bg-cyan-500/15 border-2 border-cyan-500/40 text-cyan-700 dark:text-cyan-300"
                            : isCurrent
                            ? "bg-primary text-white border-4 border-white dark:border-card shadow-primary/30 shadow-lg"
                            : isUnlocked
                            ? "bg-card border-2 border-primary/40 text-primary"
                            : "bg-muted/60 border border-border text-muted-foreground opacity-60"
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {tier.icon}
                        </span>

                        {isClaimed ? (
                          <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : isCurrent ? (
                          <button
                            onClick={() => handleClaimTier(tier.id, tier.name)}
                            className="absolute -bottom-2 px-2.5 py-0.5 bg-cyan-400 text-slate-900 text-[9px] font-black rounded-full border border-white shadow-xs hover:scale-105 active:scale-95 transition"
                          >
                            CLAIM
                          </button>
                        ) : !isUnlocked ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 rounded-2xl">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ) : null}
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {tier.label}
                        </p>
                        <p className={`text-xs font-bold ${isCurrent ? "text-primary font-black" : "text-foreground"}`}>
                          {tier.name}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quests & Missions Grid + Season Stats Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Missions Column */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
                  <span>Active Quests & Missions</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Complete these admissions milestones to earn XP and level up your Scholar Pass.
                </p>
              </div>

              {/* Quest Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-card rounded-full border border-border shadow-xs">
                {(["all", "daily", "weekly", "milestone"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setQuestCategory(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                      questCategory === tab
                        ? "bg-primary text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Quests Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredQuests.map((quest) => {
                const isComplete = quest.completed;
                const progressPct = Math.round((quest.progress / quest.maxProgress) * 100);

                return (
                  <div
                    key={quest.id}
                    className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                      isComplete
                        ? "bg-emerald-500/5 border-emerald-500/25"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-xl">
                            {quest.icon}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-black text-xs">
                          <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                          <span>+{quest.xpReward} XP</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-foreground mb-1">
                        {quest.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {quest.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">
                          {quest.progress} / {quest.maxProgress} ({progressPct}%)
                        </span>
                      </div>

                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isComplete ? "bg-emerald-500" : "bg-primary"
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="pt-1">
                        {isComplete ? (
                          <div className="w-full py-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Mission Completed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCompleteMission(quest)}
                            className="w-full py-2 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 active:scale-98 transition shadow-xs"
                          >
                            Complete Mission (+{quest.xpReward} XP)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Stats & Vault Gallery */}
          <div className="lg:col-span-4 space-y-5">
            {/* Season Stats */}
            <div className="glass-panel p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Season Stats</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-card border border-border text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Cohort Rank</p>
                  <p className="text-lg font-black text-primary mt-0.5">Top 2%</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Active Streak</p>
                  <p className="text-lg font-black text-amber-500 mt-0.5">{scholarPass.streakDays} Days</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Total XP</p>
                  <p className="text-lg font-black text-primary mt-0.5">{(((scholarPass.level || 42) * 1000) + currentXp).toLocaleString()}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Unlocks</p>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">
                    {claimedTierIds.length} / {TIERS.length}
                  </p>
                </div>
              </div>

              {/* Scholar Pass Pro Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white shadow-md relative overflow-hidden">
                <h4 className="font-extrabold text-sm">Scholar Pass Pro</h4>
                <p className="text-xs text-white/80 mt-1 mb-3">
                  Earn 50% more XP on application milestones and unlock verified obsidian badges.
                </p>
                <button
                  onClick={() => toast.success("Scholar Pass Pro active on current subscription plan.")}
                  className="w-full py-2 bg-white text-primary font-bold rounded-xl text-xs shadow-sm hover:opacity-90 active:scale-95 transition"
                >
                  Pro Active ({profile.subscriptionPlan.toUpperCase()})
                </button>
              </div>
            </div>

            {/* Vault Gallery */}
            <div className="glass-panel p-6 rounded-3xl border border-border/80 shadow-md space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Vault Gallery</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground">Oceanic UI Theme</p>
                    <p className="text-[10px] text-muted-foreground">Claimed in Season</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground">Gemini Socrates AI</p>
                    <p className="text-[10px] text-muted-foreground">Essay Specialist Avatar</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Unlocked
                  </span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground">Verified Scholar Passport</p>
                    <p className="text-[10px] text-muted-foreground">Digital Credential ID</p>
                  </div>
                  <button
                    onClick={() => setShowPassportCard(!showPassportCard)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    {showPassportCard ? "Hide" : "View"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Verified Credential Passport (Digital ID Badge for Admissions) */}
        {showPassportCard && (
          <div className="glass-panel-elevated p-8 shadow-2xl relative overflow-hidden rounded-3xl border border-primary/20 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">
                    OFFICIAL SCHOLARPASS VERIFIED CREDENTIAL ID
                  </span>
                </div>
                <h3 className="text-2xl font-black text-foreground mt-1">{profile.name}</h3>
                <p className="text-xs text-muted-foreground">{profile.email} • {profile.nationality}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Readiness Score</span>
                  <p className="text-2xl font-black text-emerald-600">
                    {Math.min(100, 40 + verifiedCerts.length * 20 + applications.length * 5)}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
              <div className="p-3.5 rounded-2xl bg-card border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Academic Program</span>
                <p className="font-bold text-sm text-foreground mt-0.5">{profile.targetDegree}</p>
                <p className="text-xs text-primary truncate font-medium">{profile.intendedMajor}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-card border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Verified Language Metric</span>
                <p className="font-bold text-sm text-emerald-600 mt-0.5">
                  {verifiedCerts.find((c) => c.type === "IELTS" || c.type === "TOEFL")?.scores.overall || "IELTS Band 8.5 Verified"}
                </p>
                <p className="text-xs text-muted-foreground">Certified CEFR C2 Level</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-card border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Official Transcript</span>
                <p className="font-bold text-sm text-emerald-600 mt-0.5">
                  GPA {profile.verifiedGpa || profile.selfReportedGpa || 3.85} / 4.0
                </p>
                <p className="text-xs text-muted-foreground">Institutional Registrar Certified</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/80 text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">
                PASSPORT-ID: SG-2026-{profile.id.toUpperCase()}
              </span>
              <button
                onClick={() => toast.success("Official Scholar Pass verified PDF ready for download.")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white font-bold text-xs shadow-sm hover:opacity-90"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
