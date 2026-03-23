import { AIChatBox } from "@/components/shared/ai/ChatBox";

export const metadata = {
  title: "AI 助手 - SnapCircle",
  description: "使用通义千问生成你的社交媒体文案",
};

export default async function AIPage() {
  return <AIChatBox />;
}
