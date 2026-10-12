import { University, UNIVERSITIES_DATABASE } from "../data/universities";

export type DegreeLevel = "Bachelor's" | "Master's" | "PhD" | "MBA";
export type UserRole = "student" | "counselor" | "teacher" | "admin" | "admissions";
export type SubscriptionPlan = "free" | "pro" | "premium" | "elite";

export interface TestAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  title: string;
  badge: string;
  organization: string;
  avatarInitials: string;
  description: string;
  subscriptionPlan?: SubscriptionPlan;
  category?: "student" | "staff" | "new";
}

export const TEST_ACCOUNTS: TestAccount[] = [
  // --- 1. Five Students (Strict "student" role only, each with dedicated subscription/onboarding tier) ---
  {
    id: "user-student-free",
    email: "student-free@scholarglass.ai",
    password: "password123",
    name: "Alex Mercer",
    role: "student",
    title: "Starter Plan Applicant (1 App Slot)",
    badge: "Free Plan",
    organization: "International Academic Institute",
    avatarInitials: "AM",
    description: "Student role only: 1 active university slot, self-reported GPA (3.65).",
    subscriptionPlan: "free",
    category: "student"
  },
  {
    id: "user-student-pro",
    email: "student-pro@scholarglass.ai",
    password: "password123",
    name: "Sophia Chen",
    role: "student",
    title: "Scholar Pro (5 Applications & AI Essay Lab)",
    badge: "Pro Plan",
    organization: "Taipei STEM Academy",
    avatarInitials: "SC",
    description: "Student role only: 5 university applications, IELTS 8.5 verified, grounded SOP generator.",
    subscriptionPlan: "pro",
    category: "student"
  },
  {
    id: "user-student-premium",
    email: "student-premium@scholarglass.ai",
    password: "password123",
    name: "Liam Johnson",
    role: "student",
    title: "Global Admissions Premium (Unlimited & Counselor Review)",
    badge: "Premium Plan",
    organization: "Aerospace Prep Academy",
    avatarInitials: "LJ",
    description: "Student role only: Unlimited applications, GRE 328 verified, expedited transcript verification.",
    subscriptionPlan: "premium",
    category: "student"
  },
  {
    id: "user-student-elite",
    email: "student-elite@scholarglass.ai",
    password: "password123",
    name: "Priya Sharma",
    role: "student",
    title: "Elite Ivy Consortium (Dedicated Advisory & Audit)",
    badge: "Elite Plan",
    organization: "International Honors College",
    avatarInitials: "PS",
    description: "Student role only: Class Rank #1, SAT 1570, early admit to Harvard GSAS.",
    subscriptionPlan: "elite",
    category: "student"
  },
  {
    id: "user-student-new",
    email: "newuser@scholarglass.ai",
    password: "password123",
    name: "Jordan Fresh",
    role: "student",
    title: "Brand New User (Clean Slate / No Documents)",
    badge: "New User",
    organization: "Prospective Student",
    avatarInitials: "JF",
    description: "Student role only: 0 applications, 0 certificates, tests fresh onboarding workflow.",
    subscriptionPlan: "free",
    category: "new"
  },

  // --- 2. Two School Counselors (Strict "counselor" role only) ---
  {
    id: "user-counselor-1",
    email: "counselor@scholarglass.ai",
    password: "password123",
    name: "Dr. Eleanor Vance",
    role: "counselor",
    title: "Head of Guidance & College Counseling",
    badge: "Lead Counselor",
    organization: "Global Academic Collegiate Institute",
    avatarInitials: "EV",
    description: "Counselor role only: Manages student roster, certifies GPA and transcripts, dispatches faculty LOR requests.",
    category: "staff"
  },
  {
    id: "user-counselor-2",
    email: "counselor-stem@scholarglass.ai",
    password: "password123",
    name: "David Sterling",
    role: "counselor",
    title: "Senior STEM College Placement Advisor",
    badge: "STEM Counselor",
    organization: "International STEM High School Network",
    avatarInitials: "DS",
    description: "Counselor role only: Specializes in European and US technical university admissions and curriculum audits.",
    category: "staff"
  },

  // --- 3. One Teacher / Faculty (Strict "teacher" role only) ---
  {
    id: "user-teacher",
    email: "teacher@scholarglass.ai",
    password: "password123",
    name: "Dr. Marcus Smith",
    role: "teacher",
    title: "Chair of Computer Science & Advanced Faculty",
    badge: "Faculty Teacher",
    organization: "Department of STEM & Computing",
    avatarInitials: "MS",
    description: "Teacher role only: Drafts and cryptographically signs academic recommendation letters (LORs) grounded in course observations.",
    category: "staff"
  },

  // --- 4. One System Administrator (Strict "admin" role only) ---
  {
    id: "user-admin",
    email: "admin@scholarglass.ai",
    password: "password123",
    name: "Sarah Croft",
    role: "admin",
    title: "Chief System Administrator & Compliance Officer",
    badge: "System Admin",
    organization: "ScholarGlass Institutional Network",
    avatarInitials: "SC",
    description: "Admin role only: Governs master QS university catalog, inspects verification audit ledger, monitors Gemini API health.",
    category: "staff"
  },

  // --- 5. One University Admissions Reviewer (Strict "admissions" role only) ---
  {
    id: "user-admissions",
    email: "admissions@scholarglass.ai",
    password: "password123",
    name: "Prof. Sarah Jenkins",
    role: "admissions",
    title: "Senior University Admissions Reviewer",
    badge: "Admissions Officer",
    organization: "TUM & European University Admissions Consortium",
    avatarInitials: "SJ",
    description: "Admissions role only: Reviews incoming international applications, validates verified credentials, issues decisions.",
    category: "staff"
  }
];

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  nationality: string;
  targetDegree: DegreeLevel;
  intendedMajor: string;
  annualBudgetUsd: number;
  priority: "high_qs_rank" | "low_cost" | "high_post_study_work" | "balanced";
  preferredCountries: string[];
  selfReportedGpa: number; // 0.0 - 4.0
  verifiedGpa?: number;
  academicNotes: string;
  schoolName?: string;
  counselorName?: string;
  subscriptionPlan: SubscriptionPlan;
}

