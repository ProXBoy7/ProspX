import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useRef, useState } from "react";
import { useTheme } from "../lib/use-theme";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ScholarGlass AI" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { theme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const handleIframeLoad = () => {
    setIsTransitioning(false);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      doc.documentElement.className = theme;
      const style = doc.createElement("style");
      style.innerHTML = `
        header.docked, header.sticky, header.top-0, header.mb-8, aside {
          display: none !important;
        }
        body { margin: 0; padding: 16px; background: transparent !important; overflow-x: hidden; }
      `;
      doc.head.appendChild(style);
    } catch {}
  };

  return (
    <DashboardLayout>
      {isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/screens/page4.html"
        title="Dashboard Overview"
        onLoad={handleIframeLoad}
        className="flex-1 min-h-0 w-full rounded-2xl border-none shadow-sm ring-1 ring-border/50 bg-transparent relative z-10"
        sandbox="allow-scripts allow-same-origin"
      />
    </DashboardLayout>
  );
}
