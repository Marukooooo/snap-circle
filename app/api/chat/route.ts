import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, UIMessage } from "ai";

const qwen = createOpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: qwen.chat("qwen-plus"),
    messages: await convertToModelMessages(messages),
    // system:
    //   "你是 SnapCircle 的 AI 文案助手，帮用户生成适合社交媒体发布的文案，可包含 emoji 和 hashtags。",
  });

  return result.toUIMessageStreamResponse();
}
