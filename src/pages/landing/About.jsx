import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, Star, Heart, Shield, Globe, Users,
  Award, CheckCircle2, Quote, ChevronRight, Lightbulb, Target
} from 'lucide-react';
import LandingLayout from './LandingLayout.jsx';

/* ── Reusable helpers ─────────────────────────────────── */
function FadeIn({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 36 : direction === 'down' ? -36 : 0, x: direction === 'left' ? 36 : direction === 'right' ? -36 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'} transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
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
const CORE_VALUES = [
  { icon: BookOpen, color: 'bg-blue-50 text-blue-600', title: 'Academic Excellence', desc: 'We hold every student to the highest academic standard, nurturing a love of learning that lasts a lifetime.' },
  { icon: Heart, color: 'bg-rose-50 text-rose-600', title: 'Taqwa & Piety', desc: 'Fear of Allah and consciousness of His presence guide every decision we make as an institution.' },
  { icon: Shield, color: 'bg-amber-50 text-amber-600', title: 'Integrity', desc: 'Honesty and transparency in all dealings — with students, parents, and the wider community.' },
  { icon: Users, color: 'bg-violet-50 text-violet-600', title: 'Community', desc: 'We are a family. Every student, teacher, and parent belongs to the An-Naheem community.' },
  { icon: Globe, color: 'bg-teal-50 text-teal-600', title: 'Global Citizenship', desc: 'We prepare students to contribute positively to Nigeria and the wider world.' },
  { icon: Star, color: 'bg-yellow-50 text-yellow-600', title: 'Continuous Growth', desc: 'We never stop improving — our staff, facilities, and programmes evolve year on year.' },
];

const LEADERSHIP = [
  { name: 'Alhaji Mujeeb Olayiwola', role: 'Founder & Proprietor', initial: 'M', bg: 'bg-primary-soft text-primary-dark' },
  { name: 'Dr. Aminat Adewale', role: 'Principal', initial: 'A', bg: 'bg-blue-100 text-blue-700' },
  { name: 'Mallam Yusuf Salau', role: 'Vice Principal', initial: 'Y', bg: 'bg-violet-100 text-violet-700' },
  { name: 'Ustaza Khadijah Bello', role: 'Head of Islamic Studies', initial: 'K', bg: 'bg-rose-100 text-rose-700' },
];

const ACHIEVEMENTS = [
  'Best Junior Secondary School — State Education Board 2024',
  '100% pass rate in the 2024/2025 third term examinations',
  'First place — Inter-school Quran Recitation Competition 2024',
  'First place — State Junior Science Fair 2025',
  'Commended for Islamic values integration by SUBEB inspectors',
  'Over 95% parent satisfaction rating in annual survey',
];

export default function About() {
  return (
    <LandingLayout>

      {/* ── PAGE HERO ────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0b3d35] via-[#0f5c52] to-[#1a7a6e] text-white py-24 px-6 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 border border-white/20">
            About Us
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mb-5 leading-tight text-white">
            Our Story, Our Mission,<br />Our Community
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/75 text-base leading-relaxed max-w-2xl mx-auto">
            Learn about the values, vision, and people that make An-Naheem Academy a place where every child can truly flourish.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" className="w-full" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,50 L0,50 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── 1. SCHOOL HISTORY ────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-14 items-center">
          <FadeIn direction="right">
            <span className="inline-block bg-primary-soft text-primary-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Our History</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink mb-5 leading-tight">
              Built on Faith,<br />Driven by Purpose
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-4">
              An-Naheem Academy was established with a singular vision: to create a junior secondary school where academic rigour and deep Islamic values coexist seamlessly. Founded by Alhaji Mujeeb Olayiwola, the school opened its doors determined to offer every Muslim child a quality education that their faith could be proud of.
            </p>
            <p className="text-muted text-sm leading-relaxed mb-4">
              From a modest beginning, we have grown into a thriving community of learners from JSS 1 to JSS 3. Our dedicated teachers, committed parents, and motivated students have built something truly special — a school that feels like family.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Today, An-Naheem Academy stands as a beacon of educational excellence and Islamic identity, producing graduates who are confident, knowledgeable, and deeply grounded in their faith.
            </p>
          </FadeIn>
          <FadeIn direction="left" delay={0.15}>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-soft to-white border border-line h-80 flex items-center justify-center">
              <img src="/Annaheem.jpeg.png" alt="An-Naheem Academy" className="h-56 w-56 object-contain drop-shadow-xl" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-line shadow">
                  <div className="font-black text-sm text-ink">An-Naheem Academy</div>
                  <div className="text-xs text-muted">Excellence · Faith · Community</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. VISION & MISSION ──────────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-7xl grid sm:grid-cols-2 gap-8">
          <FadeIn delay={0}>
            <div className="bg-white rounded-2xl p-8 border border-line h-full hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-xl bg-primary grid place-items-center mb-6">
                <Target size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-ink mb-4">Our Vision</h3>
              <p className="text-sm text-muted leading-relaxed">
                To be the leading Islamic junior secondary school in Nigeria, recognised for producing graduates who are morally upright, academically excellent, and equipped to lead with integrity in every sphere of life.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white h-full hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-xl bg-white/15 grid place-items-center mb-6">
                <Lightbulb size={26} className="text-yellow-300" />
              </div>
              <h3 className="text-xl font-black mb-4">Our Mission</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                To provide a nurturing, values-driven learning environment where every student receives a high-quality education rooted in Islamic principles — developing their minds, strengthening their faith, and preparing them for success in this world and the next.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 3. CORE VALUES ───────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Core Values" title="What We Stand For" sub="Six principles that guide every decision at An-Naheem Academy." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_VALUES.map(({ icon: Icon, color, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="border border-line rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col gap-4">
                  <div className={`h-12 w-12 rounded-xl ${color} grid place-items-center`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-ink mb-2">{title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRINCIPAL'S MESSAGE ───────────────────────── */}
      <section className="py-20 px-6 bg-page">
        <div className="mx-auto max-w-4xl">
          <FadeIn><SectionHead tag="Principal's Message" title="A Word from Our Principal" /></FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-line shadow-sm relative overflow-hidden">
              <Quote size={60} className="absolute top-6 right-6 text-primary/8" />
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-7 pb-7 border-b border-line">
                <div className="h-20 w-20 rounded-2xl bg-blue-100 grid place-items-center text-blue-700 font-black text-3xl shrink-0">A</div>
                <div>
                  <div className="font-black text-base text-ink">Dr. Aminat Adewale</div>
                  <div className="text-sm text-muted">Principal, An-Naheem Academy</div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
              <div className="space-y-4 text-sm text-muted leading-relaxed">
                <p>
                  Bismillahi Ar-Rahmani Ar-Raheem. It is my honour and privilege to lead An-Naheem Academy — a school that I believe is unlike any other in our community. Every morning, when I see our students walking through those gates ready to learn, I am reminded of the immense trust that parents place in us.
                </p>
                <p>
                  Our commitment to you is simple: we will care for your child as our own. We will challenge them academically, nurture them spiritually, and build in them the character that will serve them for a lifetime. Education at An-Naheem is not about passing examinations — it is about building human beings of worth.
                </p>
                <p>
                  We are proud of what we have built together, and we remain committed to making An-Naheem Academy the very best it can be — for your children, for our community, and for the sake of Allah.
                </p>
                <p className="font-bold text-ink">Jazakumullahu Khayran — May Allah reward you all.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 5. SCHOOL LEADERSHIP ─────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Leadership" title="Our School Leadership" sub="The dedicated team that steers An-Naheem Academy forward every day." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP.map(({ name, role, initial, bg }, i) => (
              <FadeIn key={name} delay={i * 0.09}>
                <div className="bg-page rounded-2xl p-6 text-center border border-line hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className={`h-20 w-20 rounded-2xl ${bg} grid place-items-center font-black text-3xl mx-auto mb-4`}>
                    {initial}
                  </div>
                  <h3 className="font-black text-sm text-ink mb-1">{name}</h3>
                  <p className="text-xs text-muted">{role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. ACHIEVEMENTS ──────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0b3d35] to-[#0f5c52] text-white">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-white/20">Achievements</span>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">Our Proud Achievements</h2>
              <p className="text-white/70 text-sm max-w-lg mx-auto">Recognition earned through the hard work of our students, staff, and community.</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((item, i) => (
              <FadeIn key={item} delay={i * 0.08}>
                <div className="flex items-start gap-4 bg-white/10 rounded-2xl p-5 border border-white/15 hover:bg-white/15 transition-colors">
                  <Award size={20} className="text-yellow-300 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/85 leading-relaxed">{item}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-2xl font-black text-ink mb-4">Ready to Be Part of Our Story?</h2>
            <p className="text-muted text-sm mb-7">Join hundreds of families who have trusted An-Naheem Academy with their children's education.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/admissions" className="inline-flex items-center gap-2 bg-primary text-white font-black px-7 py-3 rounded-xl hover:bg-primary-dark transition text-sm">
                Apply for Admission <ChevronRight size={15} />
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 border border-line text-ink font-bold px-7 py-3 rounded-xl hover:bg-page transition text-sm">
                Back to Home
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </LandingLayout>
  );
}
