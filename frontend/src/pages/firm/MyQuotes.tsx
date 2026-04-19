import { useEffect, useState } from 'react';
import { firmService } from '../../services/data.service';
import type { Quotation } from '../../types';
import { Link } from 'react-router-dom';

export default function MyQuotes() {
    const [quotes, setQuotes] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuotes = () => {
            firmService.getMyQuotes().then(setQuotes).catch(() => { }).finally(() => setLoading(false));
        };

        fetchQuotes();
        const intervalId = setInterval(fetchQuotes, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
        SUBMITTED: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'schedule_send' },
        SHORTLISTED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'verified' },
        REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'cancel' },
        WITHDRAWN: { bg: 'bg-slate-500/10', text: 'text-slate-400', icon: 'archive' },
    };

    const formatCost = (val: number) => val ? `₹${(val / 100000).toFixed(2)}L` : '—';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Quotes</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track all your submitted quotations</p>
            </div>

            {loading ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">progress_activity</span>
                </div>
            ) : quotes.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-4 block">request_quote</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No quotes submitted</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Browse available leads and submit your first proposal.</p>
                    <Link to="/firm/briefs" className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
                        Browse Leads <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {quotes.map((q) => {
                        const isExpanded = expandedId === q.id;
                        const sc = statusConfig[q.status] || statusConfig.SUBMITTED;

                        return (
                            <div key={q.id} className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
                                {/* Card Header — always visible */}
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-indigo-500">request_quote</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{q.propertyType} in {q.city}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="text-sm font-bold text-gradient hidden sm:block">{formatCost(q.estimatedCost)}</span>

                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${sc.bg} ${sc.text}`}>
                                            <span className="material-symbols-outlined text-xs">{sc.icon}</span>
                                            {q.status}
                                        </span>
                                        <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                                    </div>
                                </button>

                                {/* Expandable Details */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 space-y-6 border-t border-slate-100 dark:border-white/5 pt-5 animate-[fadeIn_0.2s_ease-out]">
                                        {/* Cost Breakdown */}
                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cost Breakdown</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {[
                                                    { label: 'Design', value: q.designCost, icon: 'palette' },
                                                    { label: 'Material', value: q.materialCost, icon: 'inventory_2' },
                                                    { label: 'Labor', value: q.laborCost, icon: 'engineering' },
                                                    { label: 'Other', value: q.otherCost, icon: 'more_horiz' },
                                                ].map((item) => (
                                                    <div key={item.label} className="glass-card rounded-xl p-3.5">
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <span className="material-symbols-outlined text-xs text-indigo-400">{item.icon}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCost(item.value)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="glass-card rounded-xl p-4 mt-3 flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Estimated</span>
                                                <span className="text-lg font-black text-gradient">{formatCost(q.estimatedCost)}</span>
                                            </div>
                                        </div>

                                        {/* Timeline & Cover Note */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="glass-card rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-symbols-outlined text-sm text-indigo-400">schedule</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{q.timeline}</p>
                                            </div>
                                            {q.coverNote && (
                                                <div className="glass-card rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="material-symbols-outlined text-sm text-indigo-400">sticky_note_2</span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cover Note</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{q.coverNote}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* PDF */}
                                        {q.pdfUrl && (
                                            <a href={q.pdfUrl} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                                                View Proposal PDF
                                            </a>
                                        )}

                                        {/* Customer Details — only for SHORTLISTED */}
                                        {q.status === 'SHORTLISTED' && q.customerName && (
                                            <div className="glass-card rounded-2xl p-6 border-emerald-500/20 bg-emerald-500/5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-emerald-400">person</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Customer Details</h4>
                                                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Shortlisted — Contact Unlocked</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-sm text-slate-400">badge</span>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Name</p>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{q.customerName}</p>
                                                        </div>
                                                    </div>
                                                    {q.customerEmail && (
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-sm text-slate-400">mail</span>
                                                            <div>
                                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Email</p>
                                                                <a href={`mailto:${q.customerEmail}`} className="text-sm font-bold text-indigo-500 hover:underline">{q.customerEmail}</a>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {q.customerPhone && (
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-sm text-slate-400">phone</span>
                                                            <div>
                                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Phone</p>
                                                                <a href={`tel:${q.customerPhone}`} className="text-sm font-bold text-indigo-500 hover:underline">{q.customerPhone}</a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            <Link to={`/firm/brief/${q.propertyId}`} className="btn-outline px-5 py-2.5 text-xs font-bold flex items-center gap-2 rounded-xl">
                                                <span className="material-symbols-outlined text-sm">visibility</span> View Lead
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
