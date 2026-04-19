import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CheckCircle2,
    MessageSquare,
    ArrowRight,
    Menu
} from 'lucide-react';
import { MobileMenu } from '../../components/MobileMenu';
import logo from '../../assets/logo/nestlnk-logo.jpg';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Contact() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#0b1121] text-slate-900 dark:text-white transition-colors duration-500 selection:bg-indigo-500/30 overflow-x-hidden">
            {/* ─── Immersive Background Elements ─── */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

                {/* Texture Overlays */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* ─── Top Navigation ─── */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-6 lg:px-12 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0b1121]/40"
            >
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <img src={logo} alt="NestLnk" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
                    <div>
                        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase">NestLnk</span>
                        <span className="block text-[8px] font-bold text-indigo-500 uppercase tracking-[0.2em] leading-none mt-0.5 opacity-50">Private Limited</span>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-10 ml-16">
                    {['About', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase()}`}
                            className={`text-sm font-bold transition-all hover:translate-y-[-1px] ${item === 'Contact' ? 'text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'}`}
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-6 ml-auto">
                    <div className="hidden sm:flex pr-4 border-r border-slate-200 dark:border-white/10 items-center">
                        <ThemeSwitcher />
                    </div>
                    <Link to="/login" className="hidden lg:block text-sm font-bold text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="hidden sm:flex h-11 px-7 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black hover:scale-105 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 items-center">
                        Join Network
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden w-11 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xl"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} logo={logo} />
            </motion.header>

            <main className="relative z-10 w-full pt-20">
                {/* ─── Hero Contact Section ─── */}
                <section className="relative w-full min-h-screen py-32 px-6 lg:px-24">
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

                        {/* Info Column */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                Contact Us
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-black tracking-[-0.04em] leading-[0.9] mb-10">
                                Let's Start a <br />
                                <span className="text-gradient">Dialogue.</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium mb-12">
                                Whether you're a property owner ready to transform your space or a design firm
                                seeking elite growth, we're here to facilitate your journey.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="space-y-10">
                                {[
                                    { icon: <Mail className="w-6 h-6" />, label: 'Inquiries', value: 'hello@nestlnk.com' },
                                    { icon: <Phone className="w-6 h-6" />, label: 'Direct Line', value: '+91 98765 43210' },
                                    { icon: <MapPin className="w-6 h-6" />, label: 'HQ Address', value: 'Nexus Tech Park, Bangalore' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">{item.label}</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Form Column */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative group mt-10 lg:mt-0"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                            <div className="relative p-6 md:p-12 rounded-[40px] bg-white dark:bg-[#0b1121]/80 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 shadow-2xl">
                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-16"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-8 animate-bounce-short">
                                                <CheckCircle2 className="w-12 h-12" />
                                            </div>
                                            <h3 className="text-4xl font-black mb-4 tracking-tight">Sent with Pride!</h3>
                                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto mb-10">
                                                Thank you for reaching out. A NestLnk expert will review your message and connect within 24 hours.
                                            </p>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                Send another message
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
                                                    <MessageSquare className="w-6 h-6" />
                                                </div>
                                                <h2 className="text-3xl font-black tracking-tight">Express Inquiry</h2>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Identity</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Your Name"
                                                            required
                                                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Endpoint</label>
                                                        <input
                                                            type="email"
                                                            placeholder="you@domain.com"
                                                            required
                                                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Your Vision or Request</label>
                                                    <textarea
                                                        placeholder="Describe your requirement in detail..."
                                                        required
                                                        rows={5}
                                                        className="w-full p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold transition-all resize-none"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl dark:shadow-white/5 group"
                                                >
                                                    Dispatch Request
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ─── Final CTA ─── */}
                <section className="w-full py-20 px-6">
                    <div className="max-w-[1400px] mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-16 rounded-[60px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-5xl mx-auto"
                        >
                            <h2 className="text-3xl md:text-6xl font-black mb-8 tracking-tighter capitalize">Ready to scale your <br /> design operation?</h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link to="/register" className="h-20 px-12 rounded-3xl bg-indigo-600 text-white text-xl font-black flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-indigo-600/20">
                                    Join the Network
                                    <ArrowRight className="w-6 h-6" />
                                </Link>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Join 450+ Active Firms</p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* ─── Minimal Footer ─── */}
            <footer className="w-full border-t border-slate-200 dark:border-white/5 py-16 bg-white dark:bg-[#0b1121] transition-colors">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="NestLnk" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-black tracking-tighter">NestLnk</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium tracking-wide italic">"Where vision finds form."</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        <Link to="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Instagram</Link>
                        <Link to="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">LinkedIn</Link>
                        <Link to="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Twitter</Link>
                    </div>

                    <div className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                        © 2026 NestLnk Private Limited
                    </div>
                </div>
            </footer>
        </div>
    );
}
