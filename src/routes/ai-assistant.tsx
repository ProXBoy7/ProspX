import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useEffect } from "react";
import { loadAppState, AppState } from "../lib/store";
import { GroundedAIAssistantView } from "../components/ai/GroundedAIAssistantView";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "Grounded AI Essay Assistant — ScholarGlass AI" }] }),
  component: AIAssistantPage,
});

function AIAssistantPage() {
  const [appState, setAppState] = useState<AppState>(loadAppState);

  useEffect(() => {
    const handleUpdate = () => {
      setAppState(loadAppState());
    };
    window.addEventListener("scholarglass_state_updated", handleUpdate);
    return () => window.removeEventListener("scholarglass_state_updated", handleUpdate);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-y-auto">
        <GroundedAIAssistantView
          profile={appState.profile}
          certificates={appState.certificates}
          activities={appState.activities || []}
          geminiApiKey={appState.geminiApiKey}
          activeRole={appState.activeRole}
        />
      </div>
    </DashboardLayout>
  );
}
