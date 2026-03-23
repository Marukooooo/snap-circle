"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../client";
import { revalidatePath } from "next/cache";

export const switchLike = async (postId: number) => {
  const { userId } = await auth();

  // 1. 安全检查
  if (!userId) throw new Error("User is not authenticated!");

  try {
    // 2. 查找并切换状态
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({ data: { postId, userId } });
    }

    // 3. 核心：触发该路径下所有数据的重新获取 (Server-side refresh)
    revalidatePath("/");
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to switch like");
  }
};