export type CertificateType = "IELTS" | "TOEFL" | "Duolingo" | "SAT" | "GRE" | "Transcript" | "Diploma";

export interface CertificateScore {
  overall?: number | string;
  gpa?: string;
  breakdown?: Record<string, number | string>;
}

export interface EvidenceCertificate {
  id: string;
  studentId?: string;
  title: string;
  type: CertificateType;
  issuer: string;
  credentialId: string;
  issueDate: string;
  verificationStatus: "verified" | "pending" | "rejected";
  verifiedAt?: string;
  verificationHash?: string;
  scores: CertificateScore;
  fileUrl?: string;
  rawTextNotes?: string;
  uploadedBy?: "student" | "counselor";
}

export type ApplicationStage = "wishlist" | "preparing" | "submitted" | "decision" | "visa";
export type DecisionOutcome = "pending" | "accepted" | "waitlisted" | "rejected";

export interface ChecklistTask {
  id: string;
  title: string;
  completed: boolean;
  category: "exam" | "document" | "portal" | "visa" | "fee";
}

export interface ApplicationItem {
  id: string;
  studentId?: string;
  universityId: string;
  program: string;
  degree: DegreeLevel;
  stage: ApplicationStage;
  decision: DecisionOutcome;
  deadline: string;
  intake: string;
  portalUrl: string;
  checklist: ChecklistTask[];
  notes: string;
  appliedDate?: string;
  decisionDate?: string;
}

export interface LorRequest {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  targetUniversity: string;
  status: "requested" | "in_draft" | "submitted";
  letterContent?: string;
  requestedDate: string;
  submittedDate?: string;
  studentNotes?: string;
}

export interface RosterStudent {
  id: string;
  name: string;
  email: string;
  grade: string;
  gpa: number;
  verifiedGpa?: number;
  targetMajor: string;
  applicationsCount: number;
  certificatesCount: number;
  lorStatus: "pending" | "completed" | "none";
  counselorNotes?: string;
  subscriptionPlan?: SubscriptionPlan;
}

export type ActivityCategory = "olympiad" | "extracurricular" | "event" | "project" | "volunteering";

export interface ActivityItem {
  id: string;
  studentId?: string;
  title: string;
  category: ActivityCategory;
  organization: string;
  roleOrAward: string;
  dateRange: string;
  description: string;
  memorableMoments: string; // Anecdotes, breakthroughs, personal turning points used directly in AI essays
  skills: string[];
  highlightInEssay: boolean;
  evidenceUrl?: string;
}

export interface ScholarQuest {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "milestone";
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  icon: string;
}

export interface ScholarPassState {
  seasonName: string;
  seasonDescription: string;
  level: number;
  currentXp: number;
  targetXp: number;
  streakDays: number;
  claimedTierIds: number[];
  quests: ScholarQuest[];
}

export interface AppState {
  activeRole: UserRole;
  profile: StudentProfile;
  certificates: EvidenceCertificate[];
  applications: ApplicationItem[];
  activities: ActivityItem[];
  scholarPass: ScholarPassState;
  geminiApiKey: string;
  // Multi-Role Extensions
  rosterStudents: RosterStudent[];
  lorRequests: LorRequest[];
  universities: University[];
}

export const STUDENT_PRESETS: Record<
  string, 
  { 
    profile: StudentProfile; 
    certificates: EvidenceCertificate[]; 
    applications: ApplicationItem[];
    activities: ActivityItem[];
  }
