"use client";

import { Comment, User } from "@/app/generated/prisma/client";
import { addComment } from "@/lib/actions/addComment";

import { useUser } from "@clerk/nextjs";
import { Send } from "lucide-react";

import Image from "next/image";
import { useOptimistic, useRef, useState } from "react";
import CommentInteraction from "./CommentInteraction";
import UserAvatar from "../user/UserAvatar";
type CommentWithUser = Comment & {
  user: User;
  likes: { userId: string }[];
};

export default function CommentList({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: number;
}) {
  const { user } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: CommentWithUser) => [newComment, ...state],
  );

  const handleAction = async (formData: FormData) => {
    const desc = formData.get("desc") as string;
    if (!user || !desc || !desc.trim()) return;

    addOptimisticComment({
      id: Math.random(),
      desc,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId: postId,
      likes: [],
      user: {
        id: user.id,
        username: user.username || "发布中...",
        avatar: user.imageUrl || "/noAvatar.png",
        name: user.firstName || "",
        surname: user.lastName || "",
      } as User,
    });

    formRef.current?.reset();

    try {
      await addComment(postId, desc);
    } catch (err) {
      console.error("评论失败:", err);
    }
  };

  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            ref={formRef}
            action={handleAction}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              name="desc"
              placeholder="说点什么..."
              className="bg-transparent outline-none flex-1"
              required
            />
            <button type="submit">
              <Send size={16} className="cursor-pointer" />
            </button>
          </form>
        </div>
      )}

      <div className="">
        {optimisticComments.map((comment) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            {/* AVATAR */}
            <UserAvatar
              avatarUrl={comment.user.avatar}
              username={comment.user.username}
              size={40}
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* CONTENT */}
            <div className="flex flex-row gap-4 flex-1 items-center">
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-medium text-sm">
                  {comment.user.name && comment.user.surname
                    ? `${comment.user.name} ${comment.user.surname}`
                    : comment.user.username}
                </span>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {comment.desc}
                </p>
              </div>

              {/* ACTIONS  */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <CommentInteraction
                  postId={postId}
                  commentId={comment.id}
                  likes={comment.likes.map((like) => like.userId)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-4 mt-6 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}
