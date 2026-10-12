import React, { useState } from "react";
import { StudentProfile, AppState, UserRole } from "../../lib/store";
import { testGeminiApiKey } from "../../services/gemini";
import { 
  Key, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Save, 
  User, 
  Globe2, 
  DollarSign, 
  GraduationCap,
  Building2,
  PenTool,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  profile: StudentProfile;
  geminiApiKey: string;
  activeRole?: UserRole;
  onSaveProfile: (profile: StudentProfile) => void;
  onSaveApiKey: (key: string) => void;
}

export function SettingsView({
  profile,
  geminiApiKey,
  activeRole = "student",
  onSaveProfile,
  onSaveApiKey
}: Props) {
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");

  // Profile Form State
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [nationality, setNationality] = useState(profile.nationality);
  const [intendedMajor, setIntendedMajor] = useState(profile.intendedMajor);
  const [annualBudget, setAnnualBudget] = useState(profile.annualBudgetUsd);
  const [selfReportedGpa, setSelfReportedGpa] = useState(profile.selfReportedGpa);
  const [academicNotes, setAcademicNotes] = useState(profile.academicNotes);

  const handleTestKey = async () => {
    if (!apiKeyInput.trim()) {
      toast.error("Please enter a Gemini API Key first.");
      return;
    }
    setIsTesting(true);
    setTestStatus("idle");
    try {
      const ok = await testGeminiApiKey(apiKeyInput.trim());
      if (ok) {
        setTestStatus("success");
        onSaveApiKey(apiKeyInput.trim());
        toast.success("Gemini API Key validated and connected successfully!");
      } else {
        setTestStatus("error");
        toast.error("Invalid API Key or quota exceeded.");
      }
    } catch (e: any) {
      setTestStatus("error");
      toast.error(`Connection failed: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name,
      email,
      nationality,
      intendedMajor,
      annualBudgetUsd: annualBudget,
      selfReportedGpa: Number(selfReportedGpa),
      academicNotes
    });
    toast.success("Profile settings updated!");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings & Integrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your Gemini AI credentials, profile parameters, and study abroad preferences.
        </p>
      </div>

      {/* GEMINI API KEY INTEGRATION CARD */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Google Gemini API Key</h3>
              <p className="text-xs text-muted-foreground">
                Powers credential verification, grounded essay drafting, and dynamic university matching.
              </p>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
          >
            Get Free Key at Google AI Studio
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">API Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestStatus("idle");
                }}
                placeholder="AIzaSy..."
                className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleTestKey}
              disabled={isTesting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50 shrink-0"
            >
              {isTesting ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Save & Test
                </>
              )}
            </button>
          </div>

          {testStatus === "success" && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              <Check className="w-4 h-4" />
              Connected & Verified with Gemini API
            </div>
          )}

          {testStatus === "error" && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-semibold pt-1">
              <AlertCircle className="w-4 h-4" />
              Connection failed. Please verify the API key string.
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground">💡 How to configure your Gemini API Key:</p>
          <p>
            1. <strong>In the App:</strong> Paste your key in the box above and click <strong>"Save & Test"</strong>. It is stored securely in your browser session.
          </p>
          <p>
            2. <strong>In your Project file:</strong> You can also put it directly in the file <code>.env</code> in your root folder as:
            <br />
            <code className="text-primary font-bold">VITE_GEMINI_API_KEY=your_gemini_key_here</code>
          </p>
        </div>
      </div>

      {/* ROLE-SPECIFIC IDENTITY & PERMISSION SETTINGS */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-foreground">
              {activeRole === "student" ? "Academic & Personal Profile" : `${activeRole.toUpperCase()} Account Credentials & Affiliation`}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeRole === "student"
                ? "Configure your personal study abroad criteria, degree targets, and GPA."
                : `Institutional parameters assigned to your ${activeRole} account. (Single Role Policy Active)`}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {activeRole} Role
          </span>
        </div>

        <form onSubmit={handleSaveProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Intended Major</label>
              <input
                type="text"
                value={intendedMajor}
                onChange={(e) => setIntendedMajor(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Annual Budget (USD)</label>
              <input
                type="number"
                value={annualBudget}
                onChange={(e) => setAnnualBudget(Number(e.target.value))}
                className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Self-Reported GPA (out of 4.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={selfReportedGpa}
                onChange={(e) => setSelfReportedGpa(Number(e.target.value))}
                className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">
              Academic Background Notes (Used for Grounded AI Prompting)
            </label>
            <textarea
              value={academicNotes}
              onChange={(e) => setAcademicNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Undergrad thesis on neural networks, 2 years research assistant, 1 paper published..."
              className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
