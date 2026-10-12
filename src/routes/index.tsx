import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../components/theme-toggle";
import SoftBlurIn from '../components/ui/smoothui/soft-blur-in';
import CursorFollow from '../components/ui/smoothui/cursor-follow';
import Stats2 from '../components/ui/smoothui/stats-2';
import Team2 from '../components/ui/smoothui/team-2';
import Testimonials1 from '../components/ui/smoothui/testimonials-1';
import Faq2 from '../components/ui/smoothui/faq-2';
import Footer3 from '../components/ui/smoothui/footer-3';
import ShimmerSweep from '../components/ui/smoothui/shimmer-sweep';
import PerWordCrossfade from '../components/ui/smoothui/per-word-crossfade';
import { NumberTicker } from '../components/ui/number-ticker';
import { BentoGrid, BentoCard } from '../components/ui/bento-grid';
import AnimatedProgressBar from '../components/ui/smoothui/animated-progress-bar';
import { FileText, Bell, Share2, Calendar, Verified, Bot, Milestone } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";

function HeroTitle({ customTitle }: { customTitle?: string }) {
  const [highlightPill, setHighlightPill] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlightPill(true);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  if (customTitle) {
    return (
      <h1 className="text-4xl font-black leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-3xl">
        {customTitle}
      </h1>
    );
  }

  return (
    <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight text-primary sm:text-6xl md:text-7xl">
      <div className="block">
        <SoftBlurIn delay={0}>Refine your </SoftBlurIn>
        <motion.span
          className="inline-block rounded-2xl transition-all duration-500 my-1 mx-1"
          animate={{
            backgroundColor: highlightPill ? "var(--primary)" : "transparent",
            color: highlightPill ? "var(--primary-foreground)" : "var(--primary)",
            paddingLeft: highlightPill ? "0.85rem" : "0rem",
            paddingRight: highlightPill ? "0.85rem" : "0rem",
            paddingTop: highlightPill ? "0.2rem" : "0rem",
            paddingBottom: highlightPill ? "0.2rem" : "0rem",
            boxShadow: highlightPill ? "0 10px 30px -5px rgba(0, 91, 191, 0.3)" : "none",
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <SoftBlurIn delay={250}>academic</SoftBlurIn>
        </motion.span>
      </div>
      <div className="block mt-2">
        <SoftBlurIn delay={500}>vision.</SoftBlurIn>
      </div>
    </h1>
  );
}
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScholarGlass AI — Refine your academic vision" },
      {
        name: "description",
        content:
          "ScholarGlass AI helps students and researchers refine their academic vision with an evidence vault, AI synthesis, and portfolio timeline.",
      },
      { property: "og:title", content: "ScholarGlass AI — Refine your academic vision" },
      {
        property: "og:description",
        content:
          "A luminous acrylic workspace for students: evidence vault, AI synthesis, and a portfolio timeline that grows with your work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [videoScale, setVideoScale] = useState(0.72);
  const [videoModalOpen, setVideoModalOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Map scroll from hero exit to end of the video section (~vh) → 0.72 → 1
      const vh = window.innerHeight;
      const start = vh * 0.35;
      const end = vh * 1.0;
      const t = Math.min(1, Math.max(0, (y - start) / (end - start)));
      setVideoScale(0.72 + t * 0.28);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [customTitle, setCustomTitle] = useState<string>("");
  const [customSubtitle, setCustomSubtitle] = useState<string>("");
  const [customCta, setCustomCta] = useState<string>("Launch Your Portfolio");

  useEffect(() => {
    try {
      const t = localStorage.getItem("prospx_hero_title");
      const s = localStorage.getItem("prospx_hero_subtitle");
      const c = localStorage.getItem("prospx_hero_cta");
      if (t) setCustomTitle(t);
      if (s) setCustomSubtitle(s);
      if (c) setCustomCta(c);
    } catch {}
  }, []);

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors"
      style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* Ambient animated blobs */}
      <div
        aria-hidden
        className="blob-a pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, var(--blob-a) 0%, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="blob-b pointer-events-none fixed -bottom-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, var(--blob-b) 0%, transparent 70%)` }}
      />

      {/* Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : ""
        }`}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-[clamp(1rem,4vw,2rem)] py-4 sm:flex sm:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary shadow-lg">
              <span className="material-symbols-outlined text-primary-foreground" style={{ fontSize: 20 }}>
                school
              </span>
            </div>
            <span className="truncate text-lg font-bold tracking-tight text-primary">
              ScholarGlass AI
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/universities"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/50 transition border border-border/60"
            >
              <span>Explore Universities</span>
            </Link>
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition"
            >
              Sign in
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="auth"
        className="relative flex min-h-screen items-center justify-center px-6 pt-24 pb-16"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <PerWordCrossfade>Luminous Acrylic · Student Portfolio Suite</PerWordCrossfade>
          </p>
          <HeroTitle customTitle={customTitle} />
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            <ShimmerSweep delay={600}>
              {customSubtitle || "A calm, luminous workspace where evidence, projects, and AI synthesis live side by side — built for the way modern students actually research."}
            </ShimmerSweep>
          </p>

          {/* Action CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition"
            >
              <span>{customCta}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-foreground hover:bg-card transition"
            >
              <span className="material-symbols-outlined text-base text-primary">travel_explore</span>
              <span>Browse QS Rankings</span>
            </Link>
          </div>
        </div>

        <a
          href="#intro"
          aria-label="Scroll to introduction"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 grid h-11 w-11 place-items-center rounded-full border border-border bg-card/60 text-foreground animate-bounce"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            expand_more
          </span>
        </a>
      </section>

      {/* Scroll-scaling video */}
      <section id="showcase" className="relative px-6 pb-24 pt-8">
        <CursorFollow>
          <div className="mx-auto max-w-6xl">
            <div
              onClick={() => setVideoModalOpen(true)}
              className="scroll-video mx-auto overflow-hidden border border-primary/20 shadow-2xl cursor-pointer group relative rounded-3xl"
              style={
                {
                  ["--sv-scale" as any]: videoScale,
                  background: "rgba(var(--surface) / 0.6)",
                  boxShadow:
                    "0 40px 120px -40px color-mix(in oklab, var(--primary) 45%, transparent)",
                } as React.CSSProperties
              }
            >
              {/* Backlight Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-cyan-500/20 to-primary/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition duration-500 pointer-events-none" />
              <video
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="relative z-10 block h-[52vh] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                data-cursor-text="Play intro"
              />
            </div>
          </div>
        </CursorFollow>
      </section>

      {/* Introduction — bento */}
      <section id="intro" className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Introduction
          </p>
          <h2 className="mb-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            One serene surface for every piece of your academic work.
          </h2>
          <p className="mb-12 max-w-2xl text-lg text-muted-foreground">
            ScholarGlass AI brings your notes, sources, projects, and reflections into a single
            luminous workspace — so you spend less time hunting for evidence and more time thinking.
          </p>

          <BentoGrid className="grid-cols-1 lg:grid-cols-3 auto-rows-[17rem] gap-6">
            {bentoFeatures.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              About the app
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for students who take their work seriously.
            </h2>
            <p className="mb-4 text-muted-foreground">
              Whether you're wrapping a semester project or building a multi-year research
              portfolio, ScholarGlass gives you a durable place for every draft, citation, and
              insight — with AI that only ever answers from evidence you own.
            </p>
            <p className="text-muted-foreground">
              No dark patterns, no data mining. Just a calm, focused workspace designed with
              academics, for academics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-5 backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-card/80">
              <div className="text-3xl font-extrabold text-primary tracking-tight flex items-baseline gap-1">
                <NumberTicker value={12} />k+
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">Active Students</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Across top institutions</div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-5 backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-card/80">
              <div className="text-3xl font-extrabold text-primary tracking-tight flex items-baseline">
                <NumberTicker value={48} />
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">Universities</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Worldwide adoption</div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-5 backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-card/80">
              <div className="text-3xl font-extrabold text-primary tracking-tight flex items-baseline gap-1">
                <NumberTicker value={1.2} decimalPlaces={1} />M
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">Evidence Records</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Safely indexed</div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-5 backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-card/80">
              <div className="text-3xl font-extrabold text-primary tracking-tight flex items-baseline gap-1">
                <NumberTicker value={99.9} decimalPlaces={1} />%
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">Vault Uptime</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Reliable research</div>
            </div>
          </div>

        </div>
      </section>

      <section className="relative px-6 py-24">
        <Team2 />
      </section>

      <section className="relative px-6 py-24 bg-muted/30">
        <Testimonials1 />
      </section>

      {/* Manifesto — dedicated statement */}
      <section id="manifesto" className="relative overflow-hidden px-6 py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
          style={{ background: `radial-gradient(ellipse at center, var(--blob-a) 0%, transparent 70%)` }}
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Our promise
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Your research, gently amplified.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ScholarGlass keeps every source, note, and reflection at your fingertips — quietly
            organized, never in the way. Focus on the ideas; we'll hold the scaffolding.
          </p>
          <Link
            to="/sign-up"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition"
          >

            Start exploring
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_forward
            </span>
          </Link>

        </div>
      </section>

      {/* FAQ Section (Fixed Duplicate Title) */}
      <section id="faq" className="relative px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Faq2 />
        </div>
      </section>

      {/* Support / Contact Us Section (Image 2 style) */}
      <section id="support" className="relative px-6 py-20 border-t border-border/50">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-card/80 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Column: Contact Information */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-foreground">Contact information</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                    We help you find direction, remove friction, and keep your research moving forward—strategically and confidently.
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-sm text-foreground">
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>call</span>
                    <span className="font-semibold">+1 561 301 4406</span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>mail</span>
                    <span className="font-semibold">info@scholarglass.ai</span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>location_on</span>
                    <span className="font-semibold">Newtown, CT 06482</span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>schedule</span>
                    <span className="font-semibold">Monday – Friday, 9:00 AM – 6:00 PM (EST)</span>
                  </div>
                </div>

                {/* Map Preview Graphic */}
                <div className="relative overflow-hidden rounded-2xl border border-border/80 h-44 shadow-md bg-muted/40 group">
                  <img
                    src="https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco,CA&zoom=12&size=600x300&sensor=false&key=AIzaSyA"
                    alt="ScholarGlass Location Map"
                    className="w-full h-full object-cover grayscale opacity-90 transition group-hover:grayscale-0 group-hover:scale-105 duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-primary bg-background/90 px-3 py-1.5 rounded-full shadow-xs border border-border">
                      📍 Newtown Research Hub
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Send Us a Message */}
              <div className="lg:col-span-7 space-y-6 border-t lg:border-t-0 lg:border-l border-border/60 pt-8 lg:pt-0 lg:pl-12">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-foreground">Send Us a Message</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Fill up the form and our team will get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">First name</label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Last name</label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Phone</label>
                      <input
                        type="tel"
                        placeholder="Enter phone"
                        className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Type here..."
                      className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-foreground px-7 py-3 text-sm font-bold text-background shadow-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Popup (Matching Image 1) */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-8"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white/80 hover:bg-black hover:text-white backdrop-blur-md transition border border-white/20"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>

              <iframe
                src="https://www.youtube.com/embed/7i7miqyB8wY?autoplay=1"
                title="ScholarGlass AI Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer3 />
    </div>
  );
}

