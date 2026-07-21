import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, Users, Award, Heart, Star, ChevronRight,
  GraduationCap, Mosque, Globe, FlaskConical, Dumbbell,
  CalendarDays, ArrowRight, CheckCircle2, Quote
} from 'lucide-react';
import LandingLayout from './LandingLayout.jsx';

/* ── Reusable fade-in wrapper ─────────────────────────── */
function FadeIn({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0, x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'} transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

/* ── Section heading ──────────────────────────────────── */
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
const WHY_ITEMS = [
  { icon: BookOpen, title: 'Academic Excellence', desc: 'Rigorous curriculum blending modern education with deep Islamic foundations.' },
  { icon: Mosque, title: 'Islamic Environment', desc: 'A nurturing, values-driven campus where faith and learning go hand in hand.' },
  { icon: Users, title: 'Expert Teachers', desc: 'Qualified, passionate educators committed to every student\'s growth.' },
  { icon: Heart, title: 'Holistic Development', desc: 'We develop the mind, body, and spirit of every child in our care.' },
  { icon: Award, title: 'Proven Results', desc: 'Consistent top performances in external examinations and competitions.' },
  { icon: Globe, title: 'Global Outlook', desc: 'Students are prepared to thrive in a diverse, interconnected world.' },
];

const PROGRAMS = [
  { icon: GraduationCap, level: 'JSS 1', desc: 'Foundation year — literacy, numeracy and Islamic identity.' },
  { icon: GraduationCap, level: 'JSS 2', desc: 'Building depth across core sciences, arts and Islamic studies.' },
  { icon: GraduationCap, level: 'JSS 3', desc: 'Exam preparation with career guidance and spiritual mentorship.' },
];

const STATS = [
  { value: '26+', label: 'Students Enrolled' },
  { value: '10+', label: 'Qualified Teachers' },
  { value: '9', label: 'Core Subjects' },
  { value: '100%', label: 'Pass Rate' },
];

const FACILITIES = [
  { icon: BookOpen, name: 'Modern Library', desc: 'Stocked with academic and Islamic reference materials.' },
  { icon: FlaskConical, name: 'Science Lab', desc: 'Fully equipped for practical experiments.' },
  { icon: Dumbbell, name: 'Sports Ground', desc: 'Open field for physical education and games.' },
  { icon: Mosque, name: 'Prayer Hall', desc: 'Dedicated space for daily salah and Quran recitation.' },
];

const NEWS = [
  { date: 'Jun 2025', title: 'Third Term Results Released', excerpt: 'All JSS 1 students have received their result slips for the 2025/2026 third term.' },
  { date: 'May 2025', title: 'Quran Recitation Competition', excerpt: 'Students competed in the inter-school Quran recitation event, earning top honours.' },
  { date: 'Apr 2025', title: 'Science Fair Success', excerpt: 'Our JSS 2 team won first place at the state-level junior science fair.' },
];

const EVENTS = [
  { date: 'Sep 21', title: 'New Term Begins', detail: 'Fourth term officially opens for all classes.' },
  { date: 'Oct 5', title: 'Parent-Teacher Meeting', detail: 'Progress reviews with class teachers for JSS 1–3.' },
  { date: 'Oct 20', title: 'Cultural Day', detail: 'Annual celebration of heritage, arts and Islamic culture.' },
];

const GALLERY = [
  { bg: 'from-teal-400 to-teal-600', label: 'Classroom Activities' },
  { bg: 'from-blue-400 to-blue-600', label: 'Science Lab' },
  { bg: 'from-emerald-400 to-emerald-600', label: 'Sports Day' },
  { bg: 'from-violet-400 to-violet-600', label: 'Prize Giving' },
  { bg: 'from-amber-400 to-amber-500', label: 'Quran Competition' },
  { bg: 'from-rose-400 to-rose-600', label: 'Cultural Day' },
];

const TESTIMONIALS = [
  { name: 'Ustaz Ibrahim Yusuf', role: 'Parent', text: 'An-Naheem Academy has transformed my son. His grades improved and his love for Deen grew stronger.' },
  { name: 'Hajiya Fatimah Musa', role: 'Parent', text: 'The teachers are dedicated and the Islamic environment gives parents like me complete peace of mind.' },
  { name: 'Abdullahi Yusuf', role: 'JSS 2 Student', text: 'I enjoy coming to school every day. The lessons are interesting and we learn our religion too.' },
];

/* ══════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <LandingLayout>

      {/* ── 1. HERO BANNER ───────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-[#0b3d35] via-[#0f5c52] to-[#1a7a6e] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-14 items-center w-full">
          {/* Text side */}
          <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-sm border border-white/15">
              <Star size={12} className="fill-yellow-300 text-yellow-300" />
              Excellence in Education & Islamic Values
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-tight mb-6">
              Shaping Minds,<br />
              <span className="text-yellow-300">Inspiring Souls</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              An-Naheem Academy provides world-class junior secondary education rooted in Islamic values, preparing students to excel in both Deen and Dunya.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4">
              <Link to="/admissions" className="inline-flex items-center gap-2 bg-yellow-400 text-[#0b3d35] font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition text-sm shadow-lg">
                Apply Now <ChevronRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition text-sm border border-white/20 backdrop-blur-sm">
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Logo / brand side */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="h-72 w-72 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 grid place-items-center shadow-2xl">
                <img src="/Annaheem.jpeg.png" alt="An-Naheem Academy" className="h-56 w-56 object-contain rounded-full" />
              </div>
              {/* Floating badges */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-[#0b3d35] text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                JSS 1–3
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute -bottom-4 -left-4 bg-white text-primary-dark text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                100% Pass Rate
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── 2. WELCOME MESSAGE ───────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <span className="inline-block bg-primary-soft text-primary-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Welcome</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink mb-5 leading-tight">
              Welcome to An-Naheem Academy
            </h2>
            <p className="text-muted text-base leading-relaxed mb-6">
              At An-Naheem Academy, we believe every child is a trust from Allah. Our mission is to nurture that trust by providing an education that is academically rigorous, morally grounded, and spiritually enriching. From JSS 1 to JSS 3, our students grow into confident, knowledgeable, and God-fearing young men and women.
            </p>
            <p className="text-muted text-base leading-relaxed">
              Founded on the principles of excellence and taqwa, we combine a modern national curriculum with deep Islamic learning — ensuring our graduates are prepared for both this world and the next.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 3. WHY CHOOSE US ─────────────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Why An-Naheem" title="Why Choose Us?" sub="Six reasons thousands of families trust An-Naheem Academy with their children's future." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 border border-line hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="h-12 w-12 rounded-xl bg-primary-soft grid place-items-center mb-4">
                    <Icon size={22} className="text-primary-dark" />
                  </div>
                  <h3 className="font-black text-base text-ink mb-2">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ACADEMIC PROGRAMS ─────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Academics" title="Our Academic Programs" sub="A structured three-year junior secondary curriculum built for excellence." /></FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {PROGRAMS.map(({ icon: Icon, level, desc }, i) => (
              <FadeIn key={level} delay={i * 0.1}>
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white p-8 text-center hover:scale-[1.02] transition-transform duration-300">
                  <div className="h-16 w-16 rounded-full bg-white/15 grid place-items-center mx-auto mb-5">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-3">{level}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
                  <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-white/5" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ISLAMIC LEARNING ENVIRONMENT ─────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0b3d35] to-[#0f5c52] text-white">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-14 items-center">
          <FadeIn direction="right">
            <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Islamic Environment</span>
            <h2 className="text-2xl sm:text-3xl font-black mb-5 leading-tight">
              Faith & Knowledge —<br />Hand in Hand
            </h2>
            <p className="text-white/75 text-sm leading-relaxed mb-6">
              At An-Naheem Academy, Islamic education is not an add-on — it is the heartbeat of everything we do. Daily Salah, Quran memorisation, Tafsir, Hadith studies, and Arabic language are woven into the school day alongside the national curriculum.
            </p>
            <ul className="grid gap-3">
              {['Daily Fajr & Zuhr prayers in congregation', 'Quran Hifz programme', 'Arabic language classes', 'Islamic history & ethics', 'Spiritual mentorship for every student'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 size={16} className="text-yellow-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn direction="left" delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {['Quran Classes', 'Arabic Studies', 'Islamic Ethics', 'Prayer Hall'].map((label, i) => (
                <div key={label} className={`rounded-2xl p-6 text-center ${i % 2 === 0 ? 'bg-white/10' : 'bg-yellow-400/20'} border border-white/10`}>
                  <Mosque size={28} className="mx-auto mb-3 text-yellow-300" />
                  <span className="font-bold text-sm">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. STATISTICS ────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-page border border-line hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="text-4xl font-black text-primary mb-2">{value}</div>
                  <div className="text-sm text-muted font-semibold">{label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FACILITIES ────────────────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Campus" title="Our Facilities" sub="A safe, well-resourced learning environment built to inspire curiosity." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.map(({ icon: Icon, name, desc }, i) => (
              <FadeIn key={name} delay={i * 0.09}>
                <div className="bg-white rounded-2xl overflow-hidden border border-line hover:shadow-lg transition-all duration-300 group">
                  <div className="h-36 bg-gradient-to-br from-primary-soft to-white grid place-items-center group-hover:from-primary/20 transition-colors">
                    <Icon size={40} className="text-primary-dark" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-sm text-ink mb-1">{name}</h3>
                    <p className="text-xs text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. NEWS PREVIEW ──────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <span className="inline-block bg-primary-soft text-primary-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">News</span>
                <h2 className="text-2xl sm:text-3xl font-black text-ink">Latest News</h2>
              </div>
              <Link to="/" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {NEWS.map(({ date, title, excerpt }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="border border-line rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <span className="text-xs font-bold text-primary bg-primary-soft px-2.5 py-1 rounded-full mb-4 self-start">{date}</span>
                  <h3 className="font-black text-sm text-ink mb-2">{title}</h3>
                  <p className="text-xs text-muted leading-relaxed flex-1">{excerpt}</p>
                  <button className="mt-4 text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start">
                    Read more <ArrowRight size={12} />
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. UPCOMING EVENTS ───────────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Events" title="Upcoming Events" sub="Stay up to date with what's happening at An-Naheem Academy." /></FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {EVENTS.map(({ date, title, detail }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-line hover:shadow-md transition-all flex gap-5 items-start">
                  <div className="shrink-0 bg-primary text-white rounded-xl h-14 w-14 grid place-items-center text-center leading-tight">
                    <CalendarDays size={20} className="mb-0.5" />
                    <span className="text-[10px] font-bold">{date}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-ink mb-1">{title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{detail}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. GALLERY PREVIEW ──────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Gallery" title="Life at An-Naheem" sub="Glimpses of the vibrant learning community we have built together." /></FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GALLERY.map(({ bg, label }, i) => (
              <FadeIn key={label} delay={i * 0.07}>
                <div className={`rounded-2xl bg-gradient-to-br ${bg} h-44 sm:h-52 flex items-end p-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300 overflow-hidden group`}>
                  <span className="text-white text-sm font-bold drop-shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300">{label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. TESTIMONIALS ─────────────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Testimonials" title="What Families Say" sub="Hear from parents and students who are part of the An-Naheem community." /></FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text }, i) => (
              <FadeIn key={name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-line hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <Quote size={28} className="text-primary/25 mb-4 shrink-0" />
                  <p className="text-sm text-muted leading-relaxed flex-1 italic">"{text}"</p>
                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-line">
                    <div className="h-10 w-10 rounded-full bg-primary-soft grid place-items-center text-primary-dark font-black text-base shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <div className="font-black text-sm text-ink">{name}</div>
                      <div className="text-xs text-muted">{role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. ADMISSION CTA ────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0b3d35] via-[#0f5c52] to-[#1a7a6e] text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-3xl text-center relative">
          <FadeIn>
            <span className="inline-block bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">Admissions Open</span>
            <h2 className="text-2xl sm:text-4xl font-black mb-5 leading-tight">
              Ready to Join the<br />An-Naheem Family?
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Applications for the 2025/2026 session are now open. Secure your child's place in one of Nigeria's finest Islamic junior secondary schools.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/admissions" className="inline-flex items-center gap-2 bg-yellow-400 text-[#0b3d35] font-black px-8 py-3.5 rounded-xl hover:bg-yellow-300 transition text-sm shadow-xl">
                Apply Now <ChevronRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border border-white/25 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition text-sm">
                Learn More
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </LandingLayout>
  );
}
