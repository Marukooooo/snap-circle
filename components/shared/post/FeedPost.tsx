import Image from "next/image";
import Link from "next/link";
import { Post as PostType, User } from "@/app/generated/prisma/client";
import PostInteraction from "./PostInteraction";

type FeedPostType = PostType & { user: User } & {
  likes: { userId: string }[];
  _count: { comments: number };
};

export default function FeedPost({ post }: { post: FeedPostType }) {
  return (
    <div className="flex flex-col gap-4 border-b pb-4">
      {/* 用户 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? post.user.name + " " + post.user.surname
              : post.user.username}
          </span>
        </div>
      </div>

      {/* 点击 → 打开 Modal */}
      <Link
        href={`/post/${post.id}`}
        className="flex flex-col gap-4"
        scroll={false}
      >
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
        <p className="line-clamp-2">{post.desc}</p>
      </Link>

      <PostInteraction
        postId={post.id}
        likes={post.likes.map((like) => like.userId)}
        commentNumber={post._count.comments}
      />
    </div>
  );
}
