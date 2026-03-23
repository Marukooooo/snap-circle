"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react"; // 1. 引入 useRef 和 useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";

export function AIChatBox() {
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, status } = useChat();

  // --- 滚动控制逻辑开始 ---
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 使用 requestAnimationFrame 确保在 DOM 更新渲染完成后执行滚动
    const scrollTimeout = setTimeout(() => {
      scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [messages, status]);
  // --- 滚动控制逻辑结束 ---

  const isBusy = status === "submitted" || status === "streaming";

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isBusy) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 1. 顶部标题栏 */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>文案助手</span>
        </div>
        {status === "streaming" && (
          <div className="text-[10px] text-indigo-500 animate-pulse flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI 思考中
          </div>
        )}
      </div>

      {/* 2. 消息滚动区域 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
            {messages.length === 0 && (
              <div className="h-[40vh] flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Bot size={32} className="opacity-50" />
                </div>
                <p className="text-sm">
                  告诉我你想发布的图片内容，我来帮你写文案
                </p>
              </div>
            )}

            {/* 完全保留你原始的数据渲染逻辑 */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted shadow-sm"
                  }`}
                >
                  {message.role === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                <div
                  className={`flex flex-col gap-2 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60"
                    }`}
                  >
                    {message.parts.map(
                      (part, i) =>
                        part.type === "text" && (
                          <p key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </p>
                        ),
                    )}
                  </div>
                </div>
              </div>
            ))}

            {status === "submitted" && (
              <div className="flex gap-4 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-muted">
                  <Bot size={16} />
                </div>
                <div className="bg-muted/40 rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {/* 注入滚动锚点 */}
            <div ref={scrollEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* 3. 底部输入框区域 */}
      <div className="p-4 bg-background">
        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={handleSend} className="relative flex items-center">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="发送消息..."
              disabled={isBusy}
              className="py-6 px-6 rounded-2xl border-muted-foreground/20 focus-visible:ring-indigo-500 pr-14 shadow-sm transition-all"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isBusy || !inputValue.trim()}
              className="absolute right-2.5 rounded-xl h-9 w-9"
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-60">
            SnapCircle AI 可以帮助你激发灵感。
          </p>
        </div>
      </div>
    </div>
  );
}
