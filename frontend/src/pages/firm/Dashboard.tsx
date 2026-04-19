import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { firmService } from '../../services/data.service';
import type { PropertyBrief, Quotation } from '../../types';

export default function FirmDashboard() {
    const { user } = useAuth();
    const [briefs, setBriefs] = useState<PropertyBrief[]>([]);
    const [quotes, setQuotes] = useState<Quotation[]>([]);

    useEffect(() => {
        const fetchData = () => {
            firmService.getOpenBriefs().then(data => {
                const sortedBriefs = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBriefs(sortedBriefs);
            }).catch(() => { });
            
            firmService.getMyQuotes().then(setQuotes).catch(() => { });
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const totalQuotes = quotes.length;
    const shortlistedQuotes = quotes.filter(q => q.status === 'SHORTLISTED').length;
    const winRate = totalQuotes > 0 ? Math.round((shortlistedQuotes / totalQuotes) * 100) + '%' : '0%';

    const stats = [
        { icon: 'feed', label: 'Open Leads', value: briefs.length, color: 'from-indigo-500 to-violet-600' },
        { icon: 'request_quote', label: 'Quotes Submitted', value: totalQuotes, color: 'from-emerald-500 to-teal-600' },
        { icon: 'star', label: 'Shortlisted', value: shortlistedQuotes, color: 'from-amber-500 to-orange-600' },
        { icon: 'trending_up', label: 'Win Rate', value: winRate, color: 'from-rose-500 to-pink-600' },
    ];

    return (
        <div className="space-y-6 md:space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-xl">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome, {user?.name} 👋</h1>
                    {user?.companyName && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                            <span className="material-symbols-outlined text-indigo-500 text-sm">business</span>
                            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">{user.companyName}</span>
                        </div>
                    )}
                </div>
                <Link to="/firm/briefs" className="h-11 px-8 btn-primary text-sm flex items-center justify-center gap-2 group shrink-0">
                    <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">search</span>
                    Browse New Leads
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card glass-card-hover rounded-3xl p-5 md:p-6 transition-all duration-300">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg mb-4`}>
                            <span className="material-symbols-outlined text-white text-xl md:text-2xl stat-glow">{stat.icon}</span>
                        </div>
                        <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{stat.value}</p>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Available Property Leads</h2>
                    </div>
                    <Link to="/firm/briefs" className="text-xs md:text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                        View All <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>
                {briefs.length === 0 ? (
                    <div className="glass-card rounded-3xl p-10 md:p-20 text-center border-dashed border-2">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl text-slate-400">inventory_2</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">No active leads found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">New property leads from clients in your area will appear here. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {briefs.slice(0, 6).map((b) => (
                            <div key={b.id} className="glass-card glass-card-hover rounded-3xl p-6 md:p-7 transition-all duration-500 relative group overflow-hidden border border-slate-200/50 dark:border-white/5">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-indigo-500/30 text-4xl">architecture</span>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 border border-indigo-500/10">{b.propertyType}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{b.status}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6 tracking-tight">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                                    </div>
                                    <span className="truncate">{b.city}</span>
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="glass-card bg-slate-50/50 dark:bg-white/5 rounded-2xl p-4 border-none">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Area Size</p>
                                        <p className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{b.sizeSqft} <span className="text-[10px] font-medium text-slate-400 uppercase">SQFT</span></p>
                                    </div>
                                    <div className="glass-card bg-slate-50/50 dark:bg-white/5 rounded-2xl p-4 border-none">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Allocated Budget</p>
                                        <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tighter">₹{(b.budgetMin / 100000).toFixed(1)}L+</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link to={`/firm/brief/${b.id}`} className="h-11 btn-secondary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl">
                                        Details <span className="material-symbols-outlined text-base">visibility</span>
                                    </Link>
                                    <Link to={`/firm/brief/${b.id}/submit`} className="h-11 btn-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl shadow-indigo-500/20">
                                        Quote <span className="material-symbols-outlined text-base">send</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
