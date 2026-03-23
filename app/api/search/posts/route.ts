import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const cursor = searchParams.get("cursor");

    const posts = await prisma.post.findMany({
      where: {
        desc: {
          contains: q,
          mode: "insensitive",
        },
      },
      include: {
        user: true,
        likes: { select: { userId: true } },
        _count: { select: { comments: true } },
      },
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: { id: "desc" },
    });

    const nextCursor = posts.length === 10 ? posts[posts.length - 1].id : null;

    return NextResponse.json({ posts, nextCursor });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
