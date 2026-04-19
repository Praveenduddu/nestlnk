import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import {
    ArrowRight,
    Mail,
    Lock,
    Loader2,
    ChevronLeft,
    CheckCircle2,
    ShieldCheck,
    Globe,
    Compass,
    Eye,
    EyeOff,
    RefreshCw
} from 'lucide-react';

import logo from '../../assets/logo/nestlnk-logo.jpg';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Recovery Logic
    const [view, setView] = useState<'LOGIN' | 'RECOVERY_EMAIL' | 'RECOVERY_OTP' | 'RECOVERY_PASSWORD'>('LOGIN');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryOtp, setRecoveryOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const handleResendRecoveryOtp = async () => {
        if (resendTimer > 0) return;
        setResendTimer(60);
        try {
            await fetch('/api/auth/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail })
            });
        } catch (e) {
            console.error("Resend failed", e);
        }
    };

    // Timer Effect
    useState(() => {
        const interval = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    });

    const handleRequestRecoveryOtp = async (e: FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail })
            });
            if (response.ok) {
                setView('RECOVERY_OTP');
                setResendTimer(60);
            } else {
                setError('Service Error: Failed to dispatch recovery code.');
            }
        } catch {
            setError('Network Error: Recovery service unreachable.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyRecoveryOtp = async (e: FormEvent) => {
        e.preventDefault();
        const otpCode = recoveryOtp.join('');
        if (otpCode.length < 6) return;

        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail, otp: otpCode })
            });
            const data = await response.json();
            if (data.valid) {
                setView('RECOVERY_PASSWORD');
            } else {
                setError('Service Rejection: Invalid security key.');
            }
        } catch {
            setError('System Error: Verification sequence interrupted.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('Protocol Error: Password confirmation mismatch.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: recoveryEmail,
                    otp: recoveryOtp.join(''),
                    newPassword: newPassword
                })
            });
            if (response.ok) {
                setView('LOGIN');
                setEmail(recoveryEmail);
                setError('');
                // Maybe a success toast here if available
            } else {
                setError('Service Error: Failed to update security passkey.');
            }
        } catch {
            setError('Network Error: Security server unreachable.');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login(email, password);
            const role = res.role.toLowerCase();
            navigate(`/${role}/dashboard`);
        } catch {
            setError('Auth failure: Credentials do not match our protocol.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#0b1121] text-slate-900 dark:text-white transition-colors duration-500 flex flex-col lg:flex-row overflow-hidden">

            {/* ─── Visual Wing (Left Side) ─── */}
            <motion.section
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-slate-900 overflow-hidden items-center justify-center p-24"
            >
                {/* Background Textures & Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-violet-900/40" />
                    <div className="absolute top-[20%] left-[-10%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-glow" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <div className="relative z-10 w-full max-w-2xl">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-12">
                            <img src={logo} alt="NestLnk" className="w-12 h-12 object-contain" />
                            <span className="text-2xl font-black tracking-tighter text-white uppercase">NestLnk</span>
                        </motion.div>

                        <motion.h2
                            variants={fadeInUp}
                            className="text-7xl xl:text-8xl font-black text-white leading-[0.85] tracking-[-0.05em] mb-12"
                        >
                            ACCESS <br />
                            THE <span className="text-white/20">CORE.</span>
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { icon: <ShieldCheck className="w-5 h-5" />, title: 'Encrypted', desc: 'Enterprise grade security' },
                                { icon: <Globe className="w-5 h-5" />, title: 'Global', desc: 'Sync across networks' },
                                { icon: <Compass className="w-5 h-5" />, title: 'Navigated', desc: 'Intelligent design flow' },
                                { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Verified', desc: 'Elite firm validation' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
                                >
                                    <div className="text-indigo-400 mb-3">{item.icon}</div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                                    <p className="text-xs text-white/40 font-medium">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Floating Large Meta-Text */}
                <div className="absolute -bottom-10 -right-20 pointer-events-none select-none">
                    <span className="text-[25vw] font-black text-white/[0.02] leading-none tracking-tighter">NEST</span>
                </div>
            </motion.section>

            {/* ─── Action Wing (Right Side) ─── */}
            <section className="flex-1 min-h-screen flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative bg-white dark:bg-[#0b1121]">

                {/* Floating Header Actions */}
                <div className="absolute top-8 left-8 right-8 flex items-center justify-between pointer-events-auto">
                    <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Exit Portal
                    </Link>
                    <ThemeSwitcher />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="w-full max-w-[420px]"
                >
                    <div className="mb-12 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="lg:hidden mb-12">
                            <img src={logo} alt="NestLnk" className="w-16 h-16 object-contain mx-auto" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                            {view === 'LOGIN' ? 'Sign In' : 'Recover Access'}
                        </h1>
                        {view === 'LOGIN' && (
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Secure Portal Access
                            </p>
                        )}
                        {view !== 'LOGIN' && (
                            <p className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                {view === 'RECOVERY_EMAIL' && 'Phase 1: Identity Extraction'}
                                {view === 'RECOVERY_OTP' && 'Phase 2: Protocol Verification'}
                                {view === 'RECOVERY_PASSWORD' && 'Phase 3: Security Override'}
                            </p>
                        )}
                    </div>


                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-8 p-5 rounded-3xl bg-red-500/5 border border-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                                    <Lock className="w-5 h-5 text-red-500" />
                                </div>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {view === 'LOGIN' && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSubmit}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 px-1">Network Username</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="node@network.lnk"
                                            required
                                            className="w-full h-16 pl-14 pr-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Security Passkey</label>
                                        <button
                                            type="button"
                                            onClick={() => setView('RECOVERY_EMAIL')}
                                            className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400"
                                        >
                                            Recovery
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full h-16 pl-14 pr-14 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 md:h-20 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg md:text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-900/10 dark:shadow-white/5 group disabled:opacity-70 disabled:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Establishing Connection...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {view === 'RECOVERY_EMAIL' && (
                            <motion.form
                                key="recovery-email"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleRequestRecoveryOtp}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 px-1">Verify Identity</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={recoveryEmail}
                                            onChange={(e) => setRecoveryEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full h-16 pl-14 pr-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Reset Code'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setView('LOGIN')}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        Return to Login
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {view === 'RECOVERY_OTP' && (
                            <motion.form
                                key="recovery-otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyRecoveryOtp}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                        A 6-digit verification protocol has been dispatched to your terminal.
                                    </p>
                                    <div className="flex justify-between gap-3">
                                        {recoveryOtp.map((digit, i) => (
                                            <input
                                                key={i}
                                                id={`recovery-otp-${i}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (!/^\d*$/.test(val)) return;
                                                    const newOtp = [...recoveryOtp];
                                                    newOtp[i] = val;
                                                    setRecoveryOtp(newOtp);
                                                    if (val && i < 5) {
                                                        document.getElementById(`recovery-otp-${i + 1}`)?.focus();
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !recoveryOtp[i] && i > 0) {
                                                        document.getElementById(`recovery-otp-${i - 1}`)?.focus();
                                                    }
                                                }}
                                                className="w-full aspect-square text-center text-xl font-black rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading || recoveryOtp.join('').length < 6}
                                        className="w-full h-16 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Code'}
                                    </button>

                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={handleResendRecoveryOtp}
                                            disabled={resendTimer > 0}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2"
                                        >
                                            <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                                            {resendTimer > 0 ? `Resend protocol in ${resendTimer}s` : 'Resend Protocol'}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setView('RECOVERY_EMAIL')}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        Back to Email
                                    </button>
                                </div>

                            </motion.form>
                        )}

                        {view === 'RECOVERY_PASSWORD' && (
                            <motion.form
                                key="recovery-password"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleResetPassword}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 px-1">New Passkey</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                required
                                                className="w-full h-16 pl-14 pr-14 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 px-1">Confirm New Passkey</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                required
                                                className="w-full h-16 pl-14 pr-14 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-3xl bg-indigo-600 text-white font-black flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Set New Password'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>


                    <div className="mt-16 text-center">
                        <p className="text-sm font-bold text-slate-400">
                            New Account?{' '}
                            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline underline-offset-8 decoration-2">Sign Up</Link>
                        </p>


                    </div>
                </motion.div>

                {/* Vertical Footer Label for Action Wing */}
                <div className="absolute bottom-12 right-6 hidden xl:block">
                    <p className="text-[10px] font-black text-slate-200 dark:text-slate-800 uppercase tracking-[0.5em] origin-right rotate-90 translate-x-1/2">
                        NestLnk Terminal v1.2
                    </p>
                </div>
            </section>
        </div>
    );
}
