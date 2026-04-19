import { useEffect, useState } from 'react';
import { propertyService } from '../../services/data.service';
import type { PropertyBrief } from '../../types';
import PropertyCard from '../../components/PropertyCard';
import toast from 'react-hot-toast';

interface Firm {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
}

export default function MyProperties() {
    const [properties, setProperties] = useState<PropertyBrief[]>([]);
    const [loading, setLoading] = useState(true);

    // Firm selection modal state
    const [showFirmModal, setShowFirmModal] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [firms, setFirms] = useState<Firm[]>([]);
    const [selectedFirmIds, setSelectedFirmIds] = useState<Set<string>>(new Set());
    const [firmsLoading, setFirmsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        propertyService.getMyProperties().then(setProperties).catch(() => { }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (showFirmModal) {
            setFirmsLoading(true);
            propertyService.getVerifiedFirms()
                .then(setFirms)
                .catch(() => toast.error('Failed to load firms'))
                .finally(() => setFirmsLoading(false));
        }
    }, [showFirmModal]);

    const openFirmModal = (e: React.MouseEvent, propertyId: string) => {
        e.preventDefault(); // Prevent navigating to property details
        setSelectedPropertyId(propertyId);
        setSelectedFirmIds(new Set());
        setSearchQuery('');
        setShowFirmModal(true);
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

    const handleAssignFirms = async () => {
        if (!selectedPropertyId) return;
        setAssigning(true);
        try {
            const firmsArray = Array.from(selectedFirmIds);
            await propertyService.assignFirms(selectedPropertyId, firmsArray);
            
            // Update local state so assigned firms don't show up again
            setProperties(prev => prev.map(p => {
                if (p.id === selectedPropertyId) {
                    return {
                        ...p,
                        targetedFirmIds: [...(p.targetedFirmIds || []), ...firmsArray]
                    };
                }
                return p;
            }));

            toast.success(`${selectedFirmIds.size} firm(s) assigned successfully!`);
            setShowFirmModal(false);
        } catch {
            toast.error('Failed to assign firms. Please try again.');
        } finally {
            setAssigning(false);
        }
    };



    const filteredFirms = firms.filter(f => {
        const selectedProperty = properties.find(p => p.id === selectedPropertyId);
        const isAssigned = selectedProperty?.targetedFirmIds?.includes(f.id);
        if (isAssigned) return false;

        const matchesSearch = f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              f.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              f.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Properties</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage all your posted property briefs</p>
            </div>

            {loading ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <span className="material-symbols-outlined animate-spin text-3xl text-indigo-400">progress_activity</span>
                </div>
            ) : properties.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">home_work</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No properties yet</h3>
                    <p className="text-slate-500 dark:text-slate-400">Start by creating your first property brief.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((p) => (
                        <PropertyCard 
                            key={p.id} 
                            property={p} 
                            linkPrefix="/customer/property"
                            actionButton={
                                <button
                                    onClick={(e) => openFirmModal(e, p.id)}
                                    disabled={p.status === 'SHORTLISTED' || p.status === 'CLOSED'}
                                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                                        p.status === 'SHORTLISTED'
                                            ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                            : p.status === 'CLOSED'
                                            ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                            : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">group_add</span>
                                    {p.status === 'SHORTLISTED' ? 'Firm Shortlisted' : p.status === 'CLOSED' ? 'Property Withdrawn' : 'Assign Firms'}
                                </button>
                            }
                        />
                    ))}
                </div>
            )}

            {/* Firm Selection Modal */}
            {showFirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-white/10">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-indigo-400">business</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assign Design Firms</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Select firms to securely share this brief with</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowFirmModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-slate-200 dark:border-white/10">
                            <div className="relative">
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
                                    {/* Select All */}
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
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                                selectedFirmIds.has(firm.id) ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                                {selectedFirmIds.has(firm.id) && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-indigo-400">{(firm.companyName || firm.name || '?').charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{firm.companyName || firm.name}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{firm.email} · {firm.phone || 'No phone'}</p>
                                            </div>
                                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">verified</span> Verified
                                            </span>
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowFirmModal(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAssignFirms}
                                disabled={selectedFirmIds.size === 0 || assigning}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                            >
                                {assigning ? (
                                    <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Assigning...</>
                                ) : (
                                    <><span className="material-symbols-outlined text-sm">send</span> Assign {selectedFirmIds.size > 0 ? `(${selectedFirmIds.size})` : ''}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
