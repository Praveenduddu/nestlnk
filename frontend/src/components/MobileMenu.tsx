import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    logo: string;
}

export const MobileMenu = ({ isOpen, onClose, logo }: MobileMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] lg:hidden"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Menu Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0b1121] shadow-2xl flex flex-col"
                    >
                        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="NestLnk" className="w-8 h-8 object-contain" />
                                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">NestLnk</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
                            <nav className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">Navigation</p>
                                {['About', 'Contact'].map((item) => (
                                    <Link
                                        key={item}
                                        to={`/${item.toLowerCase()}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between group"
                                    >
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">{item}</span>
                                        <ArrowRight className="w-6 h-6 text-slate-300 dark:text-white/10 group-hover:text-indigo-500 transition-colors" />
                                    </Link>
                                ))}
                            </nav>

                            <div className="pt-8 border-t border-slate-200 dark:border-white/5 space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Preferences</p>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <ThemeSwitcher />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-white/5 space-y-4">
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-black text-slate-900 dark:text-white"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={onClose}
                                className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-black shadow-xl dark:shadow-white/5"
                            >
                                Join Network
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
