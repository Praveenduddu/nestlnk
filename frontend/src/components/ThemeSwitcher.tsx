import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
        { id: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
        { id: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
    ] as const;

    return (
        <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all duration-300 ${theme === t.id
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                        }`}
                    title={t.label}
                >
                    {t.icon}
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{t.label}</span>
                </button>
            ))}
        </div>
    );
};
