import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect } from "react";
import { loadAppState, saveAppState, AppState, StudentProfile } from "../lib/store";
import { SettingsView } from "../components/settings/SettingsView";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings & Gemini API — ScholarGlass AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [appState, setAppState] = useState<AppState>(loadAppState);

  useEffect(() => {
    const handleUpdate = () => {
      setAppState(loadAppState());
    };
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    const updated = {
      ...appState,
      profile: updatedProfile
    };
    setAppState(updated);
    saveAppState(updated);
  };

  const handleSaveApiKey = (key: string) => {
    const updated = {
      ...appState,
      geminiApiKey: key
    };
    setAppState(updated);
    saveAppState(updated);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-y-auto">
        <SettingsView
          profile={appState.profile}
          geminiApiKey={appState.geminiApiKey}
          activeRole={appState.activeRole}
          onSaveProfile={handleSaveProfile}
          onSaveApiKey={handleSaveApiKey}
        />
      </div>
    </DashboardLayout>
  );
}
