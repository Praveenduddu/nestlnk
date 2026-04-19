import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { MobileMenu } from '../../components/MobileMenu';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    Users,
    Home,
    ShieldCheck,
    Layout,
    MessageSquare,
    Sparkles,
    Menu
} from 'lucide-react';
import { useRef, useState } from 'react';
import logo from '../../assets/logo/nestlnk-logo.jpg';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Landing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#0b1121] text-slate-900 dark:text-white transition-colors duration-500 selection:bg-indigo-500/30">
            {/* ─── Immersive Background Elements ─── */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] animate-float" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* ─── Top Navigation ─── */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-6 lg:px-12 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0b1121]/40"
            >
                <div className="flex items-center gap-3 group cursor-pointer">
                    <img src={logo} alt="NestLnk" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
                    <div>
                        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase">NestLnk</span>
                        <span className="block text-[8px] font-bold text-indigo-500 uppercase tracking-[0.2em] leading-none mt-0.5 opacity-50">Private Limited</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-10 ml-16">
                    {['About', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase()}`}
                            className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all hover:translate-y-[-1px]"
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

            <main className="relative z-10 w-full overflow-hidden">
                {/* ─── Hero Section ─── */}
                <section ref={targetRef} className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center pt-20">
                    <motion.div
                        style={{ opacity, scale, y }}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-[1400px] mx-auto flex flex-col items-center"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Defining the future of interior commerce
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-8xl lg:text-[140px] font-black tracking-[-0.04em] leading-[0.9] mb-10"
                        >
                            Elevate Your <br />
                            <span className="text-gradient md:block">Space Symphony</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-base md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed font-medium mb-12 px-2 md:px-0"
                        >
                            The premium marketplace connecting discerning property owners with
                            elite interior design firms. Anonymity by design, brilliance by choice.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                            <Link
                                to="/register"
                                className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Start Your Brief
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/about"
                                className="flex-1 h-16 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm text-slate-900 dark:text-white text-lg font-black flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                            >
                                View Network
                            </Link>
                        </motion.div>

                    </motion.div>
                </section>

                {/* ─── Stats Section ─── */}
                <section className="w-full py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent blur-[120px]" />
                    </div>

                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 relative z-10">
                        {[
                            { label: 'Network Firms', value: '450+', icon: <Users className="w-6 h-6 text-indigo-400" /> },
                            { label: 'Managed Briefs', value: '12.8k', icon: <Home className="w-6 h-6 text-emerald-400" /> },
                            { label: 'Avg. ROI', value: '40%', icon: <Sparkles className="w-6 h-6 text-amber-400" /> },
                            { label: 'Security Score', value: '100%', icon: <ShieldCheck className="w-6 h-6 text-blue-400" /> },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center md:items-start text-center md:text-left"
                            >
                                <div className="mb-4 md:mb-6 p-3 rounded-2xl bg-white/5 border border-white/10">{stat.icon}</div>
                                <p className="text-3xl md:text-5xl font-black mb-1 md:mb-2 tracking-tighter">{stat.value}</p>
                                <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ─── Immersive Process ─── */}
                <section className="w-full py-40 px-6 lg:px-24">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-col lg:flex-row gap-24 items-start">
                            <div className="lg:w-1/2 sticky top-40">
                                <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-tight mb-8">
                                    The Future of <br />
                                    <span className="text-indigo-600 dark:text-indigo-400">Collaboration.</span>
                                </h2>
                                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                                    We've rebuilt the design acquisition process from the ground up, prioritizing
                                    transparency, security, and elite results.
                                </p>
                                <div className="flex gap-4">
                                    <div className="w-12 h-1 bg-indigo-600 rounded-full" />
                                    <div className="w-4 h-1 bg-slate-200 dark:bg-white/10 rounded-full" />
                                    <div className="w-4 h-1 bg-slate-200 dark:bg-white/10 rounded-full" />
                                </div>
                            </div>

                            <div className="lg:w-1/2 space-y-12">
                                {[
                                    {
                                        icon: <Layout className="w-8 h-8" />,
                                        title: 'Anonymous Briefing',
                                        desc: 'Share your vision without revealing your identity. Control who sees your property details and when.'
                                    },
                                    {
                                        icon: <MessageSquare className="w-8 h-8" />,
                                        title: 'Direct Comparison',
                                        desc: 'Receive standardized quotes that let you compare design, material, and labor costs apples-to-apples.'
                                    },
                                    {
                                        icon: <ShieldCheck className="w-8 h-8" />,
                                        title: 'Verified Partners',
                                        desc: 'Every firm in our network undergoes a rigorous 50-point verification process for quality and reliability.'
                                    },
                                ].map((step) => (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="group p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:hover:bg-white/10 transition-all duration-300"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-2xl font-black mb-4 tracking-tight">{step.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{step.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Final CTA ─── */}
                <section className="w-full py-40 mb-20">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="relative rounded-[60px] bg-indigo-600 overflow-hidden px-12 py-24 text-center text-white">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),transparent_70%)] blur-[100px] pointer-events-none" />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative z-10"
                            >
                                <h2 className="text-4xl md:text-8xl font-black mb-10 tracking-[ -0.04em] leading-none">
                                    Your vision, <br />
                                    perfectly aligned.
                                </h2>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link to="/register" className="h-20 px-12 rounded-[30px] bg-white text-indigo-600 text-xl font-black flex items-center gap-4 hover:scale-105 transition-all shadow-2xl">
                                        Join NestLnk
                                        <ArrowRight className="w-6 h-6" />
                                    </Link>
                                    <Link to="/contact" className="h-20 px-12 rounded-[30px] border-2 border-white/30 backdrop-blur-md text-white text-xl font-black hover:bg-white/10 transition-all">
                                        Talk to an Expert
                                    </Link>
                                </div>
                                <div className="mt-16 flex items-center justify-center gap-10">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                                        <span className="text-sm font-bold opacity-80 uppercase tracking-widest">No setup fees</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                                        <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Global Firms</span>
                                    </div>
                                </div>
                            </motion.div>
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
