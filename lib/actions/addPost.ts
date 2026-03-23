"use server";

import z from "zod";
import prisma from "../client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const addPost = async (formData: FormData, img: string) => {
  const desc = formData.get("desc") as string;

  const schema = z.string().min(1, "内容不能为空").max(255, "内容过长");
  const validated = schema.safeParse(desc);

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message };
  }

  const { userId } = await auth();
  if (!userId) return { error: "请先登录" };

  try {
    await prisma.post.create({
      data: {
        desc: validated.data,
        userId,
        img,
      },
    });

    revalidatePath("/");

    return { success: true }; // ✅ 必须返回
  } catch (err) {
    console.error(err);
    return { error: "发布失败，请重试" };
  }
};