> = {
  // 1. Free/Starter Plan Student (1 App Slot)
  "student-free@scholarglass.ai": {
    profile: {
      id: "student-alex",
      name: "Alex Mercer",
      email: "student-free@scholarglass.ai",
      nationality: "International",
      targetDegree: "Master's",
      intendedMajor: "Computer Science & AI",
      annualBudgetUsd: 25000,
      priority: "high_qs_rank",
      preferredCountries: ["Germany", "Netherlands"],
      selfReportedGpa: 3.65,
      verifiedGpa: undefined,
      academicNotes: "Applying under Starter Tier with 1 active university slot.",
      schoolName: "International Academic Institute",
      counselorName: "Dr. Eleanor Vance",
      subscriptionPlan: "free"
    },
    certificates: [
      {
        id: "cert-ielts-free",
        studentId: "student-alex",
        title: "IELTS Academic Test (Self-Reported)",
        type: "IELTS",
        issuer: "British Council",
        credentialId: "TRF-PENDING-01",
        issueDate: "2025-01-10",
        verificationStatus: "pending",
        scores: { overall: 7.0, breakdown: { Reading: 7.0, Listening: 7.5, Writing: 6.5, Speaking: 7.0 } },
        rawTextNotes: "Self-uploaded TRF awaiting counselor verification.",
        uploadedBy: "student"
      }
    ],
    applications: [
      {
        id: "app-tum-free",
        studentId: "student-alex",
        universityId: "tum",
        program: "M.Sc. in Informatics & Data Engineering",
        degree: "Master's",
        stage: "preparing",
        decision: "pending",
        deadline: "May 31, 2026",
        intake: "Fall 2026",
        portalUrl: "https://campus.tum.de",
        notes: "Primary free target university application. Checklist in progress.",
        checklist: [
          { id: "c1", title: "Complete TUMonline Application Form", completed: true, category: "portal" },
          { id: "c2", title: "Upload Verified IELTS Report (Min 6.5)", completed: false, category: "exam" },
          { id: "c3", title: "Draft Grounded Statement of Purpose", completed: false, category: "document" }
        ]
      }
    ],
    activities: [
      {
        id: "act-alex-1",
        studentId: "student-alex",
        title: "Regional Informatics Olympiad",
        category: "olympiad",
        organization: "European Youth Olympiad in Informatics (EYOI)",
        roleOrAward: "Bronze Medalist (Top 12% in Algorithms)",
        dateRange: "May 2024",
        description: "Competed in high-intensity competitive programming challenges requiring graph algorithms, dynamic programming, and computational geometry under strict runtime constraints.",
        memorableMoments: "During the final 45 minutes of the contest, my tree traversal solution was repeatedly failing subtask 3 due to a stack overflow. Instead of giving up, I refactored the recursion into an iterative Fenwick tree with bitwise indexing. The submission passed all 20 test vectors with 4 minutes remaining, securing the bronze medal.",
        skills: ["C++", "Dynamic Programming", "Graph Theory", "Algorithmic Optimization"],
        highlightInEssay: true
      },
      {
        id: "act-alex-2",
        studentId: "student-alex",
        title: "Accessible Mathematics Web Platform",
        category: "project",
        organization: "Open Knowledge Foundation Student Chapter",
        roleOrAward: "Lead Front-End Developer",
        dateRange: "2024 - Present",
        description: "Built an open-source web application providing screen-reader compatible visual graphing calculators and LaTeX formula generators for visually impaired STEM students.",
        memorableMoments: "Received a personal letter from a high school mathematics teacher whose blind student was able to independently complete multivariable calculus homework for the first time using our custom ARIA keyboard navigation shortcuts.",
        skills: ["TypeScript", "Web Accessibility (WCAG)", "React", "LaTeX"],
        highlightInEssay: true
      }
    ]
  },

  // 2. Pro Plan Student (5 Apps, Verified IELTS & AI Essay Lab)
  "student-pro@scholarglass.ai": {
    profile: {
      id: "student-sophia",
      name: "Sophia Chen",
      email: "student-pro@scholarglass.ai",
      nationality: "Taiwan",
      targetDegree: "Master's",
      intendedMajor: "Biomedical Engineering & Bio-computation",
      annualBudgetUsd: 45000,
      priority: "high_qs_rank",
      preferredCountries: ["United States", "United Kingdom", "Switzerland"],
      selfReportedGpa: 3.94,
      verifiedGpa: 3.94,
      academicNotes: "President of Science Olympiad. Published research in bio-informatics.",
      schoolName: "Taipei STEM Academy",
      counselorName: "Dr. Eleanor Vance",
      subscriptionPlan: "pro"
    },
    certificates: [
      {
        id: "cert-ielts-pro",
        studentId: "student-sophia",
        title: "IELTS Academic Official Test Report",
        type: "IELTS",
        issuer: "British Council",
        credentialId: "TRF-2025-88219A",
        issueDate: "2025-03-12",
        verificationStatus: "verified",
        verifiedAt: "2025-03-15 09:20 UTC",
        verificationHash: "0x7bfa88190cde4",
        scores: { overall: 8.5, breakdown: { Reading: 9.0, Listening: 9.0, Writing: 8.0, Speaking: 8.0 } },
        rawTextNotes: "Official Band 8.5 score. CEFR Level C2 Mastery.",
        uploadedBy: "student"
      },
      {
        id: "cert-transcript-pro",
        studentId: "student-sophia",
        title: "Official B.S. Biomedical Engineering Transcript",
        type: "Transcript",
        issuer: "National University Registrar",
        credentialId: "REG-TRANS-2024-91",
        issueDate: "2024-06-20",
        verificationStatus: "verified",
        verifiedAt: "2024-06-25 11:00 UTC",
        verificationHash: "0x391ac89b21f",
        scores: { gpa: "3.94 / 4.0", overall: "3.94 GPA", breakdown: { "Molecular Biology": "A+", "Biomechanics": "A", "Biostatistics": "A+" } },
        rawTextNotes: "Top 2% of graduating faculty class.",
        uploadedBy: "counselor"
      }
    ],
    applications: [
      {
        id: "app-imperial-pro",
        studentId: "student-sophia",
        universityId: "imperial",
        program: "M.Sc. Biomedical Engineering",
        degree: "Master's",
        stage: "submitted",
        decision: "pending",
        deadline: "January 29, 2026",
        intake: "Fall 2026",
        portalUrl: "https://www.imperial.ac.uk",
        notes: "Application submitted via Imperial Portal. Application Ref: IMP-BIO-9921.",
        checklist: [
          { id: "p1", title: "Submit Online Portal Application", completed: true, category: "portal" },
          { id: "p2", title: "Upload Verified Academic Transcript", completed: true, category: "document" },
          { id: "p3", title: "Faculty LOR Verified & Attached", completed: true, category: "document" }
        ]
      },
      {
        id: "app-oxford-pro",
        studentId: "student-sophia",
        universityId: "oxford",
        program: "M.Sc. in Medical Sciences & Bioengineering",
        degree: "Master's",
        stage: "preparing",
        decision: "pending",
        deadline: "January 19, 2026",
        intake: "Fall 2026",
        portalUrl: "https://www.ox.ac.uk/admissions/graduate",
        notes: "Targeting Oxford bioengineering laboratory. Preparing research proposal.",
        checklist: [
          { id: "ox1", title: "Draft 1500-word Research Proposal", completed: true, category: "document" },
          { id: "ox2", title: "Upload Verified IELTS (Min 7.5)", completed: true, category: "exam" },
          { id: "ox3", title: "Pay £75 Application Fee", completed: false, category: "fee" }
        ]
      },
      {
        id: "app-eth-pro",
        studentId: "student-sophia",
        universityId: "eth",
        program: "M.Sc. Biomedical Engineering",
        degree: "Master's",
        stage: "wishlist",
        decision: "pending",
        deadline: "December 15, 2025",
        intake: "Fall 2026",
        portalUrl: "https://www.leba.ethz.ch",
        notes: "ETH Zurich top European technical institution.",
        checklist: [
          { id: "et1", title: "Prepare Course Descriptions Matrix", completed: false, category: "document" }
        ]
      }
    ],
    activities: [
      {
        id: "act-sophia-1",
        studentId: "student-sophia",
        title: "International Biology Olympiad (IBO)",
        category: "olympiad",
        organization: "International Biology Olympiad Committee",
        roleOrAward: "Silver Medalist (Rank 18/280 Globally)",
        dateRange: "July 2024",
        description: "Competed in high-level bio-molecular genetics, ecology, cell physiology, and computational genetics practical laboratory examinations.",
        memorableMoments: "In the molecular biology practical exam, our PCR gel electrophoresis chamber suffered an unexpected voltage fluctuation. Instead of giving up or panicking, I systematically re-calibrated the buffer conductivity, adjusted the run time, and clearly isolated the 540bp target plasmid band, finishing with the second-highest practical accuracy in our national delegation.",
        skills: ["Genetics", "Molecular Biology", "Spectrophotometry", "Statistical Ecology"],
        highlightInEssay: true
      },
      {
        id: "act-sophia-2",
        studentId: "student-sophia",
        title: "Youth Bio-Computation Research Initiative",
        category: "extracurricular",
        organization: "Taipei STEM Academy Research Lab",
        roleOrAward: "Founder & Lead Student Researcher",
        dateRange: "2023 - Present",
        description: "Led a research group of 14 students investigating deep learning architectures for secondary protein folding prediction, mentoring underclassmen in Python and PyTorch.",
        memorableMoments: "Organized a weekend hackathon that brought together 60 high school students and university mentors; our team's transformer model achieved 88.4% accuracy on synthetic peptide benchmarks, which we presented at the Regional Science Symposium.",
        skills: ["PyTorch", "Bioinformatics", "Team Leadership", "Scientific Writing"],
        highlightInEssay: true
      }
    ]
  },

  // 3. Premium Plan Student (Unlimited Applications, Counselor Verification)
  "student-premium@scholarglass.ai": {
    profile: {
      id: "student-liam",
      name: "Liam Johnson",
      email: "student-premium@scholarglass.ai",
      nationality: "United States",
      targetDegree: "Master's",
      intendedMajor: "Mechanical & Aerospace Engineering",
      annualBudgetUsd: 55000,
      priority: "high_qs_rank",
      preferredCountries: ["United States", "Netherlands", "United Kingdom"],
      selfReportedGpa: 3.75,
      verifiedGpa: 3.78,
      academicNotes: "Robotics team captain. Built autonomous UAV telemetry system. Counselor certified.",
      schoolName: "Aerospace Prep Academy",
      counselorName: "Dr. Eleanor Vance",
      subscriptionPlan: "premium"
    },
    certificates: [
      {
        id: "cert-gre-prem",
        studentId: "student-liam",
        title: "Official GRE General Test Score Report",
        type: "GRE",
        issuer: "ETS",
        credentialId: "ETS-GRE-2024-8194",
        issueDate: "2024-11-05",
        verificationStatus: "verified",
        verifiedAt: "2024-11-10 14:00 UTC",
        verificationHash: "0x89fa014b2d",
        scores: { overall: "328 / 340", breakdown: { "Quantitative": 168, "Verbal": 160, "Analytical Writing": 4.5 } },
        rawTextNotes: "Official ETS GRE score verified. 93rd percentile Quantitative.",
        uploadedBy: "student"
      },
      {
        id: "cert-transcript-prem",
        studentId: "student-liam",
        title: "Certified B.S. Mechanical Engineering Transcript",
        type: "Transcript",
        issuer: "Dean's Office",
        credentialId: "TRANS-DEAN-2024",
        issueDate: "2024-05-30",
        verificationStatus: "verified",
        verifiedAt: "2024-06-02 16:30 UTC",
        verificationHash: "0x55aa33ff11",
        scores: { gpa: "3.78 / 4.0", overall: "3.78 GPA", breakdown: { "Thermodynamics": "A", "Fluid Dynamics": "A-", "Robotics Control": "A" } },
        rawTextNotes: "Official sealed electronic copy verified by Dr. Eleanor Vance.",
        uploadedBy: "counselor"
      }
    ],
    applications: [
      {
        id: "app-delft-prem",
        studentId: "student-liam",
        universityId: "delft",
        program: "M.Sc. Aerospace Engineering (Aerodynamics)",
        degree: "Master's",
        stage: "preparing",
        decision: "pending",
        deadline: "January 15, 2026",
        intake: "Fall 2026",
        portalUrl: "https://www.studielink.nl",
        notes: "TU Delft Aerospace ranked #3 globally for aeronautics.",
        checklist: [
          { id: "dl1", title: "Complete Studielink Application", completed: true, category: "portal" },
          { id: "dl2", title: "Submit GRE Quant 168 Breakdown", completed: true, category: "exam" },
          { id: "dl3", title: "Finalize UAV Statement of Purpose", completed: true, category: "document" },
          { id: "dl4", title: "Upload Certified Transcript", completed: true, category: "document" }
        ]
      },
      {
        id: "app-mit-prem",
        studentId: "student-liam",
        universityId: "mit",
        program: "M.Sc. Aeronautics and Astronautics",
        degree: "Master's",
        stage: "wishlist",
        decision: "pending",
        deadline: "December 15, 2025",
        intake: "Fall 2026",
        portalUrl: "https://gradapply.mit.edu/aeroastro",
        notes: "MIT AeroAstro research laboratory application.",
        checklist: [
          { id: "mit1", title: "Review Faculty Research Groups", completed: false, category: "document" },
          { id: "mit2", title: "Attach 3 Letters of Recommendation", completed: false, category: "document" }
        ]
      }
    ],
    activities: [
      {
        id: "act-liam-1",
        studentId: "student-liam",
        title: "World Robot Olympiad (WRO)",
        category: "olympiad",
        organization: "World Robot Olympiad Association",
        roleOrAward: "National Champion & Global Finalist (RoboMission Senior)",
        dateRange: "November 2024",
        description: "Engineered an autonomous high-payload mobile robot with custom differential steering and computer-vision sorting.",
        memorableMoments: "Hours before the national finals, our primary optical LiDAR sensor developed a hairline fracture during transport. Under severe time pressure, I reprogrammed our obstacle navigation routine using dual ultrasonic sensors fused with Kalman filter wheel odometry. Our robot cleared the obstacle field with zero penalties and clinched 1st place.",
        skills: ["Robotics (ROS2)", "C++", "Kalman Filters", "Embedded Hardware", "Rapid Problem-Solving"],
        highlightInEssay: true
      },
      {
        id: "act-liam-2",
        studentId: "student-liam",
        title: "Autonomous Meteorological High-Altitude Balloon",
        category: "event",
        organization: "Aerospace Prep Engineering Club",
        roleOrAward: "Project Lead & Telemetry Engineer",
        dateRange: "2024",
        description: "Designed, built, and launched a weather balloon payload carrying Arduino sensors and GPS radio transmitters to 85,000 feet.",
        memorableMoments: "Tracking the payload descent through heavy cloud cover in a remote mountain range; finding the intact capsule and downloading pristine stratospheric atmospheric pressure data that we open-sourced to local meteorological schools.",
        skills: ["Avionics", "Radio Telemetry", "Arduino", "Atmospheric Physics"],
        highlightInEssay: true
      }
    ]
  },

  // 4. Elite Ivy Plan Student (Full Advisory & Direct Admissions Audit)
  "student-elite@scholarglass.ai": {
    profile: {
      id: "student-priya",
      name: "Priya Sharma",
      email: "student-elite@scholarglass.ai",
      nationality: "India",
      targetDegree: "Master's",
      intendedMajor: "Economics & Computational Data Science",
      annualBudgetUsd: 65000,
      priority: "high_qs_rank",
      preferredCountries: ["United States", "United Kingdom", "Singapore"],
      selfReportedGpa: 3.98,
      verifiedGpa: 3.98,
      academicNotes: "National merit scholar. Valedictorian candidate with mathematical economics honors.",
      schoolName: "International Honors College",
      counselorName: "Dr. Eleanor Vance",
      subscriptionPlan: "elite"
    },
    certificates: [
      {
        id: "cert-sat-elite",
        studentId: "student-priya",
        title: "Official SAT Score Report",
        type: "SAT",
        issuer: "College Board",
        credentialId: "CB-SAT-2024-9901",
        issueDate: "2024-10-15",
        verificationStatus: "verified",
        verifiedAt: "2024-10-18 10:00 UTC",
        verificationHash: "0x981ec2001fa",
        scores: { overall: "1570 / 1600", breakdown: { "Math": 800, "Reading & Writing": 770 } },
        rawTextNotes: "Official 99th percentile SAT score verified.",
        uploadedBy: "student"
      },
      {
        id: "cert-toefl-elite",
        studentId: "student-priya",
        title: "TOEFL iBT Official Score Report",
        type: "TOEFL",
        issuer: "ETS",
        credentialId: "ETS-TOEFL-2024-77",
        issueDate: "2024-09-22",
        verificationStatus: "verified",
        verifiedAt: "2024-09-25 15:45 UTC",
        verificationHash: "0x112233aabbcc",
        scores: { overall: 118, breakdown: { Reading: 30, Listening: 30, Speaking: 29, Writing: 29 } },
        rawTextNotes: "TOEFL 118 / 120 verified by ETS portal.",
        uploadedBy: "student"
      },
      {
        id: "cert-transcript-elite",
        studentId: "student-priya",
        title: "Official Certified Honors Academic Transcript",
        type: "Transcript",
        issuer: "University Registrar & Chancellor",
        credentialId: "CHANC-TRANS-2024",
        issueDate: "2024-06-10",
        verificationStatus: "verified",
        verifiedAt: "2024-06-12 12:00 UTC",
        verificationHash: "0xeeff00112233",
        scores: { gpa: "3.98 / 4.0", overall: "3.98 GPA", breakdown: { "Econometrics": "A+", "Real Analysis": "A+", "Microeconomics": "A+" } },
        rawTextNotes: "Class Rank #1. Certified summa cum laude track.",
        uploadedBy: "counselor"
      }
    ],
    applications: [
      {
        id: "app-harvard-elite",
        studentId: "student-priya",
        universityId: "harvard",
        program: "M.Sc. in Data Science & Quantitative Economics",
        degree: "Master's",
        stage: "submitted",
        decision: "accepted",
        deadline: "December 01, 2025",
        intake: "Fall 2026",
        portalUrl: "https://gsas.harvard.edu",
        notes: "Official Early Action Acceptance Letter Received with $25,000 Dean's Fellowship.",
        checklist: [
          { id: "h1", title: "Submit Harvard GSAS Application", completed: true, category: "portal" },
          { id: "h2", title: "Attach Verified 1570 SAT / 118 TOEFL", completed: true, category: "exam" },
          { id: "h3", title: "Upload 3 Certified Recommendation Letters", completed: true, category: "document" },
          { id: "h4", title: "Submit Fellowship Grant Dossier", completed: true, category: "document" }
        ]
      },
      {
        id: "app-cambridge-elite",
        studentId: "student-priya",
        universityId: "cambridge",
        program: "M.Phil in Economics & Econometric Modeling",
        degree: "Master's",
        stage: "submitted",
        decision: "pending",
        deadline: "January 07, 2026",
        intake: "Fall 2026",
        portalUrl: "https://www.postgraduate.study.cam.ac.uk",
        notes: "Application under consideration by the Cambridge Faculty of Economics.",
        checklist: [
          { id: "c1", title: "Submit Cambridge Applicant Portal Dossier", completed: true, category: "portal" },
          { id: "c2", title: "Upload Official Summa Cum Laude Transcript", completed: true, category: "document" }
        ]
      }
    ],
    activities: [
      {
        id: "act-priya-1",
        studentId: "student-priya",
        title: "International Economics Olympiad (IEO)",
        category: "olympiad",
        organization: "International Economics Olympiad Association",
        roleOrAward: "Gold Medal & Top Quantitative Essay Award",
        dateRange: "August 2024",
        description: "Represented the national team in macroeconomic crisis simulations, quantitative business case analysis, and financial econometrics.",
        memorableMoments: "Defended an econometric monetary policy model before international university professors, arguing how localized liquidity shocks propagate through emerging bond markets. When questioned on systemic contagion, I demonstrated our empirical difference-in-differences calculation that proved statistical resilience.",
        skills: ["Econometrics", "Game Theory", "Statistical Modeling", "Macroeconomics"],
        highlightInEssay: true
      },
      {
        id: "act-priya-2",
        studentId: "student-priya",
        title: "Global Youth Economic Policy Summit",
        category: "event",
        organization: "Youth Policy Consortium Global",
        roleOrAward: "Secretary-General & Keynote Speaker",
        dateRange: "2023 - 2024",
        description: "Convened 800+ international youth delegates across 32 nations to formulate data-driven policy papers on carbon pricing and clean energy transition.",
        memorableMoments: "Presenting our consensus policy paper to a delegation of World Bank economists, which led to our youth working paper being cited in an official regional development brief.",
        skills: ["International Diplomacy", "Public Speaking", "Econometric Analysis", "Policy Drafting"],
        highlightInEssay: true
      }
    ]
  },

  // 5. Additional User with NO info (Clean slate / Brand new user)
  "newuser@scholarglass.ai": {
    profile: {
      id: "student-new",
      name: "Jordan Fresh",
      email: "newuser@scholarglass.ai",
      nationality: "Unspecified",
      targetDegree: "Bachelor's",
      intendedMajor: "Undecided",
      annualBudgetUsd: 0,
      priority: "balanced",
      preferredCountries: [],
      selfReportedGpa: 0.0,
      verifiedGpa: undefined,
      academicNotes: "",
      schoolName: "",
      counselorName: "",
      subscriptionPlan: "free"
    },
    certificates: [],
    applications: [],
    activities: []
  }
};

