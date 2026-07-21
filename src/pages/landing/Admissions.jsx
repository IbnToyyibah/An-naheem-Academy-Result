import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, FileText, CreditCard, HelpCircle,
  CheckCircle2, ChevronRight, ChevronDown, GraduationCap,
  Calendar, Phone, Mail, AlertCircle
} from 'lucide-react';
import LandingLayout from './LandingLayout.jsx';

/* ── Helpers ──────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 36 : direction === 'down' ? -36 : 0, x: direction === 'left' ? 36 : direction === 'right' ? -36 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'} transition={{ duration: 0.55, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

function SectionHead({ tag, title, sub, center = true }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {tag && <span className="inline-block bg-primary-soft text-primary-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">{tag}</span>}
      <h2 className="text-2xl sm:text-3xl font-black text-ink mb-3 leading-tight">{title}</h2>
      {sub && <p className="text-muted max-w-xl mx-auto text-sm leading-relaxed">{sub}</p>}
    </div>
  );
}

/* ── DATA ─────────────────────────────────────────────── */
const STEPS = [
  { num: '01', icon: FileText, title: 'Download Form', desc: 'Collect the admission form from the school office or download it from this page.' },
  { num: '02', icon: ClipboardList, title: 'Complete & Submit', desc: 'Fill in all sections accurately and submit with the required supporting documents.' },
  { num: '03', icon: GraduationCap, title: 'Entrance Assessment', desc: 'Candidates sit a brief entrance assessment covering English, Mathematics and Islamic Studies.' },
  { num: '04', icon: CheckCircle2, title: 'Offer & Acceptance', desc: 'Successful candidates receive a formal offer letter. Accept within 7 days to secure the place.' },
  { num: '05', icon: CreditCard, title: 'Pay School Fees', desc: 'Complete payment of the acceptance fee and first-term tuition to confirm enrolment.' },
  { num: '06', icon: Calendar, title: 'Resume Date', desc: 'Collect your timetable and uniform list, then report on the official resumption date.' },
];

const REQUIREMENTS = [
  'Completed admission application form',
  'Birth certificate or declaration of age',
  'Primary 6 school leaving certificate (or equivalent)',
  'Two recent passport photographs (white background)',
  'Immunisation / health card',
  'Introductory letter from previous school',
  'Payment receipt for application processing fee',
];

const FEES = [
  { item: 'Application / Processing Fee', amount: '₦2,000', note: 'Non-refundable' },
  { item: 'Acceptance Fee', amount: '₦5,000', note: 'On offer of admission' },
  { item: 'Tuition (per term)', amount: '₦25,000', note: 'Covers all core subjects' },
  { item: 'Development Levy (annual)', amount: '₦5,000', note: 'Paid once per session' },
  { item: 'Uniform Set', amount: '₦8,500', note: 'Available at school store' },
  { item: 'Textbook Package', amount: '₦12,000', note: 'Full set for the class level' },
];

const FAQS = [
  { q: 'What age group does An-Naheem Academy admit?', a: 'We admit students from age 10–15 into JSS 1. Candidates must have completed their primary education (Primary 6).' },
  { q: 'Is the school co-educational?', a: 'Yes. An-Naheem Academy admits both male and female students. We maintain separate sections where required by Islamic practice.' },
  { q: 'What is the language of instruction?', a: 'All core subjects are taught in English. Arabic language is taught as a dedicated subject and used in Islamic Studies classes.' },
  { q: 'Are scholarships or fee waivers available?', a: 'Yes. We offer merit-based scholarships and partial fee waivers for students who demonstrate exceptional academic or Quranic ability. Contact the bursar\'s office for details.' },
  { q: 'Can we pay school fees in instalments?', a: 'An approved instalment plan is available for families who need it. Please speak to the bursar before the term begins.' },
  { q: 'What happens if my child misses the entrance assessment?', a: 'A supplementary assessment date is usually offered. Contact the admissions office to arrange a suitable date.' },
  { q: 'How do I access my child\'s results online?', a: 'Once enrolled, you receive an admission number and default password to log in to the parent portal and view your child\'s results.' },
  { q: 'When does the next academic session begin?', a: 'The 2026/2027 session is scheduled to begin on 21 September 2026. Applications close 4 weeks before resumption.' },
];

