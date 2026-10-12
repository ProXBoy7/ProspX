import React, { useState } from "react";
import { AppState, RosterStudent, EvidenceCertificate, LorRequest, CertificateType } from "../../lib/store";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  FileCheck, 
  UploadCloud, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Plus, 
  GraduationCap, 
  ExternalLink,
  Award,
  Search,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
}

export function CounselorHubView({ appState, onUpdateState }: Props) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(appState.rosterStudents[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStudentId, setUploadStudentId] = useState(appState.rosterStudents[0]?.id || "");
  const [certType, setCertType] = useState<CertificateType>("Transcript");
  const [certTitle, setCertTitle] = useState("Official High School Academic Transcript");
  const [verifiedGpaInput, setVerifiedGpaInput] = useState("3.85");
  const [certNotes, setCertNotes] = useState("Verified by High School Academic Registrar. Unweighted GPA.");

  // LOR Request Modal state
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);
  const [lorStudentId, setLorStudentId] = useState(appState.rosterStudents[0]?.id || "");
  const [teacherNameInput, setTeacherNameInput] = useState("Dr. Marcus Smith");
  const [subjectInput, setSubjectInput] = useState("AP Computer Science & Algorithms");
  const [targetUniInput, setTargetUniInput] = useState("Technical University of Munich (TUM)");

  const filteredStudents = appState.rosterStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.targetMajor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStudent = appState.rosterStudents.find((s) => s.id === selectedStudentId) || appState.rosterStudents[0];
  const studentCerts = appState.certificates.filter((c) => !c.studentId || c.studentId === selectedStudent?.id);
  const studentLors = appState.lorRequests.filter((l) => l.studentId === selectedStudent?.id);

  // Counselor submits verified certificate and sets official GPA
  const handleCounselorUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const gpaNum = parseFloat(verifiedGpaInput);

    const newCert: EvidenceCertificate = {
      id: `cert-${Date.now()}`,
      studentId: uploadStudentId,
      title: certTitle,
      type: certType,
      issuer: "High School Counselor Office (Official Endorsement)",
      credentialId: `COUNSELOR-VERIF-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: new Date().toISOString().split("T")[0],
      verificationStatus: "verified",
      verifiedAt: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      verificationHash: "0x" + Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      scores: {
        gpa: `${verifiedGpaInput} / 4.0`,
        overall: `Verified GPA ${verifiedGpaInput}`,
        breakdown: { "Academic Rigor": "Honors / AP", "Counselor Audit": "Approved" }
      },
      rawTextNotes: certNotes,
      uploadedBy: "counselor"
    };

    // Update roster student GPA
    const updatedRoster = appState.rosterStudents.map((s) => {
      if (s.id === uploadStudentId) {
        return {
          ...s,
          gpa: !isNaN(gpaNum) ? gpaNum : s.gpa,
          verifiedGpa: !isNaN(gpaNum) ? gpaNum : s.gpa,
          certificatesCount: s.certificatesCount + 1
        };
      }
      return s;
    });

    const updated = {
      ...appState,
      certificates: [newCert, ...appState.certificates],
      rosterStudents: updatedRoster
    };

    onUpdateState(updated);
    setIsUploadModalOpen(false);
    toast.success("Official certificate and audited GPA saved to student profile!");
  };

  // Counselor dispatches LOR request to a teacher
  const handleDispatchLor = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = appState.rosterStudents.find((s) => s.id === lorStudentId);

    const newLor: LorRequest = {
      id: `lor-${Date.now()}`,
      studentId: lorStudentId,
      studentName: targetStudent?.name || "Student",
      teacherId: "teacher-assigned",
      teacherName: teacherNameInput,
      subject: subjectInput,
      targetUniversity: targetUniInput,
      status: "requested",
      requestedDate: new Date().toISOString().split("T")[0],
      studentNotes: `Official request initiated by School Counselor Office for ${targetUniInput}.`
    };

    const updated = {
      ...appState,
      lorRequests: [newLor, ...appState.lorRequests]
    };

    onUpdateState(updated);
    setIsLorModalOpen(false);
    toast.success(`Recommendation letter request dispatched to ${teacherNameInput}!`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                School Counselor Command Portal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Institutional Student Roster & Credential Certification
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
              Upload and officially certify student GPA transcripts, dispatch teacher recommendation letters (LORs), and audit international university admissions portfolios.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              Certify Student Transcript / GPA
            </button>
            <button
              onClick={() => setIsLorModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/60 dark:bg-card border border-white/80 dark:border-border text-foreground hover:bg-white/90 font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Mail className="w-4 h-4 text-amber-600" />
              Request Teacher LOR
            </button>
          </div>
        </div>

        {/* Quick Stats Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/40 dark:border-white/10">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Managed Students</span>
            <p className="text-2xl font-black text-foreground mt-0.5">{appState.rosterStudents.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Verified Credentials</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{appState.certificates.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Teacher LORs Dispatched</span>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{appState.lorRequests.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Applications</span>
            <p className="text-2xl font-black text-primary mt-0.5">{appState.applications.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Roster List */}
        <div className="lg:col-span-5 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              School Student Roster
            </h3>
            <span className="text-xs text-muted-foreground font-semibold">
              {filteredStudents.length} Students
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name or target major..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredStudents.map((student) => {
              const isSelected = student.id === selectedStudentId;

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 shadow-sm"
                      : "border-border/70 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{student.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{student.grade}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Verified GPA</span>
                      <p className="text-sm font-extrabold text-emerald-600">
                        {student.verifiedGpa ? `${student.verifiedGpa} / 4.0` : `${student.gpa} (Pending)`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/40">
                    <span className="truncate pr-2 font-medium">{student.targetMajor}</span>
                    <span className="shrink-0 font-bold text-primary">
                      {student.applicationsCount} Applications
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Student Portfolio & Actions */}
        <div className="lg:col-span-7 space-y-5">
          {selectedStudent && (
            <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-6">
              {/* Student Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{selectedStudent.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Counselor Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedStudent.email} • Target: {selectedStudent.targetMajor}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setUploadStudentId(selectedStudent.id);
                      setIsUploadModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Certificate
                  </button>
                  <button
                    onClick={() => {
                      setLorStudentId(selectedStudent.id);
                      setIsLorModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Request LOR
                  </button>
                </div>
              </div>

              {/* Counselor Notes */}
              {selectedStudent.counselorNotes && (
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                  <span className="font-bold text-foreground">Counselor Evaluation Notes:</span>
                  <p className="text-muted-foreground mt-0.5">{selectedStudent.counselorNotes}</p>
                </div>
              )}

              {/* Verified Documents in Student Dossier */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  Verified Credentials in Student File ({studentCerts.length})
                </h4>

                <div className="space-y-2">
                  {studentCerts.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-3 border border-dashed rounded-xl text-center">
                      No verified certificates uploaded yet for this student.
                    </p>
                  ) : (
                    studentCerts.map((c) => (
                      <div key={c.id} className="p-3 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                              {c.type}
                            </span>
                            <span className="font-bold text-foreground">{c.title}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Issuer: {c.issuer} • ID: {c.credentialId}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-emerald-600">
                            {c.scores.overall || c.scores.gpa}
                          </span>
                          <p className="text-[10px] text-muted-foreground">
                            {c.uploadedBy === "counselor" ? "Counselor Certified" : "Student Uploaded"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recommendation Letters (LOR) Status */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-500" />
                  Teacher Letters of Recommendation ({studentLors.length})
                </h4>

                <div className="space-y-2.5">
                  {studentLors.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-3 border border-dashed rounded-xl text-center">
                      No teacher recommendation letters requested yet.
                    </p>
                  ) : (
                    studentLors.map((lor) => (
                      <div key={lor.id} className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-foreground">{lor.teacherName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            lor.status === "submitted" 
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}>
                            {lor.status}
                          </span>
                        </div>
                        <p className="text-xs text-primary font-medium">{lor.subject}</p>
                        <p className="text-[11px] text-muted-foreground">Target: {lor.targetUniversity}</p>
                        {lor.letterContent && (
                          <div className="mt-2 p-2 rounded-xl bg-muted/40 text-[11px] text-muted-foreground max-h-24 overflow-y-auto">
                            {lor.letterContent.substring(0, 180)}...
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Counselor Upload & Verify Certificate Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-foreground">Counselor Transcript & GPA Certification</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Officially certify student academic records and authenticate GPA for international admissions.
            </p>

            <form onSubmit={handleCounselorUpload} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground">Select Student</label>
                <select
                  value={uploadStudentId}
                  onChange={(e) => setUploadStudentId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {appState.rosterStudents.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Document Type</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["Transcript", "IELTS", "TOEFL", "SAT", "Diploma"] as CertificateType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCertType(t)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        certType === t
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Document Title</label>
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Audited GPA (0.0 - 4.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={verifiedGpaInput}
                    onChange={(e) => setVerifiedGpaInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Counselor Endorsement Notes</label>
                <textarea
                  value={certNotes}
                  onChange={(e) => setCertNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md hover:bg-amber-700 transition-colors"
                >
                  Certify & Lock GPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counselor Request Teacher LOR Modal */}
      {isLorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-foreground">Dispatch Teacher Recommendation Request</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Sends an official LOR prompt to a faculty member for a specific student's application.
            </p>

            <form onSubmit={handleDispatchLor} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground">Student</label>
                <select
                  value={lorStudentId}
                  onChange={(e) => setLorStudentId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {appState.rosterStudents.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.targetMajor})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Teacher Name & Department</label>
                <input
                  type="text"
                  value={teacherNameInput}
                  onChange={(e) => setTeacherNameInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Subject / Course Taught</label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Target University & Degree</label>
                <input
                  type="text"
                  value={targetUniInput}
                  onChange={(e) => setTargetUniInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md hover:bg-amber-700 transition-colors"
                >
                  Send LOR Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
