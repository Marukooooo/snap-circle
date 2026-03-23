import SearchInfiniteList from "@/components/shared/search/SearchInfiniteList";
import prisma from "@/lib/client";
import { Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground text-center">
        <Search className="h-12 w-12 mb-3 opacity-20" />
        <h2 className="text-lg font-semibold">开始探索吧</h2>
        <p className="text-sm">在上方搜索框输入关键词</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    where: {
      username: { contains: q, mode: "insensitive" },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
    },
    take: 5,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 标题 */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-1">搜索结果</p>
        <h1 className="text-2xl font-bold">"{q}"</h1>
      </div>

      {/* 用户区 */}
      {users.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            用户
          </h2>

          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-accent transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                    <Image
                      src={user.avatar || "/noAvatar.png"}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      @{user.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.name} {user.surname || ""}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                  查看
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 帖子区 */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          帖子
        </h2>

        <SearchInfiniteList query={q} />
      </section>
    </div>
  );
}
