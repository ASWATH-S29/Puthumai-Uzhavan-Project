/**
 * AIAssistantPage.tsx  v2.0
 * Farm-Aware AI Copilot with voice, multilingual, and farmer memory.
 */

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Sparkles, Mic, MicOff, ImagePlus, Plus, MessageSquare,
  AlertCircle, Wifi, Volume2, VolumeX, Globe, Brain,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import Icon from '@/components/ui/Icon';
import {
  chatSeed, chatHistory, suggestedQuestions, aiSuggestions,
  type ChatMessage,
} from '@/data/dummyData';
import { createGeminiSession, type GeminiSession } from '@/services/geminiService';
import { useAuth } from '@/context/AuthContext';
import { getFarmerMemory, buildFarmerMemoryContext, type FarmerMemory } from '@/services/farmerMemoryService';

interface SpeechRecognitionResultLike {
  0?: { transcript?: string };
}
interface SpeechRecognitionEventLike {
  results?: SpeechRecognitionResultLike[];
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (event: SpeechRecognitionErrorEventLike) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

const LANGUAGE_OPTIONS = [
  { code: 'ta-IN', label: 'Tamil',     prompt: 'ta' },
  { code: 'en-IN', label: 'English',   prompt: 'en' },
  { code: 'hi-IN', label: 'Hindi',     prompt: 'hi' },
  { code: 'te-IN', label: 'Telugu',    prompt: 'te' },
  { code: 'ml-IN', label: 'Malayalam', prompt: 'ml' },
  { code: 'kn-IN', label: 'Kannada',   prompt: 'kn' },
];

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}
function uid(p: string) {
  return `${p}${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function AIAssistantPage() {
  const { profile, user } = useAuth();

  const [farmerMemory, setFarmerMemory] = useState<FarmerMemory | null>(null);
  const memoryContextRef = useRef<string>('');

  useEffect(() => {
    if (!user?.id) return;
    getFarmerMemory(user.id)
      .then((mem) => {
        setFarmerMemory(mem);
        memoryContextRef.current = buildFarmerMemoryContext(mem);
      })
      .catch(() => {});
  }, [user?.id]);

  const [selectedLang, setSelectedLang] = useState(() => {
    const saved = profile?.preferred_language ?? 'en';
    return LANGUAGE_OPTIONS.find((l) => l.prompt === saved) ?? LANGUAGE_OPTIONS[0];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !ttsSupported) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ''));
    utter.lang = selectedLang.code;
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }, [ttsEnabled, ttsSupported, selectedLang]);

  const sessionRef = useRef<GeminiSession | null>(null);

  const getSession = useCallback(() => {
    if (!sessionRef.current) {
      sessionRef.current = createGeminiSession(chatSeed, memoryContextRef.current, selectedLang.prompt);
    }
    return sessionRef.current;
  }, [selectedLang.prompt]);

  useEffect(() => { sessionRef.current = null; }, [selectedLang]);

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SR = (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  const toggleVoice = useCallback(() => {
    const SR = (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;
    if (!SR) {
      setVoiceError('Voice input is not supported in this browser. Try Chrome on Android or desktop.');
      return;
    }
    setVoiceError(null);
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    try {
      const rec = new SR();
      rec.lang = selectedLang.code;
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (event: SpeechRecognitionEventLike) => {
        const t = event.results?.[0]?.[0]?.transcript ?? '';
        if (t) setInput(t);
        setListening(false);
      };
      rec.onerror = (event: SpeechRecognitionErrorEventLike) => {
        const m: Record<string, string> = {
          'not-allowed': 'Microphone permission denied.',
          'no-speech': 'No speech detected. Please speak clearly.',
          'network': 'Network error during voice recognition.',
        };
        setVoiceError(m[event.error] ?? `Voice error: ${event.error}`);
        setListening(false);
      };
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setVoiceError('Could not start voice recognition.');
      setListening(false);
    }
  }, [listening, selectedLang.code]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg: ChatMessage = { id: uid('u'), role: 'user', text: trimmed, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    try {
      const isFirst = messages.filter((m) => m.role === 'user').length === 0;
      const prompt = isFirst && memoryContextRef.current
        ? `${memoryContextRef.current}\n${trimmed}`
        : trimmed;
      const replyText = await getSession().sendMessage(prompt);
      setMessages((m) => [...m, { id: uid('a'), role: 'assistant', text: replyText, time: now() }]);
      speak(replyText);
    } catch (err) {
      const errText = err instanceof Error ? err.message : 'Something went wrong.';
      setMessages((m) => [...m, { id: uid('e'), role: 'assistant', text: `⚠️ ${errText}`, time: now() }]);
    } finally {
      setTyping(false);
    }
  }, [typing, messages, getSession, speak]);

  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(input); };

  const newChat = () => {
    setMessages([]);
    setInput('');
    setTyping(false);
    sessionRef.current = null;
    window.speechSynthesis?.cancel();
  };

  const apiKeyMissing = !import.meta.env.VITE_GEMINI_API_KEY;
  const hasMemory = farmerMemory && (farmerMemory.current_crop || farmerMemory.district || farmerMemory.farmer_name);

  return (
    <div className="space-y-6">
      <PageHeader icon={Bot} title="AI Farming Assistant"
        subtitle="Farm-aware AI copilot — uses your farm profile to give personalised, field-specific guidance." />

      {apiKeyMissing && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-700">Gemini API Key Not Configured</span>
            <p className="text-xs text-amber-700 mt-0.5">
              Add <code className="font-mono bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY=your_key</code> to your .env file.
              Get a free key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline">aistudio.google.com</a>.
            </p>
          </div>
        </div>
      )}

      {!hasMemory && !apiKeyMissing && (
        <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
          <Brain size={16} className="text-brand-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-brand-700">
            <span className="font-bold">Tip:</span> Complete your{' '}
            <Link to="/app/farmer-memory" className="underline font-semibold">Farm Memory profile</Link>{' '}
            so the AI can give personalised advice based on your crop, soil, and location.
          </div>
        </div>
      )}

      {voiceError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <MicOff size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{voiceError}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-5">
        {/* sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard padding="md">
            <button onClick={newChat}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-brand-700 transition-colors shadow-card">
              <Plus size={16} /> New Chat
            </button>

            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-600 mb-1.5 flex items-center gap-1">
                <Globe size={11} /> Language
              </div>
              <select
                className="w-full rounded-xl bg-brand-50 border border-gray-100 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-brand-400"
                value={selectedLang.code}
                onChange={(e) => {
                  const l = LANGUAGE_OPTIONS.find((o) => o.code === e.target.value) ?? LANGUAGE_OPTIONS[0];
                  setSelectedLang(l);
                }}>
                {LANGUAGE_OPTIONS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            {ttsSupported && (
              <button onClick={() => setTtsEnabled((v) => !v)}
                className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border ${
                  ttsEnabled ? 'bg-brand-600 text-white border-brand-600' : 'bg-brand-50 text-ink-700 border-gray-100 hover:border-brand-200'}`}>
                {ttsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                {ttsEnabled ? 'Read Aloud: On' : 'Read Aloud: Off'}
              </button>
            )}

            {hasMemory && (
              <div className="mt-3 rounded-xl bg-brand-50 border border-brand-100 p-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                  <Brain size={11} /> Farm context active
                </div>
                {farmerMemory?.current_crop && <div className="text-[10px] text-ink-600 mt-0.5">Crop: {farmerMemory.current_crop}</div>}
                {farmerMemory?.district && <div className="text-[10px] text-ink-600">Location: {farmerMemory.district}</div>}
              </div>
            )}

            <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-ink-600 mb-2">Previous Chats</div>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto scrollbar-none">
              {chatHistory.map((ch) => (
                <button key={ch.id}
                  className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors ${ch.active ? 'bg-brand-50 border border-brand-100' : 'hover:bg-brand-50'}`}>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className={ch.active ? 'text-brand-600' : 'text-ink-600/60'} />
                    <span className={`text-xs font-semibold truncate ${ch.active ? 'text-brand-700' : 'text-ink-800/65'}`}>{ch.title}</span>
                  </div>
                  <div className="text-[10px] text-ink-600/60 mt-0.5 pl-5">{ch.time}</div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* chat window */}
        <GlassCard padding="md" className="lg:col-span-2 flex flex-col h-[600px]">
          <div className="flex items-center gap-3 px-2 py-2 border-b border-gray-100 flex-shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-brand-600 grid place-items-center shadow-card">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-ink-900">Uzhavan AI</div>
              <div className="text-[11px] text-brand-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {apiKeyMissing
                  ? <span className="text-amber-600 flex items-center gap-1"><Wifi size={10} /> API key required</span>
                  : hasMemory
                  ? <span className="flex items-center gap-1"><Brain size={10} /> Farm-aware · Gemini AI</span>
                  : 'Online · powered by Gemini AI'}
              </div>
            </div>
            <div className="text-[10px] font-semibold text-ink-500 bg-gray-50 rounded-lg px-2 py-1">{selectedLang.label}</div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none">
            {messages.length === 0 && (
              <div className="h-full grid place-items-center text-center py-10">
                <div>
                  <div className="mx-auto h-16 w-16 rounded-xl bg-brand-100 grid place-items-center mb-3">
                    <Bot size={30} className="text-brand-600" />
                  </div>
                  <div className="font-display font-bold text-ink-900">Start a conversation</div>
                  <div className="text-sm text-ink-600 mt-1">Ask me anything about your farm</div>
                  {hasMemory && (
                    <div className="mt-2 text-xs text-brand-600 flex items-center justify-center gap-1">
                      <Brain size={11} /> I know your farm profile — ask something specific!
                    </div>
                  )}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-full bg-brand-600 grid place-items-center mr-2 mt-1 flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-md'
                    : m.text.startsWith('⚠️')
                    ? 'bg-red-50 border border-red-100 text-red-800 rounded-bl-md'
                    : 'bg-brand-50 border border-gray-100 text-ink-900 rounded-bl-md'}`}>
                  {m.text.split('\n').map((line, li) =>
                    line === '' ? <br key={li} /> : <p key={li} className={li > 0 ? 'mt-1' : ''}>{line}</p>)}
                  <div className={`mt-1 text-[10px] ${m.role === 'user' ? 'text-brand-100' : 'text-ink-600'}`}>{m.time}</div>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
                  <div className="h-7 w-7 rounded-full bg-brand-600 grid place-items-center mr-2 mt-1 flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-brand-50 border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-brand-400 inline-block" />
                    ))}
                    <span className="text-[11px] text-ink-600 ml-2">Uzhavan AI is thinking…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <form onSubmit={onSubmit} className="mt-2 p-2 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button type="button"
                className={`grid place-items-center h-11 w-11 rounded-2xl border transition-colors flex-shrink-0 ${
                  listening
                    ? 'bg-error-500/10 border-error-500/20 text-error-600'
                    : voiceSupported
                    ? 'bg-brand-50 border-gray-100 text-ink-800/55 hover:text-brand-700'
                    : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'}`}
                onClick={toggleVoice} aria-label={listening ? 'Stop' : 'Voice input'}>
                {listening ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
              </button>
              <button type="button"
                className="grid place-items-center h-11 w-11 rounded-2xl bg-brand-50 border border-gray-100 text-ink-800/55 hover:text-brand-700 transition-colors flex-shrink-0"
                aria-label="Upload image">
                <ImagePlus size={18} />
              </button>
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? `Listening in ${selectedLang.label}…` : hasMemory ? `Ask about your ${farmerMemory?.current_crop ?? 'farm'}…` : 'Ask Uzhavan AI anything…'}
                disabled={typing}
                className="flex-1 rounded-2xl bg-brand-50 border border-gray-100 px-4 py-3 text-sm outline-none placeholder:text-ink-600/60 focus:ring-2 focus:ring-brand-400 focus:border-transparent transition disabled:opacity-60" />
              <button type="submit" disabled={typing || !input.trim()}
                className="grid place-items-center h-11 w-11 rounded-2xl bg-brand-600 text-white hover:bg-brand-700 transition-colors flex-shrink-0 shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send">
                <Send size={18} />
              </button>
            </div>
          </form>
        </GlassCard>

        {/* suggestions sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard padding="lg">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-600" />
              <div className="font-display font-bold text-ink-900">Suggested Questions</div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                ...(hasMemory && farmerMemory?.current_crop
                  ? [`What fertiliser for my ${farmerMemory.current_crop} this week?`,
                     `Pests affecting ${farmerMemory.current_crop} in ${farmerMemory.district ?? 'TN'}?`]
                  : []),
                ...suggestedQuestions.slice(0, hasMemory ? 3 : 5),
              ].slice(0, 5).map((q) => (
                <button key={q} onClick={() => send(q)} disabled={typing}
                  className="w-full text-left rounded-2xl bg-brand-50 border border-gray-100 p-3 text-sm font-medium text-ink-800/70 hover:border-brand-200 hover:text-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {q}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard padding="lg">
            <div className="font-display font-bold text-ink-900 text-sm mb-3">Today's Actions</div>
            <div className="space-y-3">
              {aiSuggestions.map((s) => (
                <button key={s.title} onClick={() => send(`Tell me about: ${s.title}`)} disabled={typing}
                  className="w-full text-left rounded-2xl bg-brand-50 border border-gray-100 p-3 hover:border-brand-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-brand-100 grid place-items-center flex-shrink-0">
                      <Icon name={s.icon} size={15} className="text-brand-700" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700">{s.tag}</span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-ink-900">{s.title}</div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
