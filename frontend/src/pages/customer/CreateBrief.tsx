import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/data.service';
import toast from 'react-hot-toast';

interface Firm {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
}

export default function CreateBrief() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [form, setForm] = useState({
        propertyType: '', city: '', sizeSqft: '', budgetMin: '', budgetMax: '', timeline: '', scope: '',
    });

    // Firm selection state
    const [showFirmModal, setShowFirmModal] = useState(false);
    const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);
    const [firms, setFirms] = useState<Firm[]>([]);
    const [selectedFirmIds, setSelectedFirmIds] = useState<Set<string>>(new Set());
    const [firmsLoading, setFirmsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (showFirmModal) {
            setFirmsLoading(true);
            propertyService.getVerifiedFirms()
                .then(setFirms)
                .catch(() => toast.error('Failed to load firms'))
                .finally(() => setFirmsLoading(false));
        }
    }, [showFirmModal]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImages(Array.from(e.target.files));
    };

    const toggleFirm = (firmId: string) => {
        setSelectedFirmIds(prev => {
            const next = new Set(prev);
            if (next.has(firmId)) next.delete(firmId);
            else next.add(firmId);
            return next;
        });
    };

    const selectAllFirms = () => {
        if (selectedFirmIds.size === filteredFirms.length) {
            setSelectedFirmIds(new Set());
        } else {
            setSelectedFirmIds(new Set(filteredFirms.map(f => f.id)));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        
        // Convert numeric fields to actual numbers for strict backend validation
        const submissionData = {
            ...form,
            sizeSqft: Number(form.sizeSqft),
            budgetMin: Number(form.budgetMin),
            budgetMax: Number(form.budgetMax)
        };
        
        data.append('property', new Blob([JSON.stringify(submissionData)], { type: 'application/json' }));
        images.forEach((f) => data.append('images', f));
        try {
            const result = await propertyService.create(data);
            toast.success('Brief created successfully!');
            setCreatedPropertyId(result.id);
            setShowFirmModal(true);
        } catch { toast.error('Failed to create brief. Please try again.'); }
        finally { setLoading(false); }
    };

    const handleAssignFirms = async () => {
        if (!createdPropertyId) return;
        setAssigning(true);
        try {
            await propertyService.assignFirms(createdPropertyId, Array.from(selectedFirmIds));
            toast.success(`${selectedFirmIds.size} firm(s) assigned successfully!`);
            navigate('/customer/my-properties');
        } catch {
            toast.error('Failed to assign firms. Please try again.');
        } finally {
            setAssigning(false);
        }
    };

    const handleSkip = async () => {
        if (!createdPropertyId) return;
        setAssigning(true);
        try {
            await propertyService.assignFirms(createdPropertyId, []);
            toast.success('Property details sent to all firms!');
            navigate('/customer/my-properties');
        } catch {
            toast.error('Failed to send details. Please try again.');
        } finally {
            setAssigning(false);
        }
    };

    const filteredFirms = firms.filter(f =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Properties</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Describe your property requirements to receive competitive quotations</p>
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

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Floor Plan</label>
                    <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/30 transition-colors">
                            <span className="material-symbols-outlined text-4xl text-slate-500 mb-3 block">cloud_upload</span>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                {images.length > 0 ? `${images.length} file(s) selected` : 'Drop PDF here or click to browse'}
                            </p>
                            <p className="text-xs text-slate-600">PDF up to 10MB</p>
                        </div>
                        <input type="file" multiple accept=".pdf,application/pdf" onChange={handleImageChange} className="hidden" />
                    </label>
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {images.map((f, i) => (
                                <span key={i} className="text-xs bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full">{f.name}</span>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading || showFirmModal} className="w-full h-12 btn-primary text-base flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                    {loading ? (
                        <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Adding...</>
                    ) : (
                        <><span className="material-symbols-outlined text-lg">send</span> Add Property</>
                    )}
                </button>
            </form>

            {/* Firm Selection Modal */}
            {showFirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-white/10">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-indigo-400">business</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Design Firms</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Choose specific firms to receive your brief, or skip to send to all</p>
                                </div>
                            </div>
                            {/* Search */}
                            <div className="relative mt-4">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input
                                    type="text"
                                    placeholder="Search firms..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Firm List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {firmsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">progress_activity</span>
                                </div>
                            ) : filteredFirms.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                                    <p className="text-sm">No firms found</p>
                                </div>
                            ) : (
                                <>
                                    {/* Select All / Deselect */}
                                    <button
                                        type="button"
                                        onClick={selectAllFirms}
                                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors mb-2 cursor-pointer"
                                    >
                                        {selectedFirmIds.size === filteredFirms.length ? 'Deselect All' : `Select All (${filteredFirms.length})`}
                                    </button>
                                    {filteredFirms.map((firm) => (
                                        <button
                                            key={firm.id}
                                            type="button"
                                            onClick={() => toggleFirm(firm.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                                                selectedFirmIds.has(firm.id)
                                                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5'
                                                    : 'border-slate-200 dark:border-white/10 hover:border-indigo-500/30 bg-white dark:bg-[#0F172A]/50'
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                                selectedFirmIds.has(firm.id)
                                                    ? 'border-indigo-500 bg-indigo-500'
                                                    : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                                {selectedFirmIds.has(firm.id) && (
                                                    <span className="material-symbols-outlined text-white text-sm">check</span>
                                                )}
                                            </div>
                                            {/* Firm Icon */}
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-indigo-400">
                                                    {(firm.companyName || firm.name || '?').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            {/* Firm Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                    {firm.companyName || firm.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {firm.email} · {firm.phone || 'No phone'}
                                                </p>
                                            </div>
                                            {/* Verified Badge */}
                                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">verified</span>
                                                Verified
                                            </span>
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={handleSkip}
                                disabled={assigning}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Send to all firms
                            </button>
                            <button
                                type="button"
                                onClick={handleAssignFirms}
                                disabled={selectedFirmIds.size === 0 || assigning}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                            >
                                {assigning ? (
                                    <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Sending...</>
                                ) : (
                                    <><span className="material-symbols-outlined text-sm">send</span> Send {selectedFirmIds.size > 0 ? `(${selectedFirmIds.size})` : ''}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