const DEFAULT_PROFILE: StudentProfile = STUDENT_PRESETS["student-free@scholarglass.ai"].profile;
const INITIAL_CERTIFICATES: EvidenceCertificate[] = STUDENT_PRESETS["student-free@scholarglass.ai"].certificates;
const INITIAL_APPLICATIONS: ApplicationItem[] = STUDENT_PRESETS["student-free@scholarglass.ai"].applications;
const INITIAL_ACTIVITIES: ActivityItem[] = STUDENT_PRESETS["student-free@scholarglass.ai"].activities;

export const INITIAL_SCHOLAR_PASS: ScholarPassState = {
  seasonName: "Spring '26 Season",
  seasonDescription: "Unlock the Oceanic UI, Obsidian Theme, and limited-edition AI personas. Your academic journey, gamified.",
  level: 42,
  currentXp: 8400,
  targetXp: 10000,
  streakDays: 14,
  claimedTierIds: [40, 41],
  quests: [
    {
      id: "q-activity-1",
      title: "Document 1 Olympiad or Extracurricular Record",
      description: "Save an activity with detailed memorable moments for AI essay grounding.",
      category: "daily",
      xpReward: 350,
      progress: 1,
      maxProgress: 1,
      completed: true,
      icon: "military_tech"
    },
    {
      id: "q-cert-1",
      title: "Verify Official Test Score or Transcript",
      description: "Upload an official IELTS, TOEFL, SAT or Transcript to lock verified credentials.",
      category: "daily",
      xpReward: 500,
      progress: 1,
      maxProgress: 1,
      completed: true,
      icon: "verified"
    },
    {
      id: "q-essay-draft",
      title: "Draft Grounded Statement of Purpose",
      description: "Generate or write a university-tailored essay utilizing verified evidence and memorable moments.",
      category: "daily",
      xpReward: 400,
      progress: 0,
      maxProgress: 1,
      completed: false,
      icon: "description"
    },
    {
      id: "q-ai-critique",
      title: "Run AI Essay Peer Review & Diagnostic",
      description: "Submit a self-written draft to the Gemini AI Essay Reviewer for rubric feedback.",
      category: "weekly",
      xpReward: 600,
      progress: 0,
      maxProgress: 1,
      completed: false,
      icon: "smart_toy"
    },
    {
      id: "q-app-checklist",
      title: "Complete 3 Application Checklist Milestones",
      description: "Advance requirements across your active target universities.",
      category: "weekly",
      xpReward: 800,
      progress: 2,
      maxProgress: 3,
      completed: false,
      icon: "checklist"
    },
    {
      id: "q-milestone-scholar",
      title: "Global Scholar Certification",
      description: "Reach 85%+ Admissions Readiness Score and secure faculty recommendation.",
      category: "milestone",
      xpReward: 1500,
      progress: 1,
      maxProgress: 2,
      completed: false,
      icon: "workspace_premium"
    }
  ]
};

