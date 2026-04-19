import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Profile() {
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
            await updateProfile({ name: formData.name, phone: fullPhone });
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Profile Header Banner */}
            <div className="relative h-48 md:h-64 rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 animate-gradient-slow"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/40 to-transparent flex items-end gap-6 md:gap-8">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1.5 shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-4xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-sm md:text-base font-bold">check</span>
                        </div>
                    </div>
                    <div className="mb-2">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-1 md:mb-2">{user?.name}</h1>
                        <p className="text-white/80 text-sm md:text-base font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm md:text-base">location_on</span>
                            Premium Member
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                <div className="space-y-6 md:col-span-1">
                    <div className="glass-card rounded-[2rem] p-8 border border-slate-200/50 dark:border-white/5 h-fit">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Profile Actions</h3>
                        
                        {isEditing ? (
                            <div className="flex flex-col gap-3">
                                <button onClick={handleSave} disabled={saving} className="w-full h-11 btn-primary text-xs font-black uppercase tracking-widest rounded-xl disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="w-full h-11 btn-outline text-xs font-black uppercase tracking-widest rounded-xl">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="w-full h-11 btn-primary text-xs font-black uppercase tracking-widest rounded-xl">Edit Profile</button>
                        )}
                    </div>

                    <div className="glass-card rounded-[2rem] p-8 border border-slate-200/50 dark:border-white/5">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Activity</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-500">Last login: 2 hours ago</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-500">Email verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-10">
                    {/* Account Info Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Account Details</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl">person</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                                {isEditing ? (
                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-dark text-sm w-full py-2" />
                                ) : (
                                    <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                                )}
                            </div>
                            {/* Email */}
                            <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate opacity-70">{user?.email}</p>
                            </div>
                            {/* Phone */}
                            <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl">call</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
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
                                    <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">{user?.phone || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