/* ── FAQ accordion item ───────────────────────────────── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={index * 0.06}>
      <div className="border border-line rounded-xl overflow-hidden">
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-page transition-colors"
        >
          <span className="font-bold text-sm text-ink leading-snug">{q}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0 text-muted">
            <ChevronDown size={18} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 text-sm text-muted leading-relaxed border-t border-line bg-page">
                {a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

/* ══════════════════════════════════════════════════════
   ADMISSIONS PAGE
══════════════════════════════════════════════════════ */
export default function Admissions() {
  return (
    <LandingLayout>

      {/* ── PAGE HERO ────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0b3d35] via-[#0f5c52] to-[#1a7a6e] text-white py-24 px-6 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 h-60 w-60 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-yellow-400/30">
            <AlertCircle size={13} /> Admissions Now Open — 2025/2026 Session
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mb-5 leading-tight text-white">
            Begin Your Child's<br />Journey With Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/75 text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Everything you need to know about applying to An-Naheem Academy — process, requirements, fees, and answers to your questions.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap gap-4 justify-center">
            <a href="#process" className="inline-flex items-center gap-2 bg-yellow-400 text-[#0b3d35] font-black px-7 py-3 rounded-xl hover:bg-yellow-300 transition text-sm shadow-lg">
              View Process <ChevronRight size={15} />
            </a>
            <a href="#fees" className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-7 py-3 rounded-xl hover:bg-white/20 transition text-sm border border-white/20">
              See Fee Schedule
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" className="w-full" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,50 L0,50 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── 1. ADMISSION PROCESS ─────────────────────────── */}
      <section id="process" className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="How to Apply" title="Admission Process" sub="Six simple steps from application to first day of school." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
              <FadeIn key={num} delay={i * 0.08}>
                <div className="relative bg-page rounded-2xl p-6 border border-line hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden group">
                  {/* Step number watermark */}
                  <span className="absolute top-3 right-4 text-6xl font-black text-primary/6 select-none group-hover:text-primary/10 transition-colors">
                    {num}
                  </span>
                  <div className="h-12 w-12 rounded-xl bg-primary grid place-items-center mb-4 relative z-10">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-black text-sm text-ink mb-2 relative z-10">{title}</h3>
                  <p className="text-xs text-muted leading-relaxed relative z-10">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. REQUIREMENTS ──────────────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-14 items-start">
          <FadeIn direction="right">
            <span className="inline-block bg-primary-soft text-primary-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Requirements</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink mb-5 leading-tight">What You Need to Apply</h2>
            <p className="text-sm text-muted leading-relaxed mb-7">
              Please ensure all documents are ready before submitting your application. Incomplete applications will not be processed.
            </p>
            <ul className="grid gap-3">
              {REQUIREMENTS.map((item, i) => (
                <motion.li key={item} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-start gap-3 text-sm text-ink">
                  <CheckCircle2 size={17} className="text-primary shrink-0 mt-0.5" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn direction="left" delay={0.15}>
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-white/15 grid place-items-center">
                  <HelpCircle size={22} className="text-yellow-300" />
                </div>
                <div>
                  <div className="font-black text-base">Need Help?</div>
                  <div className="text-white/70 text-xs">Our admissions team is here</div>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                If you have any questions about the application process or required documents, do not hesitate to reach out. We are happy to guide you every step of the way.
              </p>
              <ul className="grid gap-4">
                <li className="flex items-center gap-3 text-sm text-white/85">
                  <Phone size={16} className="text-yellow-300 shrink-0" />
                  +234 000 000 0000
                </li>
                <li className="flex items-center gap-3 text-sm text-white/85">
                  <Mail size={16} className="text-yellow-300 shrink-0" />
                  admissions@annaheemacademy.edu.ng
                </li>
                <li className="flex items-center gap-3 text-sm text-white/85">
                  <Calendar size={16} className="text-yellow-300 shrink-0" />
                  Office hours: Mon–Fri, 8am–3pm
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 3. FEE INFORMATION ───────────────────────────── */}
      <section id="fees" className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-4xl">
          <FadeIn><SectionHead tag="Fee Schedule" title="School Fee Information" sub="Transparent pricing with no hidden charges. All fees are in Nigerian Naira (₦)." /></FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-line overflow-hidden shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-3 bg-primary text-white px-6 py-4 text-xs font-bold uppercase tracking-wider">
                <span>Item</span>
                <span className="text-center">Amount</span>
                <span className="text-right">Note</span>
              </div>
              {/* Rows */}
              {FEES.map(({ item, amount, note }, i) => (
                <motion.div key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`grid grid-cols-3 items-center px-6 py-4 text-sm border-b border-line last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-page'}`}>
                  <span className="font-semibold text-ink">{item}</span>
                  <span className="text-center font-black text-primary text-base">{amount}</span>
                  <span className="text-right text-xs text-muted">{note}</span>
                </motion.div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
              <AlertCircle size={17} className="shrink-0 mt-0.5 text-amber-500" />
              <span>All fees are subject to review at the start of each new academic session. Please confirm current rates with the school bursar before making payment.</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. FAQS ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-3xl">
          <FadeIn><SectionHead tag="FAQs" title="Frequently Asked Questions" sub="Quick answers to the questions parents ask us most." /></FadeIn>
          <div className="grid gap-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0b3d35] to-[#0f5c52] text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-3xl text-center relative">
          <FadeIn>
            <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 border border-white/20">Take the First Step</span>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
              Secure Your Child's Place Today
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Spaces are limited. Apply now and give your child the gift of an education that nurtures both excellence and faith.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+2340000000000"
                className="inline-flex items-center gap-2 bg-yellow-400 text-[#0b3d35] font-black px-7 py-3.5 rounded-xl hover:bg-yellow-300 transition text-sm shadow-xl">
                <Phone size={16} /> Call Admissions Office
              </a>
              <Link to="/parent-login"
                className="inline-flex items-center gap-2 border border-white/25 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition text-sm">
                <GraduationCap size={16} /> Parent Portal Login
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </LandingLayout>
  );
}