const INITIAL_ROSTER: RosterStudent[] = [
  {
    id: "student-alex",
    name: "Alex Mercer",
    email: "student-free@scholarglass.ai",
    grade: "Senior (12th / Final Year)",
    gpa: 3.65,
    verifiedGpa: undefined,
    targetMajor: "Computer Science & AI",
    applicationsCount: 1,
    certificatesCount: 1,
    lorStatus: "pending",
    counselorNotes: "Starter Free Tier. 1 university slot active. Self-uploaded IELTS pending verification.",
    subscriptionPlan: "free"
  },
  {
    id: "student-sophia",
    name: "Sophia Chen",
    email: "student-pro@scholarglass.ai",
    grade: "Senior (12th / Final Year)",
    gpa: 3.94,
    verifiedGpa: 3.94,
    targetMajor: "Biomedical Engineering",
    applicationsCount: 3,
    certificatesCount: 2,
    lorStatus: "completed",
    counselorNotes: "Scholar Pro Plan. Top 2% class rank. Verified IELTS 8.5 & transcript.",
    subscriptionPlan: "pro"
  },
  {
    id: "student-liam",
    name: "Liam Johnson",
    email: "student-premium@scholarglass.ai",
    grade: "Senior (12th / Final Year)",
    gpa: 3.75,
    verifiedGpa: 3.78,
    targetMajor: "Mechanical & Aerospace Engineering",
    applicationsCount: 2,
    certificatesCount: 2,
    lorStatus: "pending",
    counselorNotes: "Global Admissions Premium. Robotics captain. GRE 328 & certified transcripts.",
    subscriptionPlan: "premium"
  },
  {
    id: "student-priya",
    name: "Priya Sharma",
    email: "student-elite@scholarglass.ai",
    grade: "Senior (12th / Final Year)",
    gpa: 3.98,
    verifiedGpa: 3.98,
    targetMajor: "Economics & Data Science",
    applicationsCount: 2,
    certificatesCount: 3,
    lorStatus: "completed",
    counselorNotes: "Elite Ivy Consortium Plan. Class Rank #1, SAT 1570, early admit to Harvard.",
    subscriptionPlan: "elite"
  },
  {
    id: "student-new",
    name: "Jordan Fresh",
    email: "newuser@scholarglass.ai",
    grade: "Freshman / Exploring",
    gpa: 0.0,
    verifiedGpa: undefined,
    targetMajor: "Undecided",
    applicationsCount: 0,
    certificatesCount: 0,
    lorStatus: "none",
    counselorNotes: "New user account without prior documents or applications.",
    subscriptionPlan: "free"
  }
];

