"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import { revalidatePath } from "next/cache";

export const switchCommentLike = async (postId: number, commentId: number) => {
  const { userId } = await auth();

  // 1. 安全检查
  if (!userId) throw new Error("User is not authenticated!");

  try {
    // 2. 检查用户是否已经对该评论点过赞
    const existingLike = await prisma.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (existingLike) {
      // 如果已点赞，则删除记录（取消点赞）
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // 如果未点赞，则创建记录（点赞）
      await prisma.like.create({
        data: {
          commentId,
          userId,
        },
      });
    }
    revalidatePath(`/post/${postId}`);
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to switch like");
  }
};
