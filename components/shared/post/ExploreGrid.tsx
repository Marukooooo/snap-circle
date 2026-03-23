import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { Post } from "@/app/generated/prisma/client";

type ExplorePost = Post & {
  likes: { userId: string }[];
  _count: { comments: number };
};

export default function ExploreGrid({ posts }: { posts: ExplorePost[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 p-0">
      {posts.map((post) => (
        <Link
          href={`/post/${post.id}`}
          key={post.id}
          className="group relative block aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
        >
          {/* 图片 */}
          {post.img ? (
            <Image
              src={post.img}
              alt="Explore post"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="w-full h-full p-4 flex items-center justify-center bg-zinc-800 dark:bg-zinc-700 transition-colors group-hover:bg-zinc-900">
              <p className="text-white text-xs md:text-sm line-clamp-5 text-center font-medium leading-relaxed break-words">
                {post.desc}
              </p>
            </div>
          )}

          {/* Hover 遮罩 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 z-10">
            {/* 点赞 */}
            <div className="flex items-center gap-2 text-white">
              <Heart size={20} className="fill-white" />
              <span className="font-semibold text-lg">{post.likes.length}</span>
            </div>

            {/* 评论 */}
            <div className="flex items-center gap-2 text-white">
              <MessageCircle size={20} className="fill-white" />
              <span className="font-semibold text-lg">
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
