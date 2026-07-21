import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Youtube, ChevronUp } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/contact', label: 'Contact' },
];

export default function LandingLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink overflow-x-hidden">
      {/* ── Announcement bar ─────────────────────────────────── */}
      <div className="bg-primary text-white text-xs font-semibold text-center py-2 px-4 hidden sm:block">
        🎉 Admissions open for 2025/2026 session — Apply now before seats are filled!
        <Link to="/admissions" className="ml-2 underline hover:no-underline font-bold">Learn More</Link>
      </div>

      {/* ── Arabic greeting bar ──────────────────────────────── */}
      <div className="bg-[#0b5f59] text-[#d4f5f0] text-center py-2 px-4">
        <span className="font-bold text-sm tracking-wide" style={{ fontFamily: 'serif', direction: 'rtl' }}>
          ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
        </span>
      </div>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 border-b border-line bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Logo + name */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/Annaheem.jpeg.png" alt="An-Naheem Academy" className="h-12 w-12 object-contain rounded-full border-2 border-primary/20" />
            <div className="leading-tight">
              <div className="font-black text-sm text-primary uppercase tracking-wide">An-Naheem</div>
              <div className="font-black text-xs text-ink uppercase tracking-widest">Academy</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 ml-6">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition ${isActive
                    ? 'bg-primary text-white'
                    : 'text-ink hover:bg-primary-soft hover:text-primary-dark'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  autoFocus
                  placeholder="Search…"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  className="absolute right-9 border border-line rounded-lg px-3 py-1.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 bg-white"
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="p-2 rounded-lg hover:bg-primary-soft text-muted hover:text-primary transition"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Login button */}
          <Link
            to="/parent-login"
            className="hidden md:inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition"
          >
            <GraduationCap size={16} />
            Login
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-primary-soft text-ink transition"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-lg text-sm font-semibold transition ${isActive
                        ? 'bg-primary text-white'
                        : 'text-ink hover:bg-primary-soft hover:text-primary-dark'}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <div className="flex gap-2 mt-2 border-t border-line pt-3">
                  <Link to="/parent-login" className="flex-1 text-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition">
                    Parent Login
                  </Link>
                  <Link to="/admin-login" className="flex-1 text-center bg-slate-100 text-ink px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition">
                    Admin Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page content ─────────────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-[#0d1b2a] text-slate-300">
        {/* Main footer grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6 py-14">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/Annaheem.jpeg.png" alt="Logo" className="h-12 w-12 rounded-full object-contain border border-primary/30" />
              <div>
                <div className="font-black text-white text-sm uppercase">An-Naheem</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Academy</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Nurturing excellence in education and Islamic values since our founding. Building tomorrow's leaders today.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-full bg-white/10 grid place-items-center hover:bg-primary transition text-slate-300 hover:text-white">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="grid gap-2.5">
              {[['/', 'Home'], ['/about', 'About Us'], ['/admissions', 'Admissions'], ['/parent-login', 'Parent Portal'], ['/admin-login', 'Admin Login']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-400 hover:text-primary transition flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Academics</h3>
            <ul className="grid gap-2.5">
              {['JSS 1', 'JSS 2', 'JSS 3', 'Islamic Studies', 'Arabic Language', 'Quran Recitation'].map(item => (
                <li key={item}>
                  <span className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary inline-block" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact Us</h3>
            <ul className="grid gap-4">
              <li className="flex gap-3 items-start">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">An-Naheem Academy, Nigeria</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-primary shrink-0" />
                <span className="text-sm text-slate-400">+234 000 000 0000</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-primary shrink-0" />
                <span className="text-sm text-slate-400">info@annaheemacademy.edu.ng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 px-6 py-5">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} An-Naheem Academy. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Back to top ──────────────────────────────────────── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-primary text-white shadow-lg grid place-items-center hover:bg-primary-dark transition"
            aria-label="Back to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
