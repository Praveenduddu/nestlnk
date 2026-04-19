import { useEffect, useState } from 'react';
import { adminService } from '../../services/data.service';
import toast from 'react-hot-toast';

interface Firm { id: string; name: string; email: string; companyName: string; verified: boolean; }

export default function FirmVerification() {
    const [firms, setFirms] = useState<Firm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getAllFirms().then(setFirms).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleVerify = async (id: string) => {
        try {
            await adminService.verifyFirm(id);
            setFirms(firms.map(f => f.id === id ? { ...f, verified: true } : f));
            toast.success('Firm verified successfully');
        } catch { toast.error('Failed to verify firm'); }
    };

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Firm Verification</h1><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review and verify design firm accounts</p></div>
            {loading ? (
                <div className="glass-card rounded-2xl p-12 text-center"><span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">progress_activity</span></div>
            ) : firms.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center"><span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">business</span><h3 className="text-lg font-semibold text-slate-900 dark:text-white">No firms registered</h3></div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="border-b border-white/5">
                            {['Firm', 'Email', 'Status', 'Action'].map(h => <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">{h}</th>)}
                        </tr></thead>
                        <tbody>{firms.map(f => (
                            <tr key={f.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold">{f.name.charAt(0)}</div><div><p className="text-sm font-semibold text-slate-900 dark:text-white">{f.name}</p><p className="text-xs text-slate-500">{f.companyName}</p></div></div></td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{f.email}</td>
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${f.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{f.verified ? 'Verified' : 'Pending'}</span></td>
                                <td className="px-6 py-4">{!f.verified && <button onClick={() => handleVerify(f.id)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-900 dark:text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all cursor-pointer">Verify</button>}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
