import { useEffect, useState } from 'react';
import { adminService } from '../../services/data.service';
import type { Quotation } from '../../types';

export default function QuoteMonitor() {
    const [quotes, setQuotes] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getAllQuotes().then(setQuotes).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quote Monitor</h1><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor all quotations submitted across the platform</p></div>
            {loading ? (
                <div className="glass-card rounded-2xl p-12 text-center"><span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">progress_activity</span></div>
            ) : quotes.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center"><span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">request_quote</span><h3 className="text-lg font-semibold text-slate-900 dark:text-white">No quotes to monitor</h3></div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="border-b border-white/5">
                            {['Firm', 'Property', 'Total', 'Timeline', 'Date'].map(h => <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">{h}</th>)}
                        </tr></thead>
                        <tbody>{quotes.map(q => (
                            <tr key={q.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold">{(q.firmCompany || q.firmName)?.charAt(0)}</div><p className="text-sm font-semibold text-slate-900 dark:text-white">{q.firmCompany || q.firmName}</p></div></td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{q.propertyType} in {q.city}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gradient">₹{(q.estimatedCost / 100000).toFixed(2)}L</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{q.timeline}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
