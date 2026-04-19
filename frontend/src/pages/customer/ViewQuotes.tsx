import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/data.service';
import type { PropertyBrief, Quotation } from '../../types';
import QuoteComparisonTable from '../../components/QuoteComparisonTable';
import toast from 'react-hot-toast';

export default function ViewQuotes() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [property, setProperty] = useState<PropertyBrief | null>(null);
    const [quotes, setQuotes] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!id) return;
        Promise.all([propertyService.getById(id), propertyService.getQuotes(id)])
            .then(([p, q]) => { setProperty(p); setQuotes(q); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    const handleShortlist = async (firmId: string) => {
        if (!id) return;
        try {
            await propertyService.shortlistFirm(id, firmId);
            toast.success('Firm shortlisted successfully!');
            // Reload data to reflect the new status
            Promise.all([propertyService.getById(id), propertyService.getQuotes(id)])
                .then(([p, q]) => { setProperty(p); setQuotes(q); });
        } catch { toast.error('Failed to shortlist firm'); }
    };

    const handleWithdrawProperty = async () => {
        if (!id || !property) return;
        const confirmClose = window.confirm('Are you sure you want to withdraw this property? Firms will be notified and no new quotes will be accepted.');
        if (!confirmClose) return;
        
        try {
            await propertyService.closeProperty(id);
            toast.success('Property withdrawn successfully');
            setProperty({ ...property, status: 'CLOSED' });
        } catch {
            toast.error('Failed to withdraw property');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-indigo-400">progress_activity</span>
        </div>
    );

    if (!property) return (
        <div className="glass-card rounded-2xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-4 block">search_off</span>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Property not found</h3>
        </div>
    );

    const isClosed = property.status === 'CLOSED';

    return (
        <div className="space-y-8">
            <Link to="/customer/my-properties" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Properties
            </Link>

            {/* Property Summary */}
            <div className="glass-card rounded-2xl p-8 relative">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400">{property.propertyType}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400' : property.status === 'SHORTLISTED' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-500 dark:text-slate-400'}`}>
                                {property.status === 'CLOSED' ? 'WITHDRAWN' : property.status}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{property.propertyType} in {property.city}</h1>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Budget</p>
                            <p className="text-lg font-bold text-gradient">₹{(property.budgetMin / 100000).toFixed(1)}L — ₹{(property.budgetMax / 100000).toFixed(1)}L</p>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
                                className="p-2 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors flex items-center justify-center bg-white dark:bg-slate-800"
                            >
                                <span className="material-symbols-outlined text-lg">more_vert</span>
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-10 py-1">
                                    <button 
                                        onClick={() => { setMenuOpen(false); navigate(`/customer/edit-property/${property.id}`); }}
                                        disabled={isClosed}
                                        className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm text-slate-400">edit</span> Edit Property
                                    </button>
                                    <button 
                                        onClick={() => { setMenuOpen(false); handleWithdrawProperty(); }}
                                        disabled={isClosed}
                                        className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm text-red-400">cancel</span> Withdraw
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: 'square_foot', label: 'Size', value: `${property.sizeSqft} sqft` },
                        { icon: 'schedule', label: 'Timeline', value: property.timeline },
                        { icon: 'request_quote', label: 'Quotes', value: `${property.quoteCount} received` },
                        { icon: 'calendar_today', label: 'Posted', value: new Date(property.createdAt).toLocaleDateString() },
                    ].map((item) => (
                        <div key={item.label} className="glass-card rounded-xl p-4">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                <span className="text-xs">{item.label}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quotes */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-400">compare</span>
                        Quotation Comparison
                    </div>
                    {quotes.length > 0 && (
                        <button 
                            onClick={() => navigate(`/customer/property/${id}/ai-compare`)}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">psychology</span>
                            Compare with AI
                        </button>
                    )}
                </h2>
                {quotes.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">hourglass_empty</span>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No quotes yet</h3>
                        <p className="text-slate-500 dark:text-slate-400">Design firms will submit their proposals soon.</p>
                    </div>
                ) : (
                    <QuoteComparisonTable quotes={quotes} onShortlist={handleShortlist} showActions={quotes.length > 0} propertyStatus={property.status} />
                )}
            </div>
        </div>
    );
}
