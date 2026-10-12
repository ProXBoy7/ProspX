import React, { useState } from "react";
import { ActivityItem, ActivityCategory, UserRole } from "../../lib/store";
import { 
  Trophy, 
  Sparkles, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  Building, 
  Award, 
  Lightbulb, 
  Bookmark, 
  Check, 
  Star, 
  Filter,
  FileText,
  X,
  Edit2
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  activities: ActivityItem[];
  activeRole?: UserRole;
  onAddActivity: (activity: ActivityItem) => void;
  onUpdateActivity: (activity: ActivityItem) => void;
  onDeleteActivity: (id: string) => void;
}

export function ActivitiesSaverView({
  activities,
  activeRole = "student",
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity
}: Props) {
  const [activeCategory, setActiveCategory] = useState<"all" | ActivityCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("olympiad");
  const [organization, setOrganization] = useState("");
  const [roleOrAward, setRoleOrAward] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [description, setDescription] = useState("");
  const [memorableMoments, setMemorableMoments] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [highlightInEssay, setHighlightInEssay] = useState(true);

  const filtered = activities.filter((act) => {
    const matchesSearch = 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.memorableMoments.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeCategory === "all") return true;
    return act.category === activeCategory;
  });

  const handleOpenAddModal = () => {
    setEditingActivity(null);
    setTitle("");
    setCategory("olympiad");
    setOrganization("");
    setRoleOrAward("");
    setDateRange("");
    setDescription("");
    setMemorableMoments("");
    setSkillsInput("");
    setHighlightInEssay(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (act: ActivityItem) => {
    setEditingActivity(act);
    setTitle(act.title);
    setCategory(act.category);
    setOrganization(act.organization);
    setRoleOrAward(act.roleOrAward);
    setDateRange(act.dateRange);
    setDescription(act.description);
    setMemorableMoments(act.memorableMoments);
    setSkillsInput(act.skills.join(", "));
    setHighlightInEssay(act.highlightInEssay);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please provide at least a title and description.");
      return;
    }

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingActivity) {
      const updated: ActivityItem = {
        ...editingActivity,
        title,
        category,
        organization,
        roleOrAward,
        dateRange,
        description,
        memorableMoments,
        skills: skills.length > 0 ? skills : editingActivity.skills,
        highlightInEssay
      };
      onUpdateActivity(updated);
      toast.success("Activity record updated successfully!");
    } else {
      const newItem: ActivityItem = {
        id: `act-${Date.now()}`,
        title,
        category,
        organization,
        roleOrAward,
        dateRange: dateRange || "2024 - 2025",
        description,
        memorableMoments,
        skills: skills.length > 0 ? skills : ["Leadership", "Analytical Thinking"],
        highlightInEssay
      };
      onAddActivity(newItem);
      toast.success("Saved new activity & memorable moment for AI essays!");
    }

    setIsModalOpen(false);
  };

  const getCategoryBadge = (cat: ActivityCategory) => {
    switch (cat) {
      case "olympiad":
        return { label: "Olympiad / Competition", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "event":
        return { label: "Event / Summit", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "project":
        return { label: "Independent Project", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "volunteering":
        return { label: "Volunteering & Community", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      default:
        return { label: "Extracurricular", color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
    }
  };

  const olympiadsCount = activities.filter((a) => a.category === "olympiad").length;
  const memorableMomentsCount = activities.filter((a) => a.memorableMoments && a.memorableMoments.trim().length > 10).length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Portfolio & Story Saver
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Extracurriculars, Olympiads & Memorable Moments
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Save competitions, Olympiad medals, research summits, and leadership projects with vivid memorable moments. The AI Essay Lab directly weaves these anecdotes into your application essays.
          </p>
        </div>

        {/* Quick Highlights Counters */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Olympiads</span>
            <strong className="text-xl font-extrabold text-amber-600">{olympiadsCount}</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Essay Stories</span>
            <strong className="text-xl font-extrabold text-primary">{memorableMomentsCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: "all", label: `All (${activities.length})` },
            { id: "olympiad", label: `Olympiads (${olympiadsCount})` },
            { id: "extracurricular", label: "Extracurriculars" },
            { id: "event", label: "Events & Summits" },
            { id: "project", label: "Projects" },
            { id: "volunteering", label: "Volunteering" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "glass-panel text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Add Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search records or moments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Activity Cards Grid */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-base font-bold text-foreground">No records found</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? "No activities or memorable moments match your search query."
              : "Start recording your Olympiad achievements, extracurricular initiatives, and memorable moments for admissions essays."}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Activity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className="glass-panel p-6 rounded-3xl border border-white/60 dark:border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  {/* Top Bar: Category badge, Highlight toggle, Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.highlightInEssay && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Sparkles className="w-3 h-3" />
                          Featured in AI
                        </span>
                      )}
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title="Edit record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${item.title}"?`)) {
                            onDeleteActivity(item.id);
                            toast.success("Activity removed.");
                          }
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                    {item.organization && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-primary" />
                        {item.organization}
                      </span>
                    )}
                    {item.dateRange && (
                      <span className="flex items-center gap-1 opacity-80">
                        <Calendar className="w-3 h-3" />
                        {item.dateRange}
                      </span>
                    )}
                  </div>

                  {/* Role or Award */}
                  {item.roleOrAward && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{item.roleOrAward}</span>
                    </div>
                  )}

                  {/* General Description */}
                  <p className="text-xs text-foreground/80 mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Critical Highlight: Memorable Moments for Essay */}
                  {item.memorableMoments && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 relative">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Memorable Moment (Admissions Story):</span>
                      </div>
                      <p className="text-xs text-foreground font-medium italic leading-relaxed">
                        "{item.memorableMoments}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Skills Tags at Bottom */}
                {item.skills && item.skills.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 flex-wrap">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {editingActivity ? "Edit Activity Record" : "Add Activity or Olympiad Record"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Save descriptions and memorable moments to power your AI admissions essay.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Title / Achievement Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. International Mathematical Olympiad (IMO)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-input bg-background/80 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-2xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="olympiad">Olympiad / Competition</option>
                    <option value="extracurricular">Extracurricular Club</option>
                    <option value="event">Event / Conference / Summit</option>
                    <option value="project">Independent Project / Research</option>
                    <option value="volunteering">Volunteering / Social Impact</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Role or Award Achieved</label>
                  <input
                    type="text"
                    placeholder="e.g. Silver Medalist, Team Lead"
                    value={roleOrAward}
                    onChange={(e) => setRoleOrAward(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Organization / Committee</label>
                  <input
                    type="text"
                    placeholder="e.g. National Olympiad Committee"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Date Range</label>
                  <input
                    type="text"
                    placeholder="e.g. May 2024 or 2023 - Present"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">General Scope & Responsibilities *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Summarize the core activities, team responsibilities, and overall outcomes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-input bg-background/80 px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Crucial Memorable Moments Section */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Memorable Moments (For AI Admissions Essay)</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  What specific obstacle, sudden crisis, lab equipment breakdown, or eureka moment happened? The AI uses this personal story as proof of resilience.
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. 'During the final 45 minutes, our team's sensor cracked. I quickly rewrote our navigation code using fallback ultrasonic sensors, saving our robot from disqualification...'"
                  value={memorableMoments}
                  onChange={(e) => setMemorableMoments(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-amber-500/30 bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Key Skills Learned (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, Graph Theory, Resilience, Public Speaking"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-input bg-background/80 px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="highlightToggle"
                  checked={highlightInEssay}
                  onChange={(e) => setHighlightInEssay(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="highlightToggle" className="text-xs font-medium text-foreground cursor-pointer select-none">
                  Highlight this activity as a primary story in my AI essays
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary text-xs font-bold text-white shadow-sm hover:opacity-90 transition"
                >
                  {editingActivity ? "Update Record" : "Save Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
