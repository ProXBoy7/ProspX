import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect, useMemo } from "react";
import { loadAppState, saveAppState, AppState } from "../lib/store";
import { UNIVERSITIES_DATABASE, University } from "../data/universities";
import {
  Search,
  Globe,
  Star,
  BookOpen,
  DollarSign,
  GraduationCap,
  ExternalLink,
  Plus,
  Check,
  Filter,
  X,
  ChevronDown,
  MapPin,
  Award,
  Bookmark,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/universities")({
  head: () => ({ meta: [{ title: "University Finder — ScholarGlass ProspX" }] }),
  component: UniversityFinderPage,
});

const COUNTRIES = ["All Countries", "United States", "United Kingdom", "Germany", "Netherlands", "Switzerland", "Canada", "Australia", "Singapore", "Japan", "France"];
const BUDGET_RANGES = [
  { label: "Any Budget", max: Infinity },
  { label: "Under $20k/yr", max: 20000 },
  { label: "Under $35k/yr", max: 35000 },
  { label: "Under $50k/yr", max: 50000 },
  { label: "Under $70k/yr", max: 70000 },
];
const QS_RANGES = [
  { label: "Any Rank", min: 0 },
  { label: "Top 10", min: 0, max: 10 },
  { label: "Top 25", min: 0, max: 25 },
  { label: "Top 50", min: 0, max: 50 },
  { label: "Top 100", min: 0, max: 100 },
];

