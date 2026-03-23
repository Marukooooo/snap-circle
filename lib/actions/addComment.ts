"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../client";
import { revalidatePath } from "next/cache";

export const addComment = async (postId: number, desc: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("未登录");

  try {
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });

    revalidatePath(`/post/${postId}`);

    return createdComment;
  } catch (err) {
    console.error(err);
    throw new Error("添加评论失败");
  }
};
