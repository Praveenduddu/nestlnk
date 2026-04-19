import type { Quotation } from '../types';

interface Props {
    quotes: Quotation[];
    onShortlist?: (firmId: string) => void;
    showActions?: boolean;
    propertyStatus?: string;
}

export default function QuoteComparisonTable({ quotes, onShortlist, showActions = false, propertyStatus = 'OPEN' }: Props) {
    const sorted = [...quotes].sort((a, b) => a.estimatedCost - b.estimatedCost);

    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            {['Firm', 'Total Cost', 'Design', 'Material', 'Labor', 'Other', 'Timeline', 'PDF', ...(showActions ? ['Action'] : [])].map((h) => (
                                <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((q, i) => (
                            <tr key={q.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${(i === 0 && propertyStatus === 'OPEN') ? 'bg-emerald-500/[0.03]' : (q.status === 'SHORTLISTED') ? 'bg-emerald-500/[0.05]' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-slate-900 dark:text-white text-xs font-bold shrink-0">
                                            {q.firmCompany?.charAt(0) || q.firmName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{q.firmCompany || q.firmName}</p>
                                            {i === 0 && propertyStatus === 'OPEN' && (
                                                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">verified</span> Lowest Cost
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">₹{(q.estimatedCost / 100000).toFixed(2)}L</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">₹{(q.designCost / 100000).toFixed(2)}L</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">₹{(q.materialCost / 100000).toFixed(2)}L</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">₹{(q.laborCost / 100000).toFixed(2)}L</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">₹{(q.otherCost / 100000).toFixed(2)}L</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{q.timeline}</td>
                                <td className="px-6 py-4">
                                    {q.pdfUrl ? (
                                        <a href={q.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span> View
                                        </a>
                                    ) : <span className="text-slate-600 text-sm">—</span>}
                                </td>
                                {showActions && (
                                    <td className="px-6 py-4">
                                        {q.status === 'SHORTLISTED' ? (
                                            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1 w-max">
                                                <span className="material-symbols-outlined text-sm">task_alt</span> Shortlisted
                                            </span>
                                        ) : propertyStatus !== 'OPEN' ? (
                                            <span className="text-slate-500 text-xs font-semibold">Not Selected</span>
                                        ) : (
                                            <button
                                                onClick={() => onShortlist?.(q.firmId)}
                                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4725f4] to-[#6366f1] text-slate-900 dark:text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer"
                                            >
                                                Shortlist
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
