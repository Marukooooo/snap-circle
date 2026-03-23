"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "../client";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData,
) => {
  const fields = Object.fromEntries(formData.entries());

  // 过滤空字段
  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== ""),
  );

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse(filteredFields);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: true };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: validatedFields.data,
    });
    revalidatePath("/profile/[username]");

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
