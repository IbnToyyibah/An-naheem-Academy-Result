import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, GraduationCap, Phone, Mail,
  MapPin, Facebook, Twitter, Youtube, ChevronUp,
} from 'lucide-react';

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

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 50); setShowTop(window.scrollY > 400); };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink overflow-x-hidden">

      {/* Announcement bar */}
      <div className="bg-[#1e3a8a] text-sky-100 text-xs font-medium text-center py-2 px-6 hidden sm:block tracking-wide">
        Admissions open for 2025/2026 session —&nbsp;
        <Link to="/admissions" className="underline font-bold text-white hover:text-yellow-300 transition">Apply now</Link>
      </div>

      {/* Arabic greeting */}
      <div className="bg-[#162d6e] text-sky-100 text-center py-2 px-6 text-base font-semibold" dir="rtl"
        style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", letterSpacing: '0.04em' }}>
        ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
      </div>

      {/* Navbar */}
      <header className={`sticky top-0 z-50 bg-white border-b border-slate-200 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <nav className="mx-auto flex max-w-7xl items-center gap-6 px-6 h-16 relative">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
            <img src="/Annaheem.jpeg.png" alt="An-Naheem Academy"
              className="h-16 w-16 object-contain rounded-full ring-2 ring-blue-100 shrink-0" />
            <div className="leading-none hidden sm:block">
              <div className="font-extrabold text-2xl text-blue-800 tracking-tight">AN-NAHEEM ACADEMY</div>
            </div>
          </Link>

          {/* Desktop links — centred absolutely */}
          <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                    ? 'text-[#1e3a8a] font-semibold bg-blue-50'
                    : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-blue-50'}`}>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center gap-1 relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.input autoFocus placeholder="Search…" value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  initial={{ width: 0, opacity: 0 }} animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="absolute right-8 h-8 border border-slate-200 rounded-lg px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-black" />
              )}
            </AnimatePresence>
            <button onClick={() => setSearchOpen(v => !v)}
              className="p-2 text-slate-black hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-all" aria-label="Search">
              <Search size={17} />
            </button>
          </div>

          {/* Login buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/admin-login"
              className="px-4 py-1.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:border-blue-300 hover:text-[#1e3a8a] hover:bg-blue-50 transition-all duration-200">
              Admin
            </Link>
            <Link to="/parent-login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-all duration-200 shadow-sm">
              <GraduationCap size={15} /> Parent Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-slate-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-all"
            onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-100 md:hidden bg-white">
              <div className="px-5 py-4 grid gap-1.5">
                {NAV_LINKS.map(({ to, label }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <NavLink to={to} end={to === '/'}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                          ? 'bg-blue-50 text-[#1e3a8a] font-semibold'
                          : 'text-slate-700 hover:bg-blue-50 hover:text-[#1e3a8a]'}`}>
                      {label}
                    </NavLink>
                  </motion.div>
                ))}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
                  <Link to="/admin-login"
                    className="text-center py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-[#1e3a8a] transition-all">
                    Admin
                  </Link>
                  <Link to="/parent-login"
                    className="text-center py-2.5 text-sm font-semibold bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-all">
                    Parent Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6 sm:px-8 py-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/Annaheem.jpeg.png" alt="Logo"
                className="h-11 w-11 rounded-full object-contain ring-1 ring-white/15" />
              <div>
                <div className="font-extrabold text-white text-sm tracking-tight">AN-NAHEEM</div>
                <div className="text-[10px] text-white font-bold uppercase tracking-widest">Academy</div>
              </div>
            </div>
            <p className="text-sm text-white font-bold leading-relaxed mb-5">
              Nurturing academic excellence and Islamic values — building Nigeria's next generation of leaders.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="h-9 w-9 rounded-lg bg-white/10 grid place-items-center hover:bg-[#1e3a8a] text-white transition-colors duration-200">
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="grid gap-2.5">
              {[['/', 'Home'], ['/about', 'About Us'], ['/admissions', 'Admissions'],
              ['/parent-login', 'Parent Portal'], ['/admin-login', 'Admin Login']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white font-bold hover:text-sky-300 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="h-px w-3 bg-sky-400 inline-block group-hover:w-5 transition-all duration-200 shrink-0" />{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Academics</h4>
            <ul className="grid gap-2.5">
              {['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3', 'Islamic Studies', 'Arabic Language'].map(item => (
                <li key={item} className="text-sm text-white font-bold flex items-center gap-2">
                  <span className="h-px w-3 bg-sky-400 inline-block shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Contact</h4>
            <ul className="grid gap-4">
              <li className="flex gap-3 items-start">
                <MapPin size={14} className="text-sky-400 mt-0.5 shrink-0" />
                <span className="text-sm text-white font-bold">An-Naheem Academy, Nigeria</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={14} className="text-sky-400 shrink-0" />
                <a href="https://wa.me/2348060171809" target="_blank" rel="noreferrer"
                  className="text-sm text-white font-bold hover:text-sky-300 transition-colors">
                  +234 8060171809 (WhatsApp)
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={14} className="text-sky-400 shrink-0" />
                <a href="mailto:annaheemacademy2017@gmail.com"
                  className="text-sm text-white font-bold hover:text-sky-300 transition-colors">
                  annaheemacademy2017@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 sm:px-8 py-5">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between gap-2 text-xs text-white font-bold">
            <span>© {new Date().getFullYear()} An-Naheem Academy. All rights reserved.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-sky-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-sky-300 transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-[#1e3a8a] text-white shadow-lg grid place-items-center hover:bg-[#1e40af] transition-colors"
            aria-label="Back to top">
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
