import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen mesh-bg flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 sticky top-0 z-40">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tighter uppercase">NestLnk</span>
                </div>
                <div className="w-10" /> {/* Spacer for centering branding */}
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={`flex-1 overflow-hidden relative ${location.pathname.includes('/ai-compare') ? 'lg:pl-72' : 'p-4 md:p-8 lg:pl-72'}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                        className={`w-full ${location.pathname.includes('/ai-compare') ? 'max-w-none' : 'max-w-7xl mx-auto'}`}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
