"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function WebChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Salam! Mən Zia NFC AI köməkçisiyəm. Sizə premium NFC vizit kartları, rəqəmsal profillər və ya platformanın imkanları haqqında necə kömək edə bilərəm?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "NFC vizit kartı nədir?",
    "Profili necə özəlləşdirə bilərəm?",
    "NFC kart sifarişi necə olur?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    if (!textToSend) setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("API response error");
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Bağışlayın, cavab alarkən xəta baş verdi.";
      
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Üzr istəyirik, NVIDIA DeepSeek serveri ilə əlaqə qurarkən xəta baş verdi. Zəhmət olmasa bir az sonra yenidən yoxlayın.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(79,70,229,0.55)] active:scale-[0.97] group border border-white/10"
        >
          <div className="relative size-6 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white p-0.5 transition-transform duration-300 group-hover:rotate-12">
            <img
              src="/logo.webp"
              alt="Zia NFC"
              className="h-full w-full rounded-full object-cover"
              onError={(e) => {
                // fallback if image not found
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <span className="tracking-wide">DeepSeek Köməkçi</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[550px] w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <Bot className="size-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-green-500"></span>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide">Zia NFC AI</h3>
                <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-medium">
                  <Sparkles className="size-3 text-yellow-400" />
                  <span>DeepSeek R1 Engine</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Bot className="size-4" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Bot className="size-4" />
                </div>
                <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-white border border-slate-100 px-4 py-3 text-sm text-slate-500 shadow-sm flex items-center gap-2">
                  <RefreshCw className="size-3.5 animate-spin text-indigo-500" />
                  <span>Düşünür...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && !isLoading && (
            <div className="bg-slate-50/50 px-4 pb-2 pt-1 flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/20 transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-slate-100 p-3 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all active:scale-95 shrink-0"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
