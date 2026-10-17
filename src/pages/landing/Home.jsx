import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, Users, Award, Heart, Star, ChevronRight,
  GraduationCap, Landmark, Globe, FlaskConical, Dumbbell,
  CalendarDays, ArrowRight, CheckCircle2, Quote,
} from 'lucide-react';
import LandingLayout from './LandingLayout.jsx';

/* ── Helpers ─────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === 'up' ? 32 : direction === 'down' ? -32 : 0,
        x: direction === 'left' ? 32 : direction === 'right' ? -32 : 0,
      }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ tag, title, sub, light = false }) {
  return (
    <div className="text-center mb-12">
      {tag && (
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4 ${light
            ? 'bg-white/15 text-white border border-white/25'
            : 'bg-blue-50 text-[#1e3a8a] border border-blue-200'
            }`}
        >
          {tag}
        </motion.span>
      )}
      <h2 className={`text-2xl sm:text-3xl font-bold mb-3 leading-snug ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      {sub && (
        <p className={`text-xl max-w-lg mx-auto leading-relaxed ${light ? 'text-sky-100' : 'text-slate-600'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── DATA ────────────────────────────────────────────────────────── */
const WHY_ITEMS = [
  { icon: BookOpen, title: 'Academic Excellence', desc: 'A rigorous national curriculum delivered by qualified teachers who are passionate about results.' },
  { icon: Landmark, title: 'Islamic Environment', desc: 'Faith is central — daily prayers, Quran, Arabic and Islamic studies are woven into every school day.' },
  { icon: Users, title: 'Experienced Faculty', desc: 'Our teachers combine pedagogical expertise with deep Islamic knowledge.' },
  { icon: Heart, title: 'Holistic Development', desc: 'Academic, spiritual, physical and social growth — we nurture the whole child.' },
  { icon: Award, title: 'Proven Track Record', desc: '100% pass rate with multiple award wins at state and national level.' },
  { icon: Globe, title: 'Future-Ready Graduates', desc: 'Students graduate confident, critical thinkers ready for senior secondary and beyond.' },
];

const PROGRAMS = [
  { level: 'JSS 1', tag: 'Year 1', desc: 'Foundation in literacy, numeracy, Islamic identity and critical thinking.' },
  { level: 'JSS 2', tag: 'Year 2', desc: 'Deepening core sciences, arts, social studies and Quranic knowledge.' },
  { level: 'JSS 3', tag: 'Year 3', desc: 'BECE preparation, career orientation and spiritual mentorship.' },
  { level: 'SS 1', tag: 'Year 4', desc: 'Senior secondary foundation — sciences, arts or commercial streams.' },
  { level: 'SS 2', tag: 'Year 5', desc: 'Advanced subject specialisation with extracurricular enrichment.' },
  { level: 'SS 3', tag: 'Year 6', desc: 'WAEC/NECO preparation, university guidance and leadership programmes.' },
];

const STATS = [
  { value: '200+', label: 'Students Enrolled' },
  { value: '20+', label: 'Qualified Teachers' },
  { value: '6', label: 'Year Groups' },
  { value: '100%', label: 'Pass Rate' },
];

const FACILITIES = [
  { icon: BookOpen, name: 'Modern Library', desc: 'Academic and Islamic reference materials for all levels.', img: '/Library.png' },
  { icon: FlaskConical, name: 'Science Labs', desc: 'Fully equipped labs for biology, chemistry and physics practicals.', img: '/Laboratory.jpg' },
  { icon: Dumbbell, name: 'Sports Grounds', desc: 'Open fields and courts for physical education and team sports.', img: '/Sport.jpg' },
  { icon: Landmark, name: 'Prayer Hall', desc: 'Dedicated Musallah for daily congregational prayers.', img: '/Masjid.png' },
];

