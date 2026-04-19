import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { firmService } from '../../services/data.service';
import type { PropertyBrief } from '../../types';
import { Skeleton } from '../../components/Skeleton';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function ViewBriefs() {
    const [briefs, setBriefs] = useState<PropertyBrief[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'withdrawn'>('active');

    useEffect(() => {
        setLoading(true);
        const fetchBriefs = () => {
            const fetchPromise = activeTab === 'active' 
                ? firmService.getOpenBriefs() 
                : firmService.getWithdrawnBriefs();
                
            fetchPromise
                .then(setBriefs)
                .catch(() => {})
                .finally(() => setLoading(false));
        };

        fetchBriefs(); // Initial fetch
        const intervalId = setInterval(fetchBriefs, 5000); // Poll every 5 seconds for "automatic" updates

        return () => clearInterval(intervalId);
    }, [activeTab]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Available Leads</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Browse open property leads and submit your proposals</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-[#0F172A] p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'active' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('withdrawn')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'withdrawn' ? 'bg-white dark:bg-[#1E293B] shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Withdrawn
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card rounded-2xl p-6 h-[280px] flex flex-col justify-between">
                            <div>
                                <Skeleton variant="text" className="w-1/3 mb-4 h-6" />
                                <Skeleton variant="text" className="w-3/4 mb-2" />
                                <Skeleton variant="text" className="w-full h-12 mb-4" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Skeleton variant="rectangular" className="h-16 rounded-lg" />
                                <Skeleton variant="rectangular" className="h-16 rounded-lg" />
                                <Skeleton variant="rectangular" className="h-16 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : briefs.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">inbox</span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {activeTab === 'active' ? 'No leads available' : 'No withdrawn leads'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        {activeTab === 'active' ? 'Check back soon for new property leads.' : 'Properties closed by customers will appear here.'}
                    </p>
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {briefs.map((b) => (
                        <motion.div variants={itemVariants} key={b.id} className="glass-card glass-card-hover rounded-2xl p-6 transition-colors duration-300 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-3 gap-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400">{b.propertyType}</span>
                                    {activeTab === 'withdrawn' && (
                                        <span className="bg-slate-500/10 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">archive</span>
                                            Withdrawn
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-500 shrink-0">{new Date(b.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-2 pr-12">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">location_on</span>{b.city}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{b.scope}</p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="glass-card rounded-lg p-2.5 text-center"><p className="text-xs text-slate-500">Size</p><p className="text-sm font-semibold text-slate-900 dark:text-white">{b.sizeSqft}</p></div>
                                <div className="glass-card rounded-lg p-2.5 text-center"><p className="text-xs text-slate-500">Budget</p><p className="text-sm font-semibold text-gradient">₹{(b.budgetMin / 100000).toFixed(0)}L+</p></div>
                                <div className="glass-card rounded-lg p-2.5 text-center"><p className="text-xs text-slate-500">Timeline</p><p className="text-sm font-semibold text-slate-900 dark:text-white">{b.timeline}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <Link to={`/firm/brief/${b.id}`} className={`h-10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-colors ${activeTab === 'active' ? 'btn-secondary' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                                    Details <span className="material-symbols-outlined text-base">visibility</span>
                                </Link>
                                {activeTab === 'active' ? (
                                    <Link to={`/firm/brief/${b.id}/submit`} className="h-10 btn-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-indigo-500/20">
                                        Quote <span className="material-symbols-outlined text-base">send</span>
                                    </Link>
                                ) : (
                                    <button disabled className="h-10 bg-slate-100 dark:bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl cursor-not-allowed border border-slate-200 dark:border-white/5">
                                        Withdrawn
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
