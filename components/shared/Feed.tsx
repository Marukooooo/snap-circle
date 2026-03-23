import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import FeedPost from "./post/FeedPost";

const Feed = async ({ username }: { username?: string }) => {
  const { userId } = await auth();

  let posts: any[] = [];
  //个人主页，查询该用户帖子
  if (username) {
    posts = await prisma.post.findMany({
      where: {
        user: {
          username: username,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  //首页，查询我 + 关注的人
  if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);
    const ids = [userId, ...followingIds];

    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
      {posts.length
        ? posts.map((post) => <FeedPost key={post.id} post={post} />)
        : "TA还没有发布帖子哦"}
    </div>
  );
};

export default Feed;
