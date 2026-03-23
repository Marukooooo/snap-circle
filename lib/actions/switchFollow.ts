"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../client";

export default async function switchFollow(targetUserId: string) {
  const { userId: currentUserId } = await auth();

  if (!currentUserId || currentUserId === targetUserId) {
    throw new Error("Unauthorized");
  }

  const existingFollow = await prisma.follower.findFirst({
    where: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  if (existingFollow) {
    await prisma.follower.delete({
      where: { id: existingFollow.id },
    });
    return { type: "unfollow" };
  }

  const existingRequest = await prisma.followRequest.findFirst({
    where: {
      senderId: currentUserId,
      receiverId: targetUserId,
    },
  });

  if (existingRequest) {
    await prisma.followRequest.delete({
      where: { id: existingRequest.id },
    });
    return { type: "cancel_request" };
  }

  await prisma.followRequest.create({
    data: {
      senderId: currentUserId,
      receiverId: targetUserId,
    },
  });

  return { type: "request_sent" };
}
