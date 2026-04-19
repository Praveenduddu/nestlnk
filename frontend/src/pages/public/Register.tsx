import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import {
    ArrowRight,
    Mail,
    Lock,
    User,
    Building2,
    Phone,
    Loader2,
    ChevronLeft,
    CheckCircle2,
    Layers,
    Shapes,
    Sparkles,
    Eye,
    EyeOff,
    ShieldCheck,
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

export default function Register() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState<'CUSTOMER' | 'FIRM'>('CUSTOMER');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step Management
    const [step, setStep] = useState(1); // 1: Identity, 2: Verification
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);

    // Validation Service Patterns
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

    const isEmailValid = EMAIL_REGEX.test(formData.email);
    const isPhoneValid = PHONE_REGEX.test(formData.phone);

    const handleRequestOtp = async (e: FormEvent) => {
        e.preventDefault();

        if (!isEmailValid || !isPhoneValid) {
            setError('Service Rejection: Invalid identity protocol.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Protocol Error: Password confirmation mismatch.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            if (response.ok) {
                setStep(2);
                setResendTimer(60);
            } else {
                setError('Service Error: Failed to dispatch verification code.');
            }
        } catch {
            setError('Network Error: Verification service unreachable.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpCode = otp.join('');
        if (otpCode.length < 6) return;

        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: otpCode })
            });
            const data = await response.json();

            if (data.valid) {
                try {
                    const payload = { ...formData, role };
                    if (role === 'FIRM') payload.name = formData.companyName;
                    await registerUser(payload);
                    navigate(`/${role.toLowerCase()}/dashboard`);
                } catch (regErr: any) {
                    const message = regErr.response?.data?.message || regErr.message || 'Registration failed.';
                    setError(`Security Protocol Error: ${message}`);
                }
            } else {
                setError('Service Rejection: Invalid or expired security key.');
            }
        } catch (err: any) {
            setError('System Error: Identity verification sequence interrupted.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setResendTimer(60);
        try {
            await fetch('/api/auth/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
        } catch (e) {
            console.error("Resend failed", e);
        }
    };

    // Timer Logic
    useState(() => {
        const interval = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    });

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#0b1121] text-slate-900 dark:text-white transition-colors duration-500 flex flex-col lg:flex-row overflow-hidden">

            {/* ─── Visual Wing (Left Side) ─── */}
            <motion.section
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-slate-900 overflow-hidden items-center justify-center p-24"
            >
                <div className="absolute inset-0 z-0 text-white/5 font-black text-[30vw] select-none pointer-events-none origin-center rotate-12 flex items-center justify-center">
                    JOIN
                </div>

                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 via-transparent to-violet-900/40" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-glow" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <div className="relative z-10 w-full max-w-2xl">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                        <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-12">
                            <img src={logo} alt="NestLnk" className="w-12 h-12 object-contain" />
                            <span className="text-2xl font-black tracking-tighter text-white uppercase">NestLnk</span>
                        </motion.div>

                        <motion.h2 variants={fadeInUp} className="text-7xl xl:text-8xl font-black text-white leading-[0.85] tracking-[-0.05em] mb-12">
                            BECOME <br />
                            THE <span className="text-white/20">NETWORK.</span>
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { icon: <Layers className="w-5 h-5" />, title: 'Scalable', desc: 'Enterprise infrastructure ready' },
                                { icon: <Shapes className="w-5 h-5" />, title: 'Curated', desc: 'Elite marketplace standards' },
                                { icon: <Sparkles className="w-5 h-5" />, title: 'Premium', desc: 'High-impact visibility' },
                                { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Vetted', desc: 'Verified professional network' },
                            ].map((item, i) => (
                                <motion.div key={i} variants={fadeInUp} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    <div className="text-violet-400 mb-3">{item.icon}</div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                                    <p className="text-xs text-white/40 font-medium">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ─── Action Wing (Right Side) ─── */}
            <section className="flex-1 min-h-screen flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative bg-white dark:bg-[#0b1121] overflow-y-auto">
                <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-50">
                    <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Abort
                    </Link>
                    <ThemeSwitcher />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="w-full max-w-[520px] pt-20 pb-12"
                >
                    <div className="mb-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="lg:hidden mb-10">
                            <img src={logo} alt="NestLnk" className="w-16 h-16 object-contain mx-auto" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                            {step === 1 ? 'Sign Up' : 'Verify Identity'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                            {step === 2 && 'Secure Protocol Phase 2'}
                        </p>

                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex rounded-[20px] bg-slate-50 dark:bg-white/5 p-1.5 mb-2 border border-slate-100 dark:border-white/5">
                                    {(['CUSTOMER', 'FIRM'] as const).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRole(r)}
                                            className={`flex-1 py-4 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${role === r
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl'
                                                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {r === 'CUSTOMER' ? 'Property Owner' : 'Design Firm'}
                                        </button>
                                    ))}
                                </div>

                                {error && (
                                    <div className="p-5 rounded-3xl bg-red-500/5 border border-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
                                        <Lock className="w-5 h-5 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRequestOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">
                                            {role === 'CUSTOMER' ? 'Legal Identity' : 'Studio Label'}
                                        </label>
                                        <div className="relative group">
                                            {role === 'CUSTOMER' ? (
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                            ) : (
                                                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                            )}
                                            <input
                                                type="text"
                                                value={role === 'CUSTOMER' ? formData.name : formData.companyName}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData(prev => role === 'CUSTOMER' ? { ...prev, name: val } : { ...prev, companyName: val });
                                                }}
                                                placeholder={role === 'CUSTOMER' ? "Full Name" : "Company Name"}
                                                required
                                                className="w-full h-16 pl-14 pr-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Network Hub</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="email@endpoint"
                                                    required
                                                    className={`w-full h-16 pl-14 pr-12 rounded-3xl bg-slate-50 dark:bg-white/5 border transition-all outline-none font-bold text-slate-900 dark:text-white ${formData.email === ''
                                                        ? 'border-slate-100 dark:border-white/5'
                                                        : isEmailValid
                                                            ? 'border-green-500/50 bg-green-500/5'
                                                            : 'border-red-500/50 bg-red-500/5'
                                                        }`}
                                                />
                                                {formData.email !== '' && (
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                                        {isEmailValid ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Lock className="w-4 h-4 text-red-500" />}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Comms Protocol</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+91..."
                                                    required
                                                    className={`w-full h-16 pl-14 pr-12 rounded-3xl bg-slate-50 dark:bg-white/5 border transition-all outline-none font-bold text-slate-900 dark:text-white ${formData.phone === ''
                                                        ? 'border-slate-100 dark:border-white/5'
                                                        : isPhoneValid
                                                            ? 'border-green-500/50 bg-green-500/5'
                                                            : 'border-red-500/50 bg-red-500/5'
                                                        }`}
                                                />
                                                {formData.phone !== '' && (
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                                        {isPhoneValid ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Lock className="w-4 h-4 text-red-500" />}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">New Passkey</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="••••••••"
                                                    required
                                                    className="w-full h-16 pl-14 pr-14 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-violet-500 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Confirm Key</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    placeholder="••••••••"
                                                    required
                                                    className="w-full h-16 pl-14 pr-14 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-slate-900 dark:focus:border-white outline-none font-bold transition-all text-slate-900 dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-violet-500 transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
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
                                                Dispatching Code...
                                            </>
                                        ) : (
                                            <>
                                                Sign Up
                                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                                        <ShieldCheck className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">We've sent a 6-digit key to</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white mb-8">{formData.email}</p>

                                    <div className="flex justify-between gap-3 mb-8">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                id={`otp-${i}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (!/^\d*$/.test(val)) return;
                                                    const newOtp = [...otp];
                                                    newOtp[i] = val;
                                                    setOtp(newOtp);
                                                    if (val && i < 5) {
                                                        document.getElementById(`otp-${i + 1}`)?.focus();
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                                        document.getElementById(`otp-${i - 1}`)?.focus();
                                                    }
                                                }}
                                                className="w-full aspect-square text-center text-2xl font-black rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                                            />
                                        ))}
                                    </div>

                                    {error && (
                                        <div className="mb-8 p-4 rounded-2xl bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={loading || otp.join('').length < 6}
                                        className="w-full h-16 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate Protocol'}
                                    </button>
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={resendTimer > 0}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-500 disabled:opacity-50 transition-colors"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                                        {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Protocol'}
                                    </button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-bold text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline underline-offset-8 decoration-2">Sign in</Link>
                        </p>

                    </div>
                </motion.div>
            </section>
        </div>
    );
}