export function UniversityFinderPage() {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[0]);
  const [selectedQs, setSelectedQs] = useState(QS_RANGES[0]);
  const [minGpa, setMinGpa] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const handleUpdate = () => setAppState(loadAppState());
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const addedUniversityIds = new Set(appState.applications.map((a) => a.universityId));

  const filtered = useMemo(() => {
    return UNIVERSITIES_DATABASE.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase()) ||
        u.country.toLowerCase().includes(search.toLowerCase()) ||
        u.popularMajors.some((m) => m.toLowerCase().includes(search.toLowerCase()));
      const matchCountry = selectedCountry === "All Countries" || u.country === selectedCountry;
      const matchBudget = u.annualTuitionUsd <= selectedBudget.max;
      const matchQs = u.qsRank >= (selectedQs.min ?? 0) && u.qsRank <= (selectedQs.max ?? Infinity);
      const matchGpa = u.minGpa <= (minGpa === 0 ? 4.0 : minGpa + 0.5);
      return matchSearch && matchCountry && matchBudget && matchQs && matchGpa;
    }).sort((a, b) => a.qsRank - b.qsRank);
  }, [search, selectedCountry, selectedBudget, selectedQs, minGpa]);

  const handleAddToApplications = (uni: University) => {
    if (addedUniversityIds.has(uni.id)) {
      toast.info(`${uni.shortName} is already in your applications.`);
      return;
    }
    const newApp = {
      id: `app-${uni.id}-${Date.now()}`,
      universityId: uni.id,
      program: uni.popularMajors[0] || "General Studies",
      degree: appState.profile.targetDegree,
      stage: "wishlist" as const,
      decision: "pending" as const,
      deadline: uni.deadlines.fallRegular,
      intake: uni.intakes[0] || "Fall 2025",
      portalUrl: uni.officialApplyUrl,
      checklist: [],
      notes: `Added from University Finder. QS Rank: #${uni.qsRank}`,
    };
    const updated = { ...appState, applications: [...appState.applications, newApp] };
    saveAppState(updated);
    setAppState(updated);
    toast.success(`${uni.shortName} added to your applications!`, {
      description: `QS Rank #${uni.qsRank} · ${uni.country}`,
    });
  };

  const rankColor = (rank: number) => {
    if (rank <= 10) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    if (rank <= 50) return "text-primary bg-primary/10 border-primary/20";
    if (rank <= 100) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    return "text-muted-foreground bg-muted/30 border-border";
  };

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 relative overflow-hidden border border-border/60 shadow-lg">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/5 via-sky-500/5 to-transparent" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">QS World University Rankings</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">University Finder</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Browse {UNIVERSITIES_DATABASE.length} top universities · Filter by rank, budget, GPA & location · Add to your applications
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                {addedUniversityIds.size} in My List
              </div>
              <div className="px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground text-xs font-bold">
                {filtered.length} / {UNIVERSITIES_DATABASE.length} shown
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Top 10 Universities", value: UNIVERSITIES_DATABASE.filter(u => u.qsRank <= 10).length, icon: "🏆" },
              { label: "Countries Covered", value: [...new Set(UNIVERSITIES_DATABASE.map(u => u.country))].length, icon: "🌍" },
              { label: "Avg. Acceptance Rate", value: "~18%", icon: "📊" },
              { label: "Scholarships Available", value: UNIVERSITIES_DATABASE.filter(u => u.scholarshipsAvailable).length, icon: "🎓" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-2xl bg-card border border-border text-center">
                <p className="text-lg">{s.icon}</p>
                <p className="text-base font-black text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search universities, cities, majors (e.g. Computer Science, MIT, London)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${
                showFilters ? "bg-primary text-white border-primary" : "bg-card border-border text-foreground hover:border-primary/40"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <div className="flex gap-1 p-1 bg-card border border-border rounded-2xl">
              <button onClick={() => setViewMode("grid")} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}>⊞ Grid</button>
              <button onClick={() => setViewMode("list")} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}>☰ List</button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="glass-panel p-5 rounded-3xl border border-border/80 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Country
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCountry(c)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                          selectedCountry === c ? "bg-primary text-white border-primary" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {c === "All Countries" ? "🌍 All" : c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QS Rank */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5" /> QS Rank
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {QS_RANGES.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => setSelectedQs(r)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                          selectedQs.label === r.label ? "bg-amber-500 text-white border-amber-500" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Annual Budget
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {BUDGET_RANGES.map((b) => (
                      <button
                        key={b.label}
                        onClick={() => setSelectedBudget(b)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                          selectedBudget.label === b.label ? "bg-emerald-500 text-white border-emerald-500" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min GPA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> My GPA: {appState.profile.selfReportedGpa.toFixed(2)}
                  </label>
                  <p className="text-[10px] text-muted-foreground">Filter universities where your GPA meets the minimum requirement</p>
                  <button
                    onClick={() => setMinGpa(minGpa === 0 ? appState.profile.selfReportedGpa : 0)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      minGpa > 0 ? "bg-primary text-white border-primary" : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {minGpa > 0 ? "✓ Filtering by my GPA" : "Apply GPA Filter"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">{filtered.length} universities match your filters</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCountry("All Countries");
                    setSelectedBudget(BUDGET_RANGES[0]);
                    setSelectedQs(QS_RANGES[0]);
                    setMinGpa(0);
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* University Cards */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-foreground font-bold">No universities match your filters</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((uni) => {
              const isAdded = addedUniversityIds.has(uni.id);
              const meetsGpa = appState.profile.selfReportedGpa >= uni.minGpa;
              return (
                <div
                  key={uni.id}
                  className="glass-panel p-5 rounded-3xl border border-border/70 shadow-xs hover:border-primary/30 hover:shadow-md transition-all flex flex-col group cursor-pointer"
                  onClick={() => setSelectedUni(uni)}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{uni.flag}</span>
                      <div className={`px-2 py-0.5 rounded-full border text-xs font-black ${rankColor(uni.qsRank)}`}>
                        #{uni.qsRank}
                      </div>
                    </div>
                    {uni.scholarshipsAvailable && (
                      <div className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold">
                        🎓 Scholarship
                      </div>
                    )}
                  </div>

                  <h3 className="font-black text-sm text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {uni.city}, {uni.country}
                  </p>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                    {uni.overview}
                  </p>

                  {/* Key stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 rounded-xl bg-muted/30">
                      <p className="text-xs font-black text-foreground">{uni.acceptanceRate}</p>
                      <p className="text-[9px] text-muted-foreground">Accept Rate</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-muted/30">
                      <p className={`text-xs font-black ${meetsGpa ? "text-emerald-600" : "text-amber-500"}`}>{uni.minGpa.toFixed(1)}</p>
                      <p className="text-[9px] text-muted-foreground">Min GPA</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-muted/30">
                      <p className="text-xs font-black text-foreground">${(uni.annualTuitionUsd / 1000).toFixed(0)}k</p>
                      <p className="text-[9px] text-muted-foreground">/yr Tuition</p>
                    </div>
                  </div>

                  {/* Top Majors */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {uni.popularMajors.slice(0, 3).map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] font-semibold">
                        {m}
                      </span>
                    ))}
                    {uni.popularMajors.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground text-[10px] font-semibold">
                        +{uni.popularMajors.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleAddToApplications(uni)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                        isAdded
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-primary text-white hover:opacity-90 shadow-xs"
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      {isAdded ? "Added" : "Add to List"}
                    </button>
                    <a
                      href={uni.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-2xl bg-muted/40 text-muted-foreground border border-border hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List view */
          <div className="glass-panel border border-border/70 shadow-md overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">University</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">QS Rank</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Tuition/yr</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Min GPA</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Accept Rate</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((uni) => {
                    const isAdded = addedUniversityIds.has(uni.id);
                    const meetsGpa = appState.profile.selfReportedGpa >= uni.minGpa;
                    return (
                      <tr
                        key={uni.id}
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedUni(uni)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{uni.flag}</span>
                            <div>
                              <p className="font-bold text-foreground text-sm">{uni.shortName}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{uni.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full border text-xs font-black ${rankColor(uni.qsRank)}`}>
                            #{uni.qsRank}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{uni.city}, {uni.country}</td>
                        <td className="p-4 text-xs font-bold text-foreground">${(uni.annualTuitionUsd / 1000).toFixed(0)}k</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold ${meetsGpa ? "text-emerald-600" : "text-amber-500"}`}>
                            {uni.minGpa.toFixed(1)} {meetsGpa ? "✓" : "↑"}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{uni.acceptanceRate}</td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleAddToApplications(uni)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isAdded
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-primary text-white hover:opacity-90"
                            }`}
                          >
                            {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            {isAdded ? "Added" : "Add"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QS Attribution */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          Data sourced from QS World University Rankings 2025 · Rankings updated annually ·{" "}
          <a href="https://www.topuniversities.com/university-rankings/world-university-rankings/2025" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            View full QS rankings →
          </a>
        </p>
      </div>

      {/* University Detail Modal */}
      {selectedUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUni(null)}>
          <div
            className="glass-panel w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{selectedUni.flag}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full border text-xs font-black ${rankColor(selectedUni.qsRank)}`}>
                        QS #{selectedUni.qsRank}
                      </span>
                      {selectedUni.scholarshipsAvailable && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold">
                          🎓 Scholarships Available
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-foreground">{selectedUni.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedUni.city}, {selectedUni.country}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedUni(null)} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Overview */}
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedUni.overview}</p>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Annual Tuition", value: `$${selectedUni.annualTuitionUsd.toLocaleString()}`, icon: DollarSign },
                  { label: "Living Costs", value: `$${selectedUni.annualLivingCostUsd.toLocaleString()}`, icon: Globe },
                  { label: "Min GPA", value: selectedUni.minGpa.toFixed(1), icon: TrendingUp },
                  { label: "Min IELTS", value: selectedUni.minIelts.toFixed(1), icon: BookOpen },
                  { label: "Acceptance Rate", value: selectedUni.acceptanceRate, icon: Award },
                  { label: "Portal Type", value: selectedUni.portalType, icon: GraduationCap },
                  { label: "Visa Required", value: selectedUni.visaType.split(" ")[0] + "...", icon: Bookmark },
                  { label: "Deadline", value: selectedUni.deadlines.fallRegular, icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="p-3 rounded-2xl bg-card border border-border text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-black text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Popular Majors */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Popular Programs</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUni.popularMajors.map((m) => (
                    <span key={m} className="px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 text-xs font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Intakes */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Available Intakes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUni.intakes.map((i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visa note */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-xs font-bold text-amber-600 mb-1">🛂 Visa Information</p>
                <p className="text-xs text-muted-foreground">{selectedUni.visaType}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleAddToApplications(selectedUni);
                    setSelectedUni(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
                    addedUniversityIds.has(selectedUni.id)
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-primary text-white hover:opacity-90 shadow-md"
                  }`}
                >
                  {addedUniversityIds.has(selectedUni.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {addedUniversityIds.has(selectedUni.id) ? "Already in Your List" : "Add to My Applications"}
                </button>
                <a
                  href={selectedUni.officialApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/40 text-foreground border border-border font-bold text-sm hover:border-primary/40 hover:text-primary transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
