'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export function ChatScreen() {
  const { chatMessages, addChatMessage, isChatLoading, setChatLoading, goBack, currentTrip, nav, setCurrentTrip } = useAppStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure trip data is loaded when entering chat
  useEffect(() => {
    if (nav.tripId && chatMessages.length === 0) {
      setCurrentTrip(nav.tripId);
    }
  }, [nav.tripId, chatMessages.length, setCurrentTrip]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isChatLoading) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      content: text,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
      userName: 'You',
    };
    addChatMessage(userMsg);
    setInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          tripId: currentTrip?.id,
          messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      addChatMessage({
        id: `msg-ai-${Date.now()}`,
        content: data.reply || 'Sorry, I could not process that request.',
        role: 'assistant',
        createdAt: new Date().toISOString(),
      });
    } catch {
      addChatMessage({
        id: `msg-err-${Date.now()}`,
        content: 'Sorry, something went wrong. Please try again.',
        role: 'assistant',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setChatLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-purple-100/50 shrink-0">
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 shrink-0" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="w-9 h-9 rounded-full gradient-purple flex items-center justify-center shrink-0 shadow-md shadow-purple-300/30">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold">PackBot AI</h1>
          <p className="text-[11px] text-muted-foreground truncate">{currentTrip?.name || 'Travel Assistant'}</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-500">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 rounded-full gradient-purple-soft flex items-center justify-center mb-4"
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
            <h3 className="text-base font-bold mb-1">PackBot AI</h3>
            <p className="text-sm text-muted-foreground max-w-[240px]">
              Ask me anything about your trip planning, destinations, budgets, or itineraries!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Suggest beaches', 'Compare costs', 'Plan itinerary'].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 rounded-full glass-card-purple border border-purple-100/50 text-purple-600 font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full gradient-purple flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className="max-w-[80%]">
                <div className={cn(
                  'px-4 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                )}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-purple max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:my-1 prose-table:text-xs">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                <p className={cn(
                  'text-[10px] text-muted-foreground mt-1',
                  msg.role === 'user' ? 'text-right' : 'text-left'
                )}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isChatLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 items-end"
          >
            <div className="w-7 h-7 rounded-full gradient-purple flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="chat-bubble-ai px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-2 h-2 rounded-full bg-purple-300"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-purple-100/50 bg-white/80 backdrop-blur-xl safe-bottom">
        <div className="flex gap-2 items-center relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask about your trip..."
            disabled={isChatLoading}
            className="flex-1 h-11 rounded-full bg-purple-50 border-purple-200 focus:border-purple-500 text-sm pr-12"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim() || isChatLoading}
            className={cn(
              'absolute right-7 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              input.trim() && !isChatLoading ? 'gradient-purple text-white' : 'bg-purple-100 text-purple-300'
            )}
          >
            {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}