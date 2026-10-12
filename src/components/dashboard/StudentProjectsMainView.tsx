import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { 
  AppState, 
  ActivityItem, 
  ApplicationItem, 
  EvidenceCertificate, 
  StudentProfile,
  addActivity,
  saveAppState,
  completeQuest
} from "../../lib/store";
import { 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Clock, 
  Download, 
  Mail, 
  GraduationCap, 
  FileText, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Globe2, 
  PenTool, 
  FolderKanban, 
  TrendingUp, 
  Check, 
  X,
  Zap,
  Layers,
  BookOpen,
  User,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Calendar,
  School,
  ArrowRight,
  SlidersHorizontal,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
  onOpenDiagnostic: () => void;
  onSwitchToKanban?: () => void;
}

export function StudentProjectsMainView({
  appState,
  onUpdateState,
  onOpenDiagnostic,
  onSwitchToKanban
}: Props) {
  const { profile, activities = [], certificates = [], applications = [], scholarPass } = appState;
  
  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(
    appState.isNewUser || (activities.length === 0 && applications.length === 0)
  );

  // New Project Modal form state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState<"project" | "olympiad" | "extracurricular" | "volunteering">("project");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectProgress, setProjectProgress] = useState(65);
  const [projectMemorableMoments, setProjectMemorableMoments] = useState("");

  // Edit Profile Modal form state
  const [editMajor, setEditMajor] = useState(profile.intendedMajor || "");
  const [editDegree, setEditDegree] = useState(profile.targetDegree || "Bachelor's");
  const [editSchool, setEditSchool] = useState(profile.schoolName || "");
  const [editGpa, setEditGpa] = useState(profile.selfReportedGpa || 3.8);
  const [editBudget, setEditBudget] = useState(profile.annualBudgetUsd || 25000);

  // Is this an institutional preset demo account (e.g. Alex Mercer, Sophia Chen, Priya Sharma)?
  const isDemoAccount = profile.email?.includes("@scholarglass.ai") && profile.email !== "newuser@scholarglass.ai";

  // Dynamic calculation for Onboarding Tutorial Progress
  const step1Done = Boolean(profile.selfReportedGpa && profile.selfReportedGpa > 0 && profile.intendedMajor && profile.intendedMajor !== "Undecided Major");
  const step2Done = applications.length > 0;
  const step3Done = activities.length > 0;
  const step4Done = Boolean(appState.onboardingCompleted);

  const completedStepsCount = [step1Done, step2Done, step3Done, step4Done].filter(Boolean).length;
  const tutorialPercentage = Math.round((completedStepsCount / 4) * 100);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      studentId: profile.id,
      title: projectTitle.trim(),
      category: projectCategory,
      organization: profile.schoolName || "Independent Academic Initiative",
      roleOrAward: "Lead Author / Participant",
      dateRange: "Current Academic Year",
      description: projectDesc.trim() || "Independent academic project and practical application.",
      memorableMoments: projectMemorableMoments.trim() || "Developed new skills through real-world experimentation and perseverance.",
      skills: ["Research", "Methodology", "Leadership"],
      highlightInEssay: true
    };

    const updated = addActivity(newAct);
    onUpdateState(updated);
    setIsNewProjectModalOpen(false);
    setProjectTitle("");
    setProjectDesc("");
    setProjectMemorableMoments("");
    toast.success(`Project "${newAct.title}" saved to your portfolio!`, {
      description: "Available in your AI Essay grounding vault and dossier."
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppState = {
      ...appState,
      profile: {
        ...profile,
        intendedMajor: editMajor.trim() || "Undecided Major",
        targetDegree: editDegree as any,
        schoolName: editSchool.trim() || "High School / Prospective Student",
        selfReportedGpa: Number(editGpa),
        annualBudgetUsd: Number(editBudget)
      }
    };
    saveAppState(updated);
    onUpdateState(updated);
    setIsEditProfileModalOpen(false);
    toast.success("Academic profile updated successfully!");
  };

  const handleDeleteActivity = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: AppState = {
      ...appState,
      activities: activities.filter(a => a.id !== id)
    };
    saveAppState(updated);
    onUpdateState(updated);
    toast.success("Activity removed from portfolio.");
  };

  const handleExportCv = () => {
    const summary = `
========================================
SCHOLARGLASS PROSPX · ACADEMIC DOSSIER
========================================
STUDENT: ${profile.name}
EMAIL: ${profile.email}
INSTITUTION: ${profile.schoolName || "Prospective Student"}
INTENDED MAJOR: ${profile.intendedMajor || "Undecided"}
TARGET DEGREE: ${profile.targetDegree}
SELF-REPORTED GPA: ${profile.selfReportedGpa ? profile.selfReportedGpa + " / 4.0" : "Not Set"}
VERIFIED GPA: ${profile.verifiedGpa ? profile.verifiedGpa + " / 4.0" : "Pending Counselor Audit"}
SCHOLAR PASS LEVEL: Level ${scholarPass?.level ?? 1} (${scholarPass?.currentXp ?? 0} XP)

--- ACTIVE RESEARCH & PROJECTS (${activities.length}) ---
${activities.length > 0 
  ? activities.map((a, i) => `${i + 1}. ${a.title} (${a.category.toUpperCase()})
   Role: ${a.roleOrAward}
   Organization: ${a.organization}
   Description: ${a.description}
   Memorable Moments: "${a.memorableMoments}"`).join("\n\n")
  : "No active project records yet."
}

--- VERIFIED CREDENTIALS & CERTIFICATES (${certificates.length}) ---
${certificates.length > 0 
  ? certificates.map((c) => `• ${c.title} (${c.type}) - ${c.issuer} [Status: ${c.verificationStatus.toUpperCase()}]`).join("\n")
  : "No certificates uploaded yet."
}

--- UNIVERSITY APPLICATION PIPELINE (${applications.length}) ---
${applications.length > 0 
  ? applications.map((app) => `• ${app.program} (Stage: ${app.stage.toUpperCase()}) - Deadline: ${app.deadline}`).join("\n")
  : "No university applications shortlisted yet."
}
========================================
Generated by ScholarGlass ProspX Admissions Platform
`;

    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}_Academic_Dossier.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Academic CV & Admissions Dossier exported successfully!");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── FAST ACTION SHORTCUTS BAR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/universities"
          className="p-3.5 rounded-2xl glass-panel border border-primary/20 hover:border-primary/50 transition-all flex items-center gap-3 group shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Globe2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground block truncate">QS Universities</span>
            <span className="text-[10px] text-muted-foreground truncate block">30+ Global Rankings</span>
          </div>
        </Link>

        <Link
          to="/ai-assistant"
          className="p-3.5 rounded-2xl glass-panel border border-purple-500/20 hover:border-purple-500/50 transition-all flex items-center gap-3 group shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PenTool className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground block truncate">AI Essay Lab</span>
            <span className="text-[10px] text-muted-foreground truncate block">Write & Critique SOP</span>
          </div>
        </Link>

        <Link
          to="/scholar-pass"
          className="p-3.5 rounded-2xl glass-panel border border-amber-500/20 hover:border-amber-500/50 transition-all flex items-center gap-3 group shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground block truncate">Scholar Pass</span>
            <span className="text-[10px] text-muted-foreground truncate block">Level {scholarPass?.level ?? 1} · {scholarPass?.currentXp ?? 0} XP</span>
          </div>
        </Link>

        <Link
          to="/evidence-vault"
          className="p-3.5 rounded-2xl glass-panel border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex items-center gap-3 group shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground block truncate">Evidence Vault</span>
            <span className="text-[10px] text-muted-foreground truncate block">{activities.length} Records</span>
          </div>
        </Link>
      </div>

      {/* ── ONBOARDING TUTORIAL BANNER (FOR NEW / FRESH USERS) ── */}
      {showTutorial && (
        <div className="p-6 rounded-[28px] border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white shadow-xs">
                  Beginner Walkthrough
                </span>
                <span className="text-xs font-bold text-primary">
                  {completedStepsCount} of 4 Steps Completed ({tutorialPercentage}%)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1 tracking-tight">
                Welcome to ProspX, {profile.name}! 🚀
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                Your admissions workspace is initialized. Follow this 4-step interactive tutorial to build a standout university profile.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTutorial(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-muted/50 hover:bg-muted text-muted-foreground transition self-start sm:self-auto shrink-0"
            >
              Minimize Tutorial
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-5">
            <div 
              className="h-full bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 rounded-full transition-all duration-700" 
              style={{ width: `${Math.max(tutorialPercentage, 8)}%` }}
            />
          </div>

          {/* 4 Tutorial Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              step1Done 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-card/80 border-border hover:border-primary/40"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Step 1</span>
                  {step1Done ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-primary">+200 XP</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-foreground">Set Academic Profile</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  Specify target degree, major, and self-reported GPA.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary transition flex items-center justify-center gap-1"
              >
                <span>{step1Done ? "Edit Profile" : "Start Step 1"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              step2Done 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-card/80 border-border hover:border-primary/40"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Step 2</span>
                  {step2Done ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-primary">+250 XP</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-foreground">Shortlist 1 University</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  Explore 30+ QS top institutions and shortlist your first match.
                </p>
              </div>
              <Link
                to="/universities"
                className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary transition flex items-center justify-center gap-1"
              >
                <span>{step2Done ? "View Shortlist" : "Browse QS Catalog"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              step3Done 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-card/80 border-border hover:border-primary/40"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Step 3</span>
                  {step3Done ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-primary">+300 XP</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-foreground">Add 1 Project / Award</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  Document research, an Olympiad medal, or extracurricular.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(true)}
                className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary transition flex items-center justify-center gap-1"
              >
                <span>{step3Done ? "Add Another" : "+ Create Project"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 4 */}
            <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              step4Done 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-card/80 border-border hover:border-primary/40"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Step 4</span>
                  {step4Done ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-primary">+350 XP</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-foreground">Explore AI Essay Lab</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  Generate personal statements grounded directly in your vault.
                </p>
              </div>
              <Link
                to="/ai-assistant"
                onClick={() => {
                  if (!appState.onboardingCompleted) {
                    const updated = { ...appState, onboardingCompleted: true };
                    saveAppState(updated);
                    onUpdateState(updated);
                  }
                }}
                className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary transition flex items-center justify-center gap-1"
              >
                <span>Open Essay Lab</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── BENTO DASHBOARD GRID ── */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Active Projects & Recent Activities (Span 8) */}
        <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Active Projects</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {activities.length} Recorded
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Academic research, Olympiad medals, and extracurricular evidence for essay grounding.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onSwitchToKanban && (
                <button
                  type="button"
                  onClick={onSwitchToKanban}
                  className="px-4 py-2 rounded-full font-bold text-xs bg-muted/40 hover:bg-muted text-foreground border border-border/70 transition-all flex items-center gap-1.5"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-primary" />
                  <span>Kanban Pipeline</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(true)}
                className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-xs shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* Active Projects Cards Grid or Guided Empty State */}
          {activities.length === 0 ? (
            <div className="glass-panel p-8 rounded-[28px] border-2 border-dashed border-border/80 text-center flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-foreground">Your Projects Vault is Empty</h3>
              <p className="text-xs text-muted-foreground max-w-md mt-1 leading-relaxed">
                Admissions officers look for authentic intellectual curiosity, Olympiad rankings, and extracurricular leadership. Add your first project to ground your future college essays.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:opacity-90 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Project</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Populate quick starter sample project for student
                    const sample: ActivityItem = {
                      id: `act-${Date.now()}`,
                      studentId: profile.id,
                      title: "Independent STEM Research Initiative",
                      category: "project",
                      organization: profile.schoolName || "Academic Honors Club",
                      roleOrAward: "Lead Author & Student Researcher",
                      dateRange: "2024 - Present",
                      description: "Investigated computational methods and data modeling for real-world environmental sustainability.",
                      memorableMoments: "Our pilot simulation achieved 94% prediction accuracy after 3 failed prototyping cycles.",
                      skills: ["Python", "Data Analysis", "Research Methodology"],
                      highlightInEssay: true
                    };
                    const updated = addActivity(sample);
                    onUpdateState(updated);
                    toast.success("Sample research project added to your vault!");
                  }}
                  className="px-4 py-2.5 rounded-full bg-muted/50 hover:bg-muted text-foreground text-xs font-bold border border-border/70 transition"
                >
                  Load Starter Template
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activities.map((act) => (
                <div 
                  key={act.id} 
                  className="glass-panel shine-effect p-6 rounded-[28px] border border-border/80 flex flex-col justify-between min-h-[300px] shadow-sm hover:border-primary/40 transition-all group relative"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[11px] font-bold border border-primary/20 capitalize">
                        {act.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteActivity(act.id, e)}
                        className="text-muted-foreground hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-black text-primary leading-tight mb-1.5">
                      {act.title}
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground mb-2">
                      {act.roleOrAward} • {act.organization}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {act.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/50 space-y-2.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Essay Grounding Value</span>
                      <span className="text-emerald-600 font-black">Verified Evidence</span>
                    </div>

                    <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-700" 
                        style={{ width: "85%" }} 
                      />
                    </div>

                    {act.memorableMoments && (
                      <p className="text-[11px] text-muted-foreground italic truncate">
                        "{act.memorableMoments}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Activities / Evidence Section */}
          <div className="space-y-3.5 mt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Recent Evidence & Milestones</h3>
              <Link to="/evidence-vault" className="text-xs font-bold text-primary hover:underline">
                Open Full Vault ({certificates.length + activities.length})
              </Link>
            </div>
            
            {certificates.length === 0 && activities.length === 0 ? (
              <div className="glass-panel p-5 rounded-2xl border border-border/70 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">No Evidence Documents Uploaded</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Upload IELTS/SAT score reports or transcripts to lock verified credentials.
                    </p>
                  </div>
                </div>
                <Link
                  to="/evidence-vault"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary transition shrink-0"
                >
                  Upload Evidence
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {certificates.slice(0, 3).map((cert) => (
                  <div 
                    key={cert.id}
                    onClick={() => toast.info(`Credential verified: ${cert.title}`)}
                    className="glass-panel p-4.5 rounded-2xl border border-border/70 flex items-center gap-4 hover:border-primary/40 hover:bg-card/70 transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {cert.title} ({cert.type})
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {cert.issuer} • Status: {cert.verificationStatus.toUpperCase()}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}

                {activities.slice(0, 2).map((act) => (
                  <div 
                    key={act.id}
                    onClick={() => toast.info(`Activity record: ${act.title}`)}
                    className="glass-panel p-4.5 rounded-2xl border border-border/70 flex items-center gap-4 hover:border-primary/40 hover:bg-card/70 transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {act.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {act.roleOrAward} • {act.organization}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Profile Card, Stats, Spotlight Goal, and Timeline (Span 4) */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* 1. Profile Header Card with Overlapping Avatar */}
          <div className="glass-panel rounded-[30px] pt-14 px-6 pb-6 relative mt-8 border border-border/80 shadow-md">
            {/* Overlapping Avatar with Real Initials */}
            <div className="absolute -top-10 left-6 w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 p-1 shadow-lg shadow-primary/20 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center font-black text-xl text-primary">
                {profile.name.split(" ").map(n => n[0]).join("") || "ST"}
              </div>
            </div>

            <div className="flex flex-col gap-2 pl-1">
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">{profile.name}</h1>
                <p className="text-sm font-bold text-primary flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span className="truncate">{profile.schoolName || "Prospective Student"}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Target: <strong>{profile.targetDegree}</strong> in <strong>{profile.intendedMajor || "Undecided"}</strong>
                </p>
              </div>

              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-border/80 bg-muted/40 hover:bg-muted text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCv}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-border/80 bg-muted/40 hover:bg-muted text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Export Dossier</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Stats Row */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Volunteering / Extracurriculars */}
            <div className="glass-panel rounded-[24px] p-4.5 flex items-center gap-3.5 border border-border/70 shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-xl">volunteer_activism</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Volunteering</p>
                <p className="text-xl font-black text-foreground">
                  {isDemoAccount ? 124 : 0}<span className="text-xs font-normal text-muted-foreground"> hrs</span>
                </p>
              </div>
            </div>

            {/* Projects Count */}
            <div className="glass-panel rounded-[24px] p-4.5 flex items-center gap-3.5 border border-border/70 shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Projects</p>
                <p className="text-xl font-black text-foreground">
                  {activities.length}<span className="text-xs font-normal text-muted-foreground"> done</span>
                </p>
              </div>
            </div>
          </div>

          {/* 3. Milestone Spotlight Goal Card */}
          <div className="glass-panel rounded-[30px] p-6 flex flex-col justify-between border border-border/80 shadow-md">
            {applications.length > 0 ? (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-md shadow-primary/20">
                    <School className="w-4 h-4" />
                  </div>
                  <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    {applications[0].stage}
                  </span>
                </div>

                <h3 className="text-base font-black text-foreground mb-1">
                  {applications[0].program}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Deadline: {applications[0].deadline}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted-foreground">Checklist Progress</span>
                    <span className="text-primary font-black">
                      {Math.round(
                        (applications[0].checklist.filter(c => c.completed).length / Math.max(applications[0].checklist.length, 1)) * 100
                      )}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-700" 
                      style={{ 
                        width: `${Math.round(
                          (applications[0].checklist.filter(c => c.completed).length / Math.max(applications[0].checklist.length, 1)) * 100
                        )}%` 
                      }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-black text-sm">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <span className="bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Milestone 1
                  </span>
                </div>

                <h3 className="text-base font-black text-foreground mb-1">
                  Discover Universities
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Search 30+ QS World Universities by admission score, tuition cost, and visa policies.
                </p>

                <Link
                  to="/universities"
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-primary text-white flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition"
                >
                  <span>Explore QS Database</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* 4. Recent Activity Timeline */}
          <div className="glass-panel rounded-[30px] p-6 border border-border/80 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Audit Timeline
            </h3>

            <div className="relative border-l-2 border-border/80 ml-2.5 space-y-5 py-1">
              <div className="relative pl-5">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-card" />
                <p className="text-[11px] font-bold text-emerald-600 mb-0.5">Active Session</p>
                <p className="text-xs font-bold text-foreground">Verified Student Account</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Free Starter Tier active.</p>
              </div>

              {activities.length > 0 ? (
                <div className="relative pl-5">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-primary bg-card" />
                  <p className="text-[11px] font-semibold text-muted-foreground mb-0.5">Latest Entry</p>
                  <p className="text-xs font-bold text-foreground truncate">{activities[0].title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Saved to portfolio vault.</p>
                </div>
              ) : (
                <div className="relative pl-5">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-muted-foreground bg-card" />
                  <p className="text-[11px] font-semibold text-muted-foreground mb-0.5">Awaiting First Record</p>
                  <p className="text-xs font-bold text-foreground">Add Project or Competition</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Begin recording academic milestones.</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/50 text-right">
              <Link 
                to="/evidence-vault" 
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── NEW PROJECT MODAL ── */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Create New Academic Project
              </h3>
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Solar Navigation Rover"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Category</label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="project">Research Project</option>
                    <option value="olympiad">Olympiad / Competition</option>
                    <option value="extracurricular">Extracurricular Activity</option>
                    <option value="volunteering">Volunteering & Community</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Initial Progress ({projectProgress}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={projectProgress}
                    onChange={(e) => setProjectProgress(Number(e.target.value))}
                    className="w-full mt-2 accent-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Description & Contributions</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize the core hypothesis, methodology, and academic contributions..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Memorable Moments (Weaved into AI Essays)
                </label>
                <textarea
                  rows={2}
                  placeholder="What was the personal turning point, failure overcome, or exciting breakthrough?"
                  value={projectMemorableMoments}
                  onChange={(e) => setProjectMemorableMoments(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 transition"
                >
                  Save to Active Projects
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-muted/40 text-muted-foreground border border-border text-xs font-bold hover:bg-muted transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE MODAL (STEP 1 OF ONBOARDING) ── */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                Set Academic Targets & GPA
              </h3>
              <button 
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Current School / Institution</label>
                <input
                  type="text"
                  placeholder="e.g. International Honors High School"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Intended Major</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={editMajor}
                    onChange={(e) => setEditMajor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Target Degree</label>
                  <select
                    value={editDegree}
                    onChange={(e) => setEditDegree(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Bachelor's">Bachelor's Degree (B.S. / B.A.)</option>
                    <option value="Master's">Master's Degree (M.S. / M.A.)</option>
                    <option value="PhD">Doctoral / PhD</option>
                    <option value="MBA">Master of Business Administration (MBA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Self-Reported GPA (out of 4.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    required
                    value={editGpa}
                    onChange={(e) => setEditGpa(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Annual Budget (USD)</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={editBudget}
                    onChange={(e) => setEditBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 transition"
                >
                  Save Profile Targets
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-muted/40 text-muted-foreground border border-border text-xs font-bold hover:bg-muted transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