const INITIAL_LOR_REQUESTS: LorRequest[] = [
  {
    id: "lor-1",
    studentId: "student-alex",
    studentName: "Alex Mercer",
    teacherId: "teacher-dr-smith",
    teacherName: "Dr. Marcus Smith",
    subject: "Advanced Placement Computer Science & Algorithms",
    targetUniversity: "Technical University of Munich (TUM)",
    status: "in_draft",
    requestedDate: "2025-05-10",
    studentNotes: "Highlight my term project on neural network pathfinding and peer tutoring assistance in lab sessions.",
    letterContent: "To the Admissions Committee at Technical University of Munich,\n\nIt is my absolute privilege to provide this strong academic recommendation for Alex Mercer, whom I have taught in Advanced Computer Science. Throughout our intensive curriculum, Alex exhibited exceptional technical curiosity and rigorous analytical discipline..."
  },
  {
    id: "lor-2",
    studentId: "student-sophia",
    studentName: "Sophia Chen",
    teacherId: "teacher-dr-smith",
    teacherName: "Dr. Marcus Smith",
    subject: "Honors Physics & Computational Modeling",
    targetUniversity: "Imperial College London",
    status: "submitted",
    requestedDate: "2025-04-12",
    submittedDate: "2025-04-28",
    studentNotes: "Focus on my biophysics research presentation and laboratory precision.",
    letterContent: "To the Faculty of Engineering at Imperial College London,\n\nI recommend Sophia Chen with my highest confidence. Sophia demonstrated unparalleled mastery of computational physics..."
  },
  {
    id: "lor-3",
    studentId: "student-liam",
    studentName: "Liam Johnson",
    teacherId: "teacher-dr-smith",
    teacherName: "Dr. Marcus Smith",
    subject: "Physics Mechanics & Robotics",
    targetUniversity: "Delft University of Technology (TU Delft)",
    status: "requested",
    requestedDate: "2025-05-14",
    studentNotes: "Please mention the regional championship autonomous drone system we built in the robotics club."
  }
];

