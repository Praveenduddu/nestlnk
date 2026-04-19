import { useEffect, useState } from 'react';
import { adminService } from '../../services/data.service';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ customers: 0, firms: 0, properties: 0, quotes: 0 });

    useEffect(() => {
        adminService.getStats().then(setStats).catch(() => { });
    }, []);

    const cards = [
        { icon: 'group', label: 'Total Customers', value: stats.customers, color: 'from-indigo-500 to-violet-600', accent: 'indigo' },
        { icon: 'business', label: 'Total Firms', value: stats.firms, color: 'from-emerald-500 to-teal-600', accent: 'emerald' },
        { icon: 'home_work', label: 'Total Properties', value: stats.properties, color: 'from-amber-500 to-orange-600', accent: 'amber' },
        { icon: 'request_quote', label: 'Total Quotations', value: stats.quotes, color: 'from-rose-500 to-pink-600', accent: 'rose' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor and manage the NestLnk marketplace</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((c) => (
                    <div key={c.label} className="glass-card glass-card-hover rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.color}`} />
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg mb-4`}>
                            <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">{c.icon}</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{c.value}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="glass-card rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-400">timeline</span>
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    {[
                        { icon: 'person_add', text: 'New customer registered', time: 'Just now', color: 'text-indigo-400 bg-indigo-500/10' },
                        { icon: 'home_work', text: 'New property brief posted', time: '2 min ago', color: 'text-emerald-400 bg-emerald-500/10' },
                        { icon: 'request_quote', text: 'New quotation submitted', time: '5 min ago', color: 'text-amber-400 bg-amber-500/10' },
                        { icon: 'verified', text: 'Firm verification approved', time: '15 min ago', color: 'text-violet-400 bg-violet-500/10' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass-card transition-colors">
                            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            </div>
                            <div className="flex-1"><p className="text-sm font-medium text-slate-900 dark:text-white">{item.text}</p></div>
                            <p className="text-xs text-slate-500">{item.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
