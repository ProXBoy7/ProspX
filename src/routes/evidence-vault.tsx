import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect } from "react";
import { 
  loadAppState, 
  saveAppState, 
  AppState, 
  EvidenceCertificate, 
  ActivityItem,
  addActivity,
  updateActivity,
  deleteActivity 
} from "../lib/store";
import { EvidenceVaultView } from "../components/vault/EvidenceVaultView";
import { ActivitiesSaverView } from "../components/activities/ActivitiesSaverView";
import { ShieldCheck, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/evidence-vault")({
  head: () => ({ meta: [{ title: "Evidence Vault & Activities — ScholarGlass ProspX" }] }),
  component: EvidenceVaultPage,
});

function EvidenceVaultPage() {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [vaultTab, setVaultTab] = useState<"certificates" | "activities">("certificates");

  useEffect(() => {
    const handleUpdate = () => {
      setAppState(loadAppState());
    };
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const handleAddCertificate = (cert: EvidenceCertificate) => {
    const updated = {
      ...appState,
      certificates: [cert, ...appState.certificates]
    };
    setAppState(updated);
    saveAppState(updated);
  };

  const handleDeleteCertificate = (id: string) => {
    const updated = {
      ...appState,
      certificates: appState.certificates.filter((c) => c.id !== id)
    };
    setAppState(updated);
    saveAppState(updated);
  };

  const handleAddActivity = (act: ActivityItem) => {
    const updated = addActivity(act);
    setAppState(updated);
  };

  const handleUpdateActivity = (act: ActivityItem) => {
    const updated = updateActivity(act);
    setAppState(updated);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = deleteActivity(id);
    setAppState(updated);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-y-auto space-y-6">
        {/* Top Vault Mode Switcher Tabs */}
        <div className="flex items-center justify-center sm:justify-start">
          <div className="flex p-1.5 bg-card/60 backdrop-blur-xl rounded-full border border-border shadow-xs">
            <button
              onClick={() => setVaultTab("certificates")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                vaultTab === "certificates"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Official Test Scores & Transcripts ({appState.certificates.length})</span>
            </button>

            <button
              onClick={() => setVaultTab("activities")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                vaultTab === "activities"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Extracurriculars & Olympiad Records ({appState.activities?.length || 0})</span>
            </button>
          </div>
        </div>

        {vaultTab === "certificates" ? (
          <EvidenceVaultView
            certificates={appState.certificates}
            geminiApiKey={appState.geminiApiKey}
            activeRole={appState.activeRole}
            onAddCertificate={handleAddCertificate}
            onDeleteCertificate={handleDeleteCertificate}
          />
        ) : (
          <ActivitiesSaverView
            activities={appState.activities || []}
            activeRole={appState.activeRole}
            onAddActivity={handleAddActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

