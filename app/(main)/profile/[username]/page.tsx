import Feed from "@/components/shared/Feed";
import RightMenu from "@/components/shared/RightMenu";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
        },
      },
    },
  });

  if (!user) return notFound();

  const { userId: currentUserId } = await auth();

  let isBlocked;

  if (currentUserId) {
    const res = await prisma.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: currentUserId,
      },
    });

    if (res) isBlocked = true;
    else {
      isBlocked = false;
    }
  }

  if (isBlocked) return notFound();

  return (
    <div className="flex justify-around gap-6 pt-6 pl-6">
      <div className="w-full lg:w-[70%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 relative">
              <Image
                src={user.cover || "/noCover.png"}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              <Image
                src={user.avatar || "/noAvatar.png"}
                alt=""
                width={128}
                height={128}
                className="w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover"
              />
            </div>

            <h1 className="mt-20 mb-4 text-2xl font-medium">
              {user.name && user.surname
                ? user.name + " " + user.surname
                : user.username}
            </h1>

            <div className="flex items-center justify-center gap-12 mb-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.posts}</span>
                <span className="text-sm">帖子</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followers}</span>
                <span className="text-sm">关注</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followings}</span>
                <span className="text-sm">粉丝</span>
              </div>
            </div>
          </div>

          <Feed username={username} />
        </div>
      </div>

      <div className="hidden xl:block w-[30%]">
        <RightMenu user={user} />
      </div>
    </div>
  );
}
