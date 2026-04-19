import { useEffect, useState } from 'react';
import { adminService } from '../../services/data.service';

interface User { id: string; name: string; email: string; role: string; verified: boolean; }

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getAllUsers().then(setUsers).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this user?')) return;
        try { await adminService.deleteUser(id); setUsers(users.filter(u => u.id !== id)); } catch { alert('Failed'); }
    };

    const roleColors: Record<string, string> = { ADMIN: 'bg-rose-500/10 text-rose-400', FIRM: 'bg-violet-500/10 text-violet-400', CUSTOMER: 'bg-indigo-500/10 text-indigo-400' };

    return (
        <div className="space-y-8">
            <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage platform users and their roles</p></div>
            {loading ? (
                <div className="glass-card rounded-2xl p-12 text-center"><span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">progress_activity</span></div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b border-white/5">
                            {['User', 'Email', 'Role', 'Status', 'Action'].map(h => <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">{h}</th>)}
                        </tr></thead>
                        <tbody>{users.map(u => (
                            <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold">{u.name.charAt(0)}</div><p className="text-sm font-semibold text-slate-900 dark:text-white">{u.name}</p></div></td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.email}</td>
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[u.role] || 'bg-slate-500/10 text-slate-500 dark:text-slate-400'}`}>{u.role}</span></td>
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{u.verified ? 'Verified' : 'Pending'}</span></td>
                                <td className="px-6 py-4"><button onClick={() => handleDelete(u.id)} className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs font-medium transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">delete</span>Delete</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
