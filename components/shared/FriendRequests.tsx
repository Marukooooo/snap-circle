import Link from "next/link";
import acceptFollowRequest from "@/lib/actions/acceptFollowRequest";
import declineFollowRequest from "@/lib/actions/declineFollowRequest";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import FriendRequestList from "./FriendRequestList";

export default async function FriendRequests() {
  const { userId } = await auth();

  if (!userId) return null;

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });

  if (requests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">好友申请</span>
        <Link href="/" className="text-blue-500 text-xs">
          查看全部
        </Link>
      </div>
      {/* USER */}
      <FriendRequestList
        requests={requests}
        acceptAction={acceptFollowRequest}
        declineAction={declineFollowRequest}
      ></FriendRequestList>
    </div>
  );
}
