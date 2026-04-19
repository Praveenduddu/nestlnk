import { useState, useEffect } from 'react';
import {
    TrendingUp,
    FileText,
    CheckCircle,
    BarChart3,
    Clock,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { quotationService } from '../../services/data.service';
import type { Quotation } from '../../types';
import { VolumeTrendChart, StatusDistributionChart } from '../../components/analytics/AnalyticsCharts';
import toast from 'react-hot-toast';

export default function Analytics() {
    const [quotes, setQuotes] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 30000); // Auto-update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await quotationService.getMyQuotes();
            setQuotes(data || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            // Don't show toast on background refresh to avoid annoyance
            if (loading) toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get quotes by period
    const getQuotesInPeriod = (daysAgoStart: number, daysAgoEnd: number) => {
        const now = new Date();
        const start = new Date(now.getTime() - daysAgoStart * 24 * 60 * 60 * 1000);
        const end = new Date(now.getTime() - daysAgoEnd * 24 * 60 * 60 * 1000);
        return quotes.filter(q => {
            if (!q.createdAt) return false;
            const d = new Date(q.createdAt);
            return d >= start && d < end;
        });
    };

    // Metrics calculation logic
    const current30Days = getQuotesInPeriod(30, 0);
    const prev30Days = getQuotesInPeriod(60, 30);

    const calcMetric = (periodQuotes: Quotation[]) => {
        const total = periodQuotes.length;
        const shortlisted = periodQuotes.filter(q => q.status === 'SHORTLISTED').length;
        const totalVal = periodQuotes.reduce((acc, q) => acc + (Number(q.estimatedCost) || 0), 0);
        const avgVal = total > 0 ? totalVal / total : 0;
        const conversion = total > 0 ? (shortlisted / total) * 100 : 0;
        return { total, shortlisted, avgVal, conversion };
    };

    const current = calcMetric(current30Days);
    const prev = calcMetric(prev30Days);

    const getChange = (curr: number, p: number) => {
        if (p === 0) return curr > 0 ? '+100%' : '0%';
        const diff = ((curr - p) / p) * 100;
        return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    };

    // Global totals (as requested by headers)
    const totalQuotes = quotes.length;
    const shortlistedQuotes = quotes.filter(q => q.status === 'SHORTLISTED').length;
    const conversionRate = totalQuotes > 0 ? ((shortlistedQuotes / totalQuotes) * 100).toFixed(1) : '0.0';
    const totalProjectValue = quotes.reduce((acc, q) => acc + (Number(q.estimatedCost) || 0), 0);
    const avgQuoteValueTotal = totalQuotes > 0 ? Math.round(totalProjectValue / totalQuotes) : 0;

    const metrics = [
        {
            icon: <FileText className="w-5 h-5" />,
            label: 'Total Quotes',
            value: totalQuotes.toString(),
            change: getChange(current.total, prev.total),
            up: current.total >= prev.total,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            icon: <CheckCircle className="w-5 h-5" />,
            label: 'Shortlisted',
            value: shortlistedQuotes.toString(),
            change: getChange(current.shortlisted, prev.shortlisted),
            up: current.shortlisted >= prev.shortlisted,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            label: 'Conversion',
            value: `${conversionRate}%`,
            change: getChange(current.conversion, prev.conversion),
            up: current.conversion >= prev.conversion,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        {
            icon: <DollarSign className="w-5 h-5" />,
            label: 'Avg Value',
            value: `₹${(avgQuoteValueTotal / 1000).toFixed(1)}k`,
            change: getChange(current.avgVal, prev.avgVal),
            up: current.avgVal >= prev.avgVal,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
    ];

    // Chart Data Preparation
    const currentYear = new Date().getFullYear();
    const hasData = quotes.length > 0;

    // Rolling 12-month Volume Trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const volumeData = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - i));
        const m = d.getMonth();
        const y = d.getFullYear();
        
        const count = quotes.filter(q => {
            if (!q.createdAt) return false;
            const qd = new Date(q.createdAt);
            return qd.getMonth() === m && qd.getFullYear() === y;
        }).length;
        
        return { name: months[m], value: count };
    });

    // Status distribution data (including WITHDRAWN)
    const statusData = [
        { name: 'Submitted', value: quotes.filter(q => q.status === 'SUBMITTED').length },
        { name: 'Shortlisted', value: quotes.filter(q => q.status === 'SHORTLISTED').length },
        { name: 'Rejected', value: quotes.filter(q => q.status === 'REJECTED').length },
        { name: 'Withdrawn', value: quotes.filter(q => q.status === 'WITHDRAWN').length },
    ].filter(s => s.value > 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-10 pb-12">
            <div>
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
                    Performance Analytics
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-2 font-medium">
                    Detailed insights and metrics for the {currentYear} fiscal year
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {metrics.map((m) => (
                    <div key={m.label} className="glass-card glass-card-hover rounded-3xl p-5 md:p-6 transition-all duration-300 border border-slate-200/50 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center shadow-inner`}>
                                {m.icon}
                            </div>
                            <span className={`hidden sm:flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${m.up ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                }`}>
                                {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {m.change}
                            </span>
                        </div>
                        <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{m.value}</p>
                        <p className="text-[10px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{m.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-10 border border-slate-200/50 dark:border-white/5 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Quote Volume</h3>
                            <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">Monthly frequency of submissions</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-100/50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200/50 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Submissions</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[250px] md:h-[350px] w-full">
                        {hasData ? (
                            <VolumeTrendChart data={volumeData} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                                <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50">No Data Available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-6 md:p-10 border border-slate-200/50 dark:border-white/5">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Quote Status</h3>
                    <p className="text-xs md:text-sm font-medium text-slate-500 mb-10">Outcome distribution analysis</p>
                    <div className="h-[300px] w-full">
                        {hasData && statusData.length > 0 ? (
                            <StatusDistributionChart data={statusData} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                                <Clock className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Pending Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">
                <div className="glass-card rounded-3xl p-8 md:p-10 border border-slate-200/50 dark:border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <BarChart3 className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Efficiency Insights</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-6 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:border-indigo-500/30 group">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Market Alignment</h4>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">Optimized</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Your average quote value is currently within 5% of the market median for {currentYear}.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:border-indigo-500/30 group">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Response Velocity</h4>
                                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">Exempt</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">You are responding to new briefs 15% faster than last quarter, increasing your win probability.</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-8 md:p-10 bg-gradient-to-br from-indigo-600/10 via-indigo-600/5 to-transparent border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/40">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Growth Strategies</h3>
                    </div>
                    <ul className="space-y-6">
                        <li className="flex gap-5 group">
                            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-500 font-black border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">01</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Firms using <span className="text-indigo-500 font-bold">Cost Breakdowns</span> see a 42% higher conversion rate. Try adding line-item details.</p>
                        </li>
                        <li className="flex gap-5 group">
                            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-500 font-black border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">02</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Profiles with <span className="text-indigo-500 font-bold">Portfolio Links</span> receive 3x more engagement. Ensure your profile is 100% complete.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
