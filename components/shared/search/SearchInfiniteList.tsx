"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import { Loader2 } from "lucide-react";
import FeedPost from "../post/FeedPost";

export default function SearchInfiniteList({ query }: { query: string }) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["search-posts", query],
      queryFn: async ({ pageParam }) => {
        // 指向你新写的专门搜帖子的 API
        const res = await fetch(
          `/api/search/posts?q=${encodeURIComponent(query)}${pageParam ? `&cursor=${pageParam}` : ""}`,
        );
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      },
      staleTime: 5 * 60 * 1000,
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 处理初始加载状态
  if (status === "pending") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="flex flex-col gap-8">
      {allPosts.map((post) => (
        <FeedPost key={post.id} post={post as any} />
      ))}

      {/* 滚动监听点 */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetchingNextPage ? (
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        ) : hasNextPage ? (
          <span className="text-sm text-muted-foreground">
            继续向下滑动加载...
          </span>
        ) : (
          allPosts.length > 0 && (
            <span className="text-sm text-muted-foreground italic">
              你已经看完了所有相关帖子
            </span>
          )
        )}
      </div>

      {allPosts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <p className="text-muted-foreground">没有找到包含 "{query}" 的帖子</p>
        </div>
      )}
    </div>
  );
}
