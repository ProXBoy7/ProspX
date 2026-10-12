import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ApplicationItem, ApplicationStage, ChecklistTask, EvidenceCertificate, getUniversityById, StudentProfile } from "../../lib/store";
import { University, UNIVERSITIES_DATABASE } from "../../data/universities";
import { 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Sparkles, 
  Award,
  Globe2,
  FileCheck2,
  AlertCircle,
  GraduationCap,
  TrendingUp,
  FolderKanban,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  applications: ApplicationItem[];
  profile?: StudentProfile;
  certificates?: EvidenceCertificate[];
  onUpdateStage: (id: string, newStage: ApplicationStage) => void;
  onUpdateChecklist: (appId: string, taskId: string, completed: boolean) => void;
  onDeleteApplication: (id: string) => void;
  onAddApplication: (uniId: string, program: string) => void;
  onOpenDiagnostic: () => void;
}

const STAGES: { key: ApplicationStage; title: string; color: string; desc: string }[] = [
  { key: "wishlist", title: "Wishlist & Exploring", color: "border-sky-500/30 bg-sky-500/5", desc: "Shortlisted programs" },
  { key: "preparing", title: "Preparing Documents", color: "border-amber-500/30 bg-amber-500/5", desc: "Drafting SOP, LORs, Exams" },
  { key: "submitted", title: "Submitted & Review", color: "border-purple-500/30 bg-purple-500/5", desc: "Awaiting faculty decision" },
  { key: "decision", title: "Admissions Decision", color: "border-emerald-500/30 bg-emerald-500/5", desc: "Offers & scholarships" },
  { key: "visa", title: "Visa & Relocation", color: "border-blue-500/30 bg-blue-500/5", desc: "Immigration & Housing" }
];

