import prisma from "@/lib/client";
import Image from "next/image";
import { Suspense } from "react";
import Comments from "./Comments";
import PostInteraction from "./PostInteraction";
import { auth } from "@clerk/nextjs/server";
import PostInfo from "../PostInfo";
import { CommentSkeleton } from "./CommentList";
import UserInfoCardInteraction from "../user/UserInfoCardInteraction";
import UserAvatar from "../user/UserAvatar";

export default async function PostDetail({ postId }: { postId: number }) {
  const { userId: currentUserId } = await auth();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        include: {
          followers: { where: { followerId: currentUserId || "" } }, // 检查我是否关注了他
          followRequestsReceived: { where: { senderId: currentUserId || "" } }, // 检查我是否发送了请求
          blockedBy: { where: { blockerId: currentUserId || "" } }, // 检查我是否拉黑了他
        },
      },
      likes: true,
      _count: { select: { comments: true } },
    },
  });

  if (!post)
    return <div className="p-20 text-center text-zinc-500">帖子已不存在</div>;

  const isFollowing = post.user.followers.length > 0;
  const isFollowingSent = post.user.followRequestsReceived.length > 0;
  const isUserBlocked = post.user.blockedBy.length > 0;

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white dark:bg-zinc-950 overflow-hidden">
      {/* LEFT — 沉浸式图片区 (占 60%) */}
      <div className="relative flex-[3] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border-r border-zinc-100 dark:border-zinc-800">
        {post.img ? (
          <>
            {/* 氛围背景 */}
            <div
              className="absolute inset-0 blur-3xl opacity-10 scale-110 select-none"
              style={{
                backgroundImage: `url(${post.img})`,
                backgroundSize: "cover",
              }}
            />
            <Image
              src={post.img}
              alt={post.desc || "Post image"}
              fill
              className="object-contain z-10 p-1"
              unoptimized
              priority
            />
          </>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-br from-zinc-200/50 via-transparent to-zinc-300/50 dark:from-zinc-800/50 dark:to-zinc-700/50" />
            <div className="absolute w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -top-20 -left-20" />
            <div className="absolute w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[100px] -bottom-20 -right-20" />

            {/* 2. 主体卡片 */}
            <div className="relative z-10 w-full max-w-lg aspect-[4/5] md:aspect-square flex flex-col items-center justify-center rounded-3xl bg-white/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] p-8 md:p-16 text-center">
              <div className="absolute top-8 left-8">
                <svg
                  className="w-8 h-8 md:w-12 md:h-12 text-zinc-300 dark:text-zinc-600 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V9C12.017 6.79086 13.8079 5 16.017 5H19.017C21.2261 5 23.017 6.79086 23.017 9V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H3.017C2.46472 8 2.017 8.44772 2.017 9V12C2.017 12.5523 1.56928 13 1.017 13H-0.983V9C-0.983 6.79086 0.80786 5 3.017 5H6.017C8.22614 5 10.017 6.79086 10.017 9V15C10.017 18.3137 7.33071 21 4.017 21H1.017Z" />
                </svg>
              </div>
              <p
                className={`font-medium tracking-tight text-zinc-800 dark:text-zinc-100 leading-relaxed break-words ${
                  post.desc.length > 100
                    ? "text-lg md:text-xl"
                    : post.desc.length > 50
                      ? "text-xl md:text-2xl"
                      : "text-2xl md:text-4xl"
                }`}
              >
                {post.desc}
              </p>
              <div className="mt-8 w-12 h-1 bg-linear-to-r from-indigo-500 to-fuchsia-500 rounded-full opacity-60" />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — 精致互动区 (占 40%) */}
      <div className="flex-2 flex flex-col min-w-[350px] max-w-[450px] min-h-0 bg-white dark:bg-zinc-950">
        {/* 1. 顶部用户信息栏 (固定高度) */}
        <div className="flex-none flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-fuchsia-600">
              <div className="w-full h-full rounded-full border-2 border-white dark:border-black overflow-hidden bg-zinc-200">
                <UserAvatar
                  avatarUrl={post.user.avatar}
                  username={post.user.username}
                  size={36}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">
                {post.user.username}
              </span>

              {/* 插入交互组件：只有不是自己的帖子时才显示 */}
              {currentUserId && currentUserId !== post.userId && (
                <div className="flex items-center gap-2">
                  <UserInfoCardInteraction
                    userId={post.userId}
                    isFollowing={isFollowing}
                    isFollowingSent={isFollowingSent}
                    isUserBlocked={isUserBlocked}
                    variant="post"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. 描述与评论区 (弹性高度 + 内部滚动) */}
        {/* flex-1 会填满剩余空间，overflow-y-auto 配合 min-h-0 激活滚动 */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {/* 发布者描述 */}
          <div className="p-4 flex gap-3">
            <div className="text-sm leading-relaxed">
              <span className="text-zinc-700 dark:text-zinc-300 break-words">
                {post.desc}
              </span>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="px-4 pb-6">
            <Suspense
              fallback={
                <>
                  <CommentSkeleton />
                  <CommentSkeleton />
                  <CommentSkeleton />
                </>
              }
            >
              <Comments postId={post.id} />
            </Suspense>
          </div>
        </div>

        {/* 3. 底部互动栏 (固定高度) */}
        <div className="flex-none border-t border-zinc-100 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50/30 dark:bg-zinc-900/30 backdrop-blur-md">
          <PostInteraction
            postId={post.id}
            likes={post.likes.map((like) => like.userId)}
            commentNumber={post._count.comments}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
              {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {currentUserId === post.user.id && (
              <div className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-1 transition-colors">
                <PostInfo postId={post.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
