import React, { useState } from "react";
import { EvidenceCertificate, CertificateType, CertificateScore, UserRole } from "../../lib/store";
import { verifyCertificateDocument } from "../../services/gemini";
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Hash, 
  Calendar, 
  Building, 
  Trash2, 
  Lock, 
  Award,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCheck
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  certificates: EvidenceCertificate[];
  geminiApiKey: string;
  activeRole?: UserRole;
  onAddCertificate: (cert: EvidenceCertificate) => void;
  onDeleteCertificate: (id: string) => void;
}

export function EvidenceVaultView({
  certificates,
  geminiApiKey,
  activeRole = "student",
  onAddCertificate,
  onDeleteCertificate
}: Props) {
  const [activeSegment, setActiveSegment] = useState<"all" | "language" | "academic">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CertificateType>("IELTS");
  const [certTitle, setCertTitle] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [scoreDetails, setScoreDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const verifiedCerts = certificates.filter((c) => c.verificationStatus === "verified");
  const isProfileVerified = verifiedCerts.length > 0;

  const filteredCerts = certificates.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeSegment === "language") return c.type === "IELTS" || c.type === "TOEFL" || c.type === "Duolingo";
    if (activeSegment === "academic") return c.type === "Transcript" || c.type === "SAT" || c.type === "GRE" || c.type === "Diploma";
    return true;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    toast.info("Analyzing document with Gemini Credential Verification...", { duration: 3000 });

    try {
      const result = await verifyCertificateDocument(
        geminiApiKey,
        certTitle || `${selectedType} Score Document`,
        notes || scoreDetails,
        selectedType
      );

      const newCert: EvidenceCertificate = {
        id: `cert-${Date.now()}`,
        title: certTitle || `${selectedType} Official Verification`,
        type: selectedType,
        issuer: issuerName || result.issuer,
        credentialId: result.credentialId,
        issueDate: result.issueDate,
        verificationStatus: "verified",
        verifiedAt: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        verificationHash: result.hash,
        scores: result.scores,
        rawTextNotes: notes || result.summary
      };

      onAddCertificate(newCert);
      setIsUploadModalOpen(false);
      setCertTitle("");
      setIssuerName("");
      setScoreDetails("");
      setNotes("");
      toast.success(`Verified successfully! Official ${selectedType} scores locked.`);
    } catch (err: any) {
      toast.error(`Verification error: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Evidence Vault Header (from original Page 15) */}
      <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Cryptographic Vault</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Evidence Vault</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Manage and verify your academic credentials, test reports, and official documentation. Locked scores directly ground the AI essay generator.
          </p>
        </div>

        {/* Segmented Control Pill (Exact from Page 15) */}
        <div className="flex p-1.5 bg-white/40 dark:bg-card/40 backdrop-blur-md rounded-full border border-white/60 dark:border-border/60 shadow-inner">
          <button
            onClick={() => setActiveSegment("all")}
            className={`px-5 py-2 rounded-full font-bold text-xs transition-all ${
              activeSegment === "all"
                ? "bg-white dark:bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Evidence ({certificates.length})
          </button>
          <button
            onClick={() => setActiveSegment("language")}
            className={`px-5 py-2 rounded-full font-bold text-xs transition-all ${
              activeSegment === "language"
                ? "bg-white dark:bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Language (IELTS/TOEFL)
          </button>
          <button
            onClick={() => setActiveSegment("academic")}
            className={`px-5 py-2 rounded-full font-bold text-xs transition-all ${
              activeSegment === "academic"
                ? "bg-white dark:bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Transcripts & Diplomas
          </button>
        </div>
      </div>

      {/* Action Bar (Search & Upload from original Page 15) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/40 dark:bg-card/40 border border-white/60 dark:border-border/60 rounded-full text-xs sm:text-sm text-foreground focus:bg-white/80 focus:ring-2 focus:ring-cyan-400 outline-none backdrop-blur-sm placeholder:text-muted-foreground transition-all shadow-xs"
            placeholder="Search verified evidence by title, exam, or issuer..."
            type="text"
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {activeRole === "student" && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white rounded-full font-bold text-xs shadow-[0_0_15px_rgba(63,225,253,0.35)] hover:shadow-[0_0_22px_rgba(63,225,253,0.55)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Upload Student Credential
            </button>
          )}

          {activeRole === "counselor" && (
            <button
              onClick={() => {
                setSelectedType("Transcript");
                setCertTitle("Certified Academic Transcript & Cumulative GPA");
                setIssuerName("Counseling & Guidance Office");
                setIsUploadModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              Counselor Certify Transcript
            </button>
          )}

          {activeRole === "admissions" && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              <CheckCheck className="w-4 h-4" />
              Admissions Auditor Mode (Read-Only Certified Ledger)
            </div>
          )}

          {activeRole === "admin" && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex-1 sm:flex-none px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Admin Ingest Credential
            </button>
          )}
        </div>
      </div>

      {/* Verified Summary Strip */}
      {isProfileVerified && (
        <div className="glass-panel p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {verifiedCerts.map((cert) => (
            <div key={cert.id} className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{cert.type}</span>
              <p className="text-lg font-extrabold text-foreground mt-0.5">
                {cert.scores.overall || cert.scores.gpa}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Evidence Cards Grid (Luminous Glass Cards from Page 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => {
          const isVerified = cert.verificationStatus === "verified";

          return (
            <div
              key={cert.id}
              className="glass-panel shine-effect group flex flex-col justify-between p-6 rounded-[30px] min-h-[300px]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {cert.type}
                    </span>
                    {isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Lock className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onDeleteCertificate(cert.id);
                      toast.success("Certificate removed from vault");
                    }}
                    className="text-muted-foreground hover:text-destructive p-1 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-lg text-foreground mt-4 group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  {cert.issuer}
                </p>

                {/* Score Spotlight */}
                <div className="mt-4 p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">Authenticated Score</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {cert.scores.overall ? `Overall: ${cert.scores.overall}` : cert.scores.gpa}
                    </span>
                  </div>

                  {cert.scores.breakdown && (
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2.5 border-t border-border/40 text-[11px]">
                      {Object.entries(cert.scores.breakdown).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-muted-foreground">
                          <span className="truncate pr-1">{k}:</span>
                          <strong className="text-foreground">{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hash & Date at Card Bottom */}
              <div className="mt-5 pt-3 border-t border-white/30 dark:border-white/10 text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between">
                  <span>ID: <code className="text-foreground">{cert.credentialId}</code></span>
                  <span>Issued: {cert.issueDate}</span>
                </div>
                {cert.verificationHash && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 truncate">
                    <Hash className="w-3 h-3 shrink-0" />
                    <span>Audit Hash: {cert.verificationHash}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal with Glass Panel */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg glass-panel-elevated p-8 shadow-2xl relative">
            <h3 className="text-xl font-extrabold text-foreground">Upload & Verify Certificate</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Gemini AI will extract and authenticate the scores to lock your verified profile.
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Certificate Type</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1.5">
                  {(["IELTS", "TOEFL", "Duolingo", "SAT", "GRE", "Transcript", "Diploma"] as CertificateType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                        selectedType === type
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Document Title</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder={`e.g. Official ${selectedType} Test Report`}
                  className="mt-1.5 w-full rounded-2xl border border-input bg-background/80 px-4 py-2.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Issuing Authority / University</label>
                <input
                  type="text"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  placeholder="e.g. British Council, ETS, State University Registrar"
                  className="mt-1.5 w-full rounded-2xl border border-input bg-background/80 px-4 py-2.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Declared Scores / Notes from Document</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Overall Band 8.0 (Reading 8.5, Listening 8.5, Speaking 7.5, Writing 7.5)."
                  rows={3}
                  className="mt-1.5 w-full rounded-2xl border border-input bg-background/80 px-4 py-2.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Verify & Lock Scores
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
