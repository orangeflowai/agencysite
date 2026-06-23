'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { useSite } from '@/components/SiteProvider';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const QUICK_QUESTIONS = [
    'What tours do you offer?',
    'How do I skip the line?',
    'What is the Vatican dress code?',
    'Do you offer private tours?',
];

export default function AIConcierge() {
    const site = useSite();
    const waNumber = site?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '3514199425';
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hi! I need help booking a Rome tour.")}`;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Ciao! 👋 I'm your Roman travel assistant. Ask me anything about tours, the Vatican, or visiting Rome — or tap a quick question below.",
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isTyping) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!res.ok) throw new Error('API error');
            const data = await res.json();

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply || "I'm not sure about that — our team can help! Tap 'Chat on WhatsApp' below for instant assistance.",
            }]);
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having a quick coffee break ☕ — for immediate help please tap the WhatsApp button below!",
            }]);
        } finally {
            setIsTyping(false);
            if (!isOpen) setHasUnread(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        // bottom-28 on mobile clears the WhatsApp button; bottom-6 on larger screens
        <div className="fixed bottom-28 sm:bottom-24 right-4 sm:right-6 z-[9998] flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-3 w-[92vw] max-w-[380px] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col pointer-events-auto"
                    style={{ height: 'min(520px, 65vh)' }}
                >
                    {/* Header */}
                    <div className="bg-primary px-4 py-3 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-sm leading-tight">Roman Concierge</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                    <span className="text-[10px] text-white/75 tracking-widest font-bold uppercase">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/15 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                                        msg.role === 'user' ? 'bg-primary/10' : 'bg-primary/15'
                                    }`}>
                                        {msg.role === 'user' ? <User size={12} className="text-primary" /> : <Sparkles size={12} className="text-primary" />}
                                    </div>
                                    <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center mt-1">
                                        <Sparkles size={12} className="text-primary" />
                                    </div>
                                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1 items-center">
                                            {[0, 150, 300].map(delay => (
                                                <span key={delay} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: `${delay}ms` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick questions — show only if first message */}
                    {messages.length === 1 && (
                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1.5 shrink-0">
                            {QUICK_QUESTIONS.map(q => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="text-[11px] font-medium px-2.5 py-1 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-primary hover:text-primary transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* WhatsApp handoff */}
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-3 mb-2 mt-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold py-2.5 rounded-xl transition-colors shrink-0"
                    >
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat with a human on WhatsApp
                    </a>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="px-3 pb-3 shrink-0">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl border border-gray-200 px-3 py-2 focus-within:border-primary transition-colors">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask me anything…"
                                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="p-2 bg-primary text-white rounded-lg disabled:opacity-40 transition-all active:scale-95 hover:opacity-90"
                            >
                                {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(v => !v)}
                className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto relative"
                aria-label="Open chat assistant"
            >
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {hasUnread && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                )}
            </button>
        </div>
    );
}
