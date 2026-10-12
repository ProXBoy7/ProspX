import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect } from "react";
import { loadAppState, AppState, getUniversityById } from "../lib/store";
import { 
  ShieldCheck, 
  GraduationCap, 
  Award, 
  Globe2, 
  CheckCircle2, 
  FileText, 
  Building, 
  Calendar,
  Lock,
  Mail,
  UserCheck
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Verified Academic Profile — ScholarGlass AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [appState, setAppState] = useState<AppState>(loadAppState);

  useEffect(() => {
    const handleUpdate = () => {
      setAppState(loadAppState());
    };
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const { profile, certificates, applications } = appState;
  const verifiedCerts = certificates.filter((c) => c.verificationStatus === "verified");

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto overflow-y-auto space-y-6">
        {/* Profile Header Card */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">
                {profile.name.split(" ").map((n) => n[0]).join("")}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{profile.name}</h2>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Scholar Status
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/25 capitalize">
                    {profile.subscriptionPlan || "free"} Subscription Tier
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {profile.email} • {profile.nationality}
                </p>
                <p className="text-xs font-semibold text-primary mt-1">
                  Target: {profile.targetDegree} in {profile.intendedMajor}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto text-right">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-left sm:text-right flex-1 sm:flex-none">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Annual Budget</span>
                <p className="text-base font-extrabold text-foreground">${profile.annualBudgetUsd.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Credentials Showcase */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-base text-foreground">Verified Credentials & Scores</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {verifiedCerts.length} Official Document{verifiedCerts.length === 1 ? "" : "s"} Authenticated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedCerts.map((cert) => (
              <div key={cert.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase">
                    {cert.type}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    {cert.scores.overall ? `Overall: ${cert.scores.overall}` : cert.scores.gpa}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-foreground">{cert.title}</h4>
                <p className="text-xs text-muted-foreground">{cert.issuer}</p>

                {cert.scores.breakdown && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40 text-[11px]">
                    {Object.entries(cert.scores.breakdown).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 rounded-md bg-card border border-border/50 text-muted-foreground">
                        {k}: <strong className="text-foreground">{v}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Application Portfolio */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            University Application Pipeline ({applications.length})
          </h3>

          <div className="space-y-3">
            {applications.map((app) => {
              const uni = getUniversityById(app.universityId);
              if (!uni) return null;
              return (
                <div key={app.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{uni.flag}</span>
                      <h4 className="font-bold text-sm text-foreground">{uni.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                        QS #{uni.qsRank}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.program}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="capitalize font-semibold text-primary px-3 py-1 rounded-full bg-primary/10">
                      Stage: {app.stage}
                    </span>
                    <a
                      href={uni.officialApplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold"
                    >
                      Portal ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
