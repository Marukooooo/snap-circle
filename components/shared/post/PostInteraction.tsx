"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useOptimistic, startTransition } from "react";
import { ThumbsUp, Share, MessageCircle } from "lucide-react";
import { switchLike } from "@/lib/actions/switchLike";

export default function PostInteraction({
  postId,
  likes,
  commentNumber,
}: {
  postId: number;
  likes: string[];
  commentNumber: number;
}) {
  const { isLoaded, userId } = useAuth();

  // 1. 直接派生状态。只要 likes prop 变了，这里会自动更新。
  const currentState = {
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  };

  // 2. useOptimistic 的基础值直接设为派生出的 currentState
  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    currentState,
    (state) => ({
      likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      isLiked: !state.isLiked,
    }),
  );

  const handleLikeAction = async () => {
    if (!isLoaded || !userId) return;

    // 3. 乐观更新 UI
    startTransition(() => {
      switchOptimisticLike(null);
    });

    try {
      // 4. 调用 Server Action
      await switchLike(postId);
    } catch (err) {
      // 如果报错，useOptimistic 会自动回滚到 currentState 的旧值
      console.error("Action error:", err);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "SnapCircle",
          text: "看看这个帖子",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("链接已复制！");
      }
    } catch (error) {
      console.log("share cancelled");
    }
  };

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8">
        <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
          <form action={handleLikeAction}>
            <button type="submit" disabled={!isLoaded}>
              <ThumbsUp
                size={16}
                className={`cursor-pointer transition-colors ${
                  optimisticLike.isLiked ? "text-blue-500 fill-blue-500" : ""
                }`}
              />
            </button>
          </form>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 font-medium">
            {optimisticLike.likeCount}
          </span>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <MessageCircle size={16} className="cursor-pointer"></MessageCircle>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">{commentNumber}</span>
        </div>
      </div>
      <div className="">
        <div className="flex items-center gap-4 bg-slate-100 p-3 rounded-xl">
          <button onClick={handleShare}>
            <Share size={16} className="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}
