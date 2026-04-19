import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firmService } from '../../services/data.service';
import toast from 'react-hot-toast';

export default function SubmitQuote() {
    const { id: propertyId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pdf, setPdf] = useState<File | null>(null);
    const [form, setForm] = useState({ designCost: '', materialCost: '', laborCost: '', otherCost: '', timeline: '', coverNote: '' });

    const total = ['designCost', 'materialCost', 'laborCost', 'otherCost'].reduce((s, k) => s + (Number(form[k as keyof typeof form]) || 0), 0);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!propertyId) return;
        setLoading(true);
        const data = new FormData();

        const quotationRequest = {
            propertyId: propertyId,
            estimatedCost: total,
            designCost: Number(form.designCost) || 0,
            materialCost: Number(form.materialCost) || 0,
            laborCost: Number(form.laborCost) || 0,
            otherCost: Number(form.otherCost) || 0,
            timeline: form.timeline,
            coverNote: form.coverNote
        };

        data.append('quotation', new Blob([JSON.stringify(quotationRequest)], { type: 'application/json' }));
        if (pdf) data.append('pdf', pdf);

        try {
            await firmService.submitQuote(data);
            navigate('/firm/my-quotes');
            toast.success('Quotation submitted successfully!');
        } catch (error: any) {
            console.error('Failed to submit quote:', error.response?.data || error.message);
            toast.error(`Failed: ${error?.response?.data?.message || error?.response?.data?.error || error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Submit Quotation</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Provide a detailed cost breakdown for this property brief</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                        { key: 'designCost', label: 'Design Cost (₹)', icon: 'palette' },
                        { key: 'materialCost', label: 'Material Cost (₹)', icon: 'inventory_2' },
                        { key: 'laborCost', label: 'Labor Cost (₹)', icon: 'engineering' },
                        { key: 'otherCost', label: 'Other Costs (₹)', icon: 'more_horiz' },
                    ].map(({ key, label, icon }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-indigo-400">{icon}</span>{label}
                            </label>
                            <input type="number" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input-dark" placeholder="0" required />
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="glass-card rounded-xl p-5 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Estimated Total</span>
                    <span className="text-2xl font-bold text-gradient">₹{(total / 100000).toFixed(2)}L</span>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Timeline</label>
                    <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="input-dark" required>
                        <option value="">Select timeline...</option>
                        {['1-3 months', '3-6 months', '6-12 months', '12+ months'].map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Cover Note</label>
                    <textarea value={form.coverNote} onChange={(e) => setForm({ ...form, coverNote: e.target.value })} className="input-dark min-h-[100px] resize-none" placeholder="Describe your approach, experience, and value proposition..." />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Detailed Proposal (PDF)</label>
                    <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 text-center hover:border-indigo-500/30 transition-colors">
                            <span className="material-symbols-outlined text-3xl text-slate-500 mb-2 block">picture_as_pdf</span>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{pdf ? pdf.name : 'Upload your detailed proposal PDF'}</p>
                        </div>
                        <input type="file" accept=".pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => setPdf(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                </div>

                <button type="submit" disabled={loading} className="w-full h-12 btn-primary text-base flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                    {loading ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Submitting...</> : <><span className="material-symbols-outlined text-lg">send</span> Submit Quotation</>}
                </button>
            </form>
        </div>
    );
}