const STORAGE_KEY = "scholarglass_prospx_app_state";

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return {
      activeRole: "student",
      profile: DEFAULT_PROFILE,
      certificates: INITIAL_CERTIFICATES,
      applications: INITIAL_APPLICATIONS,
      activities: INITIAL_ACTIVITIES,
      scholarPass: INITIAL_SCHOLAR_PASS,
      geminiApiKey: "",
      rosterStudents: INITIAL_ROSTER,
      lorRequests: INITIAL_LOR_REQUESTS,
      universities: UNIVERSITIES_DATABASE
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
      const state: AppState = {
        activeRole: "student",
        profile: DEFAULT_PROFILE,
        certificates: INITIAL_CERTIFICATES,
        applications: INITIAL_APPLICATIONS,
        activities: INITIAL_ACTIVITIES,
        scholarPass: INITIAL_SCHOLAR_PASS,
        geminiApiKey: envKey,
        rosterStudents: INITIAL_ROSTER,
        lorRequests: INITIAL_LOR_REQUESTS,
        universities: UNIVERSITIES_DATABASE
      };
      saveAppState(state);
      return state;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.activeRole) parsed.activeRole = "student";
    if (!parsed.rosterStudents) parsed.rosterStudents = INITIAL_ROSTER;
    if (!parsed.lorRequests) parsed.lorRequests = INITIAL_LOR_REQUESTS;
    if (!parsed.universities) parsed.universities = UNIVERSITIES_DATABASE;
    if (!parsed.activities || !Array.isArray(parsed.activities) || parsed.activities.length === 0) {
      parsed.activities = INITIAL_ACTIVITIES;
    }
    if (!parsed.scholarPass || !Array.isArray(parsed.scholarPass.quests)) {
      parsed.scholarPass = INITIAL_SCHOLAR_PASS;
    } else {
      parsed.scholarPass = {
        ...INITIAL_SCHOLAR_PASS,
        ...parsed.scholarPass,
        claimedTierIds: Array.isArray(parsed.scholarPass.claimedTierIds) ? parsed.scholarPass.claimedTierIds : [40, 41],
        quests: Array.isArray(parsed.scholarPass.quests) ? parsed.scholarPass.quests : INITIAL_SCHOLAR_PASS.quests,
        targetXp: parsed.scholarPass.targetXp || 10000,
        currentXp: typeof parsed.scholarPass.currentXp === "number" ? parsed.scholarPass.currentXp : 8450,
        level: parsed.scholarPass.level || 42,
      };
    }
    if (!parsed.geminiApiKey) {
      parsed.geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
    }
    return parsed;
  } catch (e) {
    console.error("Failed to load app state from localStorage", e);
    return {
      activeRole: "student",
      profile: DEFAULT_PROFILE,
      certificates: INITIAL_CERTIFICATES,
      applications: INITIAL_APPLICATIONS,
      activities: INITIAL_ACTIVITIES,
      scholarPass: INITIAL_SCHOLAR_PASS,
      geminiApiKey: "",
      rosterStudents: INITIAL_ROSTER,
      lorRequests: INITIAL_LOR_REQUESTS,
      universities: UNIVERSITIES_DATABASE
    };
  }
}

