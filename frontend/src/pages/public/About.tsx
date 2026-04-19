import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { motion } from 'framer-motion';
import {
    Eye,
    Users,
    Building2,
    ShieldCheck,
    Target,
    ArrowRight,
    Menu
} from 'lucide-react';
import { useState } from 'react';
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

export default function About() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="relative min-h-screen bg-white dark:bg-[#0b1121] text-slate-900 dark:text-white transition-colors duration-500 selection:bg-indigo-500/30 overflow-x-hidden">
            {/* ─── Immersive Background Elements ─── */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

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
                            className={`text-sm font-bold transition-all hover:translate-y-[-1px] ${item === 'About' ? 'text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'}`}
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
                {/* ─── Hero Intro Section ─── */}
                <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center px-6 text-center border-b border-slate-200/50 dark:border-white/5">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="w-full max-w-[1400px] mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            Our Story & Vision
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl lg:text-[110px] font-black tracking-[-0.04em] leading-[0.9] mb-10">
                            Building the <br />
                            <span className="text-gradient">Design Graph</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium mb-12 px-4">
                            NestLnk is more than a marketplace. We're an infrastructure layer for the interior design industry,
                            bringing clarity to a space traditionally shrouded in opacity.
                        </motion.p>
                    </motion.div>
                </section>

                {/* ─── Core Values / Mission Grid ─── */}
                <section className="w-full py-32 px-6 lg:px-24">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="lg:col-span-2 p-12 rounded-[40px] bg-slate-900 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px]"
                            >
                                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.3),transparent_60%)]" />
                                <div className="relative z-10">
                                    <Target className="w-12 h-12 text-indigo-400 mb-8" />
                                    <h2 className="text-5xl font-black mb-6 tracking-tight">Our Mission</h2>
                                    <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                                        To empower property owners with data-driven design choices while providing elite firms
                                        with a meritocratic platform to showcase their brilliance.
                                    </p>
                                </div>
                                <div className="relative z-10 flex items-center gap-4 text-sm font-black uppercase tracking-widest text-indigo-400">
                                    Explore our process <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="p-8 md:p-12 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between min-h-[400px]"
                            >
                                <div>
                                    <Eye className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-8" />
                                    <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Radical <br />Transparency</h2>
                                    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                                        No hidden fees. No kickbacks. Just clear, comparable data for both sides of the marketplace.
                                    </p>
                                </div>
                            </motion.div>

                            {[
                                {
                                    icon: <Users className="w-10 h-10" />,
                                    title: 'Elite Quality',
                                    desc: 'We curate our network rigorously, ensuring only the top 5% of design firms are eligible to join NestLnk.',
                                    color: 'text-emerald-500'
                                },
                                {
                                    icon: <Building2 className="w-10 h-10" />,
                                    title: 'Managed Growth',
                                    desc: 'Helping firms transition from manual management to professional interior commerce operations.',
                                    color: 'text-blue-500'
                                },
                                {
                                    icon: <ShieldCheck className="w-10 h-10" />,
                                    title: 'Privacy First',
                                    desc: 'Our "Anonymity by Design" philosophy protects property owners until they choose to reveal their identity.',
                                    color: 'text-violet-500'
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * i }}
                                    className="p-10 rounded-[40px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className={`mb-8 ${item.color}`}>{item.icon}</div>
                                    <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Commitment Section ─── */}
                <section className="w-full py-32 px-6 bg-indigo-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-20">
                        <div className="lg:w-1/2">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8">
                                Built for the <br />
                                <span className="text-indigo-200">Modern Visionary.</span>
                            </h2>
                            <p className="text-xl text-indigo-100 leading-relaxed max-w-xl">
                                We believe that beautiful spaces inspire beautiful work. Our commitment
                                is to make that transformation as seamless as possible.
                            </p>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-2 gap-8">
                            {[
                                { val: '100%', label: 'Verification' },
                                { val: '24/7', label: 'Support' },
                                { val: '0%', label: 'Ad Spam' },
                                { val: 'Lite', label: 'Infrastructure' },
                            ].map((s) => (
                                <div key={s.label} className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <p className="text-4xl font-black mb-1">{s.val}</p>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">{s.label}</p>
                                </div>
                            ))}
                        </div>
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