const NEWS = [
  { date: 'Jun 2025', title: 'Third Term Results Released', excerpt: 'All JSS and SS students have received their result slips for the 2024/2025 third term.' },
  { date: 'May 2025', title: 'Quran Recitation Competition', excerpt: 'Our students earned top honours at the inter-school Quran recitation event.' },
  { date: 'Apr 2025', title: 'Science Fair Success', excerpt: 'The JSS 2 science team won first place at the state junior science fair.' },
];

const EVENTS = [
  { month: 'SEP', day: '21', title: 'New Session Begins', detail: 'Resumption day for all JSS and SS classes — 2025/2026 session.' },
  { month: 'OCT', day: '05', title: 'Parent-Teacher Forum', detail: 'Progress reviews with class teachers across all year groups.' },
  { month: 'OCT', day: '20', title: 'Annual Cultural Day', detail: 'Celebrating heritage, arts, and Islamic culture with the whole community.' },
];

const GALLERY = [
  { img: '/gallery-competition.jpg', label: 'SDGs Competition' },
  { img: '/Sport.jpg', label: 'Sports Day' },
  { img: '/Laboratory.jpg', label: 'Science Laboratory' },
  { bg: 'from-indigo-600 to-indigo-800', label: 'Prize Giving' },
  { bg: 'from-blue-500 to-indigo-700', label: 'Quran Competition' },
  { bg: 'from-sky-600 to-blue-800', label: 'Cultural Day' },
];

const TESTIMONIALS = [
  { name: 'Ustaz Ibrahim Yusuf', role: 'Parent of JSS 2 Student', text: 'An-Naheem Academy transformed my son. His academic results improved and his love for the Deen grew stronger.' },
  { name: 'Hajiya Fatimah Musa', role: 'Parent of SS 1 Student', text: 'The teachers are dedicated and the Islamic environment gives parents like me complete peace of mind.' },
  { name: 'Abdullahi Yusuf', role: 'JSS 3 Student', text: 'I enjoy school every day. The lessons are engaging and we learn our religion alongside our academics.' },
];

const ARABIC_VALUES = [
  {
    arabic: '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u064e\u0651\u0647\u0650 \u0627\u0644\u0631\u064e\u0651\u062d\u0652\u0645\u064e\u0646\u0650 \u0627\u0644\u0631\u064e\u0651\u062d\u0650\u064a\u0645\u0650',
    title: 'Bismillah',
    desc: 'In the name of Allah, the Most Gracious, the Most Merciful — the foundation of everything we do.',
    icon: '✦',
    color: 'from-blue-700 to-blue-900',
  },
  {
    arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    title: 'Iqra — Read',
    desc: 'The very first revelation — Read in the name of your Lord who created. Knowledge is the first command of Islam.',
    icon: '📖',
    color: 'from-sky-600 to-blue-800',
  },
  {
    arabic: 'الْعِلْمُ نُورٌ وَالْجَهْلُ ظُلْمَةٌ',
    title: 'Knowledge is Light',
    desc: 'Knowledge is light and ignorance is darkness. We illuminate every mind entrusted to our care.',
    icon: '💡',
    color: 'from-indigo-600 to-blue-800',
  },
  {
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    title: 'Rabbi Zidni Ilma',
    desc: 'O my Lord, increase me in knowledge — the only du\'a in the Quran asking Allah for more.',
    icon: '🤲',
    color: 'from-blue-600 to-indigo-800',
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    title: 'Best Among You',
    desc: 'The best of you are those who learn the Quran and teach it. — Prophet ﷺ. Quran is at our core.',
    icon: '📿',
    color: 'from-slate-600 to-blue-800',
  },
  {
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    title: 'Actions by Intentions',
    desc: 'Every lesson, every exam, every achievement — done with a sincere intention becomes an act of worship.',
    icon: '❤️',
    color: 'from-blue-700 to-slate-800',
  },
];

