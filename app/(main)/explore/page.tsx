import prisma from "@/lib/client";
import ExploreGrid from "@/components/shared/post/ExploreGrid";
import { auth } from "@clerk/nextjs/server";

export default async function ExplorePage() {
  const { userId: currentUserId } = await auth();

  // 获取探索页帖子：所有人，但排除拉黑关系，且必须有图片
  const posts = await prisma.post.findMany({
    where: {
      user: {
        NOT: {
          blockedBy: {
            some: { blockerId: currentUserId || "" },
          },
        },
      },
    },
    include: {
      likes: { select: { userId: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="h-full bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-bold">探索</h1>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {posts.length > 0 ? (
          <ExploreGrid posts={posts} />
        ) : (
          <div className="p-20 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900 rounded-2xl m-4">
            暂无推荐内容
          </div>
        )}
      </main>
    </div>
  );
}