const bentoFeatures = [
  {
    Icon: FileText,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "/sign-in",
    cta: "Learn more",
    className: "col-span-1 lg:col-span-1 bg-card/70 backdrop-blur-xl border border-border/80 shadow-md",
    background: (
      <div className="absolute inset-0 p-4 pt-12 overflow-hidden pointer-events-none opacity-40">
        <div className="flex gap-3 -rotate-6 scale-90 translate-x-4">
          <div className="rounded-xl border border-border bg-card p-3 shadow-md w-36">
            <div className="font-bold text-xs">finances.xlsx</div>
            <div className="text-[10px] text-muted-foreground mt-1">Spreadsheet data...</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 shadow-md w-36">
            <div className="font-bold text-xs">logo.svg</div>
            <div className="text-[10px] text-muted-foreground mt-1">Vector graphics...</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Bell,
    name: "Notifications",
    description: "Get notified when something happens.",
    href: "/sign-in",
    cta: "View activity",
    className: "col-span-1 lg:col-span-2 bg-card/70 backdrop-blur-xl border border-border/80 shadow-md",
    background: (
      <div className="absolute inset-0 p-6 flex flex-col justify-center gap-2.5 overflow-hidden pointer-events-none opacity-50">
        <div className="ml-auto w-64 rounded-xl border border-border bg-card p-2.5 shadow-sm flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">⚡</div>
          <div>
            <div className="text-xs font-bold">New event <span className="text-[10px] font-normal text-muted-foreground">· 2m ago</span></div>
            <div className="text-[10px] text-muted-foreground">Magic UI</div>
          </div>
        </div>
        <div className="ml-auto w-64 rounded-xl border border-border bg-card p-2.5 shadow-sm flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-xs">💬</div>
          <div>
            <div className="text-xs font-bold">New message <span className="text-[10px] font-normal text-muted-foreground">· 5m ago</span></div>
            <div className="text-[10px] text-muted-foreground">Magic UI</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Share2,
    name: "Integrations",
    description: "Supports 100+ integrations and counting.",
    href: "/sign-in",
    cta: "Browse all",
    className: "col-span-1 lg:col-span-2 bg-card/70 backdrop-blur-xl border border-border/80 shadow-md",
    background: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="relative flex items-center justify-center w-full">
          <div className="h-12 w-12 rounded-full border border-border bg-primary/20 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Calendar,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/sign-in",
    cta: "Open calendar",
    className: "col-span-1 lg:col-span-1 bg-card/70 backdrop-blur-xl border border-border/80 shadow-md",
    background: (
      <div className="absolute inset-0 p-4 flex justify-end pointer-events-none opacity-45">
        <div className="rounded-xl border border-border bg-card p-3 shadow-md w-36 text-center text-xs">
          <div className="font-bold text-primary mb-1">‹ July 2026 ›</div>
          <div className="grid grid-cols-7 gap-1 text-[9px] text-muted-foreground font-mono">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            <div>1</div><div>2</div><div className="bg-primary text-primary-foreground rounded-full font-bold">3</div><div>4</div><div>5</div><div>6</div><div>7</div>
          </div>
        </div>
      </div>
    ),
  },
];

const stats = [
  { value: "12k+", label: "Students onboard" },
  { value: "48", label: "Universities" },
  { value: "1.2M", label: "Evidence records" },
  { value: "99.9%", label: "Uptime" },
];


const faqs = [
  {
    q: "Is my research private?",
    a: "Yes. Your vault is encrypted at rest and never used to train external models.",
  },
  {
    q: "Do I need an academic email?",
    a: "Not required — but verified academic emails unlock the free student tier.",
  },
  {
    q: "Can I export my portfolio?",
    a: "Anytime. Export to PDF, Markdown, or a portable JSON archive.",
  },
  {
    q: "Does it work offline?",
    a: "Reading and drafting work offline; sync resumes automatically when you reconnect.",
  },
];
