import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import logo from '../assets/logo/nestlnk-logo.jpg';

interface NavLink { to: string; icon: string; label: string; }

const customerLinks: NavLink[] = [
    { to: '/customer/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/customer/create-brief', icon: 'add_circle', label: 'Add Properties' },
    { to: '/customer/my-properties', icon: 'home_work', label: 'My Properties' },
    { to: '/customer/profile', icon: 'person', label: 'Profile' },
];

const firmLinks: NavLink[] = [
    { to: '/firm/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/firm/briefs', icon: 'feed', label: 'Leads' },
    { to: '/firm/my-quotes', icon: 'request_quote', label: 'My Quotes' },
    { to: '/firm/analytics', icon: 'insights', label: 'Analytics' },
    { to: '/firm/profile', icon: 'person', label: 'Profile' },
];

const adminLinks: NavLink[] = [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/admin/firms', icon: 'verified', label: 'Firm Verification' },
    { to: '/admin/users', icon: 'group', label: 'User Management' },
    { to: '/admin/properties', icon: 'domain', label: 'Property Moderation' },
    { to: '/admin/quotes', icon: 'monitoring', label: 'Quote Monitor' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const links = user?.role === 'ADMIN' ? adminLinks : user?.role === 'FIRM' ? firmLinks : customerLinks;
    const roleLabel = user?.role === 'ADMIN' ? 'Admin' : user?.role === 'FIRM' ? 'Design Firm' : 'Customer';

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(isOpen || window.innerWidth >= 1024) && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={`fixed left-0 top-0 h-full w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl text-slate-900 dark:text-white flex flex-col border-r border-slate-200 dark:border-white/5 z-[70] transition-colors duration-300 ${!isOpen && 'hidden lg:flex'}`}
                    >
                        {/* Brand & Close */}
                        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <Link to="/" className="flex items-center gap-3 group">
                                <img src={logo} alt="NestLnk" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/20" />
                                <div>
                                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase">NestLnk</span>
                                    <span className="block text-[10px] text-indigo-500 dark:text-indigo-400 font-bold tracking-wider uppercase">{roleLabel}</span>
                                </div>
                            </Link>
                            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                            {links.map((link) => {
                                const isActive = location.pathname === link.to;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Info & Settings */}
                        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-6">
                            <div className="px-2">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Settings</p>
                                <ThemeSwitcher />
                            </div>

                            <div className="flex items-center gap-3 px-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                                Sign Out
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
