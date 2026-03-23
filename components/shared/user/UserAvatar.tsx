"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserAvatarProps = {
  avatarUrl: string | null;
  username: string; // 用于跳转链接的唯一标识
  size?: number; // 可选的大小参数
  className?: string; // 允许外部传入样式覆盖
};

export default function UserAvatar({
  avatarUrl,
  username,
  size = 40, // 默认大小为 40x40
  className = "",
}: UserAvatarProps) {
  const router = useRouter();
  const handleNavigation = () => {
    // 跳转到目标页面，但因为是客户端跳转，
    // 如果该目标页面对应的路由没有被拦截，Modal 会自动关闭。
    // router.push(`/profile/${username}`);

    router.replace(`/profile/${username}`);
  };
  // 图片组件：处理默认图片和样式
  const avatarImage = (
    <Image
      src={avatarUrl || "/noAvatar.png"}
      alt={username}
      width={size}
      height={size}
      className={`${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );

  if (!username) {
    return avatarImage;
  }

  return <div onClick={handleNavigation}>{avatarImage}</div>;
}