export function ApplicationKanban({
  applications,
  profile,
  certificates = [],
  onUpdateStage,
  onUpdateChecklist,
  onDeleteApplication,
  onAddApplication,
  onOpenDiagnostic
}: Props) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUniId, setSelectedUniId] = useState(UNIVERSITIES_DATABASE[0]?.id || "");
  const [customProgram, setCustomProgram] = useState("M.Sc. Computer Science");
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddApplication(selectedUniId, customProgram);
    setIsAddModalOpen(false);
    toast.success("University application added to Kanban!");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* CLEAN ONBOARDING HERO BANNER: Displayed for Brand New User (0 Applications & 0 Certificates) */}
      {applications.length === 0 && certificates.length === 0 ? (
        <div className="glass-panel-elevated p-8 relative overflow-hidden border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card/80 to-primary/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Fresh Student Onboarding • Clean Slate State
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Welcome to ProspX, {profile?.name || "Scholar"}!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You have started with a brand new profile without pre-loaded certificates or applications.
                Begin your international admissions journey by taking the <strong>AI Diagnostic Survey</strong> or shortlisting your first QS-ranked global university.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white font-bold text-xs shadow-lg shadow-primary/25 hover:opacity-90 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Start AI Diagnostic Survey
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-card border border-border text-foreground hover:bg-muted font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 text-primary" />
                Shortlist First University
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ORIGINAL PREVIOUS DASHBOARD BENTO SECTION: Academic Highlights & Projects */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Academic Project Card 1 (Luminous Glass Panel from original Page 4) */}
          <div className="md:col-span-6 lg:col-span-4 glass-panel shine-effect p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-bold border border-cyan-500/25">
                  In Progress
                </span>
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Active Research
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {profile?.intendedMajor ? `${profile.intendedMajor.split(" ")[0]} Research Track` : "Quantum Neural Topologies"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {profile?.academicNotes || "Investigating high-dimensional neural pathways using simulated quantum annealing frameworks for academic submissions."}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">Research Milestone</span>
                <strong className="text-primary font-bold">78%</strong>
              </div>
              <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Academic Project Card 2 (Luminous Glass Panel from original Page 4) */}
          <div className="md:col-span-6 lg:col-span-4 glass-panel shine-effect p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-500/25">
                  Review Pending
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Due in 4 days</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Capstone Portfolio & SOP</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                Evidence-grounded statements and faculty evaluations for international admissions committees.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">Portfolio Readiness</span>
                <strong className="text-amber-600 font-bold">
                  {certificates.length > 0 ? `${Math.min(95, certificates.length * 35)}%` : "25%"}
                </strong>
              </div>
              <div className="w-full h-2 bg-amber-500/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500" 
                  style={{ width: `${certificates.length > 0 ? Math.min(95, certificates.length * 35) : 25}%` }}
                />
              </div>
            </div>
          </div>

          {/* Global Academic Readiness Card */}
          <div className="md:col-span-12 lg:col-span-4 glass-panel-elevated p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/25 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {profile?.subscriptionPlan ? `${profile.subscriptionPlan.toUpperCase()} TIER` : "Verified Scholar"}
                </span>
                <span className="text-xs font-bold text-primary">Fall 2026 Ready</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Admissions Index</h3>
              <p className="text-xs text-muted-foreground mt-1">
                GPA {profile?.verifiedGpa ? `verified at ${profile.verifiedGpa} / 4.0` : `self-reported at ${profile?.selfReportedGpa || "3.50"} / 4.0`} with {certificates.length} credentials in Evidence Vault.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20 dark:border-white/10 text-center">
              <div className="p-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Plan Slots</span>
                <p className="text-sm font-extrabold text-foreground">
                  {profile?.subscriptionPlan === "free" ? "1 Active" : profile?.subscriptionPlan === "pro" ? "5 Slots" : "Unlimited"}
                </p>
              </div>
              <div className="p-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">QS Target Pool</span>
                <p className="text-sm font-extrabold text-primary">Top 50 Global</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP PIPELINE HEADER: Action Controls */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-primary">
              International Admissions Pipeline
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            Application Pipeline & Requirement Tracker
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor real-time application stages, official web portals, and country-specific prerequisite checklists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Link
            to="/universities"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Browse QS Ratings</span>
          </Link>
          <button
            onClick={onOpenDiagnostic}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-xs shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Diagnostic
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/60 dark:bg-card border border-white/80 dark:border-border text-foreground hover:bg-white/90 font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-primary" />
            Add Application
          </button>
        </div>
      </div>

      {/* 5-STAGE KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {STAGES.map((col, colIdx) => {
          const colApps = applications.filter((app) => app.stage === col.key);

          return (
            <div
              key={col.key}
              className={`glass-panel flex flex-col p-4 min-h-[540px] transition-all ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/40 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs sm:text-sm text-foreground">{col.title}</h3>
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-extrabold">
                      {colApps.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{col.desc}</p>
                </div>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-12 border-2 border-dashed border-white/40 dark:border-white/10 rounded-2xl text-center px-3">
                    <p className="text-xs text-muted-foreground">No applications in this stage</p>
                  </div>
                ) : (
                  colApps.map((app) => {
                    const uni = getUniversityById(app.universityId);
                    if (!uni) return null;

                    const isExpanded = expandedAppId === app.id;
                    const completedTasks = app.checklist.filter((c) => c.completed).length;
                    const totalTasks = app.checklist.length;
                    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                      <div
                        key={app.id}
                        className="group flex flex-col p-4 rounded-[22px] bg-white/70 dark:bg-card/70 border border-white/90 dark:border-border/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden backdrop-blur-md"
                      >
                        {/* Header & Badges */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-500/25">
                            <Award className="w-3 h-3" />
                            QS #{uni.qsRank}
                          </span>

                          <span className="text-base" title={uni.country}>
                            {uni.flag}
                          </span>
                        </div>

                        {/* University & Program */}
                        <h4 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
                          {uni.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
                          {app.program}
                        </p>

                        <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>Deadline: <strong>{app.deadline}</strong></span>
                        </div>

                        {/* Direct Portal Apply Link */}
                        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                          <a
                            href={uni.officialApplyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline hover:text-blue-600 transition-colors"
                          >
                            <Globe2 className="w-3.5 h-3.5" />
                            Official Portal ({uni.portalType})
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            title="Remove Application"
                            className="text-muted-foreground hover:text-destructive p-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Checklist Summary */}
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-muted-foreground font-medium">Requirements</span>
                            <span className="font-bold text-foreground">{completedTasks}/{totalTasks} ({progressPercent}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300 rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>

                          {/* Toggle Expand Checklist */}
                          <button
                            onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                            className="mt-2 text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            <FileCheck2 className="w-3 h-3" />
                            {isExpanded ? "Hide Checklist" : "View Checklist Tasks"}
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 space-y-1.5 bg-muted/40 p-2.5 rounded-xl border border-border/50">
                              {app.checklist.map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => onUpdateChecklist(app.id, task.id, !task.completed)}
                                  className="flex items-start gap-2 cursor-pointer group/task"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-muted-foreground group-hover/task:text-primary shrink-0 mt-0.5" />
                                  )}
                                  <span className={`text-[11px] leading-tight ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                    {task.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Stage Progression Controls */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/60 text-xs">
                          <button
                            disabled={colIdx === 0}
                            onClick={() => onUpdateStage(app.id, STAGES[colIdx - 1].key)}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none p-1 rounded-lg"
                            title="Move to previous stage"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>

                          <button
                            disabled={colIdx === STAGES.length - 1}
                            onClick={() => onUpdateStage(app.id, STAGES[colIdx + 1].key)}
                            className="flex items-center gap-1 text-primary hover:text-blue-600 font-bold disabled:opacity-30 disabled:pointer-events-none p-1 rounded-lg"
                            title="Advance to next stage"
                          >
                            <span>Advance</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add University Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-[30px] bg-card border border-border p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Add University to Admissions Pipeline</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select an institution from the QS World Ranking catalog or explore requirements.
                </p>
              </div>
              <Link
                to="/universities"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 p-1.5 rounded-xl bg-primary/10 border border-primary/20"
              >
                <span>Full QS Finder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">University (QS World Rankings)</label>
                <select
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  {UNIVERSITIES_DATABASE.map((u) => (
                    <option key={u.id} value={u.id}>
                      #{u.qsRank} {u.name} ({u.country} {u.flag})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Program / Specialization</label>
                <input
                  type="text"
                  value={customProgram}
                  onChange={(e) => setCustomProgram(e.target.value)}
                  placeholder="e.g. M.Sc. in Data Engineering & Informatics"
                  className="mt-1.5 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 text-xs text-muted-foreground space-y-1">
                {(() => {
                  const selUni = getUniversityById(selectedUniId);
                  if (!selUni) return null;
                  return (
                    <>
                      <p>• <strong>Location:</strong> {selUni.city}, {selUni.country}</p>
                      <p>• <strong>Admissions Portal:</strong> {selUni.portalType} ({selUni.officialApplyUrl})</p>
                      <p>• <strong>Requirements:</strong> Min GPA {selUni.minGpa} / IELTS {selUni.minIelts}+</p>
                      <p>• <strong>Estimated Tuition:</strong> ${selUni.annualTuitionUsd.toLocaleString()} / year</p>
                    </>
                  );
                })()}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-blue-600 transition-colors"
                >
                  Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
