import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect } from "react";
import { loadAppState, saveAppState, AppState, ApplicationStage, UserRole } from "../lib/store";
import { ApplicationKanban } from "../components/kanban/ApplicationKanban";
import { DiagnosticSurveyModal } from "../components/assessment/DiagnosticSurveyModal";
import { CounselorHubView } from "../components/counselor/CounselorHubView";
import { TeacherHubView } from "../components/teacher/TeacherHubView";
import { AdminHubView } from "../components/admin/AdminHubView";
import { AdmissionsReviewerView } from "../components/admissions/AdmissionsReviewerView";
import { 
  GraduationCap, 
  Building2, 
  PenTool, 
  ShieldAlert, 
  CheckCircle2 
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Hub — ScholarGlass AI" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setAppState(loadAppState());
    };
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const handleUpdateRole = (role: UserRole) => {
    const updated = { ...appState, activeRole: role };
    setAppState(updated);
    saveAppState(updated);
  };

  const handleUpdateStage = (id: string, newStage: ApplicationStage) => {
    const updated = {
      ...appState,
      applications: appState.applications.map((app) =>
        app.id === id ? { ...app, stage: newStage } : app
      )
    };
    setAppState(updated);
    saveAppState(updated);
  };

  const handleUpdateChecklist = (appId: string, taskId: string, completed: boolean) => {
    const updated = {
      ...appState,
      applications: appState.applications.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          checklist: app.checklist.map((c) => (c.id === taskId ? { ...c, completed } : c))
        };
      })
    };
    setAppState(updated);
    saveAppState(updated);
  };

  const handleDeleteApplication = (id: string) => {
    const updated = {
      ...appState,
      applications: appState.applications.filter((a) => a.id !== id)
    };
    setAppState(updated);
    saveAppState(updated);
  };

  const handleAddApplication = (uniId: string, program: string) => {
    const newApp = {
      id: `app-${Date.now()}`,
      universityId: uniId,
      program: program || "Master's Program",
      degree: appState.profile.targetDegree,
      stage: "wishlist" as ApplicationStage,
      decision: "pending" as const,
      deadline: "Rolling / Fall 2026",
      intake: "Fall 2026",
      portalUrl: "https://apply.university.edu",
      notes: "Newly shortlisted program from catalog.",
      checklist: [
        { id: `c-${Date.now()}-1`, title: "Review Program Prerequisites", completed: false, category: "document" as const },
        { id: `c-${Date.now()}-2`, title: "Attach Verified IELTS/Language Score", completed: false, category: "exam" as const },
        { id: `c-${Date.now()}-3`, title: "Draft Grounded Statement of Purpose", completed: false, category: "document" as const },
        { id: `c-${Date.now()}-4`, title: "Request Letters of Recommendation", completed: false, category: "document" as const },
        { id: `c-${Date.now()}-5`, title: "Submit Official Portal Application", completed: false, category: "portal" as const }
      ]
    };

    const updated = {
      ...appState,
      applications: [newApp, ...appState.applications]
    };
    setAppState(updated);
    saveAppState(updated);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-y-auto space-y-6">
        {/* Active Account & Assigned Role Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Active User Role:
                </span>
                <span className="text-xs font-black text-foreground capitalize">
                  {appState.activeRole} Account
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  Strict 1 Role Per User
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Each account in the 10-user database has a single assigned permission set and dedicated view.
              </p>
            </div>
          </div>
        </div>

        {/* 1. STUDENT VERSION */}
        {appState.activeRole === "student" && (
          <>
            <ApplicationKanban
              applications={appState.applications}
              profile={appState.profile}
              certificates={appState.certificates}
              onUpdateStage={handleUpdateStage}
              onUpdateChecklist={handleUpdateChecklist}
              onDeleteApplication={handleDeleteApplication}
              onAddApplication={handleAddApplication}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            />

            <DiagnosticSurveyModal
              isOpen={isDiagnosticOpen}
              onClose={() => setIsDiagnosticOpen(false)}
              profile={appState.profile}
              certificates={appState.certificates}
              onAddApplication={handleAddApplication}
            />
          </>
        )}

        {/* 2. SCHOOL COUNSELOR VERSION */}
        {appState.activeRole === "counselor" && (
          <CounselorHubView
            appState={appState}
            onUpdateState={(newState) => {
              setAppState(newState);
              saveAppState(newState);
            }}
          />
        )}

        {/* 3. TEACHER VERSION */}
        {appState.activeRole === "teacher" && (
          <TeacherHubView
            appState={appState}
            onUpdateState={(newState) => {
              setAppState(newState);
              saveAppState(newState);
            }}
          />
        )}

        {/* 4. ADMIN VERSION */}
        {appState.activeRole === "admin" && (
          <AdminHubView
            appState={appState}
            onUpdateState={(newState) => {
              setAppState(newState);
              saveAppState(newState);
            }}
          />
        )}

        {/* 5. UNIVERSITY ADMISSIONS OFFICER VERSION */}
        {appState.activeRole === "admissions" && (
          <AdmissionsReviewerView
            appState={appState}
            onUpdateState={(newState) => {
              setAppState(newState);
              saveAppState(newState);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
