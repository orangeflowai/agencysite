'use client';

import { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Copy, Check, Loader2, X } from 'lucide-react';

interface AIBlogAssistantProps {
    onApply: (content: {
        title: string;
        excerpt: string;
        body: any[];
        keywords: string[];
    }) => void;
    onClose: () => void;
}

const AI_PROVIDERS = [
    { id: 'groq', name: '🚀 Groq (Llama 3.1) - FREE', key: 'GROQ_API_KEY', desc: '1M tokens/day free' },
    { id: 'together', name: '⚡ Together AI - FREE', key: 'TOGETHER_API_KEY', desc: '$5 credits free' },
    { id: 'mistral', name: '🔮 Mistral - FREE', key: 'MISTRAL_API_KEY', desc: 'Limited free tier' },
    { id: 'openai', name: '💎 OpenAI GPT-4', key: 'OPENAI_API_KEY', desc: 'Paid API' },
    { id: 'anthropic', name: '🧠 Anthropic Claude', key: 'ANTHROPIC_API_KEY', desc: 'Paid API' },
    { id: 'gemini', name: '🔍 Google Gemini', key: 'GEMINI_API_KEY', desc: 'Free tier available' },
];

export default function AIBlogAssistant({ onApply, onClose }: AIBlogAssistantProps) {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState('informative');
    const [length, setLength] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [provider, setProvider] = useState('groq');
    const [model, setModel] = useState('balanced');
    const [extractingKeywords, setExtractingKeywords] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);

    const extractKeywords = async () => {
        if (!topic.trim()) return;
        
        setExtractingKeywords(true);
        try {
            const response = await fetch(`/api/ai/extract-keywords?topic=${encodeURIComponent(topic)}&limit=15`);
            if (!response.ok) throw new Error('Failed to extract keywords');
            
            const data = await response.json();
            setExtractedData(data);
            
            // Auto-fill keywords if empty
            if (!keywords.trim() && data.keywords.length > 0) {
                setKeywords(data.keywords.slice(0, 8).join(', '));
            }
        } catch (err) {
            console.error('Keyword extraction failed:', err);
        } finally {
            setExtractingKeywords(false);
        }
    };

    const addKeyword = (kw: string) => {
        const current = keywords.split(',').map(k => k.trim()).filter(Boolean);
        if (!current.includes(kw)) {
            setKeywords([...current, kw].join(', '));
        }
    };

    const generateContent = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setLoading(true);
        setError('');

        // Auto-extract keywords if not provided
        let finalKeywords = keywords.split(',').map(k => k.trim()).filter(Boolean);
        let suggestedLinks: {text: string, url: string}[] = [];
        
        if (finalKeywords.length === 0 && topic.trim()) {
            try {
                const kwResponse = await fetch(`/api/ai/extract-keywords?topic=${encodeURIComponent(topic)}&limit=10`);
                if (kwResponse.ok) {
                    const kwData = await kwResponse.json();
                    finalKeywords = kwData.keywords.slice(0, 8);
                    suggestedLinks = kwData.suggestedInternalLinks || [];
                }
            } catch (e) {
                console.error('Auto keyword extract failed:', e);
            }
        } else if (extractedData?.suggestedInternalLinks) {
            suggestedLinks = extractedData.suggestedInternalLinks;
        }

        try {
            const response = await fetch('/api/ai/generate-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    keywords: finalKeywords,
                    tone,
                    length,
                    provider,
                    model,
                    suggestedInternalLinks: suggestedLinks,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate content');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (result) {
            onApply({
                title: result.title,
                excerpt: result.excerpt,
                body: result.body,
                keywords: result.keywords,
            });
            onClose();
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-card/20 rounded-xl">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AI Blog Assistant</h2>
                            <p className="text-indigo-100 text-sm">Generate SEO-optimized blog posts with AI</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-card/20 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input Panel */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    AI Provider
                                </label>
                                <select
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                                >
                                    {AI_PROVIDERS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {AI_PROVIDERS.find(p => p.id === provider)?.desc}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Model Quality
                                </label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                                >
                                    <option value="fast">🚀 Fast (Good for testing)</option>
                                    <option value="balanced">⚖️ Balanced (Recommended)</option>
                                    <option value="powerful">🧠 Powerful (Best quality)</option>
                                </select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Higher quality uses more tokens but writes better content
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Blog Topic *
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Best time to visit Vatican Museums"
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Keywords (comma-separated)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="vatican, rome, museums, tickets"
                                        className="flex-1 px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                                    />
                                    <button
                                        onClick={extractKeywords}
                                        disabled={!topic.trim() || extractingKeywords}
                                        className="px-4 py-2.5 bg-violet-100 text-violet-700 font-medium rounded-xl hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                        title="Auto-extract from existing tours"
                                    >
                                        {extractingKeywords ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-4 h-4" />
                                        )}
                                        Auto
                                    </button>
                                </div>
                                {extractedData && (
                                    <div className="mt-2 p-3 bg-violet-50 rounded-lg border border-violet-100">
                                        <p className="text-xs font-medium text-violet-700 mb-2">
                                            Found {extractedData.keywords.length} keywords from {extractedData.relatedTours?.length || 0} related tours:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {extractedData.keywords.slice(0, 8).map((kw: string, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => addKeyword(kw)}
                                                    className="px-2 py-1 bg-card text-violet-700 text-xs rounded-full border border-violet-200 hover:border-violet-400 transition-colors"
                                                >
                                                    + {kw}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Tone</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                                    >
                                        <option value="informative">Informative</option>
                                        <option value="conversational">Conversational</option>
                                        <option value="professional">Professional</option>
                                        <option value="enthusiastic">Enthusiastic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Length</label>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                                    >
                                        <option value="short">Short (~500 words)</option>
                                        <option value="medium">Medium (~1000 words)</option>
                                        <option value="long">Long (~2000 words)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={generateContent}
                                disabled={loading || !topic.trim()}
                                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                                ) : (
                                    <><Wand2 className="w-5 h-5" /> Generate Blog Post</>
                                )}
                            </button>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Preview Panel */}
                        <div className="bg-muted rounded-xl p-4 border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground">Preview</h3>
                                {result && (
                                    <div className="flex items-center gap-3">
                                        {/* SEO Score Badge */}
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                            <Check className="w-3 h-3" />
                                            SEO Optimized
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-muted-foreground"
                                                title="Copy JSON"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={generateContent}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-muted-foreground"
                                                title="Regenerate"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!result && !loading && (
                                <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>Your generated content will appear here</p>
                                    </div>
                                </div>
                            )}

                            {loading && (
                                <div className="h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-violet-600" />
                                        <p className="text-muted-foreground">AI is writing your blog post...</p>
                                        <p className="text-sm text-muted-foreground mt-1">This may take 10-30 seconds</p>
                                    </div>
                                </div>
                            )}

                            {result && !loading && (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground ">Title</label>
                                        <p className="font-bold text-lg text-foreground">{result.title}</p>
                                        {result.title.length > 60 && (
                                            <p className="text-amber-600 text-xs mt-1">⚠️ Title is {result.title.length} chars (recommended: &lt;60)</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground ">Meta Description</label>
                                        <p className="text-foreground text-sm leading-relaxed">{result.metaDescription}</p>
                                        {result.metaDescription.length > 160 && (
                                            <p className="text-amber-600 text-xs mt-1">⚠️ Description is {result.metaDescription.length} chars (recommended: &lt;160)</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground ">Keywords</label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {result.keywords.map((kw: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* SEO Features Summary */}
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <label className="text-xs font-semibold text-green-700  mb-2 block">SEO Features Included</label>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center gap-1.5 text-green-700">
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Internal links to tours</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-green-700">
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Official website citations</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-green-700">
                                                <Check className="w-3.5 h-3.5" />
                                                <span>JSON-LD schema markup</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-green-700">
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Optimized headings (H2/H3)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Suggested Related Tours for Linking */}
                                    {extractedData?.relatedTours?.length > 0 && (
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <label className="text-xs font-semibold text-blue-700  mb-2 block">
                                                Related Tours for Internal Links
                                            </label>
                                            <div className="space-y-1">
                                                {extractedData.relatedTours.slice(0, 3).map((tour: any, i: number) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-blue-800">
                                                        <Check className="w-3 h-3" />
                                                        <span className="truncate">{tour.title}</span>
                                                        <code className="text-blue-500 text-[10px]">/tour/{tour.slug}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links Detected */}
                                    {(() => {
                                        const allText = result.body.map((b: any) => 
                                            b.children?.map((c: any) => c.text).join(' ') || ''
                                        ).join(' ');
                                        const links = allText.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
                                        const officialLinks = links.filter((l: string) => 
                                            l.includes('vatican.va') || l.includes('colosseum.it') || 
                                            l.includes('pantheon') || l.includes('museum')
                                        );
                                        
                                        if (links.length > 0) {
                                            return (
                                                <div>
                                                    <label className="text-xs font-semibold text-muted-foreground ">
                                                        Links Detected ({links.length})
                                                    </label>
                                                    <div className="mt-1 space-y-1">
                                                        {officialLinks.length > 0 && (
                                                            <div className="flex items-center gap-1.5 text-primary text-xs">
                                                                <Check className="w-3.5 h-3.5" />
                                                                <span>{officialLinks.length} official website citation{officialLinks.length > 1 ? 's' : ''}</span>
                                                            </div>
                                                        )}
                                                        {links.length > officialLinks.length && (
                                                            <div className="flex items-center gap-1.5 text-violet-600 text-xs">
                                                                <Check className="w-3.5 h-3.5" />
                                                                <span>{links.length - officialLinks.length} internal tour link{links.length - officialLinks.length > 1 ? 's' : ''}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground ">Content Preview</label>
                                        <div className="mt-2 p-3 bg-card rounded-lg border border-border text-sm text-foreground max-h-48 overflow-y-auto">
                                            {result.body.slice(0, 3).map((block: any, i: number) => (
                                                <p key={i} className="mb-2">
                                                    {block.children?.map((c: any) => c.text).join(' ')}
                                                </p>
                                            ))}
                                            <p className="text-muted-foreground ">... {result.body.length - 3} more blocks</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {result && (
                    <div className="p-4 border-t border-border bg-muted flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-foreground font-medium hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-2.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Apply to Blog Post
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
