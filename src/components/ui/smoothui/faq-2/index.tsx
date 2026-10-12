"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const ANIMATION_DURATION = 0.6;
const STAGGER_DELAY = 0.1;
const INITIAL_Y_OFFSET = 20;
const HOVER_SCALE = 1.01;
const TAP_SCALE = 0.99;
const ROTATION_OPEN = 180;
const ROTATION_CLOSED = 0;
const CONTENT_DELAY = 0.1;
const INITIAL_CONTENT_Y = -10;

interface FaqsAccordionProps {
  description?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
}

export function FaqsAccordion({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about ProspX admissions features, evidence vaults, and AI essay grounding",
  faqs = [
    {
      question: "What is ProspX and how does it help with university admissions?",
      answer:
        "ProspX is an intelligent academic admissions platform that bridges verified extracurriculars, independent research, and college applications. It empowers students to track achievements with tamper-evident proof, discover 30+ QS-ranked universities, and generate essays strictly grounded in their real experiences.",
    },
    {
      question: "How does the Evidence & Activities Vault preserve my records?",
      answer:
        "The Evidence Vault securely stores your independent research, Olympiad medals, competitions, and leadership activities along with personal 'memorable moments'. These reflections serve as authentic, verifiable evidence for admissions committees and personal statement drafting.",
    },
    {
      question: "How does the AI Essay Lab ensure my personal statement is grounded and unique?",
      answer:
        "The AI Essay Lab uses Google Gemini to generate and critique essays anchored directly in your verified vault data. Instead of generating generic clichés, the AI weaves your specific project turning points and contest breakthroughs into compelling narratives while providing structural and tone critique.",
    },
    {
      question: "What is the Scholar Pass and how do students earn XP?",
      answer:
        "The Scholar Pass is a gamified admissions companion. As you complete vital milestones—such as drafting essay prompts, uploading official transcripts, exploring QS universities, or logging volunteering hours—you earn XP to level up tiers, unlocking new features and badges.",
    },
    {
      question: "Can school counselors and teachers collaborate on ProspX?",
      answer:
        "Yes! ProspX features strict single-role security for students, school counselors, and faculty teachers. Counselors can manage student rosters and verify GPAs, while teachers can write and cryptographically sign Letters of Recommendation (LORs) grounded in classroom observations.",
    },
    {
      question: "How does the QS University Finder work with my profile?",
      answer:
        "The built-in QS World University database lets you filter top global universities by your self-reported or verified GPA, target degree, budget, popular majors, and international visa requirements (such as US F-1, UK CAS, or Swiss Canton permits).",
    },
  ],
}: FaqsAccordionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: INITIAL_Y_OFFSET }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: ANIMATION_DURATION }
          }
          viewport={{ once: true }}
          whileInView={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
        >
          <h2 className="mb-4 font-bold text-3xl text-foreground lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
            {description}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-brand hover:shadow-lg"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: INITIAL_Y_OFFSET }
              }
              key={faq.question}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: ANIMATION_DURATION,
                      delay: index * STAGGER_DELAY,
                    }
              }
              viewport={{ once: true }}
              whileInView={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
            >
              <motion.button
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-background/50"
                onClick={() => toggleAccordion(index)}
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: HOVER_SCALE }}
                whileTap={shouldReduceMotion ? {} : { scale: TAP_SCALE }}
              >
                <h3 className="pr-4 font-semibold text-foreground text-lg">
                  {faq.question}
                </h3>
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {
                          rotate:
                            openIndex === index
                              ? ROTATION_OPEN
                              : ROTATION_CLOSED,
                        }
                      : {
                          rotate:
                            openIndex === index
                              ? ROTATION_OPEN
                              : ROTATION_CLOSED,
                        }
                  }
                  className="flex-shrink-0"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: ANIMATION_DURATION, ease: "easeInOut" }
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-foreground/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : { height: 0, opacity: 0 }
                    }
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: ANIMATION_DURATION, ease: "easeInOut" }
                    }
                  >
                    <motion.div
                      animate={{ y: 0 }}
                      className="px-6 pb-6"
                      exit={
                        shouldReduceMotion
                          ? { transition: { duration: 0 } }
                          : { y: INITIAL_CONTENT_Y }
                      }
                      initial={
                        shouldReduceMotion ? { y: 0 } : { y: INITIAL_CONTENT_Y }
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              duration: ANIMATION_DURATION,
                              delay: CONTENT_DELAY,
                            }
                      }
                    >
                      <p className="text-foreground/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqsAccordion;
