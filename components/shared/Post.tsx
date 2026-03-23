import Image from "next/image";
import { ThumbsUp, Share, MessageCircle, MoreHorizontal } from "lucide-react";
import Comments from "./post/Comments";
import { Post as PostType, User } from "@/app/generated/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import PostInteraction from "./post/PostInteraction";
import PostInfo from "./PostInfo";

type FeedPostType = PostType & { user: User } & {
  likes: [{ userId: string }];
} & {
  _count: { comments: number };
};

const Post = async ({ post }: { post: FeedPostType }) => {
  const { userId } = await auth();

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
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? post.user.name + " " + post.user.surname
              : post.user.username}
          </span>
        </div>
        {userId === post.user.id && <PostInfo postId={post.id} />}
      </div>
      {/* DESC */}
      <div className="flex flex-col gap-4">
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
      </div>
      {/* INTERACTION */}
      <Suspense fallback="加载中...">
        <PostInteraction
          postId={post.id}
          likes={post.likes.map((like) => like.userId)}
          commentNumber={post._count.comments}
        ></PostInteraction>
      </Suspense>

      <Suspense fallback="加载中...">
        <Comments postId={post.id} />
      </Suspense>
    </div>
  );
};

export default Post;
