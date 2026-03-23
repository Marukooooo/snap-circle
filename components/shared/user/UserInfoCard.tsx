import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import UserInfoCardInteraction from "./UserInfoCardInteraction";
import UpdateUserInfo from "./UpdateUserInfo";
import { User } from "@/app/generated/prisma/client";

export default async function UserInfoCard({ user }: { user: User }) {
  const createdAtDate = new Date(user.createdAt);

  const formattedDate = createdAtDate.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const { userId: currentUserId } = await auth();

  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });

    blockRes ? (isUserBlocked = true) : (isUserBlocked = false);

    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    followRes ? (isFollowing = true) : (isFollowing = false);

    const followReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id,
      },
    });

    followReqRes ? (isFollowingSent = true) : (isFollowingSent = false);
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* 顶部 */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">用户信息</span>
        {currentUserId === user.id ? (
          <UpdateUserInfo user={user}></UpdateUserInfo>
        ) : (
          // <UpdateUser user={user}></UpdateUser>
          <Link href="/" className="text-blue-500 text-xs">
            查看全部
          </Link>
        )}
      </div>

      {/* 内容 */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl text-black">
            {""}
            {user.name && user.surname
              ? user.name + " " + user.surname
              : user.username}
          </span>
          <span className="text-sm">@{user.username}</span>
        </div>
        {user.description && <p>{user.description}</p>}

        {user.city && (
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>
              居住在 <b>{user.city}</b>
            </span>
          </div>
        )}

        {user.school && (
          <div className="flex items-center gap-2">
            <GraduationCap size={16} />
            <span>
              毕业于 <b>{user.school}</b>
            </span>
          </div>
        )}

        {user.work && (
          <div className="flex items-center gap-2">
            <Briefcase size={16} />
            <span>
              就职于 <b>{user.work}</b>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {user.website && (
            <div className="flex gap-1 items-center">
              <LinkIcon size={16} />
              <Link href={user.website} className="text-blue-500 font-medium">
                {user.website}
              </Link>
            </div>
          )}

          <div className="flex gap-1 items-center">
            <Calendar size={16} />
            <span>加入时间：{formattedDate}</span>
          </div>
        </div>
        {currentUserId && currentUserId !== user.id && (
          <UserInfoCardInteraction
            userId={user.id}
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
          ></UserInfoCardInteraction>
        )}
      </div>
    </div>
  );
}
