import React, { useState } from "react";
import { AppState, ApplicationItem, DecisionOutcome, getUniversityById } from "../../lib/store";
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  FileText, 
  Lock, 
  ExternalLink, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  Send
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
}

export function AdmissionsReviewerView({ appState, onUpdateState }: Props) {
  const [selectedAppId, setSelectedAppId] = useState<string>(appState.applications[0]?.id || "");
  const [reviewNotes, setReviewNotes] = useState("Candidate demonstrates verified C1 language ability and superior undergraduate mathematics coursework.");

  const selectedApp = appState.applications.find((a) => a.id === selectedAppId) || appState.applications[0];
  const targetUni = selectedApp ? getUniversityById(selectedApp.universityId) : null;
  const verifiedCerts = appState.certificates.filter((c) => c.verificationStatus === "verified");
  const teacherLor = appState.lorRequests.find((l) => l.status === "submitted");

  const handleDecision = (outcome: DecisionOutcome) => {
    if (!selectedApp) return;

    const updatedApps = appState.applications.map((a) => {
      if (a.id === selectedApp.id) {
        return {
          ...a,
          decision: outcome,
          stage: outcome === "accepted" ? "decision" as const : a.stage,
          decisionDate: new Date().toISOString().split("T")[0]
        };
      }
      return a;
    });

    const updated = {
      ...appState,
      applications: updatedApps
    };

    onUpdateState(updated);
    toast.success(`Admissions decision [${outcome.toUpperCase()}] rendered for ${appState.profile.name}!`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-primary">
                University Admissions Committee Portal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              International Applicant Dossier Review & Decisions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
              Inspect verified student transcripts, authenticated language test reports, and faculty recommendations. Render official admission decisions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-right">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Under Review</span>
              <p className="text-xl font-black text-primary">{appState.applications.length} Files</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-right">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Offers Extended</span>
              <p className="text-xl font-black text-emerald-600">
                {appState.applications.filter((a) => a.decision === "accepted").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Applications Queue */}
        <div className="lg:col-span-5 glass-panel p-6 space-y-4">
          <h3 className="font-bold text-base text-foreground flex items-center justify-between">
            <span>Applicant Pipeline Queue</span>
            <span className="text-xs text-muted-foreground font-semibold">{appState.applications.length} Applicants</span>
          </h3>

          <div className="space-y-3">
            {appState.applications.map((app) => {
              const uni = getUniversityById(app.universityId);
              if (!uni) return null;
              const isSelected = app.id === selectedAppId;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/70 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{uni.flag}</span>
                        <h4 className="font-bold text-sm text-foreground">{appState.profile.name}</h4>
                      </div>
                      <p className="text-xs font-semibold text-primary mt-0.5">{uni.name}</p>
                      <p className="text-[11px] text-muted-foreground">{app.program}</p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.decision === "accepted"
                          ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/25"
                          : app.decision === "rejected"
                          ? "bg-rose-500/15 text-rose-600 border border-rose-500/25"
                          : "bg-amber-500/15 text-amber-600 border border-amber-500/25"
                      }`}>
                        {app.decision === "pending" ? app.stage : app.decision}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">QS #{uni.qsRank}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Candidate Dossier & Decision Controls */}
        <div className="lg:col-span-7 space-y-5">
          {selectedApp && targetUni && (
            <div className="glass-panel p-8 space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/40 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-foreground">{appState.profile.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-bold border border-emerald-500/25 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Audited Credential Dossier
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Application for <strong>{targetUni.name}</strong> • {selectedApp.program}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Current Decision</span>
                  <p className={`text-base font-black capitalize ${
                    selectedApp.decision === "accepted" ? "text-emerald-600" : selectedApp.decision === "rejected" ? "text-rose-600" : "text-amber-600"
                  }`}>
                    {selectedApp.decision}
                  </p>
                </div>
              </div>

              {/* Verified Credentials in Dossier */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Authenticated Credentials & Test Scores ({verifiedCerts.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verifiedCerts.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {c.type}
                        </span>
                        <strong className="text-xs font-black text-emerald-600">
                          {c.scores.overall || c.scores.gpa}
                        </strong>
                      </div>
                      <p className="text-xs font-bold text-foreground">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground">{c.issuer} • ID: {c.credentialId}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Recommendation Letter */}
              {teacherLor && (
                <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-blue-500" />
                      Faculty Endorsement: {teacherLor.teacherName}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Signed & Certified
                    </span>
                  </div>
                  <p className="text-xs text-primary font-medium">{teacherLor.subject}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3">
                    "{teacherLor.letterContent?.substring(0, 240)}..."
                  </p>
                </div>
              )}

              {/* Committee Decision Actions */}
              <div className="pt-4 border-t border-white/40 dark:border-white/10 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Render Committee Admissions Action
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleDecision("accepted")}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Admit Student
                  </button>

                  <button
                    onClick={() => handleDecision("waitlisted")}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Clock className="w-4 h-4" />
                    Waitlist
                  </button>

                  <button
                    onClick={() => {
                      toast.info("Interview invitation email dispatched to candidate!");
                    }}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Interview
                  </button>

                  <button
                    onClick={() => handleDecision("rejected")}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
