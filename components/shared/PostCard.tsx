import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Post as PostType, User } from "@/app/generated/prisma/client";
import { auth } from "@clerk/nextjs/server";
import PostInteraction from "./post/PostInteraction";
import PostInfo from "./PostInfo";

type FeedPostType = PostType & { user: User } & {
  likes: { userId: string }[];
  _count: { comments: number };
};

export default function PostCard() {
  return <div>PostCard</div>;
}
