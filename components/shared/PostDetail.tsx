import Image from "next/image";
import { Suspense } from "react";
import prisma from "@/lib/client";
import PostInteraction from "./post/PostInteraction";
import Comments from "./post/Comments";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";

export default async function PostDetail({ postId }: { postId: number }) {
  const { userId } = await auth();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: true,
      likes: true,
      _count: { select: { comments: true } },
    },
  });

  if (!post) return <div>Post not found</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* user */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium">{post.user.username}</span>
        </div>
        {userId === post.user.id && <PostInfo postId={post.id} />}
      </div>

      {/* image */}
      {post.img && (
        <div className="w-full min-h-96 relative">
          <Image
            src={post.img}
            fill
            className="object-cover rounded-md"
            alt=""
            unoptimized
          />
        </div>
      )}

      <p>{post.desc}</p>

      {/* interaction */}
      <PostInteraction
        postId={post.id}
        likes={post.likes.map((like) => like.userId)}
        commentNumber={post._count.comments}
      />

      {/* ✅ 评论只在详情页加载 */}
      <Suspense fallback="加载评论中...">
        <Comments postId={post.id} />
      </Suspense>
    </div>
  );
}
