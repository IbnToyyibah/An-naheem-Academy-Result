import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, FileText, CreditCard, HelpCircle,
  CheckCircle2, ChevronRight, ChevronDown, GraduationCap,
  Calendar, Phone, Mail, AlertCircle,
} from 'lucide-react';
import LandingLayout from './LandingLayout.jsx';

function FadeIn({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: direction === 'up' ? 28 : direction === 'down' ? -28 : 0, x: direction === 'left' ? 28 : direction === 'right' ? -28 : 0 }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

function SectionHead({ tag, title, sub, light = false }) {
  return (
    <div className="text-center mb-10">
      {tag && (
        <span className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded mb-3 ${light ? 'bg-white/15 text-white border border-white/20' : 'bg-blue-50 text-[#1e3a8a] border border-blue-100'}`}>
          {tag}
        </span>
      )}
      <h2 className={`text-2xl sm:text-[28px] font-bold mb-2.5 leading-snug ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      {sub && <p className={`text-sm max-w-lg mx-auto leading-relaxed ${light ? 'text-white/65' : 'text-slate-500'}`}>{sub}</p>}
    </div>
  );
}

const STEPS = [
  { num: '01', icon: FileText, title: 'Obtain Form', desc: 'Collect the admission form from the school office or contact the admissions team.' },
  { num: '02', icon: ClipboardList, title: 'Complete & Submit', desc: 'Fill all sections accurately and submit with the required supporting documents.' },
  { num: '03', icon: GraduationCap, title: 'Entrance Assessment', desc: 'Candidates sit an assessment covering English, Mathematics and Islamic Studies.' },
  { num: '04', icon: CheckCircle2, title: 'Offer Letter', desc: 'Successful candidates receive a formal offer. Accept within 7 days to secure the place.' },
  { num: '05', icon: CreditCard, title: 'Pay School Fees', desc: 'Complete the acceptance fee and first-term tuition to confirm enrolment.' },
  { num: '06', icon: Calendar, title: 'Resumption', desc: 'Collect your timetable and uniform list, then report on the official first day.' },
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
  { q: 'What age group does An-Naheem Academy admit?', a: 'We admit students from age 10–15 into JSS 1, and transfer students are considered for higher year groups on a case-by-case basis.' },
  { q: 'Is the school co-educational?', a: 'Yes. We admit both male and female students and maintain appropriate arrangements in line with Islamic practice.' },
  { q: 'What is the language of instruction?', a: 'Core subjects are taught in English. Arabic is taught as a dedicated subject and used in Islamic Studies classes.' },
  { q: 'Do you offer scholarships or fee waivers?', a: 'Yes — merit-based scholarships are available for students with exceptional academic or Quranic ability. Contact the bursar for details.' },
  { q: 'Can fees be paid in instalments?', a: 'An approved instalment plan is available for families who need it. Please speak with the bursar before the term begins.' },
  { q: 'What if my child misses the entrance assessment?', a: 'A supplementary date is usually offered. Contact the admissions office to arrange a suitable time.' },
  { q: 'How do I access my child\'s results online?', a: 'After enrolment you receive an admission number and default password to log in to the parent portal.' },
  { q: 'When does the next academic session begin?', a: 'The 2026/2027 session begins on 21 September 2026. Applications close four weeks before resumption.' },
];

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={index * 0.05}>
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <button onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors">
          <span className="font-medium text-sm text-slate-800 leading-snug">{q}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-slate-400">
            <ChevronDown size={16} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <div className="px-5 pb-4 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50">{a}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

export default function Admissions() {
  return (
    <LandingLayout>

      {/* HERO */}
      <section className="relative bg-[#0f172a] text-white py-20 px-5 overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 55%, #1e3a8a 0%, transparent 55%), radial-gradient(circle at 80% 15%, #0ea5e9 0%, transparent 45%)' }} />
        <div className="mx-auto max-w-4xl text-center relative">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-widest px-3.5 py-1.5 rounded mb-4">
            <AlertCircle size={12} /> Admissions Open — 2025/2026 Session
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Begin Your Child's Journey<br />With An-Naheem Academy
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto mb-7">
            Everything you need to know — admission process, requirements, fees, and answers to common questions.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center">
            <a href="#process"
              className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1e40af] transition text-sm shadow-md">
              View Process <ChevronRight size={14} />
            </a>
            <a href="#fees"
              className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-white/12 transition text-sm">
              See Fee Schedule
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 36" className="w-full" preserveAspectRatio="none">
            <path d="M0,24 C480,44 960,0 1440,24 L1440,36 L0,36 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ADMISSION PROCESS */}
      <section id="process" className="py-14 px-5 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="How to Apply" title="Admission Process" sub="Six clear steps from application to your child's first day." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
              <FadeIn key={num} delay={i * 0.07}>
                <div className="relative bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-300 h-full overflow-hidden group">
                  <span className="absolute top-3 right-4 text-5xl font-black text-slate-100 select-none group-hover:text-blue-50 transition-colors leading-none">{num}</span>
                  <div className="h-10 w-10 rounded-lg bg-[#1e3a8a] grid place-items-center mb-4 relative z-10">
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-1.5 relative z-10">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed relative z-10">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="py-14 px-5 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
          <FadeIn direction="right">
            <span className="inline-block bg-blue-50 text-[#1e3a8a] border border-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded mb-4">Requirements</span>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">What You Need to Apply</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">Ensure all documents are ready before submission. Incomplete applications will not be processed.</p>
            <ul className="grid gap-2.5">
              {REQUIREMENTS.map((item, i) => (
                <motion.li key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 size={15} className="text-[#1e3a8a] shrink-0 mt-0.5" /> {item}
                </motion.li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn direction="left" delay={0.1}>
            <div className="bg-[#1e3a8a] rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-lg bg-white/15 grid place-items-center shrink-0">
                  <HelpCircle size={20} className="text-sky-300" />
                </div>
                <div>
                  <div className="font-bold text-sm">Need Help?</div>
                  <div className="text-white/60 text-xs">Our admissions team is ready</div>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                Contact us with any questions about the application process, required documents, or class availability.
              </p>
              <ul className="grid gap-3">
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <Phone size={14} className="text-sky-400 shrink-0" />
                  <a href="https://wa.me/2348060171809" target="_blank" rel="noreferrer"
                    className="hover:text-sky-300 transition-colors">
                    +234 8060171809 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <Mail size={14} className="text-sky-400 shrink-0" />
                  <a href="mailto:annaheemacademy2017@gmail.com"
                    className="hover:text-sky-300 transition-colors">
                    annaheemacademy2017@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <Calendar size={14} className="text-sky-400 shrink-0" /> Mon–Fri, 8:00am – 3:00pm
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FEES */}
      <section id="fees" className="py-14 px-5 bg-white">
        <div className="mx-auto max-w-3xl">
          <FadeIn><SectionHead tag="Fee Schedule" title="School Fee Information" sub="Transparent pricing with no hidden charges. All fees in Nigerian Naira (₦)." /></FadeIn>
          <FadeIn delay={0.08}>
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-[#1e3a8a] text-white px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                <span>Item</span><span className="text-center">Amount</span><span className="text-right">Note</span>
              </div>
              {FEES.map(({ item, amount, note }, i) => (
                <motion.div key={item} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}
                  className={`grid grid-cols-3 items-center px-5 py-3.5 text-sm border-b border-slate-100 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <span className="font-medium text-slate-800">{item}</span>
                  <span className="text-center font-bold text-[#1e3a8a]">{amount}</span>
                  <span className="text-right text-xs text-slate-400">{note}</span>
                </motion.div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.14}>
            <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-500" />
              Fees are subject to review each session. Confirm current rates with the school bursar before payment.
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-14 px-5 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-3xl">
          <FadeIn><SectionHead tag="FAQs" title="Frequently Asked Questions" sub="Quick answers to the questions parents ask most." /></FadeIn>
          <div className="grid gap-2.5">
            {FAQS.map((faq, i) => <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-5 bg-[#1e3a8a]">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <span className="inline-block bg-white/10 border border-white/20 text-sky-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded mb-4">Take the First Step</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">Secure Your Child's Place Today</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Spaces are limited across JSS 1 to SS 3. Apply early to avoid disappointment.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://wa.me/2348060171809" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-sky-400 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-sky-300 hover:text-slate-900 transition text-sm shadow-md">
                <Phone size={14} /> Chat on WhatsApp
              </a>
              <Link to="/parent-login"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-white/8 transition text-sm">
                <GraduationCap size={14} /> Parent Portal
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </LandingLayout>
  );
}
