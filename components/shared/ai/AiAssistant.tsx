"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Sparkles, Copy, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiAssistant() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  // 1. 使用官方推荐的 useChat 钩子
  const { messages, sendMessage, status } = useChat();

  const isGenerating = status === "submitted" || status === "streaming";

  // 2. 提取最后一条 AI 助手的文本内容（用于复制功能）
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const lastContent =
    lastAssistantMessage?.parts
      .filter((part) => part.type === "text")
      .map((part) => (part as any).text)
      .join("") || "";

  const handleCopy = () => {
    if (!lastContent) return;
    navigator.clipboard.writeText(lastContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 输入侧 */}
      <div className="space-y-4">
        <Card className="border-zinc-100 shadow-sm dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              图片故事灵感
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="例如：在公园长椅上喝拿铁，阳光洒在书页上..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-40 resize-none focus-visible:ring-fuchsia-500"
              />
              <Button
                onClick={() => {
                  if (input.trim()) {
                    sendMessage({ text: input });
                    setInput(""); // 发送后清空
                  }
                }}
                className="w-full bg-linear-to-r from-fuchsia-600 to-indigo-600 hover:opacity-90"
                disabled={isGenerating || !input.trim()}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                生成精选配文
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 结果显示侧 */}
      <div className="space-y-4">
        <Card className="min-h-75 flex flex-col border-zinc-100 shadow-sm dark:border-zinc-800">
          <CardHeader className="border-b bg-zinc-50/50 dark:bg-zinc-900/50">
            <CardTitle className="text-sm font-semibold flex justify-between items-center">
              AI 创作建议
              {lastContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                        message.role === "user"
                          ? "bg-fuchsia-600 text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {/* 核心修改：遍历 parts 渲染文本 */}
                      {message.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="whitespace-pre-wrap"
                            >
                              {part.text}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-center space-y-2">
                <Sparkles className="h-8 w-8 opacity-20" />
                <p className="text-sm italic">
                  {isGenerating
                    ? "AI 正在构思文案..."
                    : "在此输入照片背后的故事\nAI 将为你捕捉动人文字"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