/* ── Arabic Values Section — animated spring reordering ─────── */
const SPRING = { type: 'spring', damping: 25, stiffness: 250 };

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ArabicValuesSection() {
  const [order, setOrder] = useState(() => ARABIC_VALUES.map((_, i) => i));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setOrder(prev => shuffle(prev)), 2500);
    return () => clearTimeout(t);
  }, [order, paused]);

  return (
    <section className="py-16 px-6 sm:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-50 text-[#1e3a8a] border border-blue-200 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              Welcome
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-snug">
              Welcome to An-Naheem Academy
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
              Where academic excellence meets deep Islamic values — nurturing minds and souls from JSS 1 through SS 3.
            </p>
          </div>
        </FadeIn>

        {/* Pause hint */}
        <p className="text-center text-xs text-slate-400 mb-5 italic">
          Hover any card to pause the shuffle
        </p>

        <motion.ul
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0"
          layout
        >
          {order.map((idx) => {
            const { arabic, title, desc, icon, color } = ARABIC_VALUES[idx];
            return (
              <motion.li
                key={title}
                layout
                transition={SPRING}
                className="min-h-0"
                onHoverStart={() => setPaused(true)}
                onHoverEnd={() => setPaused(false)}
              >
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 24px 56px rgba(30,58,138,0.30)' }}
                  transition={{ duration: 0.22 }}
                  className={`relative rounded-2xl bg-gradient-to-br ${color} overflow-hidden cursor-default h-full flex flex-col group`}
                >
                  {/* Top shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  {/* Number watermark */}
                  <div className="absolute -bottom-4 -right-2 text-white/5 text-[120px] font-black leading-none select-none tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="relative p-6 flex flex-col h-full gap-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-xl bg-white/20 border border-white/30 grid place-items-center text-2xl shadow-inner backdrop-blur-sm shrink-0">
                        {icon}
                      </div>
                      <div className="flex gap-1 mt-1.5">
                        {[0, 1, 2].map(d => (
                          <motion.div key={d} className="h-1.5 w-1.5 rounded-full bg-white/40"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1.8, delay: d * 0.3 }} />
                        ))}
                      </div>
                    </div>

                    {/* Arabic text */}
                    <p className="text-white font-bold leading-[1.85] text-right text-[19px] drop-shadow flex-1"
                      dir="rtl"
                      style={{ fontFamily: "'Amiri', 'Scheherazade New', Georgia, serif" }}>
                      {arabic}
                    </p>

                    {/* Glowing divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

                    {/* Footer */}
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1 tracking-wide">{title}</h3>
                      <p className="text-white/80 text-xs leading-relaxed">{desc}</p>
                    </div>

                    {/* Glow orb */}
                    <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 blur-2xl -translate-x-1/2 translate-y-1/2 group-hover:bg-white/12 transition-colors duration-500" />
                  </div>
                </motion.div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/* ── Home Component ──────────────────────────────────────────────── */
export default function Home() {
  return (
    <LandingLayout>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Background image.png')" }}
        />
        <div className="absolute inset-0 bg-white/75" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#1e3a8a]/10 border border-[#1e3a8a]/20 text-[#1e3a8a] px-3.5 py-1.5 rounded text-xs font-semibold mb-6 tracking-wide"
            >
              <Star size={11} className="fill-[#1e3a8a] text-[#1e3a8a]" />
              Excellence &middot; Faith &middot; Character
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-[56px] font-bold text-slate-900 leading-[1.12] mb-5 tracking-tight"
            >
              Shaping Minds,<br />
              <span className="text-[#1e3a8a]">Inspiring Souls</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-black font-bold text-base leading-relaxed mb-8 max-w-md"
            >
              An-Naheem Academy delivers world-class JSS and SS education rooted in Islamic values —
              preparing students to excel in both Deen and Dunya.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1e40af] transition text-sm shadow-md"
              >
                Apply for Admission <ChevronRight size={15} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-medium px-5 py-2.5 rounded-lg hover:bg-slate-50 transition text-sm shadow-sm"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-200"
            >
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-xl font-bold text-[#1e3a8a]">{value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#0ea5e9] opacity-15 blur-2xl scale-110" />
              <motion.img
                src="/school-board.jpg"
                alt="An-Naheem Academy — Official Signboard"
                className="relative rounded-2xl shadow-2xl object-cover h-[420px] w-[300px] border-4 border-white"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-3 -right-4 bg-[#1e3a8a] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                JSS &ndash; SS
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -bottom-3 -left-4 bg-white text-[#1e3a8a] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-200"
              >
                WAEC &amp; NECO Certified
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" className="w-full" preserveAspectRatio="none">
            <path d="M0,32 C480,60 960,0 1440,32 L1440,48 L0,48 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── WELCOME (Arabic Values — animated reordering) ───────── */}
      <ArabicValuesSection />

      {/* ── WHY CHOOSE US ─────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-slate-100">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHead
              tag="Why An-Naheem"
              title="Why Choose Us?"
              sub="What sets An-Naheem Academy apart from every other school."
            />
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(30,58,138,0.10)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-6 border border-slate-200 h-full flex gap-4 cursor-default"
                >
                  <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 grid place-items-center shrink-0 mt-0.5">
                    <Icon size={20} className="text-[#1e3a8a]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1.5">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMIC PROGRAMS ─────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHead
              tag="Academics"
              title="Academic Programmes"
              sub="A six-year secondary education journey from JSS 1 through SS 3."
            />
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map(({ level, tag, desc }, i) => (
              <FadeIn key={level} delay={i * 0.07}>
                <motion.div
                  whileHover={{
                    y: -4,
                    boxShadow: i < 3
                      ? '0 16px 40px rgba(30,58,138,0.35)'
                      : '0 12px 32px rgba(30,58,138,0.10)',
                  }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl p-6 border h-full cursor-default ${i < 3
                    ? 'bg-[#1e3a8a] border-[#1e3a8a]'
                    : 'bg-white border-slate-200 hover:border-blue-200'
                    }`}
                >
                  <div className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${i < 3
                    ? 'bg-white/15 text-sky-200'
                    : 'bg-blue-50 text-[#1e3a8a] border border-blue-100'
                    }`}>
                    {tag}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${i < 3 ? 'text-white' : 'text-slate-900'}`}>
                    {level}
                  </h3>
                  <p className={`text-sm leading-relaxed ${i < 3 ? 'text-sky-100' : 'text-slate-600'}`}>
                    {desc}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ISLAMIC ENVIRONMENT ───────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-[#0f172a]">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-14 items-center">
          <FadeIn direction="right">
            <span className="inline-block bg-white/12 border border-white/20 text-sky-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
              Islamic Environment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-5">
              Faith &amp; Knowledge &mdash;<br />Hand in Hand
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Islamic education is not an add-on at An-Naheem — it is the foundation. Daily Salah, Quran,
              Tafsir, Hadith and Arabic are woven into every school day.
            </p>
            <ul className="grid gap-3">
              {[
                'Daily congregational Fajr & Zuhr prayers',
                'Quran Hifz programme',
                'Arabic language classes (JSS & SS)',
                'Islamic history, ethics & jurisprudence',
                'Spiritual mentorship for all students',
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-slate-200"
                >
                  <CheckCircle2 size={16} className="text-sky-400 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn direction="left" delay={0.12}>
            <div className="grid grid-cols-2 gap-4">
              {['Quran Classes', 'Arabic Studies', 'Islamic Ethics', 'Prayer Hall'].map((label, i) => (
                <motion.div
                  key={label}
                  whileHover={{
                    scale: 1.04,
                    backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(14,165,233,0.18)',
                  }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl p-6 text-center border cursor-default ${i % 2 === 0 ? 'bg-white/6 border-white/12' : 'bg-sky-500/12 border-sky-500/25'
                    }`}
                >
                  <Landmark size={26} className="mx-auto mb-3 text-sky-300" />
                  <span className="font-semibold text-sm text-white">{label}</span>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FACILITIES ────────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHead
              tag="Campus"
              title="Our Facilities"
              sub="A safe, well-resourced environment designed to inspire learning."
            />
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.map(({ icon: Icon, name, desc, img }, i) => (
              <FadeIn key={name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(30,58,138,0.12)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-default group"
                >
                  <div className={`h-52 overflow-hidden relative ${!img ? 'bg-gradient-to-br from-blue-50 to-sky-50 grid place-items-center' : ''}`}>
                    {img ? (
                      <>
                        <img
                          src={img}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-[#1e3a8a]/10 group-hover:bg-[#1e3a8a]/20 transition-colors duration-300" />
                      </>
                    ) : (
                      <Icon size={36} className="text-[#1e3a8a]" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-sm text-slate-900 mb-1.5">{name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <span className="inline-block bg-blue-50 text-[#1e3a8a] border border-blue-200 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                  News
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Latest News</h2>
              </div>
              <Link
                to="/"
                className="text-sm font-semibold text-[#1e3a8a] hover:text-blue-800 flex items-center gap-1.5 group transition-colors"
              >
                View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {NEWS.map(({ date, title, excerpt }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(30,58,138,0.10)' }}
                  transition={{ duration: 0.2 }}
                  className="border border-slate-200 rounded-xl p-6 h-full flex flex-col cursor-default hover:border-blue-200"
                >
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full mb-4 self-start">
                    {date}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mb-2.5 leading-snug">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{excerpt}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1e3a8a] hover:text-blue-800 cursor-pointer group transition-colors self-start">
                    Read more <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHead
              tag="Events"
              title="Upcoming Events"
              sub="Stay informed about what's happening at An-Naheem Academy."
            />
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {EVENTS.map(({ month, day, title, detail }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(30,58,138,0.10)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-200 flex gap-5 items-start cursor-default"
                >
                  <div className="shrink-0 bg-[#1e3a8a] text-white rounded-xl w-14 py-3 text-center shadow-sm">
                    <div className="text-[11px] font-bold text-sky-200 uppercase leading-none mb-1">{month}</div>
                    <div className="text-2xl font-black leading-none">{day}</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1.5">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{detail}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHead
              tag="Gallery"
              title="Life at An-Naheem"
              sub="A glimpse into our vibrant school community."
            />
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GALLERY.map(({ img, bg, label }, i) => (
              <FadeIn key={label} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl h-44 sm:h-52 flex items-end p-4 cursor-pointer overflow-hidden group relative ${!img ? `bg-gradient-to-br ${bg}` : ''
                    }`}
                  style={img ? { backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
                  <span className="relative text-white text-sm font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {label}
                  </span>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHead
              tag="Testimonials"
              title="What Families Say"
              sub="Voices from our parent and student community."
            />
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text }, i) => (
              <FadeIn key={name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(30,58,138,0.10)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-200 flex flex-col h-full cursor-default"
                >
                  <Quote size={24} className="text-blue-200 mb-4 shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 italic">&ldquo;{text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                    <div className="h-10 w-10 rounded-full bg-[#1e3a8a] grid place-items-center text-white font-bold text-sm shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{role}</div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADMISSION CTA ─────────────────────────────────────────── */}
      <section className="py-16 px-6 sm:px-8 bg-[#1e3a8a] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 90% 50%, #1e40af 0%, transparent 50%)',
          }}
        />
        <div className="mx-auto max-w-3xl text-center relative">
          <FadeIn>
            <span className="inline-block bg-white/12 border border-white/25 text-sky-200 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5">
              Admissions Open
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
              Ready to Join the An-Naheem Family?
            </h2>
            <p className="text-sky-100 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              Applications for the 2025/2026 session are now open. Secure your child&apos;s place today across JSS 1 to SS 3.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/admissions"
                  className="inline-flex items-center gap-2 bg-white text-[#1e3a8a] font-bold px-7 py-3 rounded-xl hover:bg-sky-50 transition-colors text-sm shadow-lg"
                >
                  Apply Now <ChevronRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
                >
                  About the School
                </Link>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

    </LandingLayout>
  );
}
