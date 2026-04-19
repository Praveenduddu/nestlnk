import { memo } from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export const Skeleton = memo(({ className = '', variant = 'rounded' }: SkeletonProps) => {
    const baseClasses = 'animate-pulse bg-slate-200/50 dark:bg-white/5 relative overflow-hidden';

    const variantClasses = {
        text: 'h-4 w-full rounded-md',
        circular: 'rounded-full',
        rectangular: 'w-full h-full',
        rounded: 'rounded-2xl w-full h-full'
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
});

Skeleton.displayName = 'Skeleton';
export default Skeleton;