export function saveAppState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("scholarglass_state_updated"));
  } catch (e) {
    console.error("Failed to save app state to localStorage", e);
  }
}

export function switchAccount(accountEmail: string): AppState {
  const state = loadAppState();
  const testAcc = TEST_ACCOUNTS.find((a) => a.email.toLowerCase() === accountEmail.toLowerCase());
  
  if (!testAcc) return state;

  let newProfile = state.profile;
  let newCertificates = state.certificates;
  let newApplications = state.applications;
  let newActivities = state.activities;

  // If selecting a student preset or new user, hydrate with their specific preset data
  if (STUDENT_PRESETS[testAcc.email]) {
    const preset = STUDENT_PRESETS[testAcc.email];
    newProfile = preset.profile;
    newCertificates = preset.certificates;
    newApplications = preset.applications;
    newActivities = preset.activities;
  }

  const updated: AppState = {
    ...state,
    activeRole: testAcc.role,
    profile: newProfile,
    certificates: newCertificates,
    applications: newApplications,
    activities: newActivities
  };

  saveAppState(updated);
  return updated;
}

export function addActivity(activity: ActivityItem): AppState {
  const state = loadAppState();
  const updated: AppState = {
    ...state,
    activities: [activity, ...state.activities]
  };
  saveAppState(updated);
  return updated;
}

export function updateActivity(activity: ActivityItem): AppState {
  const state = loadAppState();
  const updated: AppState = {
    ...state,
    activities: state.activities.map((a) => (a.id === activity.id ? activity : a))
  };
  saveAppState(updated);
  return updated;
}

export function deleteActivity(id: string): AppState {
  const state = loadAppState();
  const updated: AppState = {
    ...state,
    activities: state.activities.filter((a) => a.id !== id)
  };
  saveAppState(updated);
  return updated;
}

export function completeQuest(questId: string): AppState {
  const state = loadAppState();
  const pass = state.scholarPass ? { ...state.scholarPass } : { ...INITIAL_SCHOLAR_PASS };
  if (!Array.isArray(pass.quests)) {
    pass.quests = [...INITIAL_SCHOLAR_PASS.quests];
  }
  const quest = pass.quests.find((q) => q.id === questId);
  if (!quest || quest.completed) return state;

  quest.completed = true;
  quest.progress = quest.maxProgress;

  // Add XP
  pass.currentXp = (pass.currentXp || 0) + quest.xpReward;
  while (pass.currentXp >= (pass.targetXp || 10000)) {
    pass.currentXp -= pass.targetXp;
    pass.level = (pass.level || 1) + 1;
    pass.targetXp = Math.round((pass.targetXp || 10000) * 1.15);
  }

  const updated: AppState = {
    ...state,
    scholarPass: pass
  };
  saveAppState(updated);
  return updated;
}

export function claimPassTier(tierId: number): AppState {
  const state = loadAppState();
  const pass = state.scholarPass ? { ...state.scholarPass } : { ...INITIAL_SCHOLAR_PASS };
  if (!Array.isArray(pass.claimedTierIds)) {
    pass.claimedTierIds = [];
  }
  if (!pass.claimedTierIds.includes(tierId)) {
    pass.claimedTierIds = [...pass.claimedTierIds, tierId];
  }
  const updated: AppState = {
    ...state,
    scholarPass: pass
  };
  saveAppState(updated);
  return updated;
}

export function getUniversityById(id: string): University | undefined {
  return UNIVERSITIES_DATABASE.find((u) => u.id === id);
}

