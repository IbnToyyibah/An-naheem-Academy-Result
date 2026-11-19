import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, Star, Heart, Shield, Globe, Users,
  Award, CheckCircle2, Quote, ChevronRight, Lightbulb, Target, Landmark
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

const CORE_VALUES = [
  { icon: BookOpen, title: 'Academic Excellence', desc: 'We hold every student to the highest academic standard, nurturing a lifelong love of learning.' },
  { icon: Heart, title: 'Taqwa & Piety', desc: 'Consciousness of Allah guides every decision we make as an institution and community.' },
  { icon: Shield, title: 'Integrity', desc: 'Honesty and transparency in all our dealings — with students, parents, and the community.' },
  { icon: Users, title: 'Community', desc: 'We are a family. Every student, teacher, and parent is a valued member of An-Naheem.' },
  { icon: Globe, title: 'Global Citizenship', desc: 'Graduates are equipped to contribute positively to Nigeria and the wider world.' },
  { icon: Star, title: 'Continuous Improvement', desc: 'Our staff, facilities, and programmes evolve constantly to serve students better.' },
];

const LEADERSHIP = [
  { name: 'Dr. Muinat Lambe', role: 'Founder & Proprietress', initial: 'M', color: 'bg-blue-100 text-[#1e3a8a]' },
  { name: 'Mr. Ibrahim Ahmed Sekoni', role: 'Principal (PhD in View)', initial: 'A', color: 'bg-sky-100 text-sky-700' },
  { name: 'Ummu Aishah', role: 'Head Mistress', initial: 'U', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Mr. Solahudeen Sodiq', role: 'Editorial Chairman', initial: 'S', color: 'bg-slate-100 text-slate-700' },
];

const ACHIEVEMENTS = [
  'Best Junior Secondary School — State Education Board 2024',
  '100% pass rate in the 2024/2025 third term examinations',
  'First place — Inter-school Quran Recitation Competition 2024',
  'First place — State Junior Science Fair 2025',
  'Commended for Islamic values integration by SUBEB inspectors',
  'Over 95% parent satisfaction rating in annual community survey',
];

export default function About() {
  return (
    <LandingLayout>

      {/* PAGE HERO */}
      <section className="relative bg-[#0f172a] text-white py-20 px-5 overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, #1e3a8a 0%, transparent 55%), radial-gradient(circle at 75% 20%, #0ea5e9 0%, transparent 45%)' }} />
        <div className="mx-auto max-w-4xl text-center relative">
          <motion.span initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block bg-white/10 border border-white/15 text-sky-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded mb-4">
            About Us
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight text-white">
            Our Story, Our Mission,<br />Our Community
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            The values, vision, and people that make An-Naheem Academy a place where every child flourishes.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 36" className="w-full" preserveAspectRatio="none">
            <path d="M0,24 C480,44 960,0 1440,24 L1440,36 L0,36 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* SCHOOL HISTORY */}
      <section className="py-14 px-5 bg-white">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right">
            <span className="inline-block bg-blue-50 text-[#1e3a8a] border border-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded mb-4">Our History</span>
            <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 mb-4 leading-snug">Built on Faith,<br />Driven by Purpose</h2>
            <p className="text-black text-sm leading-relaxed mb-3">
              An-Naheem Academy was founded with a singular vision: to create a school where academic rigour and deep Islamic values coexist seamlessly. Founded by Dr. Muninat Lambe, we opened determined to offer every Muslim child an education their faith could be proud of.
            </p>
            <p className="text-black text-sm leading-relaxed mb-3">
              From a modest start, we have grown into a thriving community across JSS 1 through SS 3. Our dedicated teachers, committed parents, and motivated students have built something special — a school that feels like family.
            </p>
            <p className="text-black text-sm leading-relaxed">
              Today we stand as a beacon of educational excellence and Islamic identity, producing graduates who are confident, knowledgeable, and grounded in their faith.
            </p>
          </FadeIn>
          <FadeIn direction="left" delay={0.12}>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50 border border-slate-200 h-72 flex items-center justify-center">
              <img src="/Annaheem.jpeg.png" alt="An-Naheem Academy" className="h-52 w-52 object-contain drop-shadow-xl" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm">
                  <div className="font-bold text-sm text-slate-900">An-Naheem Academy</div>
                  <div className="text-xs text-black">Excellence · Faith · Community</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-14 px-5 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-5xl grid sm:grid-cols-2 gap-5">
          <FadeIn>
            <div className="bg-white rounded-xl p-6 border border-slate-200 h-full">
              <div className="h-11 w-11 rounded-lg bg-blue-50 grid place-items-center mb-4">
                <Target size={22} className="text-[#1e3a8a]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Our Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To be the leading Islamic secondary school in Nigeria, recognised for graduates who are morally upright, academically excellent, and equipped to lead with integrity in every sphere of life.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="bg-[#1e3a8a] rounded-xl p-6 text-white h-full">
              <div className="h-11 w-11 rounded-lg bg-white/15 grid place-items-center mb-4">
                <Lightbulb size={22} className="text-sky-300" />
              </div>
              <h3 className="text-lg font-bold mb-3">Our Mission</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                To provide a nurturing, values-driven environment where every student receives a high-quality education rooted in Islamic principles — developing minds, strengthening faith, and preparing students for success in this world and the next.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-14 px-5 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Core Values" title="What We Stand For" sub="Six principles that guide every decision at An-Naheem Academy." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_VALUES.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-300 h-full flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 grid place-items-center shrink-0 mt-0.5">
                    <Icon size={19} className="text-[#1e3a8a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 mb-1">{title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER'S WORD */}
      <section className="py-14 px-5 bg-white">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-block bg-blue-50 text-black text-bold border border-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded mb-3">Founder's Word</span>
              <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 mb-2.5 leading-snug">A Message from Our Founder</h2>
              <p className="text-sm text-white font-bold max-w-lg mx-auto">The vision that gave birth to An-Naheem Academy, in the founder's own words.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="bg-blue-300 rounded-2xl p-7 sm:p-10 text-white relative overflow-hidden shadow-xl">
              {/* decorative background circle */}
              <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/5 pointer-events-none" />

              <Quote size={44} className="text-white font-bold mb-5" />

              <div className="space-y-4 text-sm text-white leading-relaxed relative">
                <p className="text-white font-medium text-base leading-relaxed">
                  Bismillahi Ar-Rahmani Ar-Raheem.
                </p>
                <p>
                  When I first envisioned An-Naheem Academy, my heart was driven by a single, unwavering conviction: that every Muslim child in this community deserves an education that honours both the intellect and the soul. I had seen too many schools where academic achievement came at the cost of Islamic identity, and too many Islamic institutions where the standard of secular education was far below what our children deserved. I refused to accept that compromise.
                </p>
                <p>
                  An-Naheem Academy was founded as a declaration — that excellence in academics and excellence in faith are not in conflict. They are, in fact, inseparable. The Quran commands us to read, to seek knowledge, to reflect. True education has always been, at its core, an Islamic imperative.
                </p>
                <p>
                  We built this school for the child who memorises Quran in the morning and solves equations in the afternoon. For the young woman who carries her hijab with confidence and her textbook with purpose. For the young man who understands that his education is an act of worship and his success a sadaqah to his family and his ummah.
                </p>
                <p>
                  To every parent who has placed their trust in us: we do not take that trust lightly. We are not merely a school — we are partners in your most sacred responsibility. And to every student who walks through our gates: know that you are here for a reason greater than a certificate. You are here to become.
                </p>
                <p className="text-white font-semibold pt-1">
                  May Allah bless this institution, grant barakah to all who serve it, and make it a means of good for this community and generations yet to come. Ameen.
                </p>
              </div>

              {/* Founder attribution */}
              <div className="flex items-center gap-4 mt-8 pt-7 border-t border-white/15 relative">
                <div className="h-14 w-14 rounded-xl bg-white/15 grid place-items-center font-bold text-2xl text-white shrink-0">
                  M
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Dr. Muinat Lambe</div>
                  <div className="text-white text-xs mt-0.5">Founder &amp; Proprietress, An-Naheem Academy</div>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRINCIPAL'S MESSAGE */}
      <section className="py-14 px-5 bg-slate-100 border-y border-slate-100">
        <div className="mx-auto max-w-3xl">
          <FadeIn><SectionHead tag="Principal's Message" title="A Word from Our Principal" /></FadeIn>
          <FadeIn delay={0.08}>
            <div className="bg-white rounded-xl p-7 border border-slate-200 shadow-sm relative overflow-hidden">
              <Quote size={48} className="absolute top-5 right-5 text-black" />
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center mb-6 pb-6 border-b border-slate-100">
                <div className="h-16 w-16 rounded-xl bg-sky-100 grid place-items-center text-sky-700 font-bold text-2xl shrink-0">A</div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Mr. Ibrahim Ahmed Sekoni</div>
                  <div className="text-xs text-black mt-0.5">Principal (PhD in View), An-Naheem Academy</div>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-black font-semibold leading-relaxed">
                <p>Bismillahi Ar-Rahmani Ar-Raheem. It is my honour to lead An-Naheem Academy — a school unlike any other in our community. Every morning, when I see our students walking through the gates ready to learn, I am reminded of the immense trust parents place in us.</p>
                <p>Our commitment is simple: we will care for your child as our own, challenge them academically, nurture them spiritually, and build in them the character that will serve them for a lifetime.</p>
                <p>Education at An-Naheem is not about passing examinations — it is about building human beings of worth.</p>
                <p className="font-semibold text-black">Jazakumullahu Khayran — May Allah reward you all.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="py-14 px-5 bg-white">
        <div className="mx-auto max-w-7xl">
          <FadeIn><SectionHead tag="Leadership" title="School Leadership" sub="The dedicated team that steers An-Naheem Academy forward." /></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEADERSHIP.map(({ name, role, initial, color }, i) => (
              <FadeIn key={name} delay={i * 0.08}>
                <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
                  <div className={`h-16 w-16 rounded-xl ${color} grid place-items-center font-bold text-2xl mx-auto mb-3`}>{initial}</div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-0.5">{name}</h3>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-14 px-5 bg-[#0f172a]">
        <div className="mx-auto max-w-5xl">
          <FadeIn><SectionHead tag="Achievements" title="Our Proud Achievements" sub="Recognition earned through the hard work of students, staff, and community." light /></FadeIn>
          <div className="grid sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((item, i) => (
              <FadeIn key={item} delay={i * 0.07}>
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors">
                  <Award size={16} className="text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 leading-relaxed">{item}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-5 bg-white">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to Be Part of Our Story?</h2>
            <p className="text-slate-500 text-sm mb-6">Join the families who trust An-Naheem Academy with their children's education — JSS 1 through SS 3.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/admissions"
                className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#1e40af] transition text-sm shadow-sm">
                Apply for Admission <ChevronRight size={14} />
              </Link>
              <Link to="/"
                className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 font-medium px-6 py-2.5 rounded-lg hover:bg-slate-50 transition text-sm">
                Back to Home
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </LandingLayout>
  );
}
