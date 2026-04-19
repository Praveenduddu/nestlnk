import { useEffect, useState } from 'react';
import { adminService } from '../../services/data.service';
import type { PropertyBrief } from '../../types';

export default function PropertyModeration() {
    const [properties, setProperties] = useState<PropertyBrief[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getAllProperties().then(setProperties).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this property?')) return;
        try { await adminService.deleteProperty(id); setProperties(properties.filter(p => p.id !== id)); } catch { alert('Failed'); }
    };

    const statusColors: Record<string, string> = { OPEN: 'bg-emerald-500/10 text-emerald-400', SHORTLISTED: 'bg-amber-500/10 text-amber-400', CLOSED: 'bg-slate-500/10 text-slate-500 dark:text-slate-400' };

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Property Moderation</h1><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review and moderate property listings on the platform</p></div>
            {loading ? (
                <div className="glass-card rounded-2xl p-12 text-center"><span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">progress_activity</span></div>
            ) : properties.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center"><span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">home_work</span><h3 className="text-lg font-semibold text-slate-900 dark:text-white">No properties to moderate</h3></div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="border-b border-white/5">
                            {['Property', 'City', 'Size', 'Budget', 'Status', 'Action'].map(h => <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">{h}</th>)}
                        </tr></thead>
                        <tbody>{properties.map(p => (
                            <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400">{p.propertyType}</span></td>
                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{p.city}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{p.sizeSqft} sqft</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gradient">₹{(p.budgetMin / 100000).toFixed(1)}L — ₹{(p.budgetMax / 100000).toFixed(1)}L</td>
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[p.status] || 'bg-slate-500/10 text-slate-500 dark:text-slate-400'}`}>{p.status}</span></td>
                                <td className="px-6 py-4"><button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs font-medium transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">delete</span>Delete</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
