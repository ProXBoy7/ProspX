import React, { useState } from "react";
import { StudentProfile, EvidenceCertificate, DegreeLevel } from "../../lib/store";
import { University, UNIVERSITIES_DATABASE } from "../../data/universities";
import { matchUniversitiesToProfile, RecommendationMatch } from "../../services/gemini";
import { 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  DollarSign, 
  GraduationCap, 
  Globe2 
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  certificates: EvidenceCertificate[];
  onAddApplication: (uniId: string, program: string) => void;
}

export function DiagnosticSurveyModal({
  isOpen,
  onClose,
  profile,
  certificates,
  onAddApplication
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [targetDegree, setTargetDegree] = useState<DegreeLevel>(profile.targetDegree || "Master's");
  const [intendedMajor, setIntendedMajor] = useState(profile.intendedMajor || "Computer Science");
  const [preferredCountries, setPreferredCountries] = useState<string[]>(
    profile.preferredCountries.length > 0 ? profile.preferredCountries : ["Germany", "United States", "United Kingdom"]
  );
  const [annualBudget, setAnnualBudget] = useState<number>(profile.annualBudgetUsd || 30000);
  const [priority, setPriority] = useState<StudentProfile["priority"]>(profile.priority || "high_qs_rank");

  // Matched Results
  const [recommendations, setRecommendations] = useState<RecommendationMatch[] | null>(null);

  if (!isOpen) return null;

  // Check verified credentials
  const verifiedIelts = certificates.find((c) => c.type === "IELTS" && c.verificationStatus === "verified");
  const verifiedTranscript = certificates.find((c) => c.type === "Transcript" && c.verificationStatus === "verified");

  const countryOptions = [
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Singapore", flag: "🇸🇬" }
  ];

  const toggleCountry = (country: string) => {
    if (preferredCountries.includes(country)) {
      setPreferredCountries(preferredCountries.filter((c) => c !== country));
    } else {
      setPreferredCountries([...preferredCountries, country]);
    }
  };

  const handleRunAssessment = () => {
    const updatedProfile: StudentProfile = {
      ...profile,
      targetDegree,
      intendedMajor,
      preferredCountries,
      annualBudgetUsd: annualBudget,
      priority
    };

    const matches = matchUniversitiesToProfile(updatedProfile, certificates, UNIVERSITIES_DATABASE);
    setRecommendations(matches);
    setCurrentStep(5); // Show results
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl glass-panel-elevated shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">
                {currentStep === 5 ? "Your Matched University Portfolio" : "Smart Diagnostic Survey"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {currentStep === 5 
                  ? "Calibrated by QS World Rankings, verified test scores, and budget criteria" 
                  : `Step ${currentStep} of ${totalSteps} — Adaptive questions`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/60 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors border border-white/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Degree & Field */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <h4 className="text-base font-semibold text-foreground">What degree level are you applying for?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Select your target academic program level.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {(["Bachelor's", "Master's", "PhD", "MBA"] as DegreeLevel[]).map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setTargetDegree(deg)}
                      className={`p-3 rounded-2xl border text-sm font-semibold transition-all text-center ${
                        targetDegree === deg
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      {deg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Intended Major / Specialization</label>
                <input
                  type="text"
                  value={intendedMajor}
                  onChange={(e) => setIntendedMajor(e.target.value)}
                  placeholder="e.g. Computer Science, Artificial Intelligence, Data Science, Biomedical"
                  className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Verified Credentials Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 dark:text-emerald-200">
                  <p className="font-semibold">Verified Credentials Linked</p>
                  <p className="mt-0.5 opacity-90">
                    {verifiedIelts ? `• IELTS: Verified ${verifiedIelts.scores.overall} (C1 Advanced) ` : "• No verified language test yet "}
                    {verifiedTranscript ? `• Transcript: Verified GPA ${verifiedTranscript.scores.gpa}` : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Destination Countries */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <h4 className="text-base font-semibold text-foreground">Preferred Study Destinations</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose the countries you want to target (visa requirements and cost will be tuned accordingly).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {countryOptions.map((c) => {
                  const isSelected = preferredCountries.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleCountry(c.name)}
                      className={`p-3.5 rounded-2xl border text-sm font-medium transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>

              {preferredCountries.includes("Germany") && (
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-foreground">
                  💡 <strong>Germany Note:</strong> German public universities offer very low/zero tuition fees, but require an APS Certificate and a Blocked Bank Account (€11,904).
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Budget & Financial Limit */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <h4 className="text-base font-semibold text-foreground">Maximum Total Budget (Tuition + Living Costs)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Estimated annual budget in USD. The algorithm will flag affordable public universities vs high-tuition institutions.
                </p>

                <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground font-bold text-2xl">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                    <span>${annualBudget.toLocaleString()}</span>
                    <span className="text-xs font-normal text-muted-foreground">/ year</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="80000"
                  step="2500"
                  value={annualBudget}
                  onChange={(e) => setAnnualBudget(Number(e.target.value))}
                  className="mt-4 w-full accent-primary cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>$5,000 (Low-Cost EU Public)</span>
                  <span>$40,000 (Mid-Range)</span>
                  <span>$80,000+ (Ivy League / Private)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Strategic Priority */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <h4 className="text-base font-semibold text-foreground">What is your #1 Strategic Priority?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The matching engine will optimize weights based on what matters most to your future.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "high_qs_rank",
                    title: "Highest QS World Ranking (Prestige & Brand)",
                    desc: "Prioritize top 50 global institutions (MIT, Oxford, ETH, Imperial)."
                  },
                  {
                    key: "low_cost",
                    title: "Affordability & Low Tuition (Maximum ROI)",
                    desc: "Prioritize tuition-free European universities and generous scholarship options."
                  },
                  {
                    key: "high_post_study_work",
                    title: "Post-Graduation Work Visa & Immigration Path",
                    desc: "Prioritize countries with straightforward post-study work permits (Canada, Germany, Australia)."
                  },
                  {
                    key: "balanced",
                    title: "Balanced Portfolio",
                    desc: "A balanced distribution of reach, target, and solid safety options."
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setPriority(item.key as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      priority === item.key
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-sm text-foreground">{item.title}</h5>
                      {priority === item.key && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: RECOMMENDATION RESULTS */}
          {currentStep === 5 && recommendations && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">
                  Found {recommendations.length} matched universities for {intendedMajor}
                </span>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-primary underline hover:text-blue-600 font-medium"
                >
                  Adjust Survey Criteria
                </button>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {recommendations.slice(0, 8).map((match) => {
                  const uni = match.university;
                  const categoryBadge = 
                    match.category === "safety" 
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                      : match.category === "target"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-purple-500/10 text-purple-600 border-purple-500/20";

                  return (
                    <div
                      key={uni.id}
                      className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryBadge}`}>
                            {match.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                            QS #{uni.qsRank}
                          </span>
                          <span className="text-sm">{uni.flag}</span>
                          <span className="text-xs font-bold text-emerald-600">{match.matchScore}% Match</span>
                        </div>

                        <h4 className="font-bold text-sm text-foreground">{uni.name}</h4>
                        <p className="text-xs text-muted-foreground">{match.fitReason}</p>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span>Tuition: <strong>${uni.annualTuitionUsd.toLocaleString()}/yr</strong></span>
                          <span>•</span>
                          <span>Min IELTS: <strong>{uni.minIelts}</strong></span>
                          <span>•</span>
                          <span>Portal: <strong>{uni.portalType}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        {/* Direct Web Page to Apply */}
                        <a
                          href={uni.officialApplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                        >
                          <Globe2 className="w-3.5 h-3.5 text-primary" />
                          Apply Portal
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>

                        {/* Add to Kanban */}
                        <button
                          onClick={() => {
                            onAddApplication(uni.id, `M.Sc. in ${intendedMajor}`);
                            toast.success(`Added ${uni.shortName} to Kanban!`);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm hover:bg-blue-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Kanban
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between p-5 border-t border-border/80 bg-muted/10">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm hover:bg-blue-600 transition-colors"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleRunAssessment}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Generate Matched Universities
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
