import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  try {
    const followed = await prisma.follow.findMany({
      where: { follower: { userId } },
      select: { followingId: true },
    });
    const ids = followed.map((f) => f.followingId);
    const posts = await prisma.runPost.findMany({
      where: { userProfileId: { in: ids } },
      include: {
        userProfile: {
          include: { user: { select: { avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Error fetching feed", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
