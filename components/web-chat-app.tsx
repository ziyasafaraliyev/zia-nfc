"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type WebChatAppProps = {
  /** First mount open state (from lazy launcher) */
  initialOpen?: boolean;
};

export default function WebChatApp({ initialOpen = false }: WebChatAppProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Salam! Mən ZIANFC ChatBot-am. Sizə premium NFC vizit kartları, rəqəmsal profillər və ya platformanın imkanları haqqında necə kömək edə bilərəm?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "NFC vizit kartı nədir?",
    "Qiymətlər necədir?",
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

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader found");

      // Add a blank placeholder assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsLoading(false);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleaned = line.trim();
          if (!cleaned) continue;
          if (cleaned === "data: [DONE]") continue;

          if (cleaned.startsWith("data: ")) {
            try {
              const data = JSON.parse(cleaned.slice(6));
              const textChunk = data.choices?.[0]?.delta?.content || "";
              if (textChunk) {
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant") {
                    last.content += textChunk;
                  }
                  return copy;
                });
              }
            } catch (err) {
              // Ignore parsing errors for incomplete lines
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Üzr istəyirik, server ilə əlaqə qurarkən xəta baş verdi. Zəhmət olmasa bir az sonra yenidən yoxlayın.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-sky-500 px-5 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400 active:scale-[0.97] group border border-white/10"
        >
          <div className="relative size-7 shrink-0 overflow-hidden rounded-full border border-white/30 bg-white p-0.5 transition-transform duration-300 group-hover:rotate-12">
            <img
              src="/logo.webp"
              alt="Zia NFC"
              className="h-full w-full rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <span>ZIANFC ChatBot</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[550px] w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.14)] overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-950 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border-2 border-sky-400/40 bg-white p-0.5">
                <img
                  src="/logo.webp"
                  alt="Zia NFC"
                  className="h-full w-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-green-500"></span>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.1em]">ZIANFC ChatBot</h3>
                <p className="text-[10px] font-semibold text-sky-400">AI Köməkçi • Online</p>
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 overflow-hidden">
                    <img
                      src="/logo.webp"
                      alt="Zia NFC"
                      className="h-full w-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
                        }
                      }}
                    />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-sky-500 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content || (isLoading ? "..." : "")}</p>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <Bot className="size-4" />
                </div>
                <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-white border border-slate-200 px-4 py-3 text-sm text-slate-500 shadow-sm flex items-center gap-2">
                  <RefreshCw className="size-3.5 animate-spin text-sky-500" />
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
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50/30 transition-all duration-200"
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
            className="border-t border-slate-200 p-3 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50/50 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-md hover:bg-sky-400 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all active:scale-95 shrink-0"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
