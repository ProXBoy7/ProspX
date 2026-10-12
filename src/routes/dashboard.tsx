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
import { StudentProjectsMainView } from "../components/dashboard/StudentProjectsMainView";
import { 
  GraduationCap, 
  Building2, 
  PenTool, 
  ShieldAlert, 
  CheckCircle2,
  LayoutGrid,
  FolderKanban
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
  const [studentViewTab, setStudentViewTab] = useState<"projects" | "kanban">("projects");

  useEffect(() => {
    setAppState(loadAppState());
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
        {/* Active User & Verified Security Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-foreground">
                  {appState.profile.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                  {appState.activeRole} Account
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                  {appState.profile.subscriptionPlan?.toUpperCase() || "FREE"} Tier
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Role-specific verified access · Academic Session 2025–2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/60 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Verified Session
            </span>
          </div>
        </div>

        {/* 1. STUDENT VERSION */}
        {appState.activeRole === "student" && (
          <div className="space-y-6">
            {/* View Switcher Pill Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-card rounded-full border border-border shadow-xs">
                <button
                  type="button"
                  onClick={() => setStudentViewTab("projects")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                    studentViewTab === "projects"
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Academic Overview & Projects</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentViewTab("kanban")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                    studentViewTab === "kanban"
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>5-Stage Admissions Kanban ({appState.applications.length})</span>
                </button>
              </div>

              <div className="text-xs text-muted-foreground hidden sm:block">
                <span>Active Profile: <strong>{appState.profile.name}</strong> · {appState.profile.subscriptionPlan.toUpperCase()} Plan</span>
              </div>
            </div>

            {/* View 1: Academic Projects & Activities Overview (Matching Reference Image) */}
            {studentViewTab === "projects" && (
              <StudentProjectsMainView
                appState={appState}
                onUpdateState={(newState) => {
                  setAppState(newState);
                  saveAppState(newState);
                }}
                onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
                onSwitchToKanban={() => setStudentViewTab("kanban")}
              />
            )}

            {/* View 2: 5-Stage Admissions Kanban Board */}
            {studentViewTab === "kanban" && (
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
            )}

            <DiagnosticSurveyModal
              isOpen={isDiagnosticOpen}
              onClose={() => setIsDiagnosticOpen(false)}
              profile={appState.profile}
              certificates={appState.certificates}
              onAddApplication={handleAddApplication}
            />
          </div>
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
