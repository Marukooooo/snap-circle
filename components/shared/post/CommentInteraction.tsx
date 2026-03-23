"use client";

import { useAuth } from "@clerk/nextjs";
import { useOptimistic, startTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { switchCommentLike } from "@/lib/actions/switchCommentLike";

// 定义 prop 类型，匹配 Prisma Comment 模型结构
type CommentInteractionProps = {
  postId: number;
  commentId: number;
  // likes 是 Comment 模型中的 Like[]，需要传入已加载的 likes 数据
  likes: string[];
};

export default function CommentInteraction({
  postId,
  commentId,
  likes,
}: CommentInteractionProps) {
  const { isLoaded, userId } = useAuth();

  // 派生状态：计算当前点赞数和当前用户是否已点赞
  const currentState = {
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  };

  // 乐观更新逻辑：当点击按钮时，立即更新 UI，然后等待后端结果
  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    currentState,
    (state) => ({
      likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      isLiked: !state.isLiked,
    }),
  );

  const handleLikeAction = async () => {
    if (!isLoaded || !userId) return;

    // 立即执行乐观更新
    startTransition(() => {
      switchOptimisticLike(null);
    });

    try {
      // 调用服务端 Action
      await switchCommentLike(postId, commentId);
    } catch (err) {
      console.error("点赞失败:", err);
      // 如果报错，useOptimistic 会自动回滚到之前的状态
    }
  };

  return (
    <form action={handleLikeAction}>
      <button
        type="submit"
        disabled={!isLoaded}
        className="flex items-center gap-2 group cursor-pointer"
      >
        <ThumbsUp
          size={14}
          className={`transition-colors ${
            optimisticLike.isLiked
              ? "text-blue-500 fill-blue-500" // 点赞后的蓝色
              : "text-gray-400 group-hover:text-blue-500" // 未点赞的灰色
          }`}
        />
        <span
          className={`text-xs ${
            optimisticLike.isLiked ? "text-blue-500" : "text-gray-500"
          }`}
        >
          {optimisticLike.likeCount}
        </span>
      </button>
    </form>
  );
}
