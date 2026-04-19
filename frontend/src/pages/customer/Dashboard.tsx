import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { propertyService } from '../../services/data.service';
import type { PropertyBrief } from '../../types';
import PropertyCard from '../../components/PropertyCard';
import { Skeleton } from '../../components/Skeleton';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<PropertyBrief[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        propertyService.getMyProperties().then(setProperties).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const stats = [
        { icon: 'home_work', label: 'Total Properties', value: properties.length, color: 'from-indigo-500 to-violet-600' },
        { icon: 'feed', label: 'Active Briefs', value: properties.filter(p => p.status === 'OPEN').length, color: 'from-emerald-500 to-teal-600' },
        { icon: 'request_quote', label: 'Quotes Received', value: properties.reduce((sum, p) => sum + p.quoteCount, 0), color: 'from-amber-500 to-orange-600' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {user?.name} 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening with your properties</p>
                </div>
                <Link to="/customer/create-brief" className="h-11 px-6 btn-primary text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Property
                </Link>
            </div>

            {/* Stats */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <motion.div variants={itemVariants} key={stat.label} className="glass-card glass-card-hover rounded-2xl p-6 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">{stat.icon}</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 text-lg">trending_up</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Recent Properties */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Properties</h2>
                    <Link to="/customer/my-properties" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 h-[250px]">
                                <Skeleton variant="rectangular" className="rounded-xl mb-4 h-32" />
                                <Skeleton variant="text" className="w-1/2 mb-2" />
                                <Skeleton variant="text" className="w-full" />
                            </div>
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">home_work</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No properties yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Add your first property to start receiving quotations</p>
                        <Link to="/customer/create-brief" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Add your first property <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.slice(0, 3).map((p) => (
                            <motion.div variants={itemVariants} key={p.id}>
                                <PropertyCard property={p} linkPrefix="/customer/property" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
