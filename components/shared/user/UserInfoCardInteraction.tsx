"use client";

import switchFollow from "@/lib/actions/switchFollow";
import switchBlock from "@/lib/actions/switchBlock";
import { useOptimistic, useState, startTransition } from "react";

type Props = {
  userId: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
  variant?: "profile" | "post";
};

export default function UserInfoCardInteraction({
  userId,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
  variant = "profile",
}: Props) {
  const [state, setState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  });

  const [optimisticState, updateOptimistic] = useOptimistic(
    state,
    (prev, action: "follow" | "block") => {
      if (action === "follow") {
        if (prev.following) {
          return { ...prev, following: false, followingRequestSent: false };
        }
        if (prev.followingRequestSent) {
          return { ...prev, followingRequestSent: false };
        }
        return {
          ...prev,
          followingRequestSent: true,
        };
      }
      return { ...prev, blocked: !prev.blocked };
    },
  );

  const handleFollow = () => {
    startTransition(async () => {
      updateOptimistic("follow");

      try {
        const result = await switchFollow(userId);

        setState((prev) => {
          if (result.type === "unfollow") {
            return { ...prev, following: false, followingRequestSent: false };
          }
          if (result.type === "cancel_request") {
            return { ...prev, followingRequestSent: false };
          }
          if (result.type === "request_sent") {
            return { ...prev, followingRequestSent: true };
          }
          return prev;
        });
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleBlock = () => {
    startTransition(async () => {
      updateOptimistic("block");

      try {
        await switchBlock(userId);
        setState((prev) => ({ ...prev, blocked: !prev.blocked }));
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (variant === "post") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleFollow}
          className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition"
        >
          {optimisticState.following
            ? "• 已关注"
            : optimisticState.followingRequestSent
              ? "- 已发送请求"
              : "+ 关注"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleFollow}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md p-2 transition"
      >
        {optimisticState.following
          ? "已关注"
          : optimisticState.followingRequestSent
            ? "已发送关注请求"
            : "关注"}
      </button>

      <button
        onClick={handleBlock}
        className="self-end text-red-400 text-xs hover:text-red-500 transition"
      >
        {optimisticState.blocked ? "取消拉黑" : "拉黑用户"}
      </button>
    </div>
  );
}
