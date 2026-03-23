import { User } from "@/app/generated/prisma/client";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";

const UserMediaCard = async ({ user }: { user: User }) => {
  // 修改查询：不再强制要求 img 必须存在，以便展示文字帖子
  const latestPosts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl shadow-sm text-sm flex flex-col gap-4 border border-zinc-100 dark:border-zinc-800">
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center font-semibold">
        <span className="text-zinc-500 dark:text-zinc-400">最近发布</span>
        <Link
          href={`/profile/${user.username}`}
          className="text-indigo-500 text-xs hover:opacity-80 transition-opacity"
        >
          查看全部
        </Link>
      </div>

      {/* 栅格内容 */}
      <div className="grid grid-cols-4 gap-2">
        {latestPosts.length > 0 ? (
          latestPosts.map((post) => {
            // 核心修复逻辑：显式检查 img 是否存在且不是空字符串
            const hasImage = post.img && post.img.trim() !== "";

            return (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="relative aspect-square group overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-50 dark:border-zinc-800"
              >
                {hasImage ? (
                  /* 1. 有图的情况：显示图片 */
                  <Image
                    src={post.img!} // 这里已经通过 hasImage 保证了 src 不会是 "" 或 null
                    alt={post.desc || "post"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  /* 2. 无图或空字符串的情况：显示暗色 desc 块 */
                  <div className="w-full h-full p-1.5 flex items-center justify-center bg-zinc-800 dark:bg-zinc-800 transition-colors group-hover:bg-zinc-900">
                    <p className="text-[9px] leading-[1.2] text-zinc-100 text-center line-clamp-4 break-words font-medium antialiased">
                      {post.desc}
                    </p>
                  </div>
                )}

                {/* 全局悬浮遮罩 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-6 text-center text-zinc-400 dark:text-zinc-600 italic text-xs">
            暂无发布内容
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMediaCard;
