import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { firmService } from '../../services/data.service';
import type { PropertyBrief } from '../../types';
import { Skeleton } from '../../components/Skeleton';

export default function LeadDetails() {
    const { id } = useParams<{ id: string }>();
    const [lead, setLead] = useState<PropertyBrief | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            setError(null);
            firmService.getLeadById(id)
                .then(data => {
                    console.log('Lead data received:', data);
                    setLead(data);
                })
                .catch(err => {
                    console.error('Failed to fetch lead:', err);
                    setError(err.response?.data?.message || err.message || 'Failed to load lead details');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const formatDate = (dateString: any) => {
        try {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
                <div className="h-64 bg-slate-200 dark:bg-white/5 rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !lead) {
        return (
            <div className="text-center py-20 flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">error_outline</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{error || 'Lead not found'}</h2>
                <Link to="/firm/briefs" className="text-indigo-500 mt-6 btn-outline px-6 py-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Leads
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header / Banner */}
            <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-800" />
                {lead.imageUrls?.[0] && !lead.imageUrls[0].toLowerCase().includes('.pdf') ? (
                    <img src={lead.imageUrls[0]} alt={lead.propertyType} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
                ) : (
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070')] bg-cover mix-blend-overlay opacity-20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/20">{lead.propertyType}</span>
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 backdrop-blur-md text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {lead.status}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase">{lead.city} Property</h1>
                        <p className="text-slate-200 font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            Posted on {formatDate(lead.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Key Specs */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Area Size', value: lead.sizeSqft, unit: 'SQFT', icon: 'square_foot' },
                            { label: 'Budget Min', value: `₹${(lead.budgetMin / 100000).toFixed(1)}L`, unit: 'STARTING', icon: 'payments' },
                            { label: 'Timeline', value: lead.timeline, unit: 'ESTIMATED', icon: 'schedule' },
                        ].map((spec) => (
                            <div key={spec.label} className="glass-card rounded-3xl p-6 border-slate-200/50 dark:border-white/5">
                                <span className="material-symbols-outlined text-indigo-500 mb-3">{spec.icon}</span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tighter">{spec.value}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{spec.unit}</p>
                            </div>
                        ))}
                    </div>

                    {/* Scope of Work */}
                    <div className="glass-card rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-indigo-500 text-xl font-bold">description</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">Scope of Work</h2>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {lead.scope}
                            </p>
                        </div>
                    </div>

                    {/* Floor Plans & Assets */}
                    {lead.imageUrls && lead.imageUrls.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-indigo-500 text-xl font-bold">architecture</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">Floor Plans & Assets</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {lead.imageUrls.map((url, i) => {
                                    const isPdf = url.toLowerCase().includes('.pdf');
                                    return isPdf ? (
                                        <a 
                                            key={i} 
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="h-24 glass-card rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/30 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                                    <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Floor Plan Document</p>
                                                    <p className="text-xs text-slate-500">Click to view/download</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-500 transition-colors">open_in_new</span>
                                        </a>
                                    ) : (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative h-48 rounded-2xl overflow-hidden glass-card group cursor-pointer block">
                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors z-10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">open_in_new</span>
                                            </div>
                                            <img src={url} alt={`Asset ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="glass-card rounded-[2rem] p-8 border-indigo-500/20 bg-indigo-500/5 sticky top-24">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Intersted in this lead?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                            Review the requirements carefully and submit your most competitive quotation to get shortlisted.
                        </p>

                        <div className="space-y-4">
                            {lead.status === 'CLOSED' ? (
                                <div className="w-full h-14 bg-slate-100 dark:bg-white/5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/10">
                                    <span className="material-symbols-outlined text-lg">block</span> Lead Closed
                                </div>
                            ) : (
                                <Link
                                    to={`/firm/brief/${lead.id}/submit`}
                                    className="w-full h-14 btn-primary rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/25"
                                >
                                    Submit Quotation <span className="material-symbols-outlined text-lg">send</span>
                                </Link>
                            )}

                            <Link
                                to="/firm/briefs"
                                className="w-full h-14 flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
                                Back to Leads list
                            </Link>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <span className="material-symbols-outlined text-sm">verified_user</span>
                                </div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Verified Property</span>
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                                This property lead has been verified for location and area specs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
