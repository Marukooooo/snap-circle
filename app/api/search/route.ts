// app/api/search/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [], posts: [] });
    }

    const [users, posts] = await Promise.all([
      prisma.user.findMany({
        where: {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          surname: true,
        },
        take: 5,
      }),

      prisma.post.findMany({
        where: {
          desc: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          desc: true,
          img: true,
          userId: true,
        },
        take: 10,
      }),
    ]);

    return NextResponse.json({ users, posts });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
