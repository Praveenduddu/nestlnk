import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyService } from '../../services/data.service';
import toast from 'react-hot-toast';

export default function EditBrief() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [form, setForm] = useState({
        propertyType: '', city: '', sizeSqft: '', budgetMin: '', budgetMax: '', timeline: '', scope: '',
    });

    useEffect(() => {
        if (!id) return;
        propertyService.getById(id)
            .then(data => {
                if (data.status === 'CLOSED') {
                    toast.error('Cannot edit a closed property');
                    navigate('/customer/my-properties');
                    return;
                }
                setForm({
                    propertyType: data.propertyType,
                    city: data.city,
                    sizeSqft: data.sizeSqft.toString(),
                    budgetMin: data.budgetMin.toString(),
                    budgetMax: data.budgetMax.toString(),
                    timeline: data.timeline,
                    scope: data.scope,
                });
            })
            .catch(() => {
                toast.error('Failed to fetch property details');
                navigate('/customer/my-properties');
            })
            .finally(() => setFetching(false));
    }, [id, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        
        try {
            await propertyService.updateProperty(id, {
                propertyType: form.propertyType,
                city: form.city,
                sizeSqft: parseInt(form.sizeSqft),
                budgetMin: parseInt(form.budgetMin),
                budgetMax: parseInt(form.budgetMax),
                timeline: form.timeline,
                scope: form.scope,
            });
            toast.success('Brief updated successfully!');
            navigate('/customer/my-properties');
        } catch { 
            toast.error('Failed to update brief. Please try again.'); 
        } finally { 
            setLoading(false); 
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="material-symbols-outlined animate-spin text-4xl text-indigo-500">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <button 
                    onClick={() => navigate('/customer/my-properties')}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Properties
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Property Brief</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your property requirements</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 md:p-8 space-y-6">
                {/* Property Type & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Property Type</label>
                        <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="input-dark" required>
                            <option value="">Select type...</option>
                            {['Apartment', 'Villa', 'Studio', 'Office', 'Bungalow', 'Penthouse', 'Duplex'].map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">City</label>
                        <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-dark" placeholder="e.g. Bangalore" required />
                    </div>
                </div>

                {/* Size */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Size (sqft)</label>
                    <input type="number" value={form.sizeSqft} onChange={(e) => setForm({ ...form, sizeSqft: e.target.value })} className="input-dark" placeholder="1200" required />
                </div>

                {/* Budget Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Min Budget (₹)</label>
                        <input type="number" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} className="input-dark" placeholder="500000" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Max Budget (₹)</label>
                        <input type="number" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} className="input-dark" placeholder="1500000" required />
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Timeline</label>
                    <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="input-dark" required>
                        <option value="">Select timeline...</option>
                        {['1-3 months', '3-6 months', '6-12 months', '12+ months'].map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Scope */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Scope & Description</label>
                    <textarea value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="input-dark min-h-[120px] resize-none" placeholder="Describe your requirements, style preferences, and any specific needs..." required />
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full h-12 btn-primary text-base flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                        {loading ? (
                            <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Updating...</>
                        ) : (
                            <><span className="material-symbols-outlined text-lg">save</span> Save Changes</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
