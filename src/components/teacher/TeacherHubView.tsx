import React, { useState } from "react";
import { AppState, LorRequest, RosterStudent } from "../../lib/store";
import { generateTeacherRecommendationLetter } from "../../services/gemini";
import { 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Clock, 
  BookOpen, 
  Award, 
  Copy, 
  Download, 
  FileText, 
  UserCheck, 
  Check,
  Send
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
}

export function TeacherHubView({ appState, onUpdateState }: Props) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(appState.rosterStudents[0]?.id || "");
  const [courseTaught, setCourseTaught] = useState("AP Computer Science & Computational Logic");
  const [gradeEarned, setGradeEarned] = useState("A+ (98%)");
  const [targetUniversity, setTargetUniversity] = useState("Technical University of Munich (TUM)");
  const [targetProgram, setTargetProgram] = useState("M.Sc. in Informatics & Software Systems");
  const [teacherNotes, setTeacherNotes] = useState(
    "Led group term project on graph algorithms. Consistently helped peers in laboratory sessions. Exceptional work ethic."
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [draftContent, setDraftContent] = useState<string>("");
  const [activeLorId, setActiveLorId] = useState<string | null>(null);

  const selectedStudent = appState.rosterStudents.find((s) => s.id === selectedStudentId) || appState.rosterStudents[0];
  const pendingRequests = appState.lorRequests.filter((l) => l.status !== "submitted");
  const submittedRequests = appState.lorRequests.filter((l) => l.status === "submitted");

  const handleSelectPendingLor = (lor: LorRequest) => {
    setActiveLorId(lor.id);
    setSelectedStudentId(lor.studentId);
    setCourseTaught(lor.subject);
    setTargetUniversity(lor.targetUniversity);
    if (lor.letterContent) {
      setDraftContent(lor.letterContent);
    }
    toast.info(`Loaded LOR request for ${lor.studentName}`);
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    toast.info("Generating faculty recommendation letter with Gemini AI...", { duration: 3000 });

    try {
      const generated = await generateTeacherRecommendationLetter(appState.geminiApiKey, {
        teacherName: "Dr. Marcus Smith",
        teacherTitle: "Chair of Computer Science & Senior Faculty",
        studentName: selectedStudent.name,
        courseName: courseTaught,
        gradeEarned,
        targetUniversity,
        targetProgram,
        qualitativeNotes: teacherNotes,
        studentVerifiedGpa: selectedStudent.verifiedGpa || selectedStudent.gpa
      });

      setDraftContent(generated);
      toast.success("Academic recommendation draft generated!");
    } catch (e: any) {
      toast.error(`Generation error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitOfficialLor = () => {
    if (!draftContent.trim()) {
      toast.error("Please draft or enter the letter text first.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];
    let updatedRequests = [...appState.lorRequests];

    if (activeLorId) {
      updatedRequests = updatedRequests.map((r) =>
        r.id === activeLorId
          ? { ...r, status: "submitted", letterContent: draftContent, submittedDate: now }
          : r
      );
    } else {
      const newLor: LorRequest = {
        id: `lor-${Date.now()}`,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        teacherId: "teacher-marcus",
        teacherName: "Dr. Marcus Smith",
        subject: courseTaught,
        targetUniversity,
        status: "submitted",
        letterContent: draftContent,
        requestedDate: now,
        submittedDate: now
      };
      updatedRequests.unshift(newLor);
    }

    const updated = {
      ...appState,
      lorRequests: updatedRequests
    };

    onUpdateState(updated);
    toast.success(`Official recommendation letter for ${selectedStudent.name} submitted & signed!`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Teacher Banner */}
      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Teacher & Faculty Writing Portal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Academic Recommendation Letter (LOR) Desk
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
              Write, AI-draft, and officially certify recommendation letters for students you have taught. Grounded directly in course performance and verified records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-right">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Pending Requests</span>
              <p className="text-xl font-black text-amber-600">{pendingRequests.length}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-right">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Signed & Submitted</span>
              <p className="text-xl font-black text-emerald-600">{submittedRequests.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Selection & Input Parameters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Incoming LOR Requests Queue */}
          <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Active LOR Requests ({pendingRequests.length})
              </span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => handleSelectPendingLor(req)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                    activeLorId === req.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border/70 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-foreground">{req.studentName}</strong>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate">{req.subject}</p>
                  <p className="text-[10px] text-primary mt-0.5">Target: {req.targetUniversity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form: Select Student & Course Details */}
          <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <PenTool className="w-4 h-4 text-primary" />
              Recommendation Parameters
            </h3>

            <div>
              <label className="text-xs font-semibold text-foreground">Student Taught</label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setActiveLorId(null);
                }}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
              >
                {appState.rosterStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (GPA: {s.verifiedGpa || s.gpa} • {s.grade})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Course Taught</label>
                <input
                  type="text"
                  value={courseTaught}
                  onChange={(e) => setCourseTaught(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Grade Earned</label>
                <input
                  type="text"
                  value={gradeEarned}
                  onChange={(e) => setGradeEarned(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Target University</label>
              <input
                type="text"
                value={targetUniversity}
                onChange={(e) => setTargetUniversity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Target Program / Degree</label>
              <input
                type="text"
                value={targetProgram}
                onChange={(e) => setTargetProgram(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Teacher's Anecdotes & Observations (Grounded Context)
              </label>
              <textarea
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                rows={3}
                placeholder="Mention class project, intellectual strengths, peer collaboration..."
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Generating Grounded LOR...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Draft Letter with Gemini AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Letter Editor & Official Submission */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm min-h-[640px] flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Recommendation Letter for {selectedStudent.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Target: {targetUniversity} • {targetProgram}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(draftContent);
                    toast.success("Letter copied to clipboard!");
                  }}
                  disabled={!draftContent}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-40"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>

                <button
                  onClick={handleSubmitOfficialLor}
                  disabled={!draftContent}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  Sign & Submit LOR
                </button>
              </div>
            </div>

            {/* Letter Text Editor */}
            <div className="flex-1 py-4 flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Official Letter Text (Review & Edit before signing)
              </label>
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Click 'Draft Letter with Gemini AI' on the left, or write your custom academic recommendation here..."
                className="flex-1 w-full rounded-2xl border border-input bg-muted/20 p-4 text-xs sm:text-sm text-foreground leading-relaxed font-sans focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[440px]"
              />
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Signatory: Dr. Marcus Smith (Faculty Endorsement)</span>
              <span>Word Count: {draftContent ? draftContent.trim().split(/\s+/).length : 0} words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
