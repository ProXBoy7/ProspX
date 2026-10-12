import React, { useState } from "react";
import { StudentProfile, EvidenceCertificate, ActivityItem, UserRole } from "../../lib/store";
import { University, UNIVERSITIES_DATABASE } from "../../data/universities";
import { 
  generateGroundedEssay, 
  generateEssayWritingHints, 
  reviewAndCritiqueEssay,
  WritingHintsResponse,
  EssayCritiqueResult
} from "../../services/gemini";
import { 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Copy, 
  Check, 
  FileText, 
  Award, 
  AlertTriangle, 
  GraduationCap, 
  RefreshCw,
  Download,
  Bot,
  Zap,
  CheckCircle2,
  PenTool,
  ShieldAlert,
  Lightbulb,
  Search,
  Trophy,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  profile: StudentProfile;
  certificates: EvidenceCertificate[];
  activities?: ActivityItem[];
  geminiApiKey: string;
  activeRole?: UserRole;
}

export function GroundedAIAssistantView({
  profile,
  certificates,
  activities = [],
  geminiApiKey,
  activeRole = "student"
}: Props) {
  const verifiedCerts = certificates.filter((c) => c.verificationStatus === "verified");

  // Main Mode: 1 = Write Grounded Draft, 2 = AI Writing Hints & Coach, 3 = Essay Review & Critique
  const [activeMode, setActiveMode] = useState<"write" | "hints" | "review">("write");

  // Common Selection
  const [selectedUniId, setSelectedUniId] = useState<string>(UNIVERSITIES_DATABASE[0]?.id || "");
  const [programName, setProgramName] = useState(
    activeRole === "teacher" 
      ? "Academic Recommendation for Honors/Graduate Admissions" 
      : "M.Sc. in Computer Science & Artificial Intelligence"
  );

  // Mode 1: Write Essay State
  const [essayType, setEssayType] = useState<"Statement of Purpose (SOP)" | "Personal Statement" | "Diversity Essay" | "Letter of Recommendation Request">(
    activeRole === "teacher" ? "Letter of Recommendation Request" : "Statement of Purpose (SOP)"
  );
  const [wordCount, setWordCount] = useState<number>(activeRole === "teacher" ? 500 : 650);
  const [userStoryNotes, setUserStoryNotes] = useState(
    activeRole === "teacher"
      ? "Teacher Course Observations: Student achieved A+ in Advanced Algorithms. Demonstrated independent research curiosity and peer leadership."
      : ""
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEssay, setGeneratedEssay] = useState<string>("");
  const [citations, setCitations] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Mode 2: Writing Coach & Hints State
  const [coachDraftNotes, setCoachDraftNotes] = useState(
    "I want to write about my interest in neural network architectures and competitive programming, but need guidance on structuring the story and including my contest crisis."
  );
  const [isLoadingHints, setIsLoadingHints] = useState(false);
  const [hintsResult, setHintsResult] = useState<WritingHintsResponse | null>(null);

  // Mode 3: Essay Review & Critique State
  const [studentSelfWrittenEssay, setStudentSelfWrittenEssay] = useState(
    `STATEMENT OF PURPOSE: APPLICATION FOR MASTER'S IN COMPUTER SCIENCE\n\nTo the Members of the Admissions Committee,\n\nI am writing to express my earnest enthusiasm for the graduate program in Computer Science at your institution. Ever since secondary school, I have possessed a relentless passion for computational systems and algorithmic theory. I achieved consistent honors throughout my undergraduate career.\n\nOutside of coursework, I participated in several competitive programming events and worked on web platforms. I believe that studying under your distinguished faculty will provide me with the advanced knowledge required to become a research scientist.\n\nThank you for considering my application.\n\nSincerely,\n${profile.name}`
  );
  const [isReviewing, setIsReviewing] = useState(false);
  const [critiqueResult, setCritiqueResult] = useState<EssayCritiqueResult | null>(null);

  const selectedUni = UNIVERSITIES_DATABASE.find((u) => u.id === selectedUniId) || UNIVERSITIES_DATABASE[0];

  const PRESET_PROMPTS = [
    { title: "Standard Academic SOP", count: 650, type: "Statement of Purpose (SOP)" as const },
    { title: "Personal Statement & Resilience", count: 500, type: "Personal Statement" as const },
    { title: "Faculty Recommendation Request", count: 400, type: "Letter of Recommendation Request" as const },
    { title: "Diversity & Global Perspective", count: 500, type: "Diversity Essay" as const },
  ];

  // Handler: Mode 1 - Generate Grounded Draft
  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Generating grounded draft with Gemini AI...", { duration: 3000 });

    try {
      const res = await generateGroundedEssay(geminiApiKey, {
        targetUniversity: selectedUni,
        programName,
        essayType,
        wordCountTarget: wordCount,
        profile,
        verifiedCertificates: verifiedCerts,
        activities,
        userNotesAndStory: userStoryNotes
      });

      setGeneratedEssay(res.essayText);
      setCitations(res.citations);
      if (res.warnings) {
        toast.warning(res.warnings, { duration: 5000 });
      } else {
        toast.success("Essay generated with strict factual grounding & memorable moments!");
      }
    } catch (err: any) {
      toast.error(`Generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Mode 2 - Generate Writing Hints
  const handleGetHints = async () => {
    setIsLoadingHints(true);
    toast.info("Analyzing your activities & generating customized writing hints...", { duration: 2500 });
    try {
      const res = await generateEssayWritingHints(geminiApiKey, {
        targetUniversity: selectedUni,
        programName,
        studentPromptOrDraft: coachDraftNotes,
        profile,
        activities,
        verifiedCertificates: verifiedCerts
      });
      setHintsResult(res);
      toast.success("Custom writing hints generated!");
    } catch (err: any) {
      toast.error(`Hints error: ${err.message}`);
    } finally {
      setIsLoadingHints(false);
    }
  };

  // Handler: Mode 3 - Review & Critique Self-Written Essay
  const handleReviewEssay = async () => {
    if (!studentSelfWrittenEssay.trim() || studentSelfWrittenEssay.trim().length < 50) {
      toast.error("Please enter a self-written essay of at least 50 characters to review.");
      return;
    }

    setIsReviewing(true);
    toast.info("Admissions Committee AI analyzing draft against university rubric...", { duration: 3000 });
    try {
      const res = await reviewAndCritiqueEssay(geminiApiKey, {
        essayText: studentSelfWrittenEssay,
        targetUniversity: selectedUni,
        programName,
        profile,
        activities,
        verifiedCertificates: verifiedCerts
      });
      setCritiqueResult(res);
      toast.success(`Essay analyzed! Readiness Score: ${res.overallScore}/100`);
    } catch (err: any) {
      toast.error(`Review error: ${err.message}`);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = activeMode === "write" ? generatedEssay : studentSelfWrittenEssay;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedUni.shortName}_${essayType.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded essay file!");
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Gemini 2.5 Multi-Modal Admissions Suite
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            AI Admissions & Essay Lab
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Complete 3-in-1 admissions essay companion: draft grounded statements, receive real-time writing hints based on your memorable moments, and get detailed admissions committee critiques on self-written drafts.
          </p>
        </div>

        {/* Anti-Hallucination Guardrail Badge */}
        <div className="flex items-center gap-3 p-2 bg-card/60 rounded-full border border-border backdrop-blur-md shadow-xs">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold text-foreground pr-3">
            Anti-Hallucination Guardrail Active
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs (3 Modes) */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex p-1.5 bg-card/70 backdrop-blur-xl rounded-full border border-border shadow-xs">
          <button
            onClick={() => setActiveMode("write")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeMode === "write"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Write Grounded Essay</span>
          </button>

          <button
            onClick={() => setActiveMode("hints")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeMode === "hints"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <span>2. Writing Coach & Hints</span>
          </button>

          <button
            onClick={() => setActiveMode("review")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeMode === "review"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>3. Check & Critique Self-Written Essay</span>
          </button>
        </div>
      </div>

      {/* Target University & Program Selector Bar */}
      <div className="glass-panel p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Target University (QS Ranked)
          </label>
          <select
            value={selectedUniId}
            onChange={(e) => setSelectedUniId(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card/80 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
          >
            {UNIVERSITIES_DATABASE.map((u) => (
              <option key={u.id} value={u.id}>
                #{u.qsRank} {u.name} ({u.country} {u.flag})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Target Academic Program
          </label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card/80 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: WRITE GROUNDED ESSAY */}
      {/* ========================================================================= */}
      {activeMode === "write" && (
        <div className="space-y-6">
          {/* Quick Presets */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs font-bold text-muted-foreground shrink-0 uppercase tracking-wider">
              Quick Presets:
            </span>
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setEssayType(p.type);
                  setWordCount(p.count);
                  toast.info(`Selected preset: ${p.title}`);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  essayType === p.type && wordCount === p.count
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "glass-panel text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Parameters & Grounding Context */}
            <div className="lg:col-span-5 space-y-5">
              {/* Grounded Evidence & Activities Panel */}
              <div className="glass-panel p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Grounded Credentials & Activities
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                    Zero Hallucination
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  The AI strictly grounds your draft in these verified certificates and extracurricular memorable moments:
                </p>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {verifiedCerts.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-primary">{c.type}:</span>
                        <span className="text-foreground truncate">{c.title}</span>
                      </div>
                      <span className="font-black text-emerald-600 shrink-0 ml-2">
                        {c.scores.overall || c.scores.gpa}
                      </span>
                    </div>
                  ))}

                  {activities.map((a) => (
                    <div key={a.id} className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-700 dark:text-amber-400">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          {a.title}
                        </span>
                        <span className="text-[10px]">{a.roleOrAward}</span>
                      </div>
                      {a.memorableMoments && (
                        <p className="text-[11px] text-muted-foreground italic mt-1 line-clamp-2">
                          "{a.memorableMoments}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Options */}
              <div className="glass-panel p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Essay Parameters</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Document Type</label>
                    <select
                      value={essayType}
                      onChange={(e) => setEssayType(e.target.value as any)}
                      className="mt-1 w-full rounded-2xl border border-input bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Statement of Purpose (SOP)">Statement of Purpose (SOP)</option>
                      <option value="Personal Statement">Personal Statement</option>
                      <option value="Diversity Essay">Diversity Essay</option>
                      <option value="Letter of Recommendation Request">Letter of Recommendation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Target Word Count</label>
                    <select
                      value={wordCount}
                      onChange={(e) => setWordCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-2xl border border-input bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value={400}>400 words (Concise)</option>
                      <option value={500}>500 words (Standard)</option>
                      <option value={650}>650 words (Comprehensive SOP)</option>
                      <option value={800}>800 words (In-depth Research)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Additional Personal Stories / Specific Laboratory Interests
                  </label>
                  <textarea
                    rows={3}
                    value={userStoryNotes}
                    onChange={(e) => setUserStoryNotes(e.target.value)}
                    placeholder="e.g. Focus on Professor Schmidt's robotics lab, mention my desire to conduct post-study research on autonomous systems..."
                    className="mt-1 w-full rounded-2xl border border-input bg-card px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                  <span>{isGenerating ? "Generating Grounded Draft..." : "Generate Grounded Essay"}</span>
                </button>
              </div>
            </div>

            {/* Right Output Panel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-panel p-6 flex flex-col min-h-[560px]">
                <div className="flex items-center justify-between pb-4 border-b border-border/80 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">Generated Document</span>
                    {generatedEssay && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20">
                        {generatedEssay.split(/\s+/).length} words
                      </span>
                    )}
                  </div>

                  {generatedEssay && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(generatedEssay)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition text-foreground"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition text-foreground"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>
                  )}
                </div>

                {generatedEssay ? (
                  <div className="mt-4 flex-1">
                    <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed bg-card/40 p-4 rounded-2xl border border-border/60 max-h-[600px] overflow-y-auto">
                      {generatedEssay}
                    </pre>

                    {citations.length > 0 && (
                      <div className="mt-4 p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                          Verified Grounded Evidence Incorporated:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {citations.map((c, i) => (
                            <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-muted-foreground">
                    <FileText className="w-12 h-12 opacity-40 mb-3" />
                    <strong className="text-foreground text-sm font-bold">No Essay Generated Yet</strong>
                    <p className="text-xs max-w-sm mt-1">
                      Configure your parameters and click "Generate Grounded Essay" to create a bespoke, factually verified statement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: AI WRITING COACH & HINTS */}
      {/* ========================================================================= */}
      {activeMode === "hints" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Student Drafting Canvas */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Your Essay Notes or Outline</h3>
                  <p className="text-xs text-muted-foreground">
                    Describe your thesis or paste your rough paragraphs. The AI will inspect your memorable moments and give you step-by-step guidance.
                  </p>
                </div>
              </div>

              <textarea
                rows={9}
                value={coachDraftNotes}
                onChange={(e) => setCoachDraftNotes(e.target.value)}
                placeholder="Write your thoughts or paste what you have so far..."
                className="w-full rounded-2xl border border-input bg-card p-3.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
              />

              <button
                onClick={handleGetHints}
                disabled={isLoadingHints}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-amber-600 text-white px-6 py-3 text-xs font-bold shadow-md hover:bg-amber-700 active:scale-[0.99] transition disabled:opacity-50"
              >
                <Lightbulb className={`w-4 h-4 ${isLoadingHints ? "animate-spin" : ""}`} />
                <span>{isLoadingHints ? "Analyzing Story & Moments..." : "Generate AI Writing Hints"}</span>
              </button>
            </div>

            {/* Extracurriculars Available for Insertion */}
            <div className="glass-panel p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Memorable Moments Available in Your Portfolio:
              </span>
              <div className="space-y-2">
                {activities.map((a) => (
                  <div key={a.id} className="p-3 rounded-2xl bg-card border border-border text-xs flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-foreground font-semibold">{a.title}</strong>
                      <span className="text-muted-foreground text-[10px] ml-2">({a.roleOrAward})</span>
                      <p className="text-[11px] text-muted-foreground italic mt-0.5">"{a.memorableMoments}"</p>
                    </div>
                    <button
                      onClick={() => {
                        setCoachDraftNotes((prev) => prev + `\n\n[Included Moment from ${a.title}]: ${a.memorableMoments}`);
                        toast.success(`Appended moment from ${a.title}!`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold shrink-0 hover:bg-primary hover:text-white transition"
                    >
                      + Insert
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Generated Strategic Hints */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-6 min-h-[500px]">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI Writing Strategy & Narrative Hints
                </span>
                {hintsResult && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    {hintsResult.hints.length} Actionable Hints
                  </span>
                )}
              </div>

              {hintsResult ? (
                <div className="mt-4 space-y-4">
                  {hintsResult.targetFocus && (
                    <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs">
                      <strong className="text-primary font-bold block mb-0.5">Admissions Strategy for {selectedUni.shortName}:</strong>
                      <p className="text-foreground">{hintsResult.targetFocus}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {hintsResult.hints.map((hint, hIdx) => (
                      <div key={hIdx} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-foreground">{hint.section}</span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Step {hIdx + 1}</span>
                        </div>

                        <p className="text-xs text-foreground/90">{hint.suggestion}</p>

                        {hint.recommendedMemorableMoment && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                            <span className="font-bold text-[10px] block uppercase">Recommended Moment to Weave In:</span>
                            <p className="italic mt-0.5 text-[11px]">"{hint.recommendedMemorableMoment}"</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                          <span>Angle: <strong>{hint.suggestedPromptAngle}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 text-muted-foreground h-full">
                  <Lightbulb className="w-12 h-12 opacity-30 mb-3" />
                  <strong className="text-foreground text-sm font-bold">No Hints Requested Yet</strong>
                  <p className="text-xs max-w-sm mt-1">
                    Click "Generate AI Writing Hints" to receive customized suggestions on which memorable moments to include in each section.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: CHECK & CRITIQUE SELF-WRITTEN ESSAY */}
      {/* ========================================================================= */}
      {activeMode === "review" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Student's Self-Written Essay Input */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Paste Self-Written Essay</h3>
                  <p className="text-xs text-muted-foreground">
                    Our AI Admissions Reviewer will evaluate your draft against {selectedUni.shortName}'s rigorous standards.
                  </p>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {studentSelfWrittenEssay.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                rows={14}
                value={studentSelfWrittenEssay}
                onChange={(e) => setStudentSelfWrittenEssay(e.target.value)}
                placeholder="Paste your full essay draft here..."
                className="w-full rounded-2xl border border-input bg-card p-3.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none font-sans"
              />

              <button
                onClick={handleReviewEssay}
                disabled={isReviewing}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-3.5 text-xs font-bold shadow-md hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50"
              >
                <CheckCircle2 className={`w-4 h-4 ${isReviewing ? "animate-spin" : ""}`} />
                <span>{isReviewing ? "Analyzing Admissions Rubric..." : "Analyze & Critique My Essay"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Full Diagnostic Critique Report */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-6 min-h-[560px]">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Admissions Committee Diagnostic Report
                </span>
                {critiqueResult && (
                  <span className="text-xs font-black text-emerald-600 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                    Score: {critiqueResult.overallScore}/100
                  </span>
                )}
              </div>

              {critiqueResult ? (
                <div className="mt-4 space-y-5">
                  {/* Verdict & Overall Score */}
                  <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Verdict for {selectedUni.shortName}</span>
                      <h4 className="text-base font-extrabold text-foreground">{critiqueResult.admissionsVerdict}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-emerald-600">{critiqueResult.overallScore}</span>
                      <span className="text-xs text-muted-foreground font-bold"> / 100</span>
                    </div>
                  </div>

                  {/* Rubric Breakdown */}
                  <div>
                    <h5 className="text-xs font-bold uppercase text-muted-foreground mb-2">Rubric Evaluation:</h5>
                    <div className="space-y-2">
                      {critiqueResult.rubricBreakdown.map((r, rIdx) => (
                        <div key={rIdx} className="p-3 rounded-xl bg-card border border-border text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-foreground">{r.category}</strong>
                            <span className="font-bold text-emerald-600">{r.score} / {r.maxScore}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 mb-1.5">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full"
                              style={{ width: `${(r.score / r.maxScore) * 100}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">{r.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missed Opportunities to include memorable moments */}
                  {critiqueResult.missedOpportunities && critiqueResult.missedOpportunities.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Missed Portfolio Opportunities:
                      </span>
                      <ul className="text-xs text-foreground/90 space-y-1 list-disc list-inside">
                        {critiqueResult.missedOpportunities.map((m, mIdx) => (
                          <li key={mIdx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold block mb-1">Key Strengths:</strong>
                      <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                        {critiqueResult.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-red-500/5 border border-red-500/20 text-xs">
                      <strong className="text-red-700 dark:text-red-400 font-bold block mb-1">Areas to Refine:</strong>
                      <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                        {critiqueResult.weaknesses.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actionable Line Revisions */}
                  {critiqueResult.actionableLineRevisions && critiqueResult.actionableLineRevisions.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase text-muted-foreground">Recommended Line Revisions:</h5>
                      {critiqueResult.actionableLineRevisions.map((rev, revIdx) => (
                        <div key={revIdx} className="p-3 rounded-2xl bg-card border border-border text-xs space-y-1">
                          <p className="line-through text-red-500/80">"{rev.originalExcerpt}"</p>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">"{rev.revisedSuggestion}"</p>
                          <p className="text-[10px] text-muted-foreground italic">Reason: {rev.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 text-muted-foreground h-full">
                  <CheckCircle2 className="w-12 h-12 opacity-30 mb-3" />
                  <strong className="text-foreground text-sm font-bold">No Diagnostic Run Yet</strong>
                  <p className="text-xs max-w-sm mt-1">
                    Paste your self-written essay on the left and click "Analyze & Critique My Essay" to receive an admissions committee report.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
