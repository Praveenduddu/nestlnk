import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FirmProfile() {
    const { user, updateProfile } = useAuth();
    
    const parsePhone = (phoneStr: string) => {
        if (!phoneStr) return { code: '+1', number: '' };
        if (phoneStr.startsWith('+91')) return { code: '+91', number: phoneStr.substring(3).trim() };
        if (phoneStr.startsWith('+44')) return { code: '+44', number: phoneStr.substring(3).trim() };
        if (phoneStr.startsWith('+61')) return { code: '+61', number: phoneStr.substring(3).trim() };
        if (phoneStr.startsWith('+1')) return { code: '+1', number: phoneStr.substring(2).trim() };
        
        const spaceIdx = phoneStr.indexOf(' ');
        if (spaceIdx > 0 && phoneStr.startsWith('+')) {
            return { code: phoneStr.substring(0, spaceIdx), number: phoneStr.substring(spaceIdx + 1).replace(/\D/g, '') };
        }
        return { code: '+1', number: phoneStr.replace(/\D/g, '') };
    };

    const initialPhone = parsePhone(user?.phone || '');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        name: user?.name || '', 
        companyName: user?.companyName || '', 
        phoneCode: initialPhone.code,
        phoneNumber: initialPhone.number 
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (formData.phoneNumber && formData.phoneNumber.length < 10) {
            toast.error('Phone number must be at least 10 digits');
            return;
        }

        setSaving(true);
        try {
            const fullPhone = formData.phoneNumber ? `${formData.phoneCode} ${formData.phoneNumber}` : '';
            await updateProfile({ name: formData.name, companyName: formData.companyName, phone: fullPhone });
            setIsEditing(false);
            toast.success('Agency credentials updated successfully!');
        } catch (error) {
            toast.error('Failed to update credentials');
        } finally {
            setSaving(false);
        }
    };

    const trustFields = [
        { icon: 'verified', label: 'Verify Status', value: user?.verified ? 'Verified Partner' : 'Verification Underway', verified: user?.verified },
        { icon: 'groups', label: 'Entity Type', value: user?.role === 'FIRM' ? 'Interior Design Agency' : user?.role },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Business Header Banner */}
            <div className="relative h-64 md:h-80 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden mb-16 shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col md:flex-row items-start md:items-end gap-8">
                    <div className="relative group">
                        <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] bg-indigo-500 p-1.5 shadow-[0_0_50px_rgba(79,70,229,0.3)] transform transition-transform group-hover:scale-105 duration-700">
                            <div className="w-full h-full rounded-[1.8rem] md:rounded-[2.3rem] bg-slate-900 flex items-center justify-center text-4xl md:text-6xl font-black text-white">
                                {user?.companyName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        {user?.verified && (
                            <div className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-500 border-4 border-slate-900 flex items-center justify-center shadow-xl">
                                <span className="material-symbols-outlined text-white text-lg md:text-xl font-black">check_circle</span>
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{user?.companyName || user?.name}</h1>
                            {user?.verified && (
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] md:text-xs font-black uppercase tracking-widest backdrop-blur-md">
                                    Official Partner
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-base md:text-xl font-medium tracking-tight flex items-center gap-3">
                            <span className="material-symbols-outlined text-indigo-500">verified_user</span>
                            {user?.name} <span className="w-1 h-1 rounded-full bg-slate-700"></span> Principal Designer
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-14">
                {/* Business Insights Column */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-10 border border-slate-200/50 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Verification Status</h3>
                        <div className="flex items-center gap-6 mb-10">
                            <div className={`w-14 h-14 rounded-2xl ${user?.verified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'} flex items-center justify-center border border-current/20`}>
                                <span className="material-symbols-outlined text-3xl font-bold">{user?.verified ? 'verified' : 'pending_actions'}</span>
                            </div>
                            <div>
                                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{user?.verified ? 'Fully Verified' : 'Under Review'}</p>
                                <p className="text-xs font-medium text-slate-500">Tier 01 Partner Network</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5">
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"Our verification process ensures all firms on NestLnk maintain elite design standards."</p>
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-10 border border-slate-200/50 dark:border-white/5 bg-gradient-to-br from-slate-900/50 to-slate-950/50">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Response</p>
                                <p className="text-xl font-black text-indigo-500 tracking-tighter">Fast</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Projects</p>
                                <p className="text-xl font-black text-white tracking-tighter">12+</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Details Column */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Agency Info Section */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-2 h-8 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Agency Credentials</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-white/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-4xl">business</span></div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 leading-none">Registered Agency</p>
                                {isEditing ? <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="input-dark py-2" /> : <p className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.companyName || 'Not Set'}</p>}
                            </div>
                            {/* Principal Designer Name */}
                            <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-white/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-4xl">person</span></div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 leading-none">Principal Designer</p>
                                {isEditing ? <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-dark py-2" /> : <p className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.name}</p>}
                            </div>
                            {/* Email */}
                            <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-white/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-4xl">mail</span></div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 leading-none">Business Email</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight opacity-70">{user?.email}</p>
                            </div>
                             {/* Phone */}
                            <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-white/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-4xl">call</span></div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 leading-none">Primary Contact</p>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <select 
                                            value={formData.phoneCode} 
                                            onChange={e => setFormData({...formData, phoneCode: e.target.value})}
                                            className="input-dark py-2 px-2 text-sm max-w-[90px] w-auto whitespace-nowrap bg-slate-900/50 border border-slate-700 rounded-xl outline-none"
                                        >
                                            <option value="+1">+1 (US)</option>
                                            <option value="+91">+91 (IN)</option>
                                            <option value="+44">+44 (UK)</option>
                                            <option value="+61">+61 (AU)</option>
                                        </select>
                                        <input 
                                            type="tel" 
                                            maxLength={10}
                                            value={formData.phoneNumber} 
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setFormData({...formData, phoneNumber: val});
                                            }} 
                                            className="input-dark text-sm w-full py-2" 
                                            placeholder="1234567890" 
                                        />
                                    </div>
                                ) : (
                                    <p className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.phone || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meta Security Section */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Trust & Security</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {trustFields.map((f) => (
                                <div key={f.label} className="glass-card glass-card-hover rounded-3xl p-8 border border-slate-200/50 dark:border-white/5 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-2xl font-bold">{f.icon}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{f.label}</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight">{f.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Growth CTA */}
                    <div className="glass-card rounded-[3rem] p-10 md:p-14 bg-gradient-to-br from-indigo-600 to-violet-700 border-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Agency Details</h3>
                                <p className="text-white/80 text-lg font-medium max-w-md leading-relaxed">Update your agency credentials to ensure clients can reach you with their requirements.</p>
                            </div>
                            {isEditing ? (
                                <div className="flex gap-4">
                                    <button onClick={() => setIsEditing(false)} className="h-16 px-8 bg-white/10 text-white hover:bg-white/20 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all whitespace-nowrap cursor-pointer">Cancel</button>
                                    <button onClick={handleSave} disabled={saving} className="h-16 px-12 bg-white text-indigo-600 hover:bg-slate-50 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap disabled:opacity-50 cursor-pointer">
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="h-16 px-12 bg-white text-indigo-600 hover:bg-slate-50 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer">
                                    Edit Credentials
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
