import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../../services/data.service';
import type { PropertyBrief, Quotation } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export default function AIComparison() {
    const { id } = useParams<{ id: string }>();
    const { user, updateGeminiKey } = useAuth();
    const [property, setProperty] = useState<PropertyBrief | null>(null);
    const [quotes, setQuotes] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: "Hello! I'm Gemini, your AI Interior Consultant. I've analyzed all received quotations for your property. I can help you compare costs, materials, and timelines to find your perfect design partner.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [showApiKeyModal, setShowApiKeyModal] = useState(!user?.hasGeminiKey);
    const [showPreview, setShowPreview] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        Promise.all([propertyService.getById(id), propertyService.getQuotes(id)])
            .then(([p, q]) => {
                setProperty(p);
                setQuotes(q);
                
                if (q.length > 0) {
                    setTimeout(() => {
                        const lowest = [...q].sort((a, b) => a.estimatedCost - b.estimatedCost)[0];
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            role: 'ai',
                            content: `I've found ${q.length} active quotations. **${lowest.firmName}** currently offers the most competitive pricing. Would you like a detailed cost-comparison breakdown?`,
                            timestamp: new Date()
                        }]);
                    }, 1000);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSaveApiKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKeyInput.trim()) return;
        
        try {
            await updateGeminiKey(apiKeyInput);
            toast.success("Gemini API Key saved securely!");
            setShowApiKeyModal(false);
        } catch (error) {
            toast.error("Failed to save API key.");
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping || !id) return;

        if (!user?.hasGeminiKey) {
            setShowApiKeyModal(true);
            return;
        }

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const aiMsgId = (Date.now() + 1).toString();
        const aiMsg: Message = {
            id: aiMsgId,
            role: 'ai',
            content: '',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);

        try {
            const stream = propertyService.aiCompareStream(id, input);
            let fullContent = '';
            
            for await (const chunk of stream) {
                setIsTyping(false); // Stop typing indicator once we have the first chunk
                fullContent += chunk;
                setMessages(prev => 
                    prev.map(m => m.id === aiMsgId ? { ...m, content: fullContent } : m)
                );
            }
        } catch (error) {
            console.error("Gemini Error:", error);
            setMessages(prev => 
                prev.map(m => m.id === aiMsgId 
                    ? { ...m, content: "I'm having trouble connecting to my intelligence core. Please ensure your API key is valid or try again in a moment." } 
                    : m
                )
            );
        } finally {
            setIsTyping(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[80vh]">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent"
            />
        </div>
    );

    return (
        <div className="h-screen lg:h-[calc(100vh-0px)] flex flex-col overflow-hidden">
            {/* API Key Modal */}
            {showApiKeyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card max-w-md w-full p-8 rounded-3xl border-white/20 shadow-2xl shadow-indigo-500/10"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                            <span className="material-symbols-outlined text-white">key</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {user?.hasGeminiKey ? 'Update Gemini Key' : 'Connect Gemini'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            {user?.hasGeminiKey 
                                ? 'Update your Google AI Studio API key to continue with intelligent analysis. Your key is encrypted before storage.'
                                : 'To enable real-time intelligent analysis, please provide your Google AI Studio API key. Your key is stored securely using end-to-end encryption.'}
                            <a 
                                href="https://aistudio.google.com/api-keys" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 ml-1 text-indigo-500 hover:text-indigo-600 font-bold transition-colors group/link"
                            >
                                Get a key
                                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">north_east</span>
                            </a>
                        </p>
                        <form onSubmit={handleSaveApiKey} className="space-y-4">
                            <input 
                                type="password"
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                placeholder="Enter Gemini API Key..."
                                className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono"
                            />
                            <div className="pt-2">
                                <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer">
                                    {user?.hasGeminiKey ? 'Update Key' : 'Save & Connect'}
                                </button>
                                {user?.hasGeminiKey && (
                                    <button type="button" onClick={() => setShowApiKeyModal(false)} className="w-full mt-2 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Header - Integrated into the grid now */}
            <div className="flex-1 min-h-0 grid grid-cols-12 overflow-hidden">
                
                {/* Left Side: Quotations Browser (4 cols) - Integrated Panel */}
                <div className="col-span-12 lg:col-span-4 flex flex-col min-h-0 bg-slate-50 dark:bg-white/5 border-r border-slate-200 dark:border-white/5">
                    <div className="shrink-0 p-8 border-b border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <Link to={`/customer/property/${id}`} className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-all group">
                                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            </Link>
                            <div>
                                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Gemini Analysis</h1>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{property?.propertyType} · {property?.city}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-tighter">Proposal Stack</h3>
                            <button 
                                onClick={() => setShowApiKeyModal(true)}
                                className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-indigo-400 transition-all cursor-pointer"
                                title="AI Settings"
                            >
                                <span className="material-symbols-outlined text-[18px]">settings</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar min-h-0">
                        {quotes.map((quote) => (
                            <motion.div 
                                key={quote.id}
                                layoutId={quote.id}
                                className="group relative bg-white dark:bg-[#1E293B] rounded-[32px] p-6 border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] cursor-pointer overflow-hidden"
                            >
                                {/* Active State Background Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
                                
                                <div className="relative flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-indigo-400 text-sm font-black border border-slate-100 dark:border-white/5 shadow-inner">
                                            {quote.firmName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-1">{quote.firmName}</h4>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                                                <span className="material-symbols-outlined text-[10px]">schedule</span>
                                                {quote.timeline}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[14px] font-black text-gradient">₹{(quote.estimatedCost / 100000).toFixed(1)}L</span>
                                    </div>
                                </div>

                                <div className="relative grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Design</span>
                                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">₹{quote.designCost.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project</span>
                                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">₹{quote.materialCost.toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Gemini Chat (8 cols) - High-Contrast Docked Console */}
                <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 relative">
                    <div className="flex-1 flex flex-col bg-slate-900 border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.2)] overflow-hidden min-h-0 relative z-10">
                        {/* Status Bar - High Contrast */}
                        <div className="shrink-0 px-8 py-5 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-pulse"></div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Intelligence Console v1.5</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-1.5">
                                    {quotes.slice(0, 3).map((q, i) => (
                                        <div key={q.id} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-500/30 flex items-center justify-center text-[8px] font-bold text-indigo-400" style={{ zIndex: 10 - i }}>
                                            {q.firmName.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                                                msg.role === 'ai' 
                                                    ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/20' 
                                                    : 'bg-white dark:bg-white/10 text-slate-400 border border-slate-100 dark:border-white/5 shadow-sm'
                                            }`}>
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {msg.role === 'ai' ? 'psychology_alt' : 'person'}
                                                </span>
                                            </div>
                                            <div
                                                className={`max-w-[85%] rounded-[32px] px-8 py-6 text-base shadow-sm prose dark:prose-invert prose-slate break-words ${
                                                    msg.role === 'user'
                                                        ? 'bg-indigo-600 text-white ml-auto rounded-br-none'
                                                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                                                }`}
                                            >
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({node, className, children, ...props}: any) {
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            const language = match ? match[1] : '';
                                                            const codeContent = String(children).replace(/\n$/, '');
                                                            const isInline = !match;
                                                            
                                                            if (!isInline && language === 'html') {
                                                                return (
                                                                    <div className="my-6 border border-indigo-500/30 rounded-2xl overflow-hidden bg-indigo-500/5 backdrop-blur-sm group hover:border-indigo-500/50 transition-all duration-300">
                                                                        <div className="flex items-center justify-between px-6 py-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                                                                    <span className="material-symbols-outlined text-indigo-400">code</span>
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="text-sm font-semibold text-slate-200">Interactive Preview</h4>
                                                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Visualization Ready</p>
                                                                                </div>
                                                                            </div>
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setPreviewHtml(codeContent);
                                                                                    setShowPreview(true);
                                                                                }}
                                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95 group-hover:scale-105"
                                                                            >
                                                                                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                                                                                Live Preview
                                                                            </button>
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const iframe = document.createElement('iframe');
                                                                                    iframe.style.display = 'none';
                                                                                    document.body.appendChild(iframe);
                                                                                    iframe.contentDocument?.write(`
                                                                                        <html>
                                                                                            <head>
                                                                                                <title>AI Comparison Export</title>
                                                                                                <style>
                                                                                                    body { font-family: sans-serif; padding: 40px; }
                                                                                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                                                                                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                                                                                    th { background-color: #f5f5f5; }
                                                                                                    h1 { color: #4338ca; }
                                                                                                </style>
                                                                                            </head>
                                                                                            <body>${codeContent}</body>
                                                                                        </html>
                                                                                    `);
                                                                                    iframe.contentDocument?.close();
                                                                                    iframe.contentWindow?.print();
                                                                                    setTimeout(() => document.body.removeChild(iframe), 1000);
                                                                                }}
                                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/10 cursor-pointer active:scale-95"
                                                                            >
                                                                                <span className="material-symbols-outlined text-[16px]">download</span>
                                                                                Download PDF
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }

                                                            return !isInline ? (
                                                                <SyntaxHighlighter
                                                                    style={vscDarkPlus as any}
                                                                    language={language}
                                                                    PreTag="div"
                                                                    className="rounded-xl my-4"
                                                                    customStyle={{ padding: '1.5rem' }}
                                                                    {...props}
                                                                >
                                                                    {codeContent}
                                                                </SyntaxHighlighter>
                                                            ) : (
                                                                <code className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 font-mono`} {...props}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                                <div className={`text-[10px] mt-3 font-semibold opacity-30 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center animate-pulse">
                                            <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
                                        </div>
                                        <div className="flex gap-1.5 p-4 bg-white/5 rounded-2xl">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="px-8 py-6 bg-slate-900 border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="relative group">
                                {/* Input Background Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                
                                <div className="relative flex items-center gap-3">
                                    <input 
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask Gemini to analyze costs, timelines, or designs..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-[18px] font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-500"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!input.trim() || isTyping}
                                        className="absolute right-3 p-3 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 disabled:opacity-40 disabled:scale-100 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">north</span>
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {[
                                    { text: 'Compare Costs', icon: 'payments' },
                                    { text: 'Analyze Timelines', icon: 'timer' },
                                    { text: 'Material Quality', icon: 'diamond' }
                                ].map(suggestion => (
                                    <button 
                                        key={suggestion.text}
                                        type="button"
                                        onClick={() => setInput(`Can you compare the ${suggestion.text.toLowerCase()} between these firms?`)}
                                        className="px-4 py-2 flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-sm">{suggestion.icon}</span>
                                        {suggestion.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HTML Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/10"
                        >
                            <div className="shrink-0 px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Live Design Preview</h3>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest text-left">Interactive AI Concept Viewer</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowPreview(false)}
                                    className="w-10 h-10 rounded-full bg-slate-200/50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex-1 bg-white p-0">
                                <iframe 
                                    srcDoc={previewHtml}
                                    title="HTML Preview"
                                    className="w-full h-full border-none"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <style>{`
                .text-gradient {
                    background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.3);
                }
                /* Hide default code block backticks in markdown */
                .prose code::before, .prose code::after {
                    content: "";
                }
            `}</style>
        </div>
    );
}
