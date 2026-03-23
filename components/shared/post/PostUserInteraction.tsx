"use client";

import switchFollow from "@/lib/actions/switchFollow";
import { useOptimistic, useState } from "react";

export default function PostUserInteraction({
  userId,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) {
  const [userState, setUserState] = useState({
    following: isFollowing,
    followingRequestSent: isFollowingSent,
  });

  const [optimisticFollow, addOptimisticFollow] = useOptimistic(
    userState,
    (state) => ({
      ...state,
      following: state.following ? false : state.following,
      followingRequestSent: !state.following && !state.followingRequestSent,
    }),
  );

  const handleFollow = async () => {
    addOptimisticFollow(null);
    try {
      await switchFollow(userId);
      setUserState((prev) => ({
        ...prev,
        following: !prev.following && prev.followingRequestSent ? true : false, // 简化逻辑，根据你后端实际返回调整
        followingRequestSent: !prev.following && !prev.followingRequestSent,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form action={handleFollow}>
      <button className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">
        {optimisticFollow.following
          ? "• 正在关注"
          : optimisticFollow.followingRequestSent
            ? "• 已请求"
            : "• 关注"}
      </button>
    </form>
  );
}
