import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import LandingLayout from './LandingLayout.jsx';

function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
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

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: 'WhatsApp / Phone',
    lines: ['+234 8060171809'],
    action: { href: 'https://wa.me/2348060171809', label: 'Chat on WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Mail,
    title: 'Email Address',
    lines: ['annaheemacademy2017@gmail.com'],
    action: { href: 'mailto:annaheemacademy2017@gmail.com', label: 'Send Email', color: 'bg-[#1e3a8a] hover:bg-[#1e40af]' },
    color: 'bg-blue-50 text-[#1e3a8a]',
  },
  {
    icon: MapPin,
    title: 'School Address',
    lines: ['No 2, Oro Road, Adewole', 'Ilorin, Kwara State', '(Opposite Champion Guest House)'],
    action: null,
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: ['Monday – Friday: 8:00am – 3:00pm', 'Saturday: 9:00am – 12:00pm', 'Closed on Sundays & Public Holidays'],
    action: null,
    color: 'bg-indigo-50 text-indigo-600',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    // Build WhatsApp message and open it
    const text = `*New Message from An-Naheem Website*%0A%0A*Name:* ${encodeURIComponent(form.name)}%0A*Phone:* ${encodeURIComponent(form.phone)}%0A*Subject:* ${encodeURIComponent(form.subject)}%0A%0A*Message:*%0A${encodeURIComponent(form.message)}`;
    window.open(`https://wa.me/2348060171809?text=${text}`, '_blank');
    setSending(false);
    setSent(true);
    setForm({ name: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <LandingLayout>

      {/* HERO */}
      <section className="relative bg-[#0f172a] py-20 px-6 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 55%, #1e3a8a 0%, transparent 55%), radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 45%)' }} />
        <div className="mx-auto max-w-3xl text-center relative">
          <motion.span initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block bg-white/10 border border-white/15 text-sky-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
            Contact Us
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Get in Touch with<br />An-Naheem Academy
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-sm leading-relaxed max-w-xl mx-auto">
            We are always happy to hear from parents, prospective students, and the community. Reach out through any of the channels below.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 36" className="w-full" preserveAspectRatio="none">
            <path d="M0,24 C480,44 960,0 1440,24 L1440,36 L0,36 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="py-14 px-6 sm:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_ITEMS.map(({ icon: Icon, title, lines, action, color }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(30,58,138,0.12)' }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 h-full flex flex-col">
                  <div className={`h-12 w-12 rounded-xl ${color} grid place-items-center mb-4 shrink-0`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-2">{title}</h3>
                  <div className="flex-1 grid gap-0.5 mb-4">
                    {lines.map(line => (
                      <p key={line} className="text-sm text-slate-600 leading-relaxed">{line}</p>
                    ))}
                  </div>
                  {action && (
                    <a href={action.href} target="_blank" rel="noreferrer"
                      className={`inline-flex items-center justify-center gap-2 ${action.color} text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors mt-auto`}>
                      <MessageCircle size={13} /> {action.label}
                    </a>
                  )}
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="py-14 px-6 sm:px-8 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-start">

          {/* Form */}
          <FadeIn direction="right">
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Send Us a Message</h2>
              <p className="text-sm text-slate-500 mb-6">Fill the form below and we will respond via WhatsApp.</p>

              {sent && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl mb-5">
                  <CheckCircle2 size={17} /> Message sent! We will get back to you shortly.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Full Name *</span>
                    <input name="name" required value={form.name} onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 bg-white" />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Phone Number *</span>
                    <input name="phone" required value={form.phone} onChange={handleChange}
                      placeholder="e.g. 08012345678"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 bg-white" />
                  </label>
                </div>
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Subject *</span>
                  <input name="subject" required value={form.subject} onChange={handleChange}
                    placeholder="What is your enquiry about?"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 bg-white" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Message *</span>
                  <textarea name="message" required rows={5} value={form.message} onChange={handleChange}
                    placeholder="Write your message here…"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 bg-white resize-none" />
                </label>
                <motion.button type="submit" disabled={sending}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-white font-bold py-3 rounded-xl hover:bg-[#1e40af] transition-colors text-sm shadow-md disabled:opacity-60">
                  <Send size={15} /> {sending ? 'Opening WhatsApp…' : 'Send via WhatsApp'}
                </motion.button>
              </form>
            </div>
          </FadeIn>

          {/* Map + quick links */}
          <FadeIn direction="left" delay={0.1}>
            <div className="grid gap-5">
              {/* Embedded map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-72">
                <iframe
                  title="An-Naheem Academy Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.123456789!2d4.5983!3d8.4966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAdewole%2C+Ilorin%2C+Kwara+State!5e0!3m2!1sen!2sng!4v1234567890"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Quick contact cards */}
              <div className="bg-[#1e3a8a] rounded-2xl p-6 text-white">
                <h3 className="font-bold text-base mb-4">Reach Us Directly</h3>
                <div className="grid gap-3">
                  <a href="https://wa.me/2348060171809" target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-4 py-3 transition-colors group">
                    <div className="h-9 w-9 rounded-lg bg-green-500 grid place-items-center shrink-0">
                      <MessageCircle size={17} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">WhatsApp</div>
                      <div className="text-xs text-white/70">+234 8060171809</div>
                    </div>
                  </a>
                  <a href="mailto:annaheemacademy2017@gmail.com"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-4 py-3 transition-colors group">
                    <div className="h-9 w-9 rounded-lg bg-sky-500 grid place-items-center shrink-0">
                      <Mail size={17} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Email</div>
                      <div className="text-xs text-white/70">annaheemacademy2017@gmail.com</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-500 grid place-items-center shrink-0">
                      <MapPin size={17} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Address</div>
                      <div className="text-xs text-white/70">No 2, Oro Road, Adewole, Ilorin, Kwara State</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="py-12 px-6 sm:px-8 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="text-slate-500 text-sm mb-4">Have a general question? Check our</p>
            <a href="/admissions" className="inline-flex items-center gap-2 border border-[#1e3a8a] text-[#1e3a8a] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
              Admissions FAQs →
            </a>
          </FadeIn>
        </div>
      </section>

    </LandingLayout>
  );
}
